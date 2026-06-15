import { Router } from "express";
import uploadImage from "../middlewares/uploadImage.middleware.js";
import produtoController from "../controllers/produto.controllers.js";

const produtoRoutes = Router();

produtoRoutes.get('/', produtoController.buscarTodosProdutos);
produtoRoutes.get('/:id', produtoController.buscarProdutoPorID);
produtoRoutes.post('/', uploadImage, produtoController.incluirProduto);
produtoRoutes.put('/:id', uploadImage, produtoController.atualizarProduto);
produtoRoutes.delete('/:id', produtoController.excluirProduto);

export default produtoRoutes;