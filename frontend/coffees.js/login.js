// ============================================ //
// BANCO DE DADOS MOCK                         //
// ============================================ //
const DB = {
    usuarios: [
        { id: 1, nome: 'admin', senha: '123456', avatar: 'assets/images/avatar-admin.png' },
        { id: 2, nome: 'daniel', senha: '123456', avatar: 'assets/images/avatar-daniel.png' }
    ]
};

// ============================================ //
// REFERÊNCIAS DOM                              //
// ============================================ //
const formLogin = document.getElementById('formLogin');
const loginUser = document.getElementById('loginUser');
const loginPass = document.getElementById('loginPass');
const errorUser = document.getElementById('errorUser');
const errorPass = document.getElementById('errorPass');
const btnLogin = document.getElementById('btnLogin');
const toast = document.getElementById('toast');

let toastTimeout = null;

// ============================================ //
// FUNÇÕES                                      //
// ============================================ //

// Mostrar toast de notificação
function mostrarToast(mensagem, tipo = 'info') {
    if (toastTimeout) {
        clearTimeout(toastTimeout);
        toast.classList.remove('show');
    }

    toast.textContent = mensagem;
    toast.className = 'toast ' + tipo;

    // Forçar reflow para reiniciar animação
    void toast.offsetWidth;

    toast.classList.add('show');

    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// Salvar usuário logado no localStorage
function salvarUsuarioLogado(usuario) {
    if (usuario) {
        localStorage.setItem('coffeehouse_user', JSON.stringify({ id: usuario.id, nome: usuario.nome }));
    } else {
        localStorage.removeItem('coffeehouse_user');
    }
}

// Redirecionar para a página inicial
function redirecionarParaHome() {
    window.location.href = 'index.html';
}

// Verificar se já está logado
function verificarSessao() {
    const dados = localStorage.getItem('coffeehouse_user');
    if (dados) {
        try {
            const user = JSON.parse(dados);
            const existe = DB.usuarios.find(u => u.id === user.id);
            if (existe) {
                // Já está logado, redirecionar para home
                window.location.href = 'index.html';
            }
        } catch {
            // Ignorar erro
        }
    }
}

// ============================================ //
// EVENTO DE SUBMISSÃO                          //
// ============================================ //
formLogin.addEventListener('submit', (e) => {
    e.preventDefault();

    const user = loginUser.value.trim();
    const pass = loginPass.value.trim();

    // Limpar erros
    loginUser.classList.remove('error');
    loginPass.classList.remove('error');
    errorUser.textContent = '';
    errorPass.textContent = '';

    // Validar campos obrigatórios
    let hasError = false;

    if (!user) {
        loginUser.classList.add('error');
        errorUser.textContent = 'usuário obrigatório';
        hasError = true;
    }

    if (!pass) {
        loginPass.classList.add('error');
        errorPass.textContent = 'senha obrigatória';
        hasError = true;
    }

    if (hasError) {
        mostrarToast('Preencha todos os campos', 'error');
        return;
    }

    // Desabilitar botão durante validação
    btnLogin.disabled = true;
    btnLogin.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Verificando...';

    // Simular requisição ao servidor (delay para feedback)
    setTimeout(() => {
        // Validar no banco
        const usuario = DB.usuarios.find(u => 
            u.nome.toLowerCase() === user.toLowerCase() && 
            u.senha === pass
        );

        if (!usuario) {
            loginUser.classList.add('error');
            loginPass.classList.add('error');
            errorPass.textContent = 'usuário ou senha incorreta';
            mostrarToast('Usuário ou senha incorretos', 'error');

            btnLogin.disabled = false;
            btnLogin.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Entrar';
            return;
        }

        // Login bem sucedido
        salvarUsuarioLogado(usuario);
        mostrarToast('Login realizado com sucesso! ☕', 'success');

        // Redirecionar após pequeno delay
        setTimeout(() => {
            redirecionarParaHome();
        }, 800);

    }, 600);
});

// ============================================ //
// ENTER PARA SUBMETER                          //
// ============================================ //
loginPass.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        formLogin.dispatchEvent(new Event('submit'));
    }
});

loginUser.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        loginPass.focus();
    }
});

// ============================================ //
// LIMPAR ERROS AO DIGITAR                      //
// ============================================ //
loginUser.addEventListener('input', () => {
    loginUser.classList.remove('error');
    errorUser.textContent = '';
});

loginPass.addEventListener('input', () => {
    loginPass.classList.remove('error');
    errorPass.textContent = '';
});

// ============================================ //
// INICIALIZAÇÃO                                //
// ============================================ //
verificarSessao();

console.log('☕ Página de Login - CoffeeHouse');