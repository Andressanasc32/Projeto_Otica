<div align="center">

# 🕶️ Sistema de Gestão para Ótica

### *API RESTful & Painel Web de Controle de Estoque e Produtos*

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-2.x-black?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![License](https://img.shields.io/badge/Status-Conclu%C3%ADdo-brightgreen?style=for-the-badge)](#)

</div>

<br />

---

## 📌 Sobre o Projeto

O **Sistema de Gestão para Ótica** é uma solução web desenvolvida para otimizar o gerenciamento e controle de catálogo de produtos (óculos, lentes monofocais, bifocais, multifocais e acessórios), movimentação de estoque e visualização de dados operacionais.

---

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologias |
| :--- | :--- |
| **Backend** | Python 3.10+, Flask, Flask-CORS |
| **Frontend** | HTML5, CSS3, JavaScript (ES6+), Bootstrap 5 |
| **Banco de Dados** | SQLite3 |
| **Ferramentas & Versionamento** | Git, `venv` (Virtual Environment) |
| **Auxílio & Produtividade** | IA (ChatGPT / Claude / Gemini) |

---

## 🤖 Uso de Inteligência Artificial

> 💡 **Nota de Transparência:** A IA foi utilizada como uma ferramenta de apoio e produtividade durante as seguintes etapas do projeto:

- 🏗️ **Arquitetura & Rotas:** Auxílio na modelagem inicial das rotas RESTful no `app.py` e boas práticas de integração com o módulo `database.py`.
- 🛠️ **Troubleshooting:** Suporte no diagnóstico e resolução de erros de política de CORS (*Cross-Origin Resource Sharing*) usando `flask-cors`.
- 📝 **Documentação:** Apoio na estruturação, clareza e formatação padrão deste arquivo `README.md`.

---

## 📐 Decisões Tomadas e Justificativas

- 🎨 **Interface Responsiva com Bootstrap:** Optei pelo **Bootstrap 5** para garantir uma interface moderna, padronizada e limpa sem gastar tempo excessivo reimplementando componentes do zero. O sistema de grid garante total **responsividade** para desktops e dispositivos móveis.
- 🔌 **Centralização de Requisições (`api.js`):** Toda a camada de comunicação com o backend (HTTP Fetch Requests) foi isolada num único módulo JS para manter o código limpo, modular e fácil de dar manutenção.
- 🗄️ **Separação em Módulos Backend:** Separação estrita de responsabilidades entre a lógica de rotas/Endpoints (`app.py`) e a camada de persistência de dados (`database.py`).

---

## 📁 Estrutura do Projeto

```text
otica/
├── 📂 Backend/
│   ├── 📄 app.py              # Entrada da aplicação e endpoints Flask
│   ├── 📄 database.py         # Conexão e manipulação do banco SQLite
│   ├── 🗄️ otica.db            # Banco de dados SQLite
│   └── 📂 venv/               # Ambiente virtual Python
├── 📄 .gitignore              # Regras de exclusão do Git
└── 📄 README.md               # Documentação completa do projeto
⚙️ Como Executar o Projeto
1️⃣ Clonar o Repositório
Bash
git clone <URL_DO_REPOSITORIO>
cd otica
2️⃣ Configurar e Ativar o Ambiente Virtual (venv)
Windows:

Bash
.\Backend\venv\Scripts\activate
Linux / macOS:

Bash
source Backend/venv/bin/activate
3️⃣ Instalar as Dependências
Bash
pip install flask flask-cors
4️⃣ Iniciar o Servidor Backend
Bash
python Backend/app.py
🚀 O servidor estará rodando em: http://localhost:5000

🎯 Desafios e Soluções Técnico-Práticas
🔴 Dificuldade: O repositório continha arquivos pesados do ambiente virtual (venv/) e temporários (__pycache__/), poluindo os commits.

🟢 Solução: Criação de um .gitignore robusto ignorando venv/, __pycache__/, binários .sqlite3/.db e variáveis de ambiente.

🔴 Dificuldade: Gerenciar o ciclo de vida das conexões sem travar o banco ou gerar concorrência em requisições concorrentes.

🟢 Solução: Encapsulamento do banco no database.py, garantindo encerramento correto do cursor após cada requisição das rotas do app.py.

🔴 Dificuldade: Bloqueio de requisições ao tentar consumir o backend Flask a partir da interface frontend.

🟢 Solução: Implementação e parametrização do middleware flask-cors nas rotas do projeto.

🔮 O que Ficou Faltando / Próximos Passos (Com Mais Tempo)
🔐 Tela de Login do Colaborador: Implementação de um fluxo de autenticação (login/logout) com controle de acesso baseado em níveis de usuário (vendedor vs administrador).

🛡️ Autenticação JWT: Proteção das rotas privadas da API com tokens de acesso (JSON Web Tokens).

🔍 Filtros Avançados: Busca combinada por categoria, faixa de preço e marca diretamente no painel.

💬 Respostas da Parte 4 — Perguntas Curtas
1. Qual a diferença entre npm run dev e npm run build? Qual deve ir para produção e por quê?
O npm run dev inicia um servidor de desenvolvimento local com compilação em tempo real e source maps, ideal para depuração mas pesado e lento. O npm run build compila, minifica e otimiza todo o código em arquivos estáticos (HTML/CSS/JS) leves. Para produção deve ir o resultado do build, pois oferece alta performance, menor consumo de banda e maior segurança quando servido por um web server (ex.: Nginx) ou CDN.

2. Por que não se deve usar o servidor embutido do Flask (flask run) em produção? O que você usaria no lugar?
O servidor nativo do Flask é um servidor WSGI simples, mono-thread por padrão, feito exclusivamente para testes locais e sem suporte a alta concorrência. Em produção, deve-se utilizar um servidor WSGI robusto como o Gunicorn ou uWSGI, operando atrás de um proxy reverso como o Nginx.

3. Um gerente de loja diz: "A tela de produtos ficou em branco". Quais passos você seguiria para descobrir a causa?
Inspecionar o Navegador: Abrir as ferramentas de desenvolvedor (F12) e checar o Console para buscar exceções JS.

Aba Network: Verificar se as requisições para a API falharam (erros 404, 500 ou CORS).

Teste Direto na API: Fazer requisições via cURL/Postman para validar o estado do backend.

Análise de Logs: Checar os logs do servidor backend e do proxy/web server.

4. Por que guardar valores em dinheiro como float pode dar problema? Como evitar no Python e JS?
O tipo float utiliza a representação binária IEEE 754, que gera imprecisões de arredondamento em dízimas decimais (ex.: 0.1 + 0.2 vira 0.30000000000000004).

Em Python: Utiliza-se a classe nativa decimal.Decimal ou armazena-se o valor inteiro em centavos.

Em JavaScript: Trabalha-se com inteiros (centavos) dividindo por 100 na exibição, ou utilizam-se bibliotecas de precisão como dinero.js ou big.js.
