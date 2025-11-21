document.querySelector(".back-btn").addEventListener("click", function() {
    window.location.href = "/";
});

const openBtn = document.querySelector(".btn-retirar");
const closeBtn = document.getElementById("closeModalBtn");
const modal = document.getElementById("modal");
const overlay = document.getElementById("modalOverlay");

openBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
});

closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
});

overlay.addEventListener("click", () => {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
});
