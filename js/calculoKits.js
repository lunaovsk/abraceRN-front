function montarBodyEnxoval() {
    return {
        type: "ENXOVAL",
        items: [{
                itemName: "Body",
                gender: "M",
                size: "P",
                quantity: Number(document.getElementById("body").value)
            },
            {
                itemName: "Macacão",
                gender: "M",
                size: "P",
                quantity: Number(document.getElementById("macacao").value)
            },
            {
                itemName: "Manta",
                gender: "M",
                size: "P",
                quantity: Number(document.getElementById("manta").value)
            },
            {
                itemName: "Meia",
                gender: "M",
                size: "P",
                quantity: Number(document.getElementById("meia").value)
            },
            {
                itemName: "Touca",
                gender: "M",
                size: "P",
                quantity: Number(document.getElementById("touca").value)
            },
            {
                itemName: "Babador",
                gender: "M",
                size: "P",
                quantity: Number(document.getElementById("babador").value)
            }
        ]
    };
}

function montarBodyHigiene() {
    return {
        type: "HIGIENE",
        items: [{
                itemName: "Pacote de fralda",
                gender: "UNISSEX",
                size: "Único",
                quantity: Number(document.getElementById("Pacote-de-fralda").value)
            },
            {
                itemName: "Shampoo",
                gender: "UNISSEX",
                size: "Único",
                quantity: Number(document.getElementById("shampoo").value)
            },
            {
                itemName: "Pomada",
                gender: "UNISSEX",
                size: "Único",
                quantity: Number(document.getElementById("pomada").value)
            },
            {
                itemName: "Perfume",
                gender: "UNISSEX",
                size: "Único",
                quantity: Number(document.getElementById("perfume").value)
            },
            {
                itemName: "Lenço Umedecido",
                gender: "UNISSEX",
                size: "Único",
                quantity: Number(document.getElementById("lenco-Umedecido").value)
            },
            {
                itemName: "Sabonete",
                gender: "UNISSEX",
                size: "Único",
                quantity: Number(document.getElementById("sabonete").value)
            }
        ]
    };
}

async function preencherTotalEnxoval() {
    const bodyEnxoval = montarBodyEnxoval();

    console.log("OBJETO ENVIADO PARA API:", bodyEnxoval);

    const totalKitEnxoval = await buscarTotalItensKit(bodyEnxoval);

    document.getElementById("card_enxoval").innerHTML = totalKitEnxoval.kitsPossible || 0;

    return totalKitEnxoval.kitsPossible;
}

async function preencherTotalHigiene() {
    const bodyHigiene = montarBodyHigiene();

    console.log("OBJETO ENVIADO PARA API:", bodyHigiene);

    const totalKitHigiene = await buscarTotalItensKit(bodyHigiene);

    document.getElementById("card_higiene").innerHTML = totalKitHigiene.kitsPossible || 0;

    return totalKitHigiene.kitsPossible;
}

document.addEventListener("DOMContentLoaded", async () => {
    await preencherTotalEnxoval();
    await preencherTotalHigiene();
})

async function buscarTotalItensKit(dadosKit) {
    try {

        const response = await fetch(`${configAPI.baseURL}/kit/calcular`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosKit)
        });

        console.log(response.body);
        const result = await response.json(); // <<-- AQUI VOCÊ PEGA O result DO BACKEND

        console.log("RESULTADO RECEBIDO:", result);

        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
}