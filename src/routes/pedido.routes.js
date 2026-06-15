import { Router } from "express";
import pedidoControllers from "../controllers/pedido.controllers.js";

const pedidoRoutes = Router();

pedidoRoutes.post('/', pedidoControllers.adicionarPedido);
pedidoRoutes.get('/', pedidoControllers.selecionarPedido);
pedidoRoutes.post('/:id/item', pedidoControllers.adicionarItem);
pedidoRoutes.put('/item/:id', pedidoControllers.atualizarItemPedido);
pedidoRoutes.delete('/item/:id', pedidoControllers.deletarItemPedido);

export default pedidoRoutes;