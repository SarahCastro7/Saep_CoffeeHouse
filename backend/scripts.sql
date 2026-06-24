--todas as tabelasss !

CREATE TABLE avaliacoes
(
    id_avaliacao integer NOT NULL,
    id_produto integer NOT NULL,
    nota_avaliacao integer NOT NULL,
    comentaio_avaliacao character varying(200) COLLATE pg_catalog."default" NOT NULL,
    data_avaliacao date NOT NULL,
    CONSTRAINT avaliacoes_pkey PRIMARY KEY (id_avaliacao)
);

CREATE TABLE pedidos
(
    id_pedido integer NOT NULL,
    id_produto integer NOT NULL,
    quantidade_pedido character varying COLLATE pg_catalog."default" NOT NULL,
    data_pedido date NOT NULL,
    CONSTRAINT pedidos_pkey PRIMARY KEY (id_pedido)
);

CREATE TABLE produtos
(
    id_produto integer NOT NULL,
    nome_produto character varying(30) COLLATE pg_catalog."default" NOT NULL,
    categoria_produto text COLLATE pg_catalog."default" NOT NULL,
    preco_produto numeric(10, 2) NOT NULL,
    tempoprep_produto time without time zone NOT NULL,
    emoji_produto character varying(30) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT produtos_pkey PRIMARY KEY (id_produto)
);

CREATE TABLE usuarios
(
    id_usuario integer NOT NULL,
    nome_usuario character varying(30) COLLATE pg_catalog."default" NOT NULL,
    senha_usuario character varying(30) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT usuarios_pkey PRIMARY KEY (id_usuario)
);

ALTER TABLE avaliacoes
    ADD CONSTRAINT fk_avaliacoes_produtos FOREIGN KEY (id_produto)
    REFERENCES public.produtos (id_produto) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;
