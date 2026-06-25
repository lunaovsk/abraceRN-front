const auth = {

    // Chave usada para guardar o token no localStorage
    TOKEN_KEY: 'abrace.token',

    // ===== Armazenamento do token =====

    salvarToken(token) {
        localStorage.setItem(this.TOKEN_KEY, token);
    },

    getToken() {
        return localStorage.getItem(this.TOKEN_KEY);
    },

    removerToken() {
        localStorage.removeItem(this.TOKEN_KEY);
    },

    /**
     * Decodifica o payload (claims) do JWT sem validar a assinatura.
     * A validação real é feita pelo back-end; aqui só lemos os dados
     * para exibir o usuário e controlar a interface.
     *
     * @returns {object|null} claims do token ou null se inexistente/inválido
     */
    lerClaims() {
        const token = this.getToken();
        if (!token) return null;

        try {
            // O payload é a parte do meio do token (header.payload.assinatura),
            // codificada em base64url.
            const payload = token.split('.')[1];
            const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
            return JSON.parse(json);
        } catch (error) {
            return null;
        }
    },

    /**
     * Verifica se existe um token válido e ainda não expirado.
     *
     * @returns {boolean}
     */
    estaAutenticado() {
        const claims = this.lerClaims();
        if (!claims) return false;

        // 'exp' vem em segundos (padrão JWT); Date.now() vem em milissegundos.
        if (claims.exp && Date.now() >= claims.exp * 1000) {
            this.removerToken();
            return false;
        }
        return true;
    },

    /**
     * Nome do usuário autenticado (claim 'sub' do token).
     *
     * @returns {string|null}
     */
    getUsuario() {
        const claims = this.lerClaims();
        return claims ? claims.sub : null;
    },

    /**
     * Monta os headers padrão das requisições, já com o token JWT.
     *
     * @param {object} extras headers adicionais opcionais
     * @returns {object}
     */
    headers(extras = {}) {
        const token = this.getToken();
        return {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...extras
        };
    },

    // ===== Navegação e sessão =====

    /**
     * Caminho da tela de login relativo à página atual.
     * (As páginas dentro de /pages usam um caminho diferente da raiz.)
     *
     * @returns {string}
     */
    caminhoLogin() {
        return window.location.pathname.includes('/pages/')
            ? './login.html'
            : './pages/login.html';
    },

    /**
     * Protege uma página restrita: se não houver sessão válida,
     * redireciona para o login. Deve ser chamada no início das
     * páginas que exigem autenticação.
     *
     * @returns {boolean} true se o usuário está autenticado
     */
    protegerPagina() {
        if (!this.estaAutenticado()) {
            window.location.replace(this.caminhoLogin());
            return false;
        }
        return true;
    },

    /**
     * Encerra a sessão (remove o token) e volta para a tela de login.
     */
    logout() {
        this.removerToken();
        window.location.href = this.caminhoLogin();
    },

    /**
     * Trata respostas de acesso negado das requisições à API.
     * - 401 (não autenticado / token expirado): limpa o token e volta ao login.
     * - 403 (autenticado, mas sem privilégios): apenas avisa o usuário e
     *   mantém a sessão, pois o token continua válido.
     *
     * @param {Response} response resposta retornada pelo fetch
     * @returns {boolean} true se a resposta indicava falta de acesso (já tratada)
     */
    tratarAcessoNegado(response) {
        if (response.status === 401) {
            this.removerToken();
            window.location.href = this.caminhoLogin();
            return true;
        }
        if (response.status === 403) {
            showToast('warning', 'Acesso negado: privilégios insuficientes.');
            return true;
        }
        return false;
    }
};
