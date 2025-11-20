const modalManager = {
    isUpdate: false,
    currentItemId: null,

    init() {
        this.modal = document.getElementById('modal');
        this.openModal = document.getElementById('openModal');
        this.closeModal = document.getElementById('closeModal');
        this.form = document.getElementById('itemForm');
        this.submitButton = this.form.querySelector(".adicionar");
        this.setupEventListeners();
        this.resetarModal();
    },

    setupEventListeners() {
        this.openModal.addEventListener('click', () => {
            this.isUpdate = false;
            this.currentItemId = null;
            this.submitButton.innerHTML = "Adicionar Item";
            this.abrirModal();
        });

        this.closeModal.addEventListener('click', () => {
            Swal.fire({
                title: 'Cancelado!',
                text: 'Operação cancelada.',
                icon: 'info',
                confirmButtonText: 'Ok'
            });
            this.fecharModal()
        });

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
        document.getElementById('categoria').classList.remove('readonly-select');
        document.getElementById('tipo').innerHTML = '<option value="">Selecione o tipo de item</option>';
        document.getElementById('tipo').disabled = true;
        const modalTitle = this.modal.querySelector("h2");
        const modalDesc = this.modal.querySelector("p");
        modalTitle.innerHTML = "Adicionar Novo Item";
        modalDesc.innerHTML = "Preencha as informações para adicionar um novo item ao estoque.";
        this.isUpdate = false;
        this.currentItemId = null;
        this.submitButton.innerHTML = "Adicionar Item";
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
            roupa: ['Body', 'Macacão', 'Manta', 'Calça', 'Conjunto', 'Short', 'Vestido', 'Touca', 'Meia', 'Sapato'],
            acessorio: ['Babador', 'Fralda De Pano', 'Chupeta', 'Mordedor', 'Brinquedo'],
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
        if (categoria === 'roupa') {
            document.getElementById('generoContainer').style.display = 'block';
        }
        if (categoria === 'higiene' || categoria === 'alimentacao') {
            document.getElementById('validadeContainer').style.display = 'block';
        }
    },

    handleTipoChange(tipo) {
        const categoria = document.getElementById('categoria').value;
        const mostrarTamanho = this.deveMostrarTamanho(categoria, tipo);
        document.getElementById('tamanhoContainer').style.display = mostrarTamanho ? 'block' : 'none';
    },

    deveMostrarTamanho(categoria, tipo) {
        if (categoria === 'roupa') return true;
        if (categoria === 'acessorio') return ['babador', 'fralda de pano'].includes(tipo);
        if (categoria === 'higiene') return tipo === 'fralda descartável';
        return false;
    },

    async handleSubmit(e) {
        e.preventDefault();

        const erro = this.validarFormulario();
        if (erro) {
            showToast(erro, "error");
            return;
        }

        try {
            const dados = this.prepararDados();

            if (this.isUpdate && this.currentItemId) {
                await apiService.atualizarItem(this.currentItemId, dados);
                await Swal.fire({
                    title: 'Atualizado!',
                    text: 'O item foi atualizado com sucesso.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            } else {
                await apiService.cadastrarItem(dados);
            }

            this.fecharModal();
            await app.carregarItens(0, 10);

        } catch (error) {
            console.log(error);
        }
    },

    validarFormulario() {
        const categoria = document.getElementById('categoria').value;
        const tipo = document.getElementById('tipo').value;
        const quantidade = document.getElementById('quantidade').value;

        if (!categoria) return 'Selecione uma categoria';
        if (!tipo) return 'Selecione um tipo de item';
        if (!quantidade || quantidade <= 0) return 'Informe uma quantidade válida';

        if ((categoria === 'roupa' || categoria === 'acessorio') &&
            !document.getElementById('tamanho').value &&
            document.getElementById('tamanhoContainer').style.display === 'block') {
            return 'Selecione um tamanho';
        }

        if (categoria === 'roupa' && !document.getElementById('genero').value) {
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
            'roupa': 'ROUPA',
            'acessorio': 'ACESSORIO',
            'higiene': 'HIGIENE',
            'alimentacao': 'ALIMENTACAO'
        };
        
        const mapeamentoGeneros = {
            'M': 'M',
            'F': 'F',
            'UNISSEX': 'UNISSEX'
        };

        const sizeValue = document.getElementById('tamanho').value;
        const genderValue = document.getElementById('genero').value;
        
        let validadeValue = document.getElementById('validade').value;
        if (validadeValue === "") {
            validadeValue = null;
        }

        let generoFinal = null;
        if (genderValue && mapeamentoGeneros[genderValue]) {
            generoFinal = mapeamentoGeneros[genderValue];
        }

        return {
            itemName: document.getElementById('tipo').options[document.getElementById('tipo').selectedIndex].text,
            category: mapeamentoCategorias[categoria],
            type: null,
            size: sizeValue || null,
            gender: generoFinal,
            quantity: parseInt(document.getElementById('quantidade').value),
            expirationAt: validadeValue
        };
    },

    prepararDadosUpdate(dadosItem) {
        this.isUpdate = true;
        this.currentItemId = dadosItem.id;

        const categoria = document.getElementById('categoria');
        const tipo = document.getElementById('tipo');
        const quantidade = document.getElementById('quantidade');
        const tamanho = document.getElementById('tamanho');
        const genero = document.getElementById('genero');
        const validade = document.getElementById('validade');

        const modal = document.querySelector(".modal-content");
        const buttonUpdate = this.submitButton;

        modal.querySelector("h2").innerHTML = "Atualizar o Item";
        modal.querySelector("p").innerHTML = "Preencha as informações para atualizar o item ao estoque.";
        buttonUpdate.innerHTML = "Atualizar Item";

        this.abrirModal();

        categoria.value = dadosItem.type.toLowerCase();
        categoria.classList.add('readonly-select');
        this.handleCategoriaChange(categoria.value);

        setTimeout(() => {
            tipo.value = dadosItem.itemName.toLowerCase();
        }, 50);

        quantidade.value = dadosItem.quantity || 1;

        if (dadosItem.size) {
            tamanho.value = dadosItem.size.toLowerCase();
            document.getElementById('tamanhoContainer').style.display = 'block';
        }

        if (dadosItem.gender) {
            genero.value = dadosItem.gender;
            document.getElementById('generoContainer').style.display = 'block';
        }

        if (dadosItem.expirationAt) {
            validade.value = dadosItem.expirationAt;
            document.getElementById('validadeContainer').style.display = 'block';
        }

    }
};

function showToast(message, type = "info") {
    let backgroundColor;

    if (type === "error") {
        backgroundColor = "linear-gradient(to right, #d32f2f, #c62828)";
    } else if (type === "success") {
        backgroundColor = "linear-gradient(to right, #388e3c, #2e7d32)";
    } else {
        backgroundColor = "linear-gradient(to right, #1976d2, #1565c0)";
    }

    Toastify({
        text: message,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: backgroundColor,
        },
    }).showToast();
}

document.addEventListener('DOMContentLoaded', () => {
    modalManager.init();
});