import mysql from 'mysql2/promise';
import dotenv from 'dotenv';


// Singleton para a conexão com o banco de dados
class Database {
    static #instance = null;
    #pool = null;


    #createPool() {
        this.#pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            port: process.env.DB_PORT,
            waitForConnections: true,
            connectionLimit: 100,
            queueLimit: 0,
            ssl: {
                rejectUnauthorized: false
            }
        });
    }


    static getInstance() {
        if (!Database.#instance) {
            Database.#instance = new Database();
            Database.#instance.#createPool();
        }
        return Database.#instance;
    }


    getPool() {
        return this.#pool;
    }
}

export async function initializeDatabase() {
    console.log("Inicializando o banco de dados e tabelas...");
    try {
        const tempConnection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
            ssl: { rejectUnauthorized: false }
        });


        const dbName = process.env.DB_DATABASE || 'deploy-atv';


        await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
        await tempConnection.query(`USE \`${dbName}\`;`);


   await tempConnection.query(`
    CREATE TABLE IF NOT EXISTS categorias (
        id INT PRIMARY KEY AUTO_INCREMENT,
        nome_categoria VARCHAR(30) NOT NULL,
        descricao VARCHAR(300) NULL
    );
`);

await tempConnection.query(`
    CREATE TABLE IF NOT EXISTS produtos (
        id INT PRIMARY KEY AUTO_INCREMENT,
        nome VARCHAR(30) NOT NULL,
        valor DECIMAL(15,2) NOT NULL,
        id_categoria INT,
        FOREIGN KEY (id_categoria) REFERENCES categorias(id)
    );
`);

await tempConnection.query(`
    CREATE TABLE IF NOT EXISTS pedidos (
        id INT PRIMARY KEY AUTO_INCREMENT,
        dataPedido DATETIME DEFAULT CURRENT_TIMESTAMP,
        valorTotal DECIMAL(15,2) NOT NULL,
        status VARCHAR(30) NOT NULL
    );
`);

await tempConnection.query(`
    CREATE TABLE IF NOT EXISTS itens_pedidos (
        id INT PRIMARY KEY AUTO_INCREMENT,
        idPedido INT NOT NULL,
        idProduto INT NOT NULL,
        quantidade INT NOT NULL,
        valorUnitario DECIMAL(15,2) NOT NULL,

        FOREIGN KEY (idPedido) REFERENCES pedidos(id),
        FOREIGN KEY (idProduto) REFERENCES produtos(id)
    );
`);

        await tempConnection.end();
        console.log("Banco de dados e tabelas verificados/criados com sucesso.");
    } catch (error) {
        console.error("Erro ao criar o banco ou as tabelas:", error);
        throw error;
    }
}

export const db = Database.getInstance().getPool();