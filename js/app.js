// Bloqueia o acesso ao dashboard caso não exista sessão válida
auth.protegerPagina();

const app = {
    async inicializar() {
        // Sem sessão válida não há o que carregar (a guarda já redirecionou)
        if (!auth.estaAutenticado()) return;

        this.configurarSessao();
        await this.carregarTotais();
        await this.carregarItens(0, 5); // Carrega a tabela ao entrar
    },

    // Exibe o usuário logado e habilita o botão de sair
    configurarSessao() {
        const usuarioEl = document.getElementById("usuarioLogado");
        if (usuarioEl) usuarioEl.textContent = auth.getUsuario() || "";

        const logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn) logoutBtn.addEventListener("click", () => auth.logout());
    },

    async carregarTotais() {
        const dados = await apiService.buscarTotalItens();

        // Atualiza todos os campos com os dados recebidos
        document.getElementById("totalItens").value = dados.total;
        document.getElementById("tipoCadastrado").value = dados.totalType;
        document.getElementById("categorias").value = dados.totalTypeDistinct;
        document.getElementById("itensUnicos").value = dados.totalUnique;
    },

    async recarregarTotal() {
        await this.carregarTotais();
        await this.carregarItens(0, 5); // Recarrega a tabela depois de adicionar/deletar
    },

    async carregarItens(page = 0, size = 5) {
        try {
            const lista = await apiService.localizarItens(page, size); // chama a API paginada
            preencherTabela(lista); // atualiza a tabela
            atualizarPaginacao(lista); // atualiza a paginação
        } catch (error) {
            console.error("Erro ao carregar itens:", error);
        }
    }
};

document.addEventListener('DOMContentLoaded', () => app.inicializar());