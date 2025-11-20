const inputPesquisa = document.getElementById('inputPesquisa');
const selectCategoria = document.getElementById('selectCategoria');
const selectTipo = document.getElementById('selectTipo');
const selectTamanho = document.getElementById('selectTamanho');

const app = {
    async inicializar() {
        await this.carregarDropdownTiposGeral();

        selectCategoria.addEventListener('change', async () => {
            await this.atualizarDropdownTipos();
            gerenciarFiltroTamanho();
            await this.carregarItens(0, 10);
        });

        selectTipo.addEventListener('change', () => {
            gerenciarFiltroTamanho();
            this.carregarItens(0, 10);
        });

        selectTamanho.addEventListener('change', () => this.carregarItens(0, 10));
        inputPesquisa.addEventListener('input', () => this.carregarItens(0, 10));

        gerenciarFiltroTamanho();
        await this.carregarTotalItens();
        await this.carregarItens(0, 10);
    },

    async carregarTotalItens() {
        const total = await apiService.buscarTotalItens();
        document.getElementById("totalItens").value = total || 0;
    },

    async recarregarTotal() {
        await this.carregarTotalItens();
        await this.carregarItens(0, 10);
        await this.carregarDropdownTiposGeral(); 
    },

    async carregarDropdownTiposGeral() {
        selectTipo.innerHTML = '<option value="">Todos os tipos</option>';
        
        try {
            const tipos = await apiService.buscarTodosTipos();
            
            tipos.forEach(tipo => {
                const option = new Option(tipo, tipo);
                selectTipo.add(option);
            });
            
            selectTipo.disabled = false;

        } catch (error) {
            console.error("Erro ao carregar tipos:", error);
        }
    },

    async atualizarDropdownTipos() {
        const categoriaSelecionada = selectCategoria.value;

        if (!categoriaSelecionada) {
            await this.carregarDropdownTiposGeral();
            return;
        }

        selectTipo.innerHTML = '<option value="">Todos os tipos</option>';
        selectTipo.disabled = true;

        try {
            const tipos = await apiService.buscarTiposPorCategoria(categoriaSelecionada.toUpperCase());
            
            tipos.forEach(tipo => {
                const option = new Option(tipo, tipo);
                selectTipo.add(option);
            });
            
            selectTipo.disabled = false;

        } catch (error) {
            console.error("Erro ao atualizar dropdown de tipos:", error);
        }
    },

    async carregarItens(page = 0, size = 10) {
        try {
            const filtros = {
                pesquisa: inputPesquisa.value,
                categoria: selectCategoria.value,
                tipo: selectTipo.value,
                tamanho: selectTamanho.value
            };

            const lista = await apiService.localizarItens(filtros, page, size);
            
            preencherTabela(lista);
            atualizarPaginacao(lista);
        } catch (error) {
            console.error("Erro ao carregar itens:", error);
        }
    }
};

function gerenciarFiltroTamanho() {
    const categoria = selectCategoria.value.toLowerCase();
    const tipo = selectTipo.value.toLowerCase();
    const containerFiltroTamanho = selectTamanho.parentElement;

    let mostrarTamanho = false;

    if (categoria === 'roupa') {
        mostrarTamanho = true;
    } 
    else if (categoria === 'acessorio') {
        if (tipo.includes('babador') || tipo.includes('fralda de pano')) {
            mostrarTamanho = true;
        }
    } 
    else if (categoria === 'higiene') {
        if (tipo.includes('fralda descartável') || tipo.includes('fralda descartavel')) {
            mostrarTamanho = true;
        }
    }

    if (mostrarTamanho) {
        containerFiltroTamanho.style.display = 'block';
    } else {
        containerFiltroTamanho.style.display = 'none';
        
        if (selectTamanho.value !== '') {
            selectTamanho.value = '';
            selectTamanho.dispatchEvent(new Event('change'));
        }
    }
}

document.addEventListener('DOMContentLoaded', () => app.inicializar());