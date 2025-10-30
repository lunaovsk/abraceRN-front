const apiService = {

    async cadastrarItem(dadosItem) {
        const response = await fetch(`${configAPI.baseURL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosItem)
        });

        if (!response.ok) {
            throw new Error('Erro ao cadastrar item');
        }

        return response;
    },

    async buscarTotalItens() {
        try {
            const response = await fetch(`${configAPI.baseURL}/total`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao buscar total de itens');
            }

            const data = await response.json();
            return data.total;

        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async localizarItens(page = 0, size = 10) {
    try {
        const response = await fetch(`${configAPI.baseURL}/all-items?page=${page}&size=${size}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

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

    async deleteItem(id) {
        try {
            const res = await fetch(`${configAPI.baseURL}/deletar/${id}`, {
                method: 'DELETE',
            });

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