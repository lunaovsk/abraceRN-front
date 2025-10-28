# 🍼 Abrace um RN – Dashboard Administrativo

Este projeto é um **Dashboard Administrativo** para o gerenciamento de itens do estoque de doações do projeto **Abrace um RN**.  
A aplicação permite **adicionar, visualizar, filtrar e organizar itens** por categoria, tipo, tamanho, gênero e validade.

---

## ✨ Funcionalidades

| Função | Descrição |
|-------|-----------|
| ➕ Adicionar item | Modal para cadastro de novos itens |
| 📦 Controle de estoque | Visualização detalhada dos itens cadastrados |
| 🔍 Filtros e pesquisa | Pesquisa por nome, categoria, tipo e tamanho |
| 📊 Indicadores automáticos | Total de itens, tipos cadastrados, categorias e itens únicos |
| ✅ Validações no formulário | Verifica preenchimento correto antes do envio |
| 🔔 Toast Notifications | Sucesso e erro com **Toastify.js** |
| 🔄 Atualização em tempo real | A lista e os totais são atualizados após cada operação |

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Uso |
|-----------|-----|
| **HTML5** | Estrutura da interface |
| **CSS3** | Estilização e layout |
| **JavaScript (ES6+)** | Lógica de interação e manipulação de dados |
| **Toastify.js** | Exibição de notificações |
| **Font Awesome** | Ícones na interface |
| **Fetch API** | Comunicação com backend REST |
| **Spring Boot (Back-end)** | API REST e conexão com banco de dados (caso aplicável) |

---

## 📂 Estrutura de Pastas
```
.
├── css/
│ ├── _card-estoque.css
│ ├── _card-filter.css
│ ├── _cards.css
│ ├── _header.css
│ ├── _modal-add-item.css
│ └──style.css
├── js/
│ ├── config.js
│ ├── api.js
│ ├── card.js
│ ├── app.js
│ └── modalAddItem.js
├── img/
│ └── Container.png
├── index.html
└── README.md
```

---

## 🚀 Como Executar

### 1️⃣ Clonar o repositório
```bash
git clone https://github.com/SEU-USUARIO/abrace-rn-dashboard.git
cd abrace-rn-dashboard
```

### 2️⃣ Iniciar o projeto
A aplicação é **frontend puro**, então só abrir o arquivo:
**html**
```
index.html
```
 **Dica:**  Use uma extensão como **Live Server** no VS Code para auto-reload.

---
### 🔌 Configuração de API (Opcional)
No arquivo:
**js**
```
/js/config.js
```
Configure a URL da sua API backend:

**js**
```js
const BASE_URL = "http://localhost:8080/api";
```

---

### 🧑‍💻 Desenvolvimento
Notificações com Toastify

**html**
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css">
<script src="https://cdn.jsdelivr.net/npm/toastify-js"></script>
```
Função utilizada:

**js**
```js
showToast("Mensagem aqui", "success"); // success | error | info
```
### 📸 Preview 

---

### 🤝 Contribuindo
Contribuições são bem-vindas!
Para contribuir:

**git**
```git
git branch minha-melhoria
git commit -m "Melhoria: descrição"
git push origin minha-melhoria
``` 
E abra um **Pull Request** 😉

---

### 📄 Licença
Este projeto é de uso interno do projeto **Abrace um RN**
Permissão de uso, modificação e distribuição deve ser autorizada.

---
Feito com ❤️ para apoiar famílias e recém-nascidos 🤱



