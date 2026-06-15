import { Produto } from "../models/Produto.js";
import produtoRepository from "../repositories/produto.repository.js";

const produtoController = {

    buscarTodosProdutos: async (req, res) => {
        try {

            const resultado = await produtoRepository.selecionarTodos();

            if (!resultado || resultado.length === 0) {
                return res.status(200).json({ message: 'A tabela não contém dados', data: [] });
            }

            return res.status(200).json({ message: 'Dados recebidos', data: resultado });

        } catch (error) {

            console.error(error);

            return res.status(500).json({ message: 'Erro no servidor', errorMessage: error.message });
        }
    },

    buscarProdutoPorID: async (req, res) => {
        try {

            const id = Number(req.params.id);

            const resultado = await produtoRepository.selecionarPorId(id);

            if (!resultado) {
                return res.status(404).json({ message: 'Produto não encontrado' });
            }

            return res.status(200).json(resultado);

        } catch (error) {

            console.error(error);

            return res.status(500).json({ message: 'Erro ao buscar produto', errorMessage: error.message });
        }
    },

    incluirProduto: async (req, res) => {
        try {

            const imagem_produto = req.file ? `uploads/image/${req.file.filename}` : null;

            const { nome_produto, preco_produto, descricao_produto, estoque_produto, id_categoria } = req.body;

            if (!nome_produto || !preco_produto || !descricao_produto || estoque_produto === undefined || !id_categoria) {
                return res.status(400).json({ message: "Campos obrigatórios não informados" });
            }

            const produto = Produto.criar({ nome_produto, preco_produto, descricao_produto, estoque_produto, id_categoria, imagem_produto });

            const resultado = await produtoRepository.inserirProduto(produto);

            return res.status(201).json({ message: 'Produto criado com sucesso', result: resultado });

        } catch (error) {

            console.error(error);

            return res.status(500).json({ message: 'Erro no servidor', errorMessage: error.message });
        }
    },

    atualizarProduto: async (req, res) => {
        try {

            const id = Number(req.params.id);

            if (!id) {
                return res.status(400).json({ message: "ID é obrigatório" });
            }

            const imagem_produto = req.file ? `uploads/image/${req.file.filename}` : undefined;

            const { nome_produto, preco_produto, descricao_produto, estoque_produto, id_categoria } = req.body;

            const produtoAtual = await produtoRepository.selecionarPorId(id);

            if (!produtoAtual) {
                return res.status(404).json({ message: "Produto não encontrado" });
            }

            const produto = Produto.editar({ nome_produto, preco_produto, imagem_produto, descricao_produto, estoque_produto, id_categoria }, produtoAtual);


            const resultado = await produtoRepository.atualizarProduto(produto);



            return res.status(200).json({ message: "Produto atualizado com sucesso", result: resultado });

        } catch (error) {

            console.error(error);

            return res.status(500).json({ message: "Erro no servidor", errorMessage: error.message });
        }
    },

    excluirProduto: async (req, res) => {
        try {

            const id = Number(req.params.id);

            const produto = await produtoRepository.selecionarPorId(id);

            const pedidoSelecionado = await produtoRepository.selectPedidoProduto(id);

            if (pedidoSelecionado.length !== 0) {
                return res.status(400).json({ message: "Existe um item relacionado a este produto:", pedidoSelecionado })
            }
            if (!produto) {
                return res.status(404).json({ message: 'Produto não encontrado' });
            }

            const exclusao = await produtoRepository.deletarProduto(id);

            return res.status(200).json({ message: 'Produto excluído com sucesso', detalhes: exclusao });

        } catch (error) {

            console.error(error);

            return res.status(500).json({ message: 'Erro no servidor', errorMessage: error.message });
        }
    }
};

export default produtoController;