async function preencherTotal() {
    const total = await apiService.buscarTotalItens();
    document.getElementById("totalItens").value = total;
    return total;
}

async function localizarTodosItens() {
    let lista = await apiService.localizarTodosItens();
    const tbody = document.getElementById("tbodyEstoque");

    // Limpa o conteúdo da tabela
    tbody.innerHTML = "";

    document.getElementById("contadorItens").textContent = `${lista.length} item(s) encontrado(s)`;

    // Se não tiver itens, mostra mensagem
    if (!lista || lista.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="mensagem-lista-vazia">Nenhum item encontrado</td>
            </tr>
        `;
        return;
    }

    // Monta as linhas
    lista.forEach(item => {
        const tr = document.createElement("tr");
        // Atribuindo um id único usando o id do item
        tr.id = `row-${item.id}`;
        tr.innerHTML = `
            <td><span>${item.itemName || "N/A"}</span></td>
            <td><span class="tag">${item.type || "N/A"}</span></td>
            <td><span class="tag white">${item.size || "N/A"}</span></td>
            <td>${item.gender? 
                `<span>Gênero:</span><br>
                <span class="tag">${item.gender}</span>`
                : item.expirationAt
                ? `<span>Validade:</span><br>
                <span class="tag white">${formatarData(item.expirationAt)}</span>`
                : `<span class="tag">N/A</span>`}
            </td>
            <td><span class="quantidade-badge">${item.quantity || 0}</span></td>
            <td><span>${item.createdAt ? formatarData(item.createdAt) : "N/A"}</span></td>
            <td class="actions">
                <button class="btn-action">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="btn-action trash" onclick="handleDelete(${item.id})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });


}


function formatarData(dataISO) {
    const data = new Date(dataISO);
    return data.toLocaleDateString("pt-BR", {
        timeZone: "UTC"
    });
}

// Função para deletar
async function handleDelete(id) {
    try {
        const resp = await apiService.deleteItem(id);
        if (resp) {
            showToast('Sucesso ao deletar!','success');

            // Remove a linha da tabela
            const tr = document.getElementById(`row-${id}`);
            if (tr) tr.remove();

            // Atualiza o contador de itens
            const tbody = document.getElementById("tbodyEstoque");
            document.getElementById("contadorItens").textContent = `${tbody.children.length} item(s) encontrado(s)`;

            // Atualiza o total
            await preencherTotal();

        } else {
            showToast('Erro ao deletar!','error');
        }
    } catch (error) {
        console.error(error);
        showToast('Erro ao deletar!','error');
    }
}

