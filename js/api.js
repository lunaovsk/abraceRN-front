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
            Swal.fire({
                title: 'Cancelado cadastro!',
                text: 'Não foi cadastrado o item.',
                icon: 'info',
                confirmButtonText: 'Ok'
            });
            return;
        }

        try {
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

            modalManager.fecharModal();

            // 2) Sucesso
            await Swal.fire({
                title: 'Cadastrado!',
                text: 'O item foi cadastrado com sucesso.',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            return response;

        } catch (error) {

            // 3) Erro
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
            return data;

        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async localizarItens(page = 0, size = 5) {
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

            return true; // sucesso
        } catch (error) {
            console.error(error);
            return false; // falha
        }
    },

};