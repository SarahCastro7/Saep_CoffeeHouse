const togglePassword = document.querySelector('#togglePassword');
const passwordInput = document.querySelector('#password');

togglePassword.addEventListener('click', function () {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    this.classList.toggle('fa-eye');
    this.classList.toggle('fa-eye-slash');
});

const loginForm = document.querySelector('#loginForm');
loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    
    const email = document.querySelector('#email').value;
    const password = passwordInput.value;

    console.log('Tentativa de login com:', { email, password });
    alert('Formulário enviado com sucesso!');
});
