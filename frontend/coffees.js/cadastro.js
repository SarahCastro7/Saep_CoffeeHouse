document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#loginForm') || document.querySelector('.signup-form');
    if (!form) return;

    const passwordInput = document.getElementById('password');
    const toggleBtn = document.getElementById('togglePassword') || document.querySelector('.password-toggle');

    if (toggleBtn && passwordInput) {
        toggleBtn.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            toggleBtn.classList.toggle('fa-eye');
            toggleBtn.classList.toggle('fa-eye-slash');
        });
    }
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, "");
            if (value.length > 11) value = value.slice(0, 11);

            if (value.length > 0) value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
            if (value.length > 9) value = `${value.slice(0, 10)}-${value.slice(10)}`;

            e.target.value = value;
        });
    }

    // --- SUBMIT DO FORMULÁRIO ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const confirmPass = document.getElementById('confirm-password');
        if (confirmPass && passwordInput.value !== confirmPass.value) {
            alert('As senhas não coincidem!');
            return;
        }

        const email = document.getElementById('email').value;
        const password = passwordInput.value;

        console.log('Dados capturados:', { email, password });
        alert('Pronto para o Back-end! Verifique o console.');
    });
});