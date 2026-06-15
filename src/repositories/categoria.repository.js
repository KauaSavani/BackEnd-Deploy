import { db } from "../configs/database.js";

const categoriaRepository = {
    criar: async (categoria) => {
        const sql = 'INSERT INTO categorias (nome_categoria, descricao_categoria) VALUES (?,?)'
        const values = [categoria.nome, categoria.descricao];
        const [rows] = await db.execute(sql, values)
        return rows;
    },

    editar: async (categoria) => {
        const sql = 'UPDATE categorias SET nome_categoria=?, descricao_categoria=? WHERE id_categoria=?'
        const values = [categoria.nome, categoria.descricao ?? null, categoria.id];
        const [rows] = await db.execute(sql, values);
        return rows;
    },

    selecionar: async () => {
        const sql = 'SELECT * FROM categorias'
        const [rows] = await db.execute(sql)
        return rows
    },

    selecionarPorId: async (id) => {
        const sql = 'SELECT * FROM categorias WHERE id_categoria = ?';
        const values = [id];
        const [rows] = await db.execute(sql, values);
        return rows;
    },

    deletar: async (id) => {
        const sql = 'DELETE FROM categorias WHERE id_categoria = ?'
        const values = [id];
        const [rows] = await db.execute(sql, values)
        return rows
    },
    selectProdutoPorCategoria: async (id) => {
        const sql = 'SELECT * FROM produtos WHERE id_categoria = ?;';
        const values = [id];
        const [rows] = await db.execute (sql, values);
        return rows;
    }
}

export default categoriaRepository;