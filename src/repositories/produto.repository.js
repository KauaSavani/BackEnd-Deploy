import { db } from "../configs/database.js";

const produtoRepository = {

    selecionarTodos: async () => {
        const sql = `SELECT p.estoque_produto, p.id_produto, p.nome_produto, p.preco_produto, p.imagem_produto, p.id_categoria, c.nome_categoria AS categoria FROM produtos p INNER JOIN categorias c ON p.id_categoria = c.id_categoria`;
        const [rows] = await db.execute(sql);
        return rows;
    },

    selecionarPorId: async (id) => {
        const sql = 'SELECT * FROM produtos WHERE id_produto = ?';
        const [rows] = await db.execute(sql, [id]);
        return rows; 
    },

    inserirProduto: async (produto) => {
        const conn = await db.getConnection();

        try {
            await conn.beginTransaction();

            const sql = `INSERT INTO produtos (nome_produto, descricao_produto, estoque_produto, preco_produto, imagem_produto, id_categoria) VALUES (?, ?, ?, ?, ?, ?)`;

            const values = [
                produto.nome_produto,
                produto.descricao_produto,
                produto.estoque_produto,
                produto.preco_produto,
                produto.imagem_produto,
                produto.id_categoria
            ];
            const [result] = await conn.execute(sql, values);

            await conn.commit();

            return result;

        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    atualizarProduto: async (produto) => {
        const conn = await db.getConnection();

        try {
            await conn.beginTransaction();

            const sql = `UPDATE produtos SET nome_produto = ?, preco_produto = ?, estoque_produto = ?, descricao_produto = ?, imagem_produto = ?, id_categoria = ? WHERE id_produto = ?`;

            const values = [
                produto.nome_produto,
                produto.preco_produto,
                produto.estoque_produto,
                produto.descricao_produto,
                produto.imagem_produto,
                produto.id_categoria,
                produto.id_produto
            ];

            const [result] = await conn.execute(sql, values);

            await conn.commit();

            return result;

        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },


    deletarProduto: async (id) => {
        const conn = await db.getConnection();

        try {
            await conn.beginTransaction();

            const sql = `DELETE FROM produtos WHERE id_produto = ?`;

            const [result] = await conn.execute(sql, [id]);

            await conn.commit();

            return result;

        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    selectPedidoProduto: async (id) => {
        const sql = 'SELECT * FROM itens_pedido WHERE id_produto = ?;';
        const values = [id];
        const [rows] = await db.execute (sql, values);
        return rows;
    }
};

export default produtoRepository;