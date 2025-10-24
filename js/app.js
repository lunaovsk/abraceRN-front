const app = {
    async inicializar() {
        await this.carregarTotalItens();
    },

    async carregarTotalItens() {

        const total = await apiService.buscarTotalItens();
        elementosDOM.totalItens.value = total;
    },

    async recarregarTotal() {
        await this.carregarTotalItens();
    }
};

document.addEventListener('DOMContentLoaded', () => app.inicializar());