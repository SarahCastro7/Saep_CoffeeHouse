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
const formCadastro = document.getElementById('formCadastro');
const cadastroUser = document.getElementById('cadastroUser');
const cadastroEmail = document.getElementById('cadastroEmail');
const cadastroPass = document.getElementById('cadastroPass');
const cadastroConfirm = document.getElementById('cadastroConfirm');
const termosCheck = document.getElementById('termosCheck');

const errorUser = document.getElementById('errorUser');
const errorEmail = document.getElementById('errorEmail');
const errorPass = document.getElementById('errorPass');
const errorConfirm = document.getElementById('errorConfirm');
const errorTermos = document.getElementById('errorTermos');

const btnCadastrar = document.getElementById('btnCadastrar');
const toast = document.getElementById('toast');
const togglePass = document.getElementById('togglePass');
const eyeIcon = document.getElementById('eyeIcon');

const strengthBar1 = document.getElementById('strengthBar1');
const strengthBar2 = document.getElementById('strengthBar2');
const strengthBar3 = document.getElementById('strengthBar3');
const strengthText = document.getElementById('strengthText');

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
    void toast.offsetWidth;
    toast.classList.add('show');

    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// Validar e-mail
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Validar senha (mínimo 6 caracteres)
function validarSenha(senha) {
    return senha.length >= 6;
}

// Verificar força da senha
function verificarForcaSenha(senha) {
    let forca = 0;
    if (senha.length >= 6) forca++;
    if (senha.length >= 10) forca++;
    if (/[A-Z]/.test(senha) && /[a-z]/.test(senha)) forca++;
    if (/[0-9]/.test(senha)) forca++;
    if (/[^A-Za-z0-9]/.test(senha)) forca++;

    if (forca <= 1) return { nivel: 0, texto: 'Fraca', cor: '#ef4444' };
    if (forca <= 3) return { nivel: 1, texto: 'Média', cor: '#f59e0b' };
    if (forca <= 4) return { nivel: 2, texto: 'Boa', cor: '#22c55e' };
    return { nivel: 3, texto: 'Forte', cor: '#16a34a' };
}

// Atualizar indicador de força da senha
function atualizarForcaSenha() {
    const senha = cadastroPass.value;
    const forca = verificarForcaSenha(senha);

    const barras = [strengthBar1, strengthBar2, strengthBar3];
    barras.forEach((bar, i) => {
        bar.className = 'strength-bar';
        if (i < forca.nivel + 1) {
            bar.classList.add('active');
            bar.style.background = forca.cor;
        } else {
            bar.style.background = '#e5e7eb';
        }
    });

    strengthText.textContent = forca.texto;
    strengthText.style.color = forca.cor;
}

// ============================================ //
// EVENTO DE TOGGLE SENHA                       //
// ============================================ //
togglePass.addEventListener('click', () => {
    const type = cadastroPass.type === 'password' ? 'text' : 'password';
    cadastroPass.type = type;
    eyeIcon.className = type === 'password' ? 'fa-regular fa-eye' : 'fa-regular fa-eye-slash';
});

// ============================================ //
// EVENTO DE FORÇA DA SENHA                     //
// ============================================ //
cadastroPass.addEventListener('input', atualizarForcaSenha);

// ============================================ //
// LIMPAR ERROS AO DIGITAR                      //
// ============================================ //
cadastroUser.addEventListener('input', () => {
    cadastroUser.classList.remove('error');
    errorUser.textContent = '';
});

cadastroEmail.addEventListener('input', () => {
    cadastroEmail.classList.remove('error');
    errorEmail.textContent = '';
});

cadastroPass.addEventListener('input', () => {
    cadastroPass.classList.remove('error');
    errorPass.textContent = '';
});

cadastroConfirm.addEventListener('input', () => {
    cadastroConfirm.classList.remove('error');
    errorConfirm.textContent = '';
});

termosCheck.addEventListener('change', () => {
    errorTermos.textContent = '';
});

// ============================================ //
// EVENTO DE SUBMISSÃO                          //
// ============================================ //
formCadastro.addEventListener('submit', (e) => {
    e.preventDefault();

    const user = cadastroUser.value.trim();
    const email = cadastroEmail.value.trim();
    const pass = cadastroPass.value;
    const confirm = cadastroConfirm.value;
    const termos = termosCheck.checked;

    // Limpar erros
    [cadastroUser, cadastroEmail, cadastroPass, cadastroConfirm].forEach(el => {
        el.classList.remove('error');
    });
    errorUser.textContent = '';
    errorEmail.textContent = '';
    errorPass.textContent = '';
    errorConfirm.textContent = '';
    errorTermos.textContent = '';

    let hasError = false;

    // Validar usuário
    if (!user || user.length < 3) {
        cadastroUser.classList.add('error');
        errorUser.textContent = 'Usuário deve ter pelo menos 3 caracteres';
        hasError = true;
    } else if (DB.usuarios.some(u => u.nome.toLowerCase() === user.toLowerCase())) {
        cadastroUser.classList.add('error');
        errorUser.textContent = 'Este usuário já existe';
        hasError = true;
    }

    // Validar e-mail
    if (!email) {
        cadastroEmail.classList.add('error');
        errorEmail.textContent = 'E-mail é obrigatório';
        hasError = true;
    } else if (!validarEmail(email)) {
        cadastroEmail.classList.add('error');
        errorEmail.textContent = 'Digite um e-mail válido';
        hasError = true;
    }

    // Validar senha
    if (!pass) {
        cadastroPass.classList.add('error');
        errorPass.textContent = 'Senha é obrigatória';
        hasError = true;
    } else if (!validarSenha(pass)) {
        cadastroPass.classList.add('error');
        errorPass.textContent = 'A senha deve ter pelo menos 6 caracteres';
        hasError = true;
    }

    // Validar confirmação
    if (!confirm) {
        cadastroConfirm.classList.add('error');
        errorConfirm.textContent = 'Confirme sua senha';
        hasError = true;
    } else if (pass !== confirm) {
        cadastroConfirm.classList.add('error');
        errorConfirm.textContent = 'As senhas não coincidem';
        hasError = true;
    }

    // Validar termos
    if (!termos) {
        errorTermos.textContent = 'Você precisa aceitar os termos para continuar';
        hasError = true;
    }

    if (hasError) {
        mostrarToast('Por favor, corrija os erros no formulário', 'error');
        return;
    }

    // Desabilitar botão
    btnCadastrar.disabled = true;
    btnCadastrar.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Criando conta...';

    // Simular cadastro
    setTimeout(() => {
        // Criar novo usuário
        const novoUsuario = {
            id: DB.usuarios.length + 1,
            nome: user,
            senha: pass,
            email: email,
            avatar: 'assets/images/avatar-default.png'
        };

        DB.usuarios.push(novoUsuario);

        // Salvar usuário logado
        localStorage.setItem('coffeehouse_user', JSON.stringify({ 
            id: novoUsuario.id, 
            nome: novoUsuario.nome 
        }));

        mostrarToast('Conta criada com sucesso! ☕', 'success');

        // Redirecionar para home
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 800);

        btnCadastrar.disabled = false;
        btnCadastrar.innerHTML = '<i class="fa-solid fa-user-plus"></i> Criar Conta';

    }, 800);
});

// ============================================ //
// VERIFICAR SE JÁ ESTÁ LOGADO                  //
// ============================================ //
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

verificarSessao();

console.log('☕ Página de Cadastro - CoffeeHouse');