const app = {
    async inicializar() {
        await this.carregarTotalItens();
        await localizarTodosItens(); // aqui carrega a tabela ao entrar
    },

    async carregarTotalItens() {
        const total = await apiService.buscarTotalItens();
        document.getElementById("totalItens").value = total;
    },

    async recarregarTotal() {
        await this.carregarTotalItens();
        await localizarTodosItens(); // recarrega a tabela depois de adicionar
    }
};

document.addEventListener('DOMContentLoaded', () => app.inicializar());
