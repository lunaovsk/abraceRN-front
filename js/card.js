async function preencherTotal() {
    const total = await apiService.buscarTotalItens();
    document.getElementById("totalItens").value = total;
    return total;
}