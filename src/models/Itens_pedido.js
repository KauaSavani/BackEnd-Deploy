export class ItensPedidos {
    #precoUnitario;
    #subTotal;
    #quantidade;
    #idProduto;
    #id;

    constructor(pPrecoUnitario, pSubTotal, pQuantidade, pIdProduto, pId) {
        this.#precoUnitario = pPrecoUnitario;
        this.#subTotal = pSubTotal;
        this.#quantidade = pQuantidade;
        this.#idProduto = pIdProduto
        this.#id = pId;
    }

    get precoUnitario() { return this.#precoUnitario }
    get subTotal() { return this.#subTotal }
    get quantidade() { return this.#quantidade }
    get idProduto() { return this.#idProduto }
    get id() { return this.#id }

    set precoUnitario(value) {
        this.#validarprecoUnitario(value);
        this.#precoUnitario = value;
    }

    set subTotal(value) {
        this.#validarsubTotal(value);
        this.#subTotal = value;
    }

    set quantidade(value) {
        this.#validarQuantidade(value);
        this.#quantidade = value;
    }
    
    set idProduto(value) {
        this.#validarIdProduto(value);
        this.#idProduto = value;
    }
    
    set id(value) {
        this.#validarId(value);
        this.#id = value;
    }
    #validarprecoUnitario (value) {
        if(isNaN(value) || !value || value <= 0) {
            throw new Error(`O valor unitário inserido é inválido`);
        }
    }
    #validarsubTotal (value) {
        if(isNaN(value) || !value || value <= 0) {
            throw new Error(`O valor sub total enviado não é válido`);
        }
    }
    #validarQuantidade (value) {
        if (isNaN(value) || !value || value <= 0) {
            throw new Error (`A quantidade inserida não é válido`);
        }
    }
    #validarIdProduto (value) {
        if (isNaN(value) || !value || value <= 0) {
            throw new Error (`O id do produto inserido não é válido`);
        }
    }
    #validarId (value) {
        if (isNaN(value) || !value || value <= 0) {
            throw new Error (`O id inserido não é válido`);
        }
    }

    static calcularSubTotal(quantidade, precoUnitario) {
        
        return Number((quantidade* precoUnitario).toFixed(2));
    }

    static calcularValorTotal(itens) {
        return itens.reduce(
            (total, item) => total + item.subTotal, 0
        );
    }
    
    // Design pattern
    static criar(dados) {
        return new ItensPedidos (dados.precoUnitario, dados.subTotal, dados.quantidade, dados.idProduto);
    }    

    static editar(dados) {
        return new ItensPedidos (dados.precoUnitario, dados.subTotal, dados.quantidade, dados.idProduto, dados.id);
    }
}