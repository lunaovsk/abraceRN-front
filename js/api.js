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
            Swal.fire('Cancelado', 'O item não foi cadastrado.', 'info');
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

async localizarItens(filtros = {}, page = 0, size = 10) {
    try {
        const params = new URLSearchParams();

        // 1. Categoria (PRECISA de toUpperCase para o Enum)
        if (filtros.categoria) { 
            params.append('type', filtros.categoria.toUpperCase());
        }

        // 2. Tipo (NÃO PODE ter toUpperCase)
        if (filtros.tipo) { 
            // ANTES (ERRADO): params.append('itemType', filtros.tipo.toUpperCase());
            params.append('itemType', filtros.tipo); // <-- CORRIGIDO
        }

        // 3. Tamanho (Não precisa de toUpperCase, já que o service trata)
        if (filtros.tamanho) {
            params.append('itemSize', filtros.tamanho);
        }

        // 4. Pesquisa (Não precisa de toUpperCase, o 'LIKE' trata)
        if (filtros.pesquisa) {
            params.append('itemName', filtros.pesquisa);
        }

        params.append('page', page);
        params.append('size', size); 

        const urlFinal = `${BASE_URL}/all-items?${params.toString()}`;
        console.log("Enviando para URL:", urlFinal); 

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

            if (!response.ok) {
                throw new Error('Erro ao buscar tipos por categoria');
            }
            return await response.json(); 

        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async atualizarItem(id,dadosItem){
        try {
            const response = await fetch(`${configAPI.baseURL}/atualizar/${id}`,
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
            const res = await fetch(`${configAPI.baseURL}/deletar/${id}`, {
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