async function preencherTotal() {
    const total = await apiService.buscarTotalItens();
    const elementTotal = document.getElementById("totalItens");
    if (elementTotal) {
        elementTotal.value = total || 0;
    }
    return total;
}

async function carregarPagina(page = 0, size = 10) {
    const lista = await apiService.localizarItens({}, page, size);
    preencherTabela(lista); 
    atualizarPaginacao(lista); 
}

function preencherTabela(lista) {
    const tbody = document.getElementById("tbodyEstoque");
    tbody.innerHTML = "";

    if (!lista || !lista.content || lista.content.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="mensagem-lista-vazia">Nenhum item encontrado...</td>
            </tr>`;
        document.getElementById("contadorItens").textContent = "0 item(s) encontrado(s)";
        return;
    }

    atualizarContador(lista);

    lista.content.forEach(item => {
        const tr = document.createElement("tr");
        tr.id = `row-${item.id}`;

        const categoriaExibir = item.type || "N/A"; 
        
        let infoExtra = `<span class="tag">N/A</span>`;
        
        if (item.gender) {
            infoExtra = `<span>Gênero:</span><br><span class="tag">${item.gender}</span>`;
        } else if (item.expirationAt) {
             infoExtra = `<span>Validade:</span><br><span class="tag white">${formatarData(item.expirationAt)}</span>`;
        }

        tr.innerHTML = `
            <td><span>${item.itemName || "N/A"}</span></td>
            <td><span class="tag">${categoriaExibir}</span></td>
            <td><span class="tag white">${item.size || "N/A"}</span></td>
            <td>${infoExtra}</td>
            <td><span class="quantidade-badge">${item.quantity || 0}</span></td>
            <td><span>${formatarData(item.createdAt)}</span></td>
            
            <td class="actions">
                <button class="btn-action" onclick='handleUpdate(${item.id}, ${JSON.stringify(item).replace(/'/g, "&apos;")})'>
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="btn-action trash" onclick="handleDelete(${item.id})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>`;

        tbody.appendChild(tr);
    });
}

function atualizarContador(lista) {
    const paginaAtual = lista.number;
    const tamanhoPagina = lista.size;
    const total = lista.totalElements;
    const exibidos = lista.content.length;

    const inicio = paginaAtual * tamanhoPagina + 1;
    const fim = inicio + exibidos - 1;

    const contador = document.getElementById("contadorItens");
    if(contador) {
        contador.textContent = `${inicio} - ${fim} de ${total} item(s)`;
    }
}

function formatarData(dataInput) {
    if (!dataInput) return "N/A";

    let data;

    
    if (Array.isArray(dataInput)) {
        data = new Date(
            dataInput[0], 
            dataInput[1] - 1, 
            dataInput[2], 
            dataInput[3] || 0, 
            dataInput[4] || 0, 
            dataInput[5] || 0
        );
    } else {
        
        data = new Date(dataInput);
    }
    
    if (isNaN(data.getTime())) return "Data Inválida";

    return data.toLocaleDateString("pt-BR");
}

function atualizarPaginacao(data) {
    const paginacao = document.getElementById("paginacao");
    if (!paginacao) return;

    paginacao.innerHTML = `
        <button onclick="app.carregarItens(${data.number - 1})" ${data.first ? "disabled" : ""}>Anterior</button>
        <span>Página ${data.number + 1} de ${data.totalPages}</span>
        <button onclick="app.carregarItens(${data.number + 1})" ${data.last ? "disabled" : ""}>Próxima</button>
    `;
}

function handleUpdate(id, dataItem) {
    modalManager.prepararDadosUpdate(dataItem);
}

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

        if (!result.isConfirmed) return;

        const resp = await apiService.deleteItem(id);

        if (!resp) {
            Swal.fire('Erro!', 'Não foi possível excluir o item.', 'error');
            return;
        }

        await Swal.fire('Excluído!', 'O item foi excluído com sucesso.', 'success');
        
        app.carregarItens(0, 10);
        app.carregarTotalItens();

    } catch (error) {
        console.error(error);
        Swal.fire('Erro!', 'Erro ao excluir item.', 'error');
    }
}