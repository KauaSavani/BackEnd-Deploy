import pedidoRepository from "../repositories/pedido.repository.js";
import { ItensPedidos } from "../models/Itens_pedido.js";
import { Pedido } from "../models/Pedido.js";
import produtoRepository from "../repositories/produto.repository.js";

const pedidoControllers = {
    adicionarPedido: async (req, res) => {
        try {
            let { statusPedido, itens } = req.body;

            const itensPedidos = await Promise.all(itens.map(async item => {
                const idProduto = item.idProduto;
                const produtoSelecionado = await produtoRepository.selecionarPorId(idProduto);
                const quantidade = item.quantidade;
                
                if (!produtoSelecionado) {
                    return res.status(404).json({ message: "Produto não encontrado" })
                }

                if (produtoSelecionado.estoque_produto < quantidade) {
                    return res.status(400).json({ message: "Este produto não possui estoque suficiente" })
                }
                const precoUnitario = Number(produtoSelecionado[0].preco_produto);
                const subTotal = ItensPedidos.calcularSubTotal(quantidade, precoUnitario);
                return ItensPedidos.criar({ precoUnitario, subTotal, quantidade, idProduto });
            }));

            const valorTotal = ItensPedidos.calcularValorTotal(itensPedidos);

            const pedido = Pedido.criar({ statusPedido, valorTotal });
            const result = await pedidoRepository.criarPedido(pedido, itensPedidos);
            return res.status(200).json({ message: "Pedido adicionado com sucesso", result });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro interno do servidor", errorMessage: error.message });
        }


    },
    selecionarPedido: async (req, res) => {
        try {
            const id_pedido = req.query.id_pedido;
            const id_pedido_num = Number(id_pedido);
            if (id_pedido) {
                if (!Number.isInteger(id_pedido_num)) {
                    return res.status(400).json({ message: "Envie um id_pedido válido" });
                }
                const result = await pedidoRepository.selectPedidosId(id_pedido);
                if (result.length === 0) {
                    return res.status(404).json({ message: "Pedido não encontrado" });
                }
                return res.status(200).json({ message: "Pedido selecionado:", result });
            }
            const result = await pedidoRepository.selectPedidos();
            return res.status(200).json({ message: "Pedidos selecionados:", result })
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro interno do servidor", errorMessage: error.message });
        }
    },
    adicionarItem: async (req, res) => {
        try {
            const id = req.params.id;
            const { idProduto, quantidade } = req.body;

            const produtoSelecionado = await produtoRepository.selecionarPorId(idProduto);
            if (produtoSelecionado.length === 0) {
                return res.status(404).json({ message: "Produto não encontrado" });
            }
            const precoUnitario = produtoSelecionado[0].preco_produto;

            const pedidoSelecionado = await pedidoRepository.selectPedidosId(id);
            const statusPedido = pedidoSelecionado[0].status_pedido;

            const valorAnterior = pedidoSelecionado[0].valor_total;

            const subTotal = ItensPedidos.calcularSubTotal(quantidade, precoUnitario);

            const valorDecimal = Number(valorAnterior) + Number(subTotal);
            const valorTotal = valorDecimal.toFixed(2)

            const pedido = Pedido.editar({ statusPedido, valorTotal, id })
            const itemPedido = ItensPedidos.criar({ precoUnitario, subTotal, quantidade, idProduto });

            const result = await pedidoRepository.adicionarItemPedido(pedido, itemPedido);

            return res.status(200).json({ message: "Item adicionado com sucesso", result });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro interno do servidor", errorMessage: error.message });
        }
    },
    atualizarItemPedido: async (req, res) => {
        try {
            const id = req.params.id;
            let { idProduto, quantidade, idPedido } = req.body;

            const itemSelecionado = await pedidoRepository.buscarItemPorId(id);
            if (!itemSelecionado || itemSelecionado.length === 0) {
                return res.status(404).json({ message: "Item não encontrado" });
            }

            const quantidadeAntiga = itemSelecionado[0].quantidade;

            idProduto = idProduto ?? itemSelecionado[0].id_produto;
            quantidade = quantidade ?? itemSelecionado[0].quantidade;
            idPedido = idPedido ?? itemSelecionado[0].id_pedido;

            const produtoSelecionado = await produtoRepository.selecionarPorId(idProduto);
            
            if (produtoSelecionado.length === 0) {
                return res.status(404).json({ message: "Produto não encontrado" });
            }

            const precoUnitario = produtoSelecionado[0].preco_produto;

            const subTotal = ItensPedidos.calcularSubTotal(quantidade, precoUnitario);

            const itemPedido = ItensPedidos.editar({ precoUnitario, subTotal, quantidade, idProduto, id });

            const result = await pedidoRepository.atualizarItemPedido(itemPedido, idPedido, quantidadeAntiga);

            return res.status(200).json({ message: "Item atualizado com sucesso", result });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro interno do servidor", errorMessage: error.message });
        }
    },
    deletarItemPedido: async (req, res) => {
        try {
            const id = req.params.id;

            const itemSelecionado = await pedidoRepository.buscarItemPorId(id);

            if (!itemSelecionado || itemSelecionado.length === 0) {
                return res.status(404).json({ message: "Item não encontrado" });
            }

            const dadosItem = {
                precoUnitario: itemSelecionado[0].preco_unitario, subTotal: itemSelecionado[0].subtotal, quantidade: itemSelecionado[0].quantidade, idProduto: itemSelecionado[0].id_produto
            };

            const itemDeletado = ItensPedidos.criar(dadosItem);

            const idPedido = itemSelecionado[0].id_pedido;

            const result = await pedidoRepository.deletarItemPedido(id, itemDeletado, idPedido);

            return res.status(200).json({ message: "Item deletado com sucesso", result });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro interno do servidor", errorMessage: error.message });
        }
    }
}

export default pedidoControllers;