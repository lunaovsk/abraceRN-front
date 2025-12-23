// Voltar para página inicial
document.querySelector(".back-btn").addEventListener("click", function () {
    window.location.href = "../index.html";
});

// Seletores principais
const openButtons = document.querySelectorAll(".btn-retirar");
const closeBtn = document.getElementById("closeModalBtn");
const modal = document.getElementById("modal");
const overlay = document.getElementById("modalOverlay");
const title = document.querySelector(".modal-title");
const subtitle = document.querySelector(".modal-subtitle");
const itemsList = document.querySelector(".items-list ul");
const inputs = document.querySelectorAll(".tabela-kits input");

// Dados dos kits 
const kits = {
    enxoval: {
        titulo: "Confirmar Retirada de Kit de Enxoval",
        subtitulo: "Tem certeza que deseja retirar 1 kit completo de enxoval do estoque?",
        itens: [
            `Body: ${document.getElementById("body").value} Unidade(s)`,
            `Macacão: ${document.getElementById("macacao").value} Unidade(s)`,
            `Manta: ${document.getElementById("manta").value} Unidade(s)`,
            `Meia: ${document.getElementById("meia").value} Unidade(s)`,
            `Touca: ${document.getElementById("touca").value} Unidade(s)`,
            `Babador: ${document.getElementById("babador").value} Unidade(s)`
        ]
    },
    higiene: {
        titulo: "Confirmar Retirada de Kit de Higiene",
        subtitulo: "Tem certeza que deseja retirar 1 kit completo de higiene do estoque?",
        itens: [
            `Pacote de fralda: ${document.getElementById("Pacote-de-fralda").value} Unidade(s)`,
            `Shampoo: ${document.getElementById("shampoo").value} Unidade(s)`,
            `Pomada: ${document.getElementById("pomada").value} Unidade(s)`,
            `Perfume: ${document.getElementById("perfume").value} Unidade(s)`,
            `Lenço Umedecido: ${document.getElementById("lenco-Umedecido").value} Unidade(s)`,
            `Sabonete: ${document.getElementById("sabonete").value} Unidade(s)`
        ]
    }
};

//FUNCTIONS

// Função para abrir modal com base no tipo
function abrirModal(tipo) {

    // itens dinamicamente quando abrir o modal
    if (tipo === "enxoval") {
        kits.enxoval.itens = [
            `Body: ${document.getElementById("body").value} Unidade(s)`,
            `Macacão: ${document.getElementById("macacao").value} Unidade(s)`,
            `Manta: ${document.getElementById("manta").value} Unidade(s)`,
            `Meia: ${document.getElementById("meia").value} Unidade(s)`,
            `Touca: ${document.getElementById("touca").value} Unidade(s)`,
            `Babador: ${document.getElementById("babador").value} Unidade(s)`
        ];
    }else{
         kits.higiene.itens = [
            `Pacote de fralda: ${document.getElementById("Pacote-de-fralda").value} Unidade(s)`,
            `Shampoo: ${document.getElementById("shampoo").value} Unidade(s)`,
            `Pomada: ${document.getElementById("pomada").value} Unidade(s)`,
            `Perfume: ${document.getElementById("perfume").value} Unidade(s)`,
            `Lenço Umedecido: ${document.getElementById("lenco-Umedecido").value} Unidade(s)`,
            `Sabonete: ${document.getElementById("sabonete").value} Unidade(s)`
        ];
    }

    const dados = kits[tipo];

    title.textContent = dados.titulo;
    subtitle.textContent = dados.subtitulo;

    // Atualiza lista de itens
    itemsList.innerHTML = itemsList.innerHTML = dados.itens
        .map(item => {
            console.log(item);
            return `<li>${item}</li>`;
        })
        .join("");


    // Exibir modal
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
}

// Função para o calculo de kits possiveis
function recalcularKits() {
    const linhas = document.querySelectorAll(".tabela-kits tbody tr");

    linhas.forEach((linha) => {
        const estoque = Number(linha.querySelector(".badge").textContent);
        const inputNecessario = Number(linha.querySelector("input").value);
        const campoKits = linha.children[3];

        if (inputNecessario > 0) {
            const kitsPossiveis = Math.floor(estoque / inputNecessario);
            campoKits.textContent = kitsPossiveis;
        } else {
            campoKits.textContent = "-";
        }
    });
}

//EVENTS

// Ação dos botões
openButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const tipoKit = btn.dataset.kit; // pega "enxoval" ou "higiene"
        abrirModal(tipoKit);
    });
});

// Fechar modal no botão "Cancelar"
closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
});

// Fechar clicando fora (overlay)
overlay.addEventListener("click", () => {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
});

// Ação aos inputs
inputs.forEach(input => {
    input.addEventListener("input", recalcularKits);
});
