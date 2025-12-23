async function preencherTotal() {
    const total = await apiService.buscarTotalItens();
    document.getElementById("totalItens").value = total.total || 0;
    return total;
}

// Buscar lista paginada
async function carregarPagina(page = 0, size = 5) {
    const data = await apiService.localizarItens({ page, size });

    preencherTabela(data); // Atualiza tabela
    atualizarPaginacao(data); // Atualiza botões
}

// Renderizar tabela
function preencherTabela(lista) {
    const tbody = document.getElementById("tbodyEstoque");

    // Limpa o conteúdo da tabela
    tbody.innerHTML = "";

    atualizarContador(lista);


    if (lista.content.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="mensagem-lista-vazia">Nenhum item encontrado...</td>
            </tr>`;
        return;
    }

    lista.content.forEach(item => {
        const tr = document.createElement("tr");

        // Atribuindo um id único usando o id do item
        tr.id = `row-${item.id}`;

        tr.innerHTML = `
            <td><span>${item.itemName || "N/A"}</span></td>
            <td><span class="tag">${item.type || "N/A"}</span></td>
            <td><span class="tag white">${item.size || "N/A"}</span></td>
            <td>${
                item.gender ?
                `<span>Gênero:</span><br><span class="tag">${item.gender}</span>` :
                item.expirationAt ?
                `<span>Validade:</span><br><span class="tag white">${formatarData(item.expirationAt)}</span>` :
                `<span class="tag">N/A</span>`
            }</td>
            <td><span class="quantidade-badge">${item.quantity || 0}</span></td>
            <td><span>${item.createdAt ? formatarData(item.createdAt) : "N/A"}</span></td>
            <td class="actions">
                <button class="btn-action" onclick='handleUpdate(${item.id},${JSON.stringify(item)})'>
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="btn-action trash" onclick="handleDelete(${item.id})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>`;

        tbody.appendChild(tr);
    });
}

// Atualiza Contador da tabela
function atualizarContador(lista) {
    const paginaAtual = lista.number; // começa em 0
    const tamanhoPagina = lista.size; // itens por página
    const total = lista.totalElements;
    const exibidos = lista.content.length;

    const inicio = paginaAtual * tamanhoPagina + 1;
    const fim = inicio + exibidos - 1;

    document.getElementById("contadorItens").textContent = `${inicio} - ${fim} de ${total} item(s)`;
}

// Formatador de data
function formatarData(dataISO) {
    return new Date(dataISO).toLocaleDateString("pt-BR", {
        timeZone: "UTC"
    });
}

// Paginação
function atualizarPaginacao(data) {
    const paginacao = document.getElementById("paginacao");
    paginacao.innerHTML = `
        <button onclick="carregarPagina(${data.number - 1})" ${data.first ? "disabled" : ""}>Anterior</button>
        <span>Página ${data.number + 1} de ${data.totalPages}</span>
        <button onclick="carregarPagina(${data.number + 1})" ${data.last ? "disabled" : ""}>Próxima</button>
    `;
}

// Atualizar item
async function handleUpdate(id, dataItem) {

    console.log(`${id}e item${JSON.stringify(dataItem)}`)

    modalManager.prepararDadosUpdate(dataItem);


    try {

        const response = await apiService.atualizarItem(id, dataItem);

        if (!response) { // 3) Erro
            Swal.fire({
                title: 'Erro!',
                text: 'Não foi possível atualizar o item.',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
            return;
        }

        console.log(response);


    } catch (erro) {
        console.error(erro);

        Swal.fire({
            title: 'Erro!',
            text: 'Não foi possível atualizar o item.',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
    }

}

// Abrir Modal Exibição
document.getElementById("calcular-kits").addEventListener("click", function() {
    window.location.href = "pages/calculoestoque.html";
});

// Deletar item
async function handleDelete(id) {
    try {
        const result = await Swal.fire({
            title: 'Tem certeza?',
            text: "Tem certeza que gostaria de excluir esse item? Essa ação não pode ser desfeita!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sim, deletar',
            cancelButtonText: 'Cancelar'
        });

        // Se o usuário cancelar, sai da função
        if (!result.isConfirmed) {
            Swal.fire({
                title: 'Cancelado exclução!',
                text: 'Não foi excluido o item.',
                icon: 'info',
                confirmButtonText: 'Ok'
            });

            return;
        }

        // Agora sim, deletar
        const resp = await apiService.deleteItem(id);

        if (!resp) {
            // 3) Erro
            Swal.fire({
                title: 'Erro!',
                text: 'Não foi possível excluir o item.',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
            return;
        }

        // 2) Sucesso
        await Swal.fire({
            title: 'Excluido!',
            text: 'O item foi excluido com sucesso.',
            icon: 'success',
            confirmButtonText: 'OK'
        });

        // Recarregar mantendo paginação
        const paginaAtual = document.querySelector("#paginacao span")
            .textContent.match(/\d+/)[0] - 1;

        carregarPagina(paginaAtual);
        preencherTotal();

    } catch (error) {
        console.error(error);
        // 3) Erro
        Swal.fire({
            title: 'Erro!',
            text: 'Não foi possível excluir o item.',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
    }
}
