import { Status } from "../enum/statusPedido.js";

export class Pedido {
    #statusPedido;
    #valorTotal;
    #id;

    constructor(pStatus, pValor, pId) {
        this.#validarStatusPedido(pStatus);
        this.#validarValorTotal(pValor);
        
        this.#statusPedido = pStatus;
        this.#valorTotal = pValor;
        this.#id = pId;
    }

    get statusPedido() { return this.#statusPedido }
    get valorTotal() { return this.#valorTotal }
    get id() { return this.#id }

    set statusPedido(value) {
        this.#validarStatusPedido(value);
        this.#statusPedido = value;
    }

    set valorTotal(value) {
        this.#validarValorTotal(value);
        this.#valorTotal = value;
    }

    set id(value) {
        this.#validarId(value);
        this.#id = value;
    }

    #validarStatusPedido(value) {
        if (!Object.values(Status).includes(value)) {
            throw new Error(`O Status digitado precisa ser: ${Object.values(Status)}`);
        }
    }
    #validarValorTotal(value) {
        if (isNaN(value) || !value || value <= 0) {
            throw new Error(`O valor do objeto foi inserido de maneira inadequada`);
        }
    }
    #validarId(value) {
        if (isNaN(value) || !value || value <= 0) {
            throw new Error(`O id inserido não é válido`);
        }
    }

    // Design pattern
    static criar(dados) {
        return new Pedido(dados.statusPedido, dados.valorTotal);
    }

    static editar(dados) {
        return new Pedido(dados.statusPedido, dados.valorTotal, dados.id);
    }
}