const apiService = {

    async cadastrarItem(dadosItem) {

        // 1) Pergunta antes de cadastrar
        const result = await Swal.fire({
            title: 'Confirmar cadastro?',
            text: "Deseja realmente cadastrar este item?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sim, cadastrar',
            cancelButtonText: 'Cancelar'
        });

        // Se o usuário cancelar, sai da função
        if (!result.isConfirmed) {
            showToast('info', 'Cadastro cancelado.');
            return;
        }

        try {
            const response = await fetch(`${configAPI.baseURL}`, {
                method: 'POST',
                headers: auth.headers(),
                body: JSON.stringify(dadosItem)
            });

            if (auth.tratarAcessoNegado(response)) return;

            if (!response.ok) {
                throw new Error('Erro ao cadastrar item');
            }

            modalManager.fecharModal();

            // 2) Sucesso
            showToast('success', 'Item cadastrado com sucesso!');

            return response;

        } catch (error) {

            // 3) Erro
            showToast('error', 'Não foi possível cadastrar o item.');

            modalManager.fecharModal();
            throw error;
        }
    },


    async buscarTotalItens() {
        try {
            const response = await fetch(`${configAPI.baseURL}/total`, {
                method: 'GET',
                headers: auth.headers()
            });

            if (auth.tratarAcessoNegado(response)) return;

            if (!response.ok) {
                throw new Error('Erro ao buscar total de itens');
            }

            const data = await response.json();
            return data;

        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async localizarItens({
        page = 0,
        size = 5,
        category = null,
        itemName = null,
        itemSize = null,
        gender = null,

    } = {}) {

        try {

            // Monta os parâmetros da URL
            const params = new URLSearchParams();

            params.append("page", page);
            params.append("size", size);

            if (category) params.append("category", category);
            if (itemName) params.append("itemName", itemName);
            if (itemSize) params.append("itemSize", itemSize);
            if (gender) params.append("gender", gender);

            const response = await fetch(`${configAPI.baseURL}/all-items?${params.toString()}`, {
                method: 'GET',
                headers: auth.headers()
            });

            if (auth.tratarAcessoNegado(response)) return;

            if (!response.ok) {
                throw new Error('Erro ao localizar os itens');
            }

            const data = await response.json();
            return data;

        } catch (error) {
            console.error(error);
            throw error;
        }
    },


    async atualizarItem(id, dadosItem) {
        try {
            const response = await fetch(`${configAPI.baseURL}/admin/atualizar/${id}`, {
                method: 'PUT',
                headers: auth.headers(),
                body: JSON.stringify(dadosItem)
            });

            if (auth.tratarAcessoNegado(response)) return;

            return response;
        } catch (error) {

            console.log(error);
            throw error;

        }
    },

    async deleteItem(id) {
        try {
            const res = await fetch(`${configAPI.baseURL}/admin/deletar/${id}`, {
                method: 'DELETE',
                headers: auth.headers()
            });

            if (auth.tratarAcessoNegado(res)) return; // acesso negado já tratado

            if (!res.ok) {
                throw new Error('Erro ao deletar item');
            }

            return true; // sucesso
        } catch (error) {
            console.error(error);
            return false; // falha
        }
    },


};