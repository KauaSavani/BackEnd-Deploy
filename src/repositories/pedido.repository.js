import { db } from "../configs/database.js";
import produtoRepository from "./produto.repository.js";

const pedidoRepository = {

    criarPedido: async (pedido, itensPedido) => {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const sqlPed = 'INSERT INTO pedidos (valor_total, status_pedido) VALUES (?, ?);';
            const valuesPed = [pedido.valorTotal, pedido.statusPedido];
            const [rowsPed] = await conn.execute(sqlPed, valuesPed);
            const idPedido = rowsPed.insertId;

            itensPedido.forEach(async item => {
                const idProduto = item.idProduto;
                const sqlItem = 'INSERT INTO itens_pedido (quantidade, preco_unitario, subtotal, id_pedido, id_produto) VALUES (?, ?, ?, ?, ?);'
                const valuesItem = [item.quantidade, item.precoUnitario, item.subTotal, idPedido, idProduto];

                const produtoSelecionado = await produtoRepository.selecionarPorId(idProduto);

                const sqlProduto = 'UPDATE produtos SET estoque_produto = estoque_produto - ? WHERE id_produto = ?;';
                const valuesProduto = [item.quantidade, idProduto];
                await conn.execute(sqlItem, valuesItem);
                await conn.execute(sqlProduto, valuesProduto);
            });

            await conn.commit();
            return rowsPed;
        } catch (error) {
            await conn.rollback();
            throw new Error(error);

        } finally {
            conn.release();
        }
    },

    adicionarItemPedido: async (pedido, item) => {
        const conn = await db.getConnection();

        try {
            await conn.beginTransaction();
            const idProduto = item.idProduto;
            const idPedido = pedido.id;
            const sqlItem = 'INSERT INTO itens_pedido (quantidade, preco_unitario, subtotal, id_pedido, id_produto) VALUES (?, ?, ?, ?, ?);'
            const valuesItem = [item.quantidade, item.precoUnitario, item.subTotal, idPedido, idProduto];
            const [rowsItem] = await conn.execute(sqlItem, valuesItem);

            const sqlPed = 'UPDATE pedidos SET valor_total = ? WHERE id_pedido = ?;';
            const valuesPed = [pedido.valorTotal, idPedido];
            const [rowsPed] = await conn.execute(sqlPed, valuesPed);

            await conn.commit();
            return { rowsItem, rowsPed }
        } catch (error) {
            await conn.rollback();
            throw new Error(error);
        } finally {
            conn.release();
        }
    },

    selectPedidos: async () => {
        const sql = "SELECT * FROM pedidos;";
        const [rows] = await db.execute(sql);
        return rows;
    },

    selectPedidosId: async (id) => {
        const sql = "SELECT * FROM pedidos WHERE id_pedido = ?;";
        const [rows] = await db.execute(sql, [id]);
        return rows;
    },

    atualizarItemPedido: async (item, idPedido, quantidadeAntiga) => {
        const conn = await db.getConnection();

        try {
            await conn.beginTransaction();

            const idProduto = item.idProduto;

            const sqlItem = 'UPDATE itens_pedido SET quantidade = ?, preco_unitario = ?, subtotal = ?, id_pedido = ?, id_produto = ? WHERE id_item_pedido = ?;';
            const valuesItem = [item.quantidade, item.precoUnitario, item.subTotal, idPedido, idProduto, item.id];

            const [rowsItem] = await conn.execute(sqlItem, valuesItem);

            const diferencaQuantidade = item.quantidade - quantidadeAntiga;
            const sqlEstoque = 'UPDATE produtos SET estoque_produto = estoque_produto - ? WHERE id_produto = ?;';
            const valuesEstoque = [diferencaQuantidade, idProduto];
            const [rowsEstoque] = await conn.execute(sqlEstoque, valuesEstoque);

            const sqlSoma = 'SELECT SUM(subtotal) AS novo_total FROM itens_pedido WHERE id_pedido = ?;';
            const [resultSoma] = await conn.execute(sqlSoma, [idPedido]);
            const novoValorTotal = resultSoma[0].novo_total;
            
            const sqlPed = 'UPDATE pedidos SET valor_total = ? WHERE id_pedido = ?;';
            const valuesPed = [novoValorTotal, idPedido];
            const [rowsPed] = await conn.execute(sqlPed, valuesPed);

            await conn.commit();
            return { rowsItem, rowsEstoque, rowsPed };
        } catch (error) {
            await conn.rollback();
            throw new Error(error);
        } finally {
            conn.release();
        }
    },

    buscarItemPorId: async (id) => {
        const sql = "SELECT * FROM itens_pedido WHERE id_item_pedido = ?;";
        const [rows] = await db.execute(sql, [id]);
        return rows;
    },
    deletarItemPedido: async (id, itemDeletado, idPedido) => {
        const conn = await db.getConnection();

        try {
            await conn.beginTransaction();

            const sqlDelete = 'DELETE FROM itens_pedido WHERE id_item_pedido = ?;';
            const [rowsDelete] = await conn.execute(sqlDelete, [id]);

            const sqlEstoque = 'UPDATE produtos SET estoque_produto = estoque_produto + ? WHERE id_produto = ?;';
            const valuesEstoque = [itemDeletado.quantidade, itemDeletado.idProduto];
            const [rowsEstoque] = await conn.execute(sqlEstoque, valuesEstoque);

            const sqlSoma = 'SELECT SUM(subtotal) AS novo_total FROM itens_pedido WHERE id_pedido = ?;';
            const [resultSoma] = await conn.execute(sqlSoma, [idPedido]);
            const novoValorTotal = resultSoma[0].novo_total;

            const sqlPed = 'UPDATE pedidos SET valor_total = ? WHERE id_pedido = ?;';
            const valuesPed = [novoValorTotal, idPedido];
            const [rowsPed] = await conn.execute(sqlPed, valuesPed);

            await conn.commit();
            return { rowsDelete, rowsEstoque, rowsPed };
        } catch (error) {
            await conn.rollback();
            throw new Error(error);
        } finally {
            conn.release();
        }
    },
}

export default pedidoRepository;