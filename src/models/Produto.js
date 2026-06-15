export class Produto {
    #id_produto;
    #id_categoria;
    #nome_produto;
    #preco_produto;
    #imagem_produto;
    #descricao_produto;
    #estoque_produto;

    constructor(pNome, pPreco, pImagem, pIdCategoria, pDescricao, pEstoque,  pId ) {
        this.#nome_produto = pNome;
        this.#preco_produto = pPreco;
        this.#imagem_produto = pImagem;
        this.#id_categoria = pIdCategoria;
        this.#descricao_produto = pDescricao;
        this.#estoque_produto = pEstoque;
        this.#id_produto = pId;
    }

    get id_produto() {
        return this.#id_produto;
    }

    set id_produto(value) {
        this.#validarId(value);
        this.#id_produto
    }

    get nome_produto() {
        return this.#nome_produto;
    }

    set nome_produto(value) {
        this.#validarNome(value);
        this.#nome_produto;
    }

    get preco_produto() {
        return this.#preco_produto;
    }

    set preco_produto(value) {
        this.#validarValor(value);
        this.#preco_produto;
    }

    get imagem_produto() {
        return this.#imagem_produto;
    }

    set imagem_produto(value) {
        this.#validarCaminhoImagem(value);
        this.#imagem_produto;
    }

    get id_categoria() {
        return this.#id_categoria;
    }

    set id_categoria(value) {
        this.#validarIdCategoria(value);
        this.#id_categoria;
    }

    get descricao_produto() {
        return this.#descricao_produto;
    }

    set descricao_produto(value) {
        this.#validarDescricao(value);
        this.#descricao_produto;
    }

    get estoque_produto() {
        return this.#estoque_produto;
    }

    set estoque_produto(value) {
        this.#validarEstoque(value);
        this.#estoque_produto;
    }

    #validarNome(value) {
        if (!value || value.trim().length < 3 || value.trim().length > 45) {
            throw new Error("Nome deve ter entre 3 e 45 caracteres");
        }
    }

    #validarValor(value) {
        if (value === undefined || value === null || isNaN(value) || Number(value) <= 0) {
            throw new Error("Valor deve ser numérico e maior que zero");
        }
    }

    #validarCaminhoImagem(value) {
        if (value && value.length < 3) {
            throw new Error("Caminho da imagem inválido");
        }
    }

    #validarIdCategoria(value) {
        if (!value || value <= 0) {
            throw new Error("Id da categoria é obrigatório");
        }
    }

    #validarId(value) {
        if (value && value <= 0) {
            throw new Error("ID inválido");
        }
    }
    

    #validarDescricao(value) {
        if (value && (value.trim().length < 3 || value.trim().length > 255)) {
            throw new Error("O campo descrição deve ter entre 3 e 255 caracteres")
        }
    }

    #validarEstoque(value) {
        if (!value || value <= 0) {
            throw new Error("Estoque é obrigatório");
        }
    }


    static criar(dados) {
        return new Produto(
            dados.nome_produto,
            dados.preco_produto,
            dados.imagem_produto,
            dados.id_categoria,
            dados.descricao_produto,
            dados.estoque_produto
        );
    }

    static editar(dados, produtoAtual) {
        return new Produto(
            dados.nome_produto ?? produtoAtual.nome_produto,
            dados.preco_produto ?? produtoAtual.preco_produto,
            dados.imagem_produto ?? produtoAtual.imagem_produto,
            dados.id_categoria ?? produtoAtual.id_categoria,
            dados.descricao_produto ?? produtoAtual.descricao_produto,
            dados.estoque_produto ?? produtoAtual.estoque_produto,
            produtoAtual.id_produto
        );
    }
}