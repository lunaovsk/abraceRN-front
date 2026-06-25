/**
 * Lógica da tela de login.
 *
 * Envia as credenciais para a API (POST /login), guarda o token JWT
 * retornado e redireciona o usuário para o dashboard.
 */

// Se já existe uma sessão válida, pula direto para o dashboard.
if (auth.estaAutenticado()) {
    window.location.replace('../index.html');
}

const loginForm = document.getElementById('loginForm');
const loginBtn = document.getElementById('loginBtn');
const inputSenha = document.getElementById('password');
const toggleSenha = document.getElementById('toggleSenha');

// Mostrar / ocultar senha
toggleSenha.addEventListener('click', () => {
    const estavaOculta = inputSenha.type === 'password';
    inputSenha.type = estavaOculta ? 'text' : 'password';
    toggleSenha.querySelector('i').className = estavaOculta
        ? 'fa-solid fa-eye-slash'
        : 'fa-solid fa-eye';
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = inputSenha.value;

    if (!username || !password) {
        showToast('warning', 'Preencha usuário e senha.');
        return;
    }

    // Bloqueia o botão enquanto a requisição está em andamento
    loginBtn.disabled = true;
    loginBtn.textContent = 'Entrando...';

    try {
        const response = await fetch(configAPI.authURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        // Credenciais incorretas
        if ([400, 401, 403, 404].includes(response.status)) {
            throw new Error('credenciais');
        }
        // Qualquer outra falha (servidor fora do ar, 500, etc.)
        if (!response.ok) {
            throw new Error('servidor');
        }

        const data = await response.json();
        auth.salvarToken(data.tokenJWT);

        // Sucesso: vai para o dashboard
        window.location.href = '../index.html';

    } catch (error) {
        const credenciaisInvalidas = error.message === 'credenciais';
        showToast('error', credenciaisInvalidas
            ? 'Usuário ou senha inválidos.'
            : 'Não foi possível conectar ao servidor. Tente novamente em instantes.');
    } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = 'Entrar';
    }
});
