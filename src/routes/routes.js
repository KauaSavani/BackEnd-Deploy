import { Router } from "express";
import categoriaRoutes from "./categorias.routes.js";
import produtoRoutes from "./produto.routes.js";
import pedidoRoutes from "./pedido.routes.js";

const routes = Router();

routes.use('/pedidos', pedidoRoutes);
routes.use('/produtos', produtoRoutes);
routes.use('/categorias', categoriaRoutes);

export default routes;
