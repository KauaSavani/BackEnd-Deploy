import { Router } from "express";
import categoriaController from "../controllers/categoria.controllers.js";

const categoriaRoutes = Router();

categoriaRoutes.post('/', categoriaController.criar);
categoriaRoutes.put('/:id', categoriaController.editar);
categoriaRoutes.delete('/:id', categoriaController.deletar);
categoriaRoutes.get('/', categoriaController.selecionar);
categoriaRoutes.get('/:id', categoriaController.selecionarPorId);

export default categoriaRoutes;