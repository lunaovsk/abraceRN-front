// Elementos
const inputPesquisa = document.getElementById('inputPesquisa');
const selectCategoria = document.getElementById('selectCategoria'); 
const selectTamanho = document.getElementById('selectTamanho');
const selectGenero = document.getElementById('selectGenero');

// Função para atualizar tabela com filtros
async function aplicarFiltros() {
    const filtros = {
        itemName: inputPesquisa.value || null,
        category: selectCategoria.value ? selectCategoria.value.toUpperCase() : null,
        itemSize: selectTamanho.value || null,
        gender: selectGenero.value || null,
    };

    console.log('Filtros aplicados:', filtros);

    try {
        const listaFiltrada = await apiService.localizarItens({
            page: 0,
            size: 5,
            ...filtros
        });
        console.log(listaFiltrada);
        preencherTabela(listaFiltrada);
        atualizarPaginacao(listaFiltrada);
    } catch (error) {
        console.error('Erro ao filtrar itens:', error);
    }
}


// Eventos
inputPesquisa.addEventListener('input', aplicarFiltros);
selectCategoria.addEventListener('change',aplicarFiltros);
selectTamanho.addEventListener('change', aplicarFiltros);
selectGenero.addEventListener('change', aplicarFiltros);