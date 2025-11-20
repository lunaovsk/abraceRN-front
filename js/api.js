const BASE_URL = configAPI.baseURL;

const apiService = {
    async cadastrarItem(dadosItem) {
        const result = await Swal.fire({
            title: 'Confirmar cadastro?',
            text: "Deseja realmente cadastrar este item?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sim, cadastrar',
            cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) {
            Swal.fire({
                title: 'Cancelado cadastro!',
                text: 'Não foi cadastrado o item.',
                icon: 'info',
                confirmButtonText: 'Ok'
            });
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dadosItem)
            });

            if (!response.ok) {
                throw new Error('Erro ao cadastrar item');
            }

            modalManager.fecharModal();

            await Swal.fire({
                title: 'Cadastrado!',
                text: 'O item foi cadastrado com sucesso.',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            app.carregarItens(0, 10);
            return response;

        } catch (error) {
            Swal.fire({
                title: 'Erro!',
                text: 'Não foi possível cadastrar o item.',
                icon: 'error',
                confirmButtonText: 'Ok'
            });

            modalManager.fecharModal();
            throw error;
        }
    },

    async buscarTotalItens() {
        try {
            const response = await fetch(`${BASE_URL}/total`, {
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

    async localizarItens(filtros = {}, page = 0, size = 10) {
        try {
            const params = new URLSearchParams();

            if (filtros.categoria) params.append('type', filtros.categoria.toUpperCase());
            if (filtros.tipo) params.append('itemName', filtros.tipo);
            if (filtros.tamanho) params.append('itemSize', filtros.tamanho.toUpperCase());
            if (filtros.pesquisa) params.append('itemName', filtros.pesquisa); 

            params.append('page', page);
            params.append('size', size);

            const urlFinal = `${BASE_URL}/all-items?${params.toString()}`;

            const response = await fetch(urlFinal, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                throw new Error('Erro ao localizar os itens');
            }
            
            return await response.json();

        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async buscarTiposPorCategoria(categoria) {
        try {
            const urlFinal = `${BASE_URL}/types-by-category?category=${categoria}`;
            const response = await fetch(urlFinal, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) throw new Error('Erro ao buscar tipos');
            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async buscarTodosTipos() {
        try {
            const urlFinal = `${BASE_URL}/all-types`;
            const response = await fetch(urlFinal, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) throw new Error('Erro ao buscar todos os tipos');
            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async atualizarItem(id, dadosItem){
        try {
            const response = await fetch(`${BASE_URL}/atualizar/${id}`,
            {
                method: 'PUT',
                headers:{
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify(dadosItem)
            });

            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    async deleteItem(id) {
        try {
            const res = await fetch(`${BASE_URL}/deletar/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                throw new Error('Erro ao deletar item');
            }

            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    },
};