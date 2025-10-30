const app = {
    async inicializar() {
        await this.carregarTotalItens();
        await this.carregarItens(0, 10); // Carrega a tabela ao entrar
    },

    async carregarTotalItens() {
        const total = await apiService.buscarTotalItens();
        document.getElementById("totalItens").value = total;
    },

    async recarregarTotal() {
        await this.carregarTotalItens();
        await this.carregarItens(0, 10); // Recarrega a tabela depois de adicionar/deletar
    },

    async carregarItens(page = 0, size = 10) {
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