# Abrace um RN – Dashboard Administrativo

Este projeto é um **Dashboard Administrativo** para o gerenciamento de itens do estoque de doações do projeto **Abrace um RN**.  
A aplicação permite **adicionar, visualizar, filtrar e organizar itens** por categoria, tipo, tamanho, gênero e validade.

---

## Funcionalidades

| Função | Descrição |
|-------|-----------|
| Login com JWT | Autenticação via API (`POST /login`); o token é guardado e enviado em todas as requisições |
| Controle de acesso | Ações de **editar**, **excluir** e **retirar kit** são exibidas apenas para administradores |
| Sessão e logout | Token expira em 1h; páginas restritas redirecionam para o login e há botão de sair |
| Adicionar item | Modal para cadastro de novos itens |
| Controle de estoque | Visualização detalhada dos itens cadastrados |
| Filtros e pesquisa | Pesquisa por nome, categoria, tipo e tamanho |
| Indicadores automáticos | Total de itens, tipos cadastrados, categorias e itens únicos |
| Validações no formulário | Verifica preenchimento correto antes do envio |
| Toast Notifications | Sucesso e erro com **Toastify.js** |
| Atualização em tempo real | A lista e os totais são atualizados após cada operação |

---

## Tecnologias Utilizadas

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

## Estrutura de Pastas
```
.
├── css/
│ ├── card-estoque.css
│ ├── card-filter.css
│ ├── cards.css
│ ├── header.css
│ ├── login.css
│ ├── modal-add-item.css
│ └── style.css
├── js/
│ ├── config.js
│ ├── auth.js
│ ├── api.js
│ ├── card.js
│ ├── app.js
│ ├── login.js
│ └── modalAddItem.js
├── pages/
│ ├── login.html
│ └── calculoestoque.html
├── img/
│ └── Container.png
├── index.html
└── README.md
```

---

## Como Executar

### Clonar o repositório
```bash
git clone https://github.com/SEU-USUARIO/abrace-rn-dashboard.git
cd abrace-rn-dashboard
```

### Iniciar o projeto
A aplicação é **frontend puro**. Use a extensão **Live Server** do VS Code e abra a aplicação
obrigatoriamente em **`http://127.0.0.1:5500`** — essa é uma das origens liberadas no CORS do
back-end. Abrir como `file://` ou em outra porta/host fará as requisições falharem.

```
index.html
```

### Autenticação
Ao abrir, sem uma sessão ativa você é redirecionado para **`pages/login.html`**.
O login envia as credenciais para `POST /login`; em caso de sucesso, o back-end devolve um
**token JWT** (válido por 1h) que é guardado no `localStorage` e enviado no header
`Authorization: Bearer <token>` de todas as chamadas seguintes.

> As contas são criadas pelo back-end (`POST /login/create`, restrito a usuários autenticados),
> portanto o cadastro de usuários não é feito por esta interface.

---
### Configuração de API (Opcional)
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

### Desenvolvimento
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
### Preview 

---

### Contribuindo
Para contribuir:

**git**
```git
git branch minha-melhoria
git commit -m "Melhoria: descrição"
git push origin minha-melhoria
``` 
E abra um **Pull Request**

---

### Licença
Este projeto é de uso interno do projeto **Abrace um RN**
Permissão de uso, modificação e distribuição deve ser autorizada.

---



