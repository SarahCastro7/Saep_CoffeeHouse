document.addEventListener("DOMContentLoaded", () => {
    // --- CONTROLE DE ELEMENTOS DA NAVBAR E MODAL ---
    const btnNavLogin = document.getElementById("btnNavLogin");
    const btnNavCta = document.getElementById("btnNavCta");
    const menuAvatar = document.getElementById("menuAvatar");

    const profileModal = document.getElementById("profileModal");
    const viewCard = document.getElementById("viewCard");
    const editCard = document.getElementById("editCard");

    const closeView = document.getElementById("closeView");
    const closeEdit = document.getElementById("closeEdit");
    const goEdit = document.getElementById("goEdit");
    const cancelBtn = document.getElementById("cancelBtn");
    const editForm = document.getElementById("editForm");

    // Inputs e Campos Visuais do Perfil
    const txtName = document.getElementById("txt-name");
    const txtRole = document.getElementById("txt-role");
    const txtBio = document.getElementById("txt-bio");
    const txtLocation = document.getElementById("txt-location");
    const txtEmail = document.getElementById("txt-email");
    const txtSpecialty = document.getElementById("txt-specialty");
    const viewSkillsTags = document.getElementById("view-skills-tags");

    const inName = document.getElementById("in-name");
    const inRole = document.getElementById("in-role");
    const inBio = document.getElementById("in-bio");
    const inLocation = document.getElementById("in-location");
    const inEmail = document.getElementById("in-email");
    const inSpecialty = document.getElementById("in-specialty");
    const inSkills = document.getElementById("in-skills");
    const fileInput = document.getElementById("fileInput");

    // Imagem Padrão de Cadastro
    const fotoPadrao = "IMG_PERFIL.avif";

    // --- FUNÇÃO: INICIALIZAR PERFIL VAZIO (CADASTRO NOVO) ---
    function inicializarPerfilVazio() {
        document.querySelectorAll(".user-img").forEach(img => img.src = fotoPadrao);

        // Textos de exibição iniciais vazios/padrão
        if (txtName) txtName.textContent = "Seu Nome Aqui";
        if (txtRole) txtRole.textContent = "Seu Cargo / Objetivo";
        if (txtBio) txtBio.textContent = "Escreva uma breve descrição sobre você...";
        if (txtLocation) txtLocation.textContent = "Sua Cidade, UF";
        if (txtEmail) txtEmail.textContent = "seu.email@exemplo.com";
        if (txtSpecialty) txtSpecialty.textContent = "Não definida";
        if (viewSkillsTags) viewSkillsTags.innerHTML = `<span class="tag" style="background:#f1f5f9; color:#94a3b8;">Nenhuma habilidade adicionada</span>`;

        // Inputs limpos práticos para preenchimento
        if (inName) inName.value = "";
        if (inRole) inRole.value = "";
        if (inBio) inBio.value = "";
        if (inLocation) inLocation.value = "";
        if (inEmail) inEmail.value = "";
        if (inSkills) inSkills.value = "";
    }

    inicializarPerfilVazio();

    // --- POOL DE VAGAS DO SISTEMA DE MATCH ---
    const poolVagas = [
        { title: "Desenvolvedor Front-End Junior", company: "AlphaTech Systems", local: "São Paulo, SP (Híbrido)", salary: "R$ 4.200", specialty: "Front-End", skills: ["React", "JavaScript", "CSS"], icon: "fa-code", color: "#2181BD" },
        { title: "React Developer Mobile", company: "Coders Lab", local: "Remoto", salary: "R$ 5.500", specialty: "Front-End", skills: ["React", "JavaScript", "Design"], icon: "fa-mobile-screen", color: "#8E44AD" },
        { title: "Analista Node.js & Databases", company: "DataFlow Corp", local: "Remoto", salary: "R$ 6.000", specialty: "Back-End", skills: ["JavaScript", "Node.js", "Inglês"], icon: "fa-terminal", color: "#27AE60" },
        { title: "Analista de Growth & Marketing", company: "MarketPro Agência", local: "Rio de Janeiro, RJ", salary: "R$ 3.800", specialty: "Marketing Digital", skills: ["SEO", "Google Ads", "Design"], icon: "fa-chart-line", color: "#E67E22" },
        { title: "UI/UX Product Designer", company: "Creative Studios", local: "Remoto", salary: "R$ 5.000", specialty: "Design UX/UI", skills: ["Design", "Figma", "React"], icon: "fa-palette", color: "#E74C3C" },
        { title: "Desenvolvedor Web Geral", company: "WebStart", local: "Remoto", salary: "R$ 3.500", specialty: "Front-End", skills: ["JavaScript", "HTML", "CSS"], icon: "fa-globe", color: "#2980B9" },
        { title: "Designer de Interface", company: "Pixel Perfeito", local: "Belo Horizonte, MG", salary: "R$ 4.000", specialty: "Design UX/UI", skills: ["Design", "Figma"], icon: "fa-bezier-curve", color: "#9B59B6" }
    ];

    let vagaAtualIndex = 0;
    let empresasRestantes = 14; // Contador regressivo solicitado iniciando em 14

    function atualizarContadoresInterface() {
        const txtEmpresas = document.getElementById("texto-empresas");
        const liveCounter = document.getElementById("live-counter");
        if (txtEmpresas) txtEmpresas.textContent = `${empresasRestantes} empresas interessadas`;
        if (liveCounter) liveCounter.textContent = `+${empresasRestantes}`;
    }

    // --- ENGENHARIA DO MATCH (ESTILO TINDER) ---
    function atualizarVagaMatch() {
        const cardVaga = document.getElementById("cardVaga");
        if (!cardVaga) return;

        if (empresasRestantes <= 0) {
            cardVaga.innerHTML = `
                <div style="padding: 40px 10px;">
                    <i class="fa-solid fa-circle-check" style="font-size: 3rem; color: #2181BD; margin-bottom: 15px;"></i>
                    <h3 style="color: #1e293b; margin-bottom: 8px;">Tudo avaliado!</h3>
                    <p style="color: #64748b; font-size: 14px;">Você revisou todas as empresas interessadas no momento.</p>
                </div>
            `;
            atualizarContadoresInterface();
            return;
        }

        const userSkills = inSkills.value.split(",").map(s => s.trim().toLowerCase());
        const userSpec = inSpecialty.value;

        // Filtra vagas por especialidade do usuário (se houver)
        let listaFiltrada = poolVagas.filter(vaga => vaga.specialty === userSpec);
        if (listaFiltrada.length === 0 || !userSpec || userSpec === "Não definida") {
            listaFiltrada = poolVagas;
        }

        const vaga = listaFiltrada[vagaAtualIndex % listaFiltrada.length];

        // Cálculo dinâmico real da porcentagem baseado nas skills digitadas no cadastro
        let hits = 0;
        let totalSkillsVaga = vaga.skills.length;
        vaga.skills.forEach(sk => {
            if (userSkills.includes(sk.toLowerCase())) hits++;
        });

        let matchPercent = 50 + Math.round((hits / totalSkillsVaga) * 50);
        if (matchPercent > 100) matchPercent = 100;

        // Injeta dados dinâmicos no HTML do Card
        document.getElementById("vagaTitle").textContent = vaga.title;
        document.getElementById("vagaCompany").innerHTML = `<i class="fa-solid fa-building"></i> ${vaga.company}`;
        document.getElementById("vagaLocation").textContent = vaga.local;
        document.getElementById("vagaSalary").textContent = vaga.salary;
        document.getElementById("vagaMatchPercent").textContent = `${matchPercent}% Match`;

        const logoPrincipal = document.getElementById("logoPrincipal");
        if (logoPrincipal) logoPrincipal.style.backgroundColor = vaga.color;

        const vagaIcon = document.getElementById("vagaIcon");
        if (vagaIcon) vagaIcon.className = `fa-solid ${vaga.icon}`;

        const vagaSkillsTags = document.getElementById("vagaSkillsTags");
        if (vagaSkillsTags) {
            vagaSkillsTags.innerHTML = "";
            vaga.skills.forEach(sk => {
                const span = document.createElement("span");
                span.className = "tag-skill";
                span.textContent = sk;
                vagaSkillsTags.appendChild(span);
            });
        }

        atualizarContadoresInterface();
    }

    // --- ANIMAÇÃO DE SWIPE LATERAL ---
    function animarSwipe(direcao) {
        const card = document.getElementById("cardVaga");
        if (!card) return;

        if (direcao === "esquerda") {
            card.classList.add("swipe-esquerda");
        } else {
            card.classList.add("swipe-direita");
        }

        // Decrementa o contador regressivo de empresas interessadas a cada ação
        if (empresasRestantes > 0) {
            empresasRestantes--;
        }

        setTimeout(() => {
            vagaAtualIndex++;
            card.className = "card-vaga"; // Limpa as classes de animação e traz o card de volta ao centro
            atualizarVagaMatch();
        }, 350);
    }

    // Ouvintes de Clique do Tinder
    const btnPassar = document.getElementById("btnPassar");
    const btnInteressado = document.getElementById("btnInteressado");
    if (btnPassar) btnPassar.addEventListener("click", () => animarSwipe("esquerda"));
    if (btnInteressado) btnInteressado.addEventListener("click", () => animarSwipe("direita"));


    // --- GERENCIAMENTO INTELIGENTE DA NAVBAR E MODAL ---

    // Abre direto na Edição de Cadastro caso clique em "Entrar" ou "Começar"
    const abrirModalCadastroNovo = (e) => {
        if (e) e.preventDefault();
        profileModal.classList.remove("hidden");
        viewCard.classList.add("hidden");
        editCard.classList.remove("hidden");
    };

    if (btnNavLogin) btnNavLogin.addEventListener("click", abrirModalCadastroNovo);
    if (btnNavCta) btnNavCta.addEventListener("click", abrirModalCadastroNovo);

    // Abre na Visualização se clicar no avatar redondo (já logado)
    if (menuAvatar) {
        menuAvatar.addEventListener("click", (e) => {
            e.preventDefault();
            profileModal.classList.remove("hidden");
            viewCard.classList.remove("hidden");
            editCard.classList.add("hidden");
        });
    }

    // FECHAR/CANCELAR: Se não terminou o cadastro, mantém ou volta a exibir "Entrar/Começar"
    const fecharEVerificarEstadoNavbar = (e) => {
        if (e) e.preventDefault();
        profileModal.classList.add("hidden");

        const atualNome = txtName ? txtName.textContent : "Seu Nome Aqui";
        if (atualNome === "Seu Nome Aqui" || atualNome === "") {
            if (btnNavLogin) btnNavLogin.classList.remove("hidden");
            if (btnNavCta) btnNavCta.classList.remove("hidden");
            if (menuAvatar) menuAvatar.classList.add("hidden");
        }
    };

    if (closeView) closeView.addEventListener("click", fecharEVerificarEstadoNavbar);
    if (closeEdit) closeEdit.addEventListener("click", fecharEVerificarEstadoNavbar);
    if (cancelBtn) cancelBtn.addEventListener("click", fecharEVerificarEstadoNavbar);

    if (goEdit) {
        goEdit.addEventListener("click", (e) => {
            e.preventDefault();
            viewCard.classList.add("hidden");
            editCard.classList.remove("hidden");
        });
    }

    // Upload/Troca de Foto de Perfil (Preview em tempo real)
    if (fileInput) {
        fileInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    document.querySelectorAll(".user-img").forEach(img => {
                        img.src = event.target.result;
                    });
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // --- FORMULÁRIO SUBMIT (EFETIVAR CADASTRO E SALVAR DADOS) ---
    if (editForm) {
        editForm.addEventListener("submit", (e) => {
            e.preventDefault(); // Impede criticalmente o F5 nativo que reseta a página

            // Atualiza os dados textuais do perfil
            if (txtName) txtName.textContent = inName.value.trim() || "Usuário";
            if (txtRole) txtRole.textContent = inRole.value.trim() || "Profissional";
            if (txtBio) txtBio.textContent = inBio.value.trim() || "Escreva uma breve descrição...";
            if (txtLocation) txtLocation.textContent = inLocation.value.trim() || "Brasil";
            if (txtEmail) txtEmail.textContent = inEmail.value.trim() || "";
            if (txtSpecialty) txtSpecialty.textContent = inSpecialty.value;

            // Renderiza as tags visuais de Habilidades
            if (viewSkillsTags) {
                viewSkillsTags.innerHTML = "";
                if (inSkills.value.trim() !== "") {
                    const skillsArray = inSkills.value.split(",");
                    skillsArray.forEach(skill => {
                        if (skill.trim() !== "") {
                            const span = document.createElement("span");
                            span.className = "tag";
                            span.textContent = skill.trim();
                            viewSkillsTags.appendChild(span);
                        }
                    });
                } else {
                    viewSkillsTags.innerHTML = `<span class="tag" style="background:#f1f5f9; color:#94a3b8;">Nenhuma habilidade adicionada</span>`;
                }
            }

            // Altera estocasticamente o número de matches salvos
            const statMatches = document.getElementById("stat-matches");
            if (statMatches) statMatches.textContent = Math.floor(Math.random() * 4) + 1;

            // Transiciona o Estado da Navbar: Esconde botões textuais e exibe a foto redonda fixada
            if (btnNavLogin) btnNavLogin.classList.add("hidden");
            if (btnNavCta) btnNavCta.classList.add("hidden");
            if (menuAvatar) menuAvatar.classList.remove("hidden");

            // Recalcula o Tinder com base nas preferências/skills salvas
            atualizarVagaMatch();

            // Reseta a visão interna do modal e fecha
            editCard.classList.add("hidden");
            viewCard.classList.remove("hidden");
            profileModal.classList.add("hidden");
        });
    }

    // Link externo de redirecionamento vindo de outras páginas (?open=true)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('open') === 'true') {
        abrirModalCadastroNovo();
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Inicializa os contadores e a primeira vaga do Tinder
    atualizarVagaMatch();
});