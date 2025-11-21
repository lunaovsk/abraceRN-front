const app = {
    async inicializar() {
        await this.carregarTotais();
        await this.carregarItens(0, 5); // Carrega a tabela ao entrar
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