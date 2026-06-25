const configAPI = {
    // Recursos protegidos do dashboard de estoque
    baseURL: 'http://localhost:8080/dashboard',
    // Autenticação (login)
    authURL: 'http://localhost:8080/login',
    // Cálculo e geração de kits
    kitURL: 'http://localhost:8080/kit'
};

const elementosDOM = {
    totalItens: document.getElementById('totalItens')
};

// Estilo minimalista do toast: pílula colorida e compacta, só com o texto.
(function injetarEstiloToast() {
    const estilo = document.createElement('style');
    estilo.textContent = `
        .toast-min {
            padding: 10px 16px !important;
            border-radius: 8px !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12) !important;
        }
        .toast-min .swal2-title {
            margin: 0 !important;
            padding: 0 !important;
            font-size: 14px !important;
            font-weight: 600 !important;
            color: #ffffff !important;
        }
    `;
    document.head.appendChild(estilo);
})();

// Cor de fundo conforme o tipo da notificação.
const CORES_TOAST = {
    success: '#16A34A',
    error: '#DC2626',
    warning: '#D97706',
    info: '#2563EB'
};

// Notificação rápida no canto da tela (substitui os pop-ups que exigiam clicar em "Ok").
function showToast(tipo, mensagem) {
    Swal.fire({
        toast: true,
        position: 'top-end',
        title: mensagem,
        showConfirmButton: false,
        timer: 2500,
        width: 'auto',
        background: CORES_TOAST[tipo] || CORES_TOAST.info,
        color: '#ffffff',
        customClass: { popup: 'toast-min' }
    });
}

