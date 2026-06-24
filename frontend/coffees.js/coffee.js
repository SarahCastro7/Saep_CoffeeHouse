const DB = {
    usuarios: [
        { id: 1, nome: 'admin', senha: '123456', avatar: 'assets/images/avatar-admin.png' },
        { id: 2, nome: 'daniel', senha: '123456', avatar: 'assets/images/avatar-daniel.png' }
    ],
    produtos: [
        { id: 1, nome: 'Cappuccino', categoria: 'café', preco: 12.00, tempo: 5, emoji: '☕', likes: 0, comentarios: [] },
        { id: 2, nome: 'Café Expresso', categoria: 'café', preco: 8.00, tempo: 3, emoji: '☕', likes: 0, comentarios: [] },
        { id: 3, nome: 'Mocha', categoria: 'café', preco: 15.00, tempo: 6, emoji: '☕', likes: 0, comentarios: [] },
        { id: 4, nome: 'Croissant', categoria: 'lanches', preco: 14.00, tempo: 4, emoji: '🥐', likes: 0, comentarios: [] },
        { id: 5, nome: 'Pão de Queijo', categoria: 'lanches', preco: 9.00, tempo: 3, emoji: '🥐', likes: 0, comentarios: [] },
        { id: 6, nome: 'Sanduíche Natural', categoria: 'lanches', preco: 18.00, tempo: 7, emoji: '🥐', likes: 0, comentarios: [] },
        { id: 7, nome: 'Bolo de Chocolate', categoria: 'sobremesas', preco: 10.00, tempo: 3, emoji: '🍰', likes: 0, comentarios: [] },
        { id: 8, nome: 'Cheesecake', categoria: 'sobremesas', preco: 16.00, tempo: 4, emoji: '🍰', likes: 0, comentarios: [] },
        { id: 9, nome: 'Brownie', categoria: 'sobremesas', preco: 11.00, tempo: 3, emoji: '🍰', likes: 0, comentarios: [] }
    ],
    pedidos: [
        { id: 1, id_usuario: 1, id_produto: 1, quantidade: 2, data: '2026-06-24' },
        { id: 2, id_usuario: 1, id_produto: 4, quantidade: 1, data: '2026-06-24' },
        { id: 3, id_usuario: 2, id_produto: 7, quantidade: 3, data: '2026-06-23' }
    ],
    likes: [

    ]
};


let state = {
    usuarioLogado: null,
    produtos: [...DB.produtos],
    filtroAtivo: 'todos',
    paginaAtual: 1,
    itensPorPagina: 4,
    produtoEmComentario: null
};

const DOM = {
  
    sidebar: document.getElementById('sidebar'),
    logoEmpresa: document.getElementById('logoEmpresa'),
    nomeEmpresa: document.getElementById('nomeEmpresa'),
    totalPedidos: document.getElementById('totalPedidos'),
    totalValor: document.getElementById('totalValor'),
    perfilUsuario: document.getElementById('perfilUsuario'),
    avatarUsuario: document.getElementById('avatarUsuario'),
    nomeUsuarioLogado: document.getElementById('nomeUsuarioLogado'),
    meusPedidos: document.getElementById('meusPedidos'),
    meuGasto: document.getElementById('meuGasto'),
    btnPedir: document.getElementById('btnPedir'),
    btnSair: document.getElementById('btnSair'),

    btnLogin: document.getElementById('btnLogin'),
    userLogged: document.getElementById('userLogged'),
    welcomeUser: document.getElementById('welcomeUser'),
    btnLogoutHeader: document.getElementById('btnLogoutHeader'),
    produtosGrid: document.getElementById('produtosGrid'),
    filtros: document.querySelectorAll('.filtro-btn'),
    btnAnterior: document.getElementById('btnAnterior'),
    btnProximo: document.getElementById('btnProximo'),
    pageNumbers: document.getElementById('pageNumbers'),

    modalLogin: document.getElementById('modalLogin'),
    modalClose: document.getElementById('modalClose'),
    formLogin: document.getElementById('formLogin'),
    loginUser: document.getElementById('loginUser'),
    loginPass: document.getElementById('loginPass'),
    errorUser: document.getElementById('errorUser'),
    errorPass: document.getElementById('errorPass'),

    modalPedido: document.getElementById('modalPedido'),
    modalPedidoClose: document.getElementById('modalPedidoClose'),
    formPedido: document.getElementById('formPedido'),
    pedidoProduto: document.getElementById('pedidoProduto'),
    pedidoQuantidade: document.getElementById('pedidoQuantidade'),
    errorProduto: document.getElementById('errorProduto'),
    errorQuantidade: document.getElementById('errorQuantidade'),

    modalComentario: document.getElementById('modalComentario'),
    modalComentarioClose: document.getElementById('modalComentarioClose'),
    comentariosLista: document.getElementById('comentariosLista'),
    comentarioInput: document.getElementById('comentarioInput'),
    btnEnviarComentario: document.getElementById('btnEnviarComentario'),
    errorComentario: document.getElementById('errorComentario')
};


function getProdutosFiltrados() {
    if (state.filtroAtivo === 'todos') {
        return state.produtos;
    }
    return state.produtos.filter(p => p.categoria === state.filtroAtivo);
}

function getProdutosPaginados() {
    const filtrados = getProdutosFiltrados();
    const inicio = (state.paginaAtual - 1) * state.itensPorPagina;
    return filtrados.slice(inicio, inicio + state.itensPorPagina);
}

function getTotalPaginas() {
    const filtrados = getProdutosFiltrados();
    return Math.ceil(filtrados.length / state.itensPorPagina);
}

function formatarMoeda(valor) {
    return 'R$ ' + valor.toFixed(2).replace('.', ',');
}

function getUsuarioLogado() {
    const dados = localStorage.getItem('coffeehouse_user');
    if (dados) {
        try {
            const user = JSON.parse(dados);
            return DB.usuarios.find(u => u.id === user.id) || null;
        } catch {
            return null;
        }
    }
    return null;
}

function salvarUsuarioLogado(usuario) {
    if (usuario) {
        localStorage.setItem('coffeehouse_user', JSON.stringify({ id: usuario.id, nome: usuario.nome }));
    } else {
        localStorage.removeItem('coffeehouse_user');
    }
}

function renderizarProdutos() {
    const produtos = getProdutosPaginados();
    const grid = DOM.produtosGrid;

    if (produtos.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: #888; font-size: 18px;">
                <i class="fa-solid fa-mug-saucer" style="font-size: 48px; display: block; margin-bottom: 16px; color: var(--bordas-suaves);"></i>
                Nenhum produto encontrado nesta categoria.
            </div>
        `;
        return;
    }

    grid.innerHTML = produtos.map(produto => {
        const usuarioLogado = state.usuarioLogado;
        const jaCurtiu = usuarioLogado ? DB.likes.some(l => l.id_usuario === usuarioLogado.id && l.id_produto === produto.id) : false;
        const qtdComentarios = produto.comentarios ? produto.comentarios.length : 0;

        return `
            <div class="produto-card" data-id="${produto.id}" data-categoria="${produto.categoria}">
                <span class="produto-emoji">${produto.emoji}</span>
                <h3 class="produto-nome">${produto.nome}</h3>
                <div class="produto-info">
                    <span><i class="fa-solid fa-hashtag"></i> 1</span>
                    <span><i class="fa-regular fa-clock"></i> ${produto.tempo} min</span>
                    <span class="produto-preco">${formatarMoeda(produto.preco)}</span>
                </div>
                <div class="produto-actions">
                    <button class="action-btn like-btn ${jaCurtiu ? 'liked' : ''}" data-id="${produto.id}" ${!usuarioLogado ? 'disabled' : ''}>
                        <img src="assets/images/coracao.svg" alt="Like" class="icone">
                        <span class="contador">${produto.likes || 0}</span>
                    </button>
                    <button class="action-btn comment-btn" data-id="${produto.id}" ${!usuarioLogado ? 'disabled' : ''}>
                        <img src="assets/images/comentario.svg" alt="Comentário" class="icone">
                        <span class="contador">${qtdComentarios}</span>
                    </button>
                </div>
            </div>
        `;
    }).join('');


    atualizarTotais();
}

function renderizarPaginacao() {
    const total = getTotalPaginas();
    const atual = state.paginaAtual;
    const numbers = DOM.pageNumbers;

    let html = '';
    for (let i = 1; i <= total; i++) {
        html += `<button class="page-num ${i === atual ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }
    numbers.innerHTML = html;


    numbers.querySelectorAll('.page-num').forEach(btn => {
        btn.addEventListener('click', () => {
            const pagina = parseInt(btn.dataset.page);
            if (pagina !== state.paginaAtual) {
                state.paginaAtual = pagina;
                atualizarPagina();
            }
        });
    });

 
    DOM.btnAnterior.disabled = atual <= 1;
    DOM.btnProximo.disabled = atual >= total;
}

function atualizarTotais() {

    const totalPedidos = DB.pedidos.length;
    DOM.totalPedidos.textContent = totalPedidos;

  
    let totalValor = 0;
    DB.pedidos.forEach(p => {
        const produto = DB.produtos.find(pr => pr.id === p.id_produto);
        if (produto) {
            totalValor += produto.preco * p.quantidade;
        }
    });
    DOM.totalValor.textContent = formatarMoeda(totalValor);

  
    if (state.usuarioLogado) {
        const pedidosUsuario = DB.pedidos.filter(p => p.id_usuario === state.usuarioLogado.id);
        DOM.meusPedidos.textContent = pedidosUsuario.length;

        let gastoUsuario = 0;
        pedidosUsuario.forEach(p => {
            const produto = DB.produtos.find(pr => pr.id === p.id_produto);
            if (produto) {
                gastoUsuario += produto.preco * p.quantidade;
            }
        });
        DOM.meuGasto.textContent = formatarMoeda(gastoUsuario);
    }
}

function atualizarPagina() {
    renderizarProdutos();
    renderizarPaginacao();
}

function atualizarInterfaceUsuario() {
    const usuario = state.usuarioLogado;

    if (usuario) {
       
        DOM.perfilUsuario.style.display = 'block';
        DOM.avatarUsuario.src = usuario.avatar || 'assets/images/avatar-default.png';
        DOM.nomeUsuarioLogado.textContent = usuario.nome;
        DOM.btnPedir.disabled = false;
        DOM.btnSair.style.display = 'flex';

    
        DOM.btnLogin.style.display = 'none';
        DOM.userLogged.style.display = 'flex';
        DOM.welcomeUser.textContent = usuario.nome;

     
        document.querySelectorAll('.like-btn, .comment-btn').forEach(btn => {
            btn.disabled = false;
        });


        atualizarTotais();

    } else {

        DOM.perfilUsuario.style.display = 'none';
        DOM.btnPedir.disabled = true;
        DOM.btnSair.style.display = 'none';

        DOM.btnLogin.style.display = 'flex';
        DOM.userLogged.style.display = 'none';

        document.querySelectorAll('.like-btn, .comment-btn').forEach(btn => {
            btn.disabled = true;
        });
    }

    renderizarProdutos();
}

DOM.filtros.forEach(btn => {
    btn.addEventListener('click', function() {
        // Se não estiver logado, mostrar modal de login
        if (!state.usuarioLogado) {
            abrirModalLogin();
            return;
        }

        DOM.filtros.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        state.filtroAtivo = this.dataset.categoria;
        state.paginaAtual = 1;
        atualizarPagina();
    });
});

DOM.btnAnterior.addEventListener('click', () => {
    if (!state.usuarioLogado) {
        abrirModalLogin();
        return;
    }
    if (state.paginaAtual > 1) {
        state.paginaAtual--;
        atualizarPagina();
    }
});

DOM.btnProximo.addEventListener('click', () => {
    if (!state.usuarioLogado) {
        abrirModalLogin();
        return;
    }
    const total = getTotalPaginas();
    if (state.paginaAtual < total) {
        state.paginaAtual++;
        atualizarPagina();
    }
});

DOM.produtosGrid.addEventListener('click', (e) => {
    const likeBtn = e.target.closest('.like-btn');
    if (likeBtn) {
        e.preventDefault();
        if (!state.usuarioLogado) {
            abrirModalLogin();
            return;
        }

        const produtoId = parseInt(likeBtn.dataset.id);
        const usuario = state.usuarioLogado;
        const produto = DB.produtos.find(p => p.id === produtoId);
        if (!produto) return;

        const jaCurtiu = DB.likes.some(l => l.id_usuario === usuario.id && l.id_produto === produtoId);

        if (jaCurtiu) {
        
            const idx = DB.likes.findIndex(l => l.id_usuario === usuario.id && l.id_produto === produtoId);
            if (idx !== -1) DB.likes.splice(idx, 1);
            produto.likes = (produto.likes || 0) - 1;
        } else {
        
            DB.likes.push({ id_usuario: usuario.id, id_produto: produtoId });
            produto.likes = (produto.likes || 0) + 1;
        }

        atualizarPagina();
    }
});

DOM.produtosGrid.addEventListener('click', (e) => {
    const commentBtn = e.target.closest('.comment-btn');
    if (commentBtn) {
        e.preventDefault();
        if (!state.usuarioLogado) {
            abrirModalLogin();
            return;
        }

        const produtoId = parseInt(commentBtn.dataset.id);
        state.produtoEmComentario = produtoId;
        abrirModalComentario(produtoId);
    }
});


DOM.btnLogin.addEventListener('click', abrirModalLogin);
DOM.modalClose.addEventListener('click', fecharModalLogin);

DOM.modalLogin.addEventListener('click', (e) => {
    if (e.target === DOM.modalLogin) fecharModalLogin();
});

DOM.formLogin.addEventListener('submit', (e) => {
    e.preventDefault();

    const user = DOM.loginUser.value.trim();
    const pass = DOM.loginPass.value.trim();


    DOM.loginUser.classList.remove('error');
    DOM.loginPass.classList.remove('error');
    DOM.errorUser.textContent = '';
    DOM.errorPass.textContent = '';

    let hasError = false;
    if (!user) {
        DOM.loginUser.classList.add('error');
        DOM.errorUser.textContent = 'usuário obrigatório';
        hasError = true;
    }
    if (!pass) {
        DOM.loginPass.classList.add('error');
        DOM.errorPass.textContent = 'senha obrigatória';
        hasError = true;
    }
    if (hasError) return;

    const usuario = DB.usuarios.find(u => u.nome === user && u.senha === pass);

    if (!usuario) {
        DOM.loginUser.classList.add('error');
        DOM.loginPass.classList.add('error');
        DOM.errorPass.textContent = 'usuário ou senha incorreta';
        return;
    }


    state.usuarioLogado = usuario;
    salvarUsuarioLogado(usuario);


    atualizarInterfaceUsuario();
    fecharModalLogin();
    DOM.loginUser.value = '';
    DOM.loginPass.value = '';
});


function fazerLogout() {
    state.usuarioLogado = null;
    salvarUsuarioLogado(null);
    state.filtroAtivo = 'todos';
    state.paginaAtual = 1;


    DOM.filtros.forEach(b => b.classList.remove('active'));
    DOM.filtros[0].classList.add('active');

    atualizarInterfaceUsuario();
    atualizarPagina();
}

DOM.btnSair.addEventListener('click', fazerLogout);
DOM.btnLogoutHeader.addEventListener('click', fazerLogout);


DOM.btnPedir.addEventListener('click', () => {
    if (!state.usuarioLogado) {
        abrirModalLogin();
        return;
    }
    abrirModalPedido();
});

DOM.modalPedidoClose.addEventListener('click', fecharModalPedido);
DOM.modalPedido.addEventListener('click', (e) => {
    if (e.target === DOM.modalPedido) fecharModalPedido();
});

DOM.formPedido.addEventListener('submit', (e) => {
    e.preventDefault();

    const produtoId = parseInt(DOM.pedidoProduto.value);
    const quantidade = parseInt(DOM.pedidoQuantidade.value);

    DOM.errorProduto.textContent = '';
    DOM.errorQuantidade.textContent = '';

    if (!produtoId) {
        DOM.errorProduto.textContent = 'Selecione um produto';
        return;
    }
    if (!quantidade || quantidade < 1) {
        DOM.errorQuantidade.textContent = 'Quantidade deve ser maior que 0';
        return;
    }


    DB.pedidos.push({
        id: DB.pedidos.length + 1,
        id_usuario: state.usuarioLogado.id,
        id_produto: produtoId,
        quantidade: quantidade,
        data: new Date().toISOString().split('T')[0]
    });

    fecharModalPedido();
    atualizarInterfaceUsuario();
    atualizarPagina();


    alert('Pedido realizado com sucesso! ☕');
});


DOM.modalComentarioClose.addEventListener('click', fecharModalComentario);
DOM.modalComentario.addEventListener('click', (e) => {
    if (e.target === DOM.modalComentario) fecharModalComentario();
});

DOM.btnEnviarComentario.addEventListener('click', enviarComentario);
DOM.comentarioInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') enviarComentario();
});

function enviarComentario() {
    const texto = DOM.comentarioInput.value.trim();
    const produtoId = state.produtoEmComentario;

    DOM.errorComentario.textContent = '';

    if (!texto) {
        DOM.errorComentario.textContent = 'não é possível enviar um comentário vazio';
        return;
    }

    if (texto.length < 3) {
        DOM.errorComentario.textContent = 'O comentário deve ter mais de 2 caracteres';
        return;
    }


    const produto = DB.produtos.find(p => p.id === produtoId);
    if (produto) {
        if (!produto.comentarios) produto.comentarios = [];
        produto.comentarios.push({
            id_usuario: state.usuarioLogado.id,
            nome_usuario: state.usuarioLogado.nome,
            texto: texto,
            data: new Date().toISOString()
        });
    }

    DOM.comentarioInput.value = '';
    abrirModalComentario(produtoId);
    atualizarPagina();
}

function abrirModalLogin() {
    DOM.modalLogin.classList.add('show');
    DOM.loginUser.focus();
}

function fecharModalLogin() {
    DOM.modalLogin.classList.remove('show');
    DOM.loginUser.classList.remove('error');
    DOM.loginPass.classList.remove('error');
    DOM.errorUser.textContent = '';
    DOM.errorPass.textContent = '';
}

function abrirModalPedido() {

    const select = DOM.pedidoProduto;
    select.innerHTML = '<option value="">Selecione um produto</option>';
    DB.produtos.forEach(p => {
        select.innerHTML += `<option value="${p.id}">${p.emoji} ${p.nome} - ${formatarMoeda(p.preco)}</option>`;
    });
    DOM.modalPedido.classList.add('show');
}

function fecharModalPedido() {
    DOM.modalPedido.classList.remove('show');
    DOM.errorProduto.textContent = '';
    DOM.errorQuantidade.textContent = '';
}

function abrirModalComentario(produtoId) {
    const produto = DB.produtos.find(p => p.id === produtoId);
    if (!produto) return;

    const lista = DOM.comentariosLista;
    const comentarios = produto.comentarios || [];

    if (comentarios.length === 0) {
        lista.innerHTML = '<p style="text-align: center; color: #888; padding: 20px;">Nenhum comentário ainda. Seja o primeiro!</p>';
    } else {
        lista.innerHTML = comentarios.map(c => `
            <div class="comentario-item">
                <span class="comentario-usuario">${c.nome_usuario || 'Usuário'}</span>
                <p class="comentario-texto">${c.texto}</p>
                <span class="comentario-data">${new Date(c.data).toLocaleString('pt-BR')}</span>
            </div>
        `).join('');
    }

    DOM.modalComentario.classList.add('show');
    DOM.comentarioInput.value = '';
    DOM.comentarioInput.focus();
    DOM.errorComentario.textContent = '';
}

function fecharModalComentario() {
    DOM.modalComentario.classList.remove('show');
    state.produtoEmComentario = null;
    DOM.errorComentario.textContent = '';
}


function init() {
    const usuario = getUsuarioLogado();
    if (usuario) {
        state.usuarioLogado = usuario;
    }


    atualizarInterfaceUsuario();
    atualizarPagina();

    DOM.logoEmpresa.src = 'assets/images/CoffeeHouse.png';
    DOM.nomeEmpresa.textContent = 'CoffeeHouse';

    console.log('☕ CoffeeHouse iniciado!');
    console.log('Usuário logado:', state.usuarioLogado ? state.usuarioLogado.nome : 'Nenhum');
}

document.addEventListener('DOMContentLoaded', init);