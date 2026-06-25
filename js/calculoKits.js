/**
 * Monta o corpo de um kit lendo cada linha da tabela: o nome do item e a
 * quantidade necessária (a "receita", definida na tela) e o gênero/tamanho
 * escolhidos pelo usuário nos selects da linha. Nada é chumbado no código —
 * gênero/tamanho são as variações reais vindas do estoque.
 *
 * @param {"enxoval"|"higiene"} tipo
 * @returns {{type: string, items: object[]}}
 */
function montarBodyKit(tipo) {
    const tabela = document.querySelector(`.tabela-kits[data-kit="${tipo}"]`);

    const items = [...tabela.querySelectorAll("tbody tr")].map(linha => {
        const input = linha.querySelector("input");
        const selGenero = linha.querySelector(".select-genero");
        const selTamanho = linha.querySelector(".select-tamanho");

        return {
            itemName: ITENS_KIT[input.id],
            // value vazio = variação inexistente para aquele eixo → null
            gender: selGenero && selGenero.value ? selGenero.value : null,
            size: selTamanho && selTamanho.value ? selTamanho.value : null,
            quantity: Number(input.value)
        };
    });

    return { type: tipo === "enxoval" ? "ENXOVAL" : "HIGIENE", items };
}

function montarBodyEnxoval() {
    return montarBodyKit("enxoval");
}

function montarBodyHigiene() {
    return montarBodyKit("higiene");
}

/**
 * Formata o mapa de itens limitantes vindo da API ({ "Meia": 3 }) em texto.
 * @param {object} limitingItems mapa itemName -> quantidade disponível
 * @returns {string}
 */
function formatarLimitantes(limitingItems) {
    if (!limitingItems) return "—";
    const nomes = Object.keys(limitingItems);
    return nomes.length ? nomes.join(", ") : "Nenhum";
}

async function preencherTotalEnxoval() {
    const bodyEnxoval = montarBodyEnxoval();

    const totalKitEnxoval = await buscarTotalItensKit(bodyEnxoval);
    if (!totalKitEnxoval) return; // requisição bloqueada (sem sessão) ou sem retorno

    document.getElementById("card_enxoval").innerHTML = totalKitEnxoval.kitsPossible || 0;
    document.getElementById("limitantes_enxoval").textContent = formatarLimitantes(totalKitEnxoval.limitingItems);

    return totalKitEnxoval.kitsPossible;
}

async function preencherTotalHigiene() {
    const bodyHigiene = montarBodyHigiene();

    const totalKitHigiene = await buscarTotalItensKit(bodyHigiene);
    if (!totalKitHigiene) return; // requisição bloqueada (sem sessão) ou sem retorno

    document.getElementById("card_higiene").innerHTML = totalKitHigiene.kitsPossible || 0;
    document.getElementById("limitantes_higiene").textContent = formatarLimitantes(totalKitHigiene.limitingItems);

    return totalKitHigiene.kitsPossible;
}

// Mapeia o id do input de cada linha da tabela para o nome real do item no
// estoque. A "receita" do kit (quais itens) é definida na tela; o estoque de
// cada item vem do back-end.
const ITENS_KIT = {
    body: "Body",
    macacao: "Macacão",
    manta: "Manta",
    meia: "Meia",
    touca: "Touca",
    babador: "Babador",
    "Pacote-de-fralda": "Pacote de fralda",
    shampoo: "Shampoo",
    pomada: "Pomada",
    perfume: "Perfume",
    "lenco-Umedecido": "Lenço Umedecido",
    sabonete: "Sabonete"
};

// ===== Estoque real por variação (preenchido a partir de /all-items) =====

// Estoque indexado por "itemName|gender|size" (gender/size vazios = null).
let estoqueIndex = {};
// Variações reais de gênero e tamanho que existem no estoque (para os selects).
let generosDisponiveis = [];
let tamanhosDisponiveis = [];
let selectsMontados = false;

// Chave de busca no índice; campos vazios representam "sem gênero/tamanho".
function chaveEstoque(nome, gender, size) {
    return `${nome}|${gender || ""}|${size || ""}`;
}

/**
 * Busca o estoque real (rota comum /all-items) e monta o índice por variação,
 * além das listas de gêneros/tamanhos existentes. Não envolve nenhum valor
 * chumbado: tudo vem do back-end.
 *
 * @returns {Promise<boolean>} true se o estoque foi carregado
 */
async function carregarIndiceEstoque() {
    let dados;
    try {
        const response = await fetch(`${configAPI.baseURL}/all-items?page=0&size=1000`, {
            method: "GET",
            headers: auth.headers()
        });

        if (auth.tratarAcessoNegado(response)) return false;
        if (!response.ok) {
            console.warn(`[kits] /all-items respondeu ${response.status} — tabela fica com os valores estáticos.`);
            return false;
        }

        dados = await response.json();
    } catch (error) {
        console.error("[kits] falha ao buscar /all-items:", error);
        return false;
    }

    estoqueIndex = {};
    const generos = new Set();
    const tamanhos = new Set();

    (dados.content || []).forEach(item => {
        const chave = chaveEstoque(item.itemName, item.gender, item.size);
        estoqueIndex[chave] = (estoqueIndex[chave] || 0) + (item.quantity || 0);
        if (item.gender) generos.add(item.gender);
        if (item.size) tamanhos.add(item.size);
    });

    generosDisponiveis = [...generos].sort();
    tamanhosDisponiveis = [...tamanhos].sort();
    return true;
}

// Cria um <select> com uma opção vazia ("—") seguida das variações reais.
function montarSelectVariacao(classe, valores) {
    const select = document.createElement("select");
    select.className = `select-variacao ${classe}`;

    ["", ...valores].forEach(valor => {
        const opt = document.createElement("option");
        opt.value = valor;
        opt.textContent = valor || "—";
        select.appendChild(opt);
    });

    return select;
}

// Atualiza o badge de estoque de uma linha conforme a variação selecionada.
function atualizarEstoqueLinha(linha) {
    const input = linha.querySelector("input");
    const badge = linha.querySelector(".badge");
    const selGenero = linha.querySelector(".select-genero");
    const selTamanho = linha.querySelector(".select-tamanho");
    const nome = input && ITENS_KIT[input.id];
    if (!nome || !badge) return;

    const chave = chaveEstoque(nome, selGenero.value, selTamanho.value);
    const quantidade = estoqueIndex[chave] || 0;
    badge.textContent = quantidade;
    badge.className = quantidade > 0 ? "badge badge-blue" : "badge badge-red";
}

/**
 * Injeta (uma única vez) os selects de gênero/tamanho em cada linha,
 * pré-selecionando a primeira variação existente daquele item, e liga os
 * eventos que atualizam o estoque exibido e recalculam os kits possíveis.
 */
function montarSelectsVariacao() {
    if (selectsMontados) return;

    document.querySelectorAll(".tabela-kits tbody tr").forEach(linha => {
        const input = linha.querySelector("input");
        const nome = input && ITENS_KIT[input.id];
        if (!nome) return;

        const selGenero = montarSelectVariacao("select-genero", generosDisponiveis);
        const selTamanho = montarSelectVariacao("select-tamanho", tamanhosDisponiveis);

        // Pré-seleciona a primeira variação que de fato existe para este item.
        const variacao = Object.keys(estoqueIndex)
            .map(chave => chave.split("|"))
            .find(([itemName, , ]) => itemName === nome);
        if (variacao) {
            selGenero.value = variacao[1];
            selTamanho.value = variacao[2];
        }

        const caixa = document.createElement("div");
        caixa.className = "variacao-box";
        caixa.append(selGenero, selTamanho);
        linha.querySelector("td").appendChild(caixa);

        const aoMudar = () => {
            atualizarEstoqueLinha(linha);
            recalcularKits();
        };
        selGenero.addEventListener("change", aoMudar);
        selTamanho.addEventListener("change", aoMudar);
    });

    selectsMontados = true;
}

// Recarrega o estoque e atualiza badges + kits possíveis de todas as linhas.
async function atualizarEstoque() {
    const ok = await carregarIndiceEstoque();
    if (!ok) return;

    montarSelectsVariacao();
    document.querySelectorAll(".tabela-kits tbody tr").forEach(atualizarEstoqueLinha);
    recalcularKits();
}

document.addEventListener("DOMContentLoaded", async () => {
    await atualizarEstoque();
    await preencherTotalEnxoval();
    await preencherTotalHigiene();
})

async function buscarTotalItensKit(dadosKit) {
    try {

        const response = await fetch(`${configAPI.kitURL}/calcular`, {
            method: "POST",
            headers: auth.headers(),
            body: JSON.stringify(dadosKit)
        });

        if (auth.tratarAcessoNegado(response)) return;

        console.log(response.body);
        const result = await response.json(); // <<-- AQUI VOCÊ PEGA O result DO BACKEND

        console.log("RESULTADO RECEBIDO:", result);

        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**
 * Gera (retira) um kit do estoque: PUT /kit/gerar-kits.
 *
 * Endpoint restrito a administradores; desconta as quantidades dos itens
 * do estoque. Os erros são exibidos ao usuário e a função sinaliza o
 * resultado para que a interface possa reagir.
 *
 * @param {object} dadosKit corpo no formato { type, items: [...] }
 * @returns {Promise<boolean>} true se o kit foi gerado com sucesso
 */
async function gerarKit(dadosKit) {
    try {
        const response = await fetch(`${configAPI.kitURL}/gerar-kits`, {
            method: "PUT",
            headers: auth.headers(),
            body: JSON.stringify(dadosKit)
        });

        // 401 (sessão) ou 403 (sem permissão de admin) já são tratados aqui
        if (auth.tratarAcessoNegado(response)) return false;

        if (!response.ok) {
            const mensagem = response.status === 404
                ? "Algum item do kit não foi encontrado no estoque."
                : "Não foi possível gerar o kit. Verifique se há quantidade suficiente em estoque.";
            showToast("error", mensagem);
            return false;
        }

        return true;
    } catch (error) {
        console.error(error);
        showToast("error", "Falha de conexão com o servidor. Tente novamente.");
        return false;
    }
}