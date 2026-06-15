import { Categoria } from "../models/Categoria.js";
import categoriaRepository from "../repositories/categoria.repository.js";



const categoriaController = {
    
    selecionar: async (req, res) => {
        try {
            
            const result = await categoriaRepository.selecionar();
            
            if (!result || result.length === 0) {
                return res.status(200).json({ message: 'A tabela não contém dados', data: [] });
            }
            
            res.status(200).json({ result })
            
        } catch (error) {
            
            console.error(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message })
            
        }
    },

    selecionarPorId: async (req, res) => {
    
        try {
            const id = Number(req.params.id);
    
            const result = await categoriaRepository.selecionarPorId(id);
    
            if (!result) {
                return res.status(400).json({ message: 'Categoria não encontrada' });
            }
    
            return res.status(200).json(result);
    
        } catch (error) {
    
            console.error(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message })
    
        }
    
    },

    criar: async (req, res) => {

        try {

            const { nome, descricao } = req.body
            const categoria = Categoria.criar({ nome, descricao })
            const result = await categoriaRepository.criar(categoria);
            res.status(200).json({ result })

        } catch (error) {

            console.error(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message })

        }
    },

    editar: async (req, res) => {

        try {

            const id = Number(req.params.id)
            const { nome, descricao } = req.body

            const categoriaSelecionada = await categoriaRepository.selecionarPorId(id);

            if(categoriaSelecionada.length === 0) {
                return res.status(404).json({message: "Item não encontrado"});2
            }

            const categoria = Categoria.editar({ nome, descricao }, id)
            const result = await categoriaRepository.editar(categoria);

            if(result.changedRows === 0) {
                return res.status(400).json({message: "Altere algum valor"})
            }

            res.status(200).json({ result })
            
        } catch (error) {

            console.error(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message })
        }
    },

    deletar: async (req, res) => {
        try {

            const id = Number(req.params.id)
            const produtoRelacionado = await categoriaRepository.selectProdutoPorCategoria(id);
            if(produtoRelacionado.length !== 0) {
                return res.status(400).json({message: "Há um produto relacionado a esta categoria", produtosRelacionados: produtoRelacionado})
            }
            const result = await categoriaRepository.deletar(id);
            res.status(200).json({ result })

        } catch (error) {

            console.error(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message })

        }
    },
}

export default categoriaController