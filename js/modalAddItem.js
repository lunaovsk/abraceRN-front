const modalManager = {
    init() {
        this.modal = document.getElementById('modal');
        this.openModal = document.getElementById('openModal');
        this.closeModal = document.getElementById('closeModal');
        this.form = document.getElementById('itemForm');
        this.setupEventListeners();
        this.resetarModal();
    },

    setupEventListeners() {
        this.openModal.addEventListener('click', () => this.abrirModal());
        this.closeModal.addEventListener('click', () => this.fecharModal());
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        document.getElementById('categoria').addEventListener('change', (e) => 
            this.handleCategoriaChange(e.target.value));
            
        document.getElementById('tipo').addEventListener('change', (e) => 
            this.handleTipoChange(e.target.value));
    },

    abrirModal() {
        this.modal.style.display = 'flex';
    },

    fecharModal() {
        this.modal.style.display = 'none';
        this.resetarModal();
    },

    resetarModal() {
        this.form.reset();
        this.ocultarCamposAdicionais();
        document.getElementById('tipo').innerHTML = '<option value="">Selecione o tipo de item</option>';
        document.getElementById('tipo').disabled = true;
    },

    ocultarCamposAdicionais() {
        document.getElementById('tamanhoContainer').style.display = 'none';
        document.getElementById('generoContainer').style.display = 'none';
        document.getElementById('validadeContainer').style.display = 'none';
    },

    handleCategoriaChange(categoria) {
        this.ocultarCamposAdicionais();
        this.carregarTipos(categoria);
        this.mostrarCamposPorCategoria(categoria);
    },

    carregarTipos(categoria) {
        const tipoSelect = document.getElementById('tipo');
        tipoSelect.innerHTML = '<option value="">Selecione o tipo de item</option>';

        const tipos = {
            roupas: ['Body', 'Macacão', 'Manta', 'Calça', 'Conjunto', 'Short', 'Vestido', 'Touca', 'Meia', 'Sapato'],
            acessorios: ['Babador', 'Fralda De Pano', 'Chupeta', 'Mordedor', 'Brinquedo'],
            higiene: ['Fralda Descartável', 'Lenço Umedecido', 'Sabonete', 'Shampoo', 'Óleo', 'Pomada', 'Álcool Gel'],
            alimentacao: ['Mamadeira', 'Copo', 'Pratinho', 'Colher', 'Babador']
        };

        if (categoria && tipos[categoria]) {
            tipos[categoria].forEach(tipo => {
                const option = document.createElement('option');
                option.value = tipo.toLowerCase();
                option.textContent = tipo;
                tipoSelect.appendChild(option);
            });
            tipoSelect.disabled = false;
        } else {
            tipoSelect.disabled = true;
        }
    },

    mostrarCamposPorCategoria(categoria) {
        if (categoria === 'roupas') {
            document.getElementById('generoContainer').style.display = 'block';
        } else if (categoria === 'higiene') {
            document.getElementById('validadeContainer').style.display = 'block';
        }
    },

    handleTipoChange(tipo) {
        const categoria = document.getElementById('categoria').value;
        const mostrarTamanho = this.deveMostrarTamanho(categoria, tipo);
        document.getElementById('tamanhoContainer').style.display = mostrarTamanho ? 'block' : 'none';
    },

    deveMostrarTamanho(categoria, tipo) {
        if (categoria === 'roupas') return true;
        if (categoria === 'acessorios') return ['babador', 'fralda-de-pano'].includes(tipo);
        if (categoria === 'higiene') return tipo === 'fralda descartável';
        return false;
    },

    async handleSubmit(e) {
        e.preventDefault();

        const erro = this.validarFormulario();
        if (erro) {
            alert(erro);
            return;
        }

        try {
            const dados = this.prepararDados();
            await apiService.cadastrarItem(dados);
            
            alert('Item cadastrado com sucesso!');
            this.fecharModal();
            await app.recarregarTotal();
            
        } catch (error) {
            alert('Erro ao cadastrar item');
        }
    },

    validarFormulario() {
        const categoria = document.getElementById('categoria').value;
        const tipo = document.getElementById('tipo').value;
        const quantidade = document.getElementById('quantidade').value;

        if (!categoria) return 'Selecione uma categoria';
        if (!tipo) return 'Selecione um tipo de item';
        if (!quantidade || quantidade <= 0) return 'Informe uma quantidade válida';

        if ((categoria === 'roupas' || categoria === 'acessorios') && 
            !document.getElementById('tamanho').value && 
            document.getElementById('tamanhoContainer').style.display === 'block') {
            return 'Selecione um tamanho';
        }

        if (categoria === 'roupas' && !document.getElementById('genero').value) {
            return 'Selecione um gênero';
        }

        if ((categoria === 'higiene' || categoria === 'alimentacao') && 
            !document.getElementById('validade').value) {
            return 'Informe a data de validade';
        }

        return null;
    },

    prepararDados() {
        const categoria = document.getElementById('categoria').value;
        
        const mapeamentoCategorias = {
            'roupas': 'ROUPA',
            'acessorios': 'ACESSORIO', 
            'higiene': 'HIGIENE',
            'alimentacao': 'ALIMENTACAO'
        };

        const mapeamentoGeneros = {
            'masculino': 'M',
            'feminino': 'F', 
            'unissex': 'UNISSEX'
        };

        return {
            itemName: document.getElementById('tipo').options[document.getElementById('tipo').selectedIndex].text,
            type: mapeamentoCategorias[categoria],
            size: document.getElementById('tamanho').value || null,
            gender: document.getElementById('genero').value ? 
            mapeamentoGeneros[document.getElementById('genero').value] : null,
            quantity: parseInt(document.getElementById('quantidade').value),
            expirationAt: document.getElementById('validade').value || null
        };
    }
};

document.addEventListener('DOMContentLoaded', () => {
    modalManager.init();
});