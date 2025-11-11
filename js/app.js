const inputPesquisa = document.getElementById('inputPesquisa'); 
const selectCategoria = document.getElementById('selectCategoria'); 
const selectTipo = document.getElementById('selectTipo'); 
const selectTamanho = document.getElementById('selectTamanho'); 

const app = {
    async inicializar() {

        selectCategoria.addEventListener('change', async () => {
            await this.atualizarDropdownTipos(); 
            gerenciarFiltroTamanho(); 
            await this.carregarItens(0, 10);
        });
        
        inputPesquisa.addEventListener('input', () => this.carregarItens(0, 10));
        
        selectTipo.addEventListener('change', () => {
            gerenciarFiltroTamanho(); 
            this.carregarItens(0, 10);
        });
        
        selectTamanho.addEventListener('change', () => this.carregarItens(0, 10));

        await this.carregarItens(0, 10); 
        gerenciarFiltroTamanho(); 
    },

    async atualizarDropdownTipos() {
        const categoriaSelecionada = selectCategoria.value; 

        selectTipo.innerHTML = '<option value="">Todos os tipos</option>';
        selectTipo.disabled = true;

        if (categoriaSelecionada) {
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

            const data = await apiService.localizarItens(filtros, page, size); 
            
            preencherTabela(data); 
            atualizarPaginacao(data); 
        } catch (error) {
            console.error("Erro ao carregar itens:", error);
        }
    }
};

function gerenciarFiltroTamanho() {
    const categoria = selectCategoria.value;
    const tipo = selectTipo.value;
    const tamanhoContainer = document.getElementById('tamanhoContainer');

    let mostrarTamanho = false; 

    switch (categoria) {
        case 'roupa':
            mostrarTamanho = true;
            break;
        
        case 'acessorio':
            if (tipo === 'Babador' || tipo === 'Fralda De Pano') {
                mostrarTamanho = true;
            }
            break;
            
        case 'higiene':
            if (tipo === 'Fralda Descartável') {
                mostrarTamanho = true;
            }
            break;
            
        case 'alimentacao':
            mostrarTamanho = false;
            break;
    }

    if (mostrarTamanho) {
        tamanhoContainer.style.display = 'block';
    } else {
        tamanhoContainer.style.display = 'none';
        
        if (selectTamanho.value !== '') {
            selectTamanho.value = '';
            selectTamanho.dispatchEvent(new Event('change'));
        }
    }
}

document.addEventListener('DOMContentLoaded', () => app.inicializar());