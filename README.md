🕶️ Sistema de Gestão para Ótica
Um sistema web completo para gerenciamento e controle de produtos, estoque e rotas de vendas para óticas, desenvolvido com Python (Flask) no backend e integração com banco de dados SQLite.

📌 Sobre o Projeto
Este projeto consiste em uma API REST e painel para gerenciamento de catálogo de produtos (óculos, lentes e acessórios) e controle das rotas da aplicação.

🛠️ Tecnologias Utilizadas
Backend: Python 3.10+, Flask, Flask-CORS

Frontend: HTML5, CSS3, Bootstrap 5

Banco de Dados: SQLite

Ambiente Virtual e Versão: venv, Git

Auxílio no Desenvolvimento: Inteligência Artificial (ChatGPT / Claude / Gemini)

🤖 Uso de Inteligência Artificial no Projeto
A IA foi utilizada como uma ferramenta de apoio e produtividade durante as seguintes etapas do desenvolvimento:

Estruturação da Arquitetura e Rotas: Apoio na modelagem inicial das rotas do Flask no app.py e boas práticas de integração com o banco de dados database.py.

Resolução de Problemas (Troubleshooting): Diagnóstico de erros de CORS (Cross-Origin Resource Sharing) e suporte na configuração da biblioteca flask-cors.

Documentação: Auxílio na geração e organização do arquivo README.md para apresentar o projeto de forma clara e padronizada.

📐 Decisões Tomadas e Justificativas
Uso do Bootstrap no Frontend: Optei por utilizar o framework Bootstrap na interface para garantir uma estilização limpa, moderna e consistente sem perder tempo reimplementando componentes do zero. Além disso, o grid do Bootstrap proporcionou responsividade total à página, garantindo boa navegação em diferentes tamanhos de tela.

Isolamento das chamadas de API (api.js): Toda a comunicação de rede (requests/fetch) foi centralizada num único arquivo de serviço para manter o código limpo e reutilizável.

Separação de Módulos Backend: Separação entre a regra de rotas (app.py) e a camada de perssitência do banco de dados (database.py).

📁 Estrutura do Projeto
Plaintext
otica/
├── Backend/
│   ├── app.py              # Ponto de entrada da aplicação e definição das rotas Flask
│   ├── database.py         # Configuração e conexão com o banco de dados
│   ├── otica.db            # Banco de dados SQLite
│   └── venv/               # Ambiente virtual Python
├── .gitignore              # Arquivo de exclusões do Git
└── README.md               # Documentação do projeto

⚙️ Como Executar o Projeto
Clonar o repositório:

Bash
git clone <URL_DO_REPOSITORIO>
cd otica
Ativar o ambiente virtual (venv):

Windows:

Bash
.\Backend\venv\Scripts\activate
Linux/macOS:

Bash
source Backend/venv/bin/activate
Instalar as dependências:

Bash
pip install flask flask-cors
Executar o servidor Backend:

Bash
python Backend/app.py
🎯 Desafios e Dificuldades Encontradas
1. Configuração do Ambiente Virtual e Versionamento
Dificuldade: Inicialmente, o repositório continha arquivos pesados das dependências instaladas no ambiente virtual (venv), além de arquivos temporários do Python (__pycache__), deixando o repositório poluído.

Solução: Criação de um arquivo .gitignore configurado adequadamente para ignorar pastas como venv/, __pycache__/, arquivos binários .sqlite3/.db e variáveis de ambiente .env.

2. Integração e Comunicação das Rotas Flask com o Banco de Dados
Dificuldade: Tratar a conexão com o banco de dados SQLite dentro do fluxo das rotas da API, garantindo que as requisições do painel de produtos retornem os dados em formato JSON correto sem travar conexões ativas.

Solução: Separação clara da lógica de banco de dados no módulo database.py e estruturação de rotas organizadas no app.py, garantindo o encerramento correto das conexões após cada requisição.

3. Integração Cross-Origin (CORS)
Dificuldade: Bloqueio de requisições ao tentar conectar o painel frontend ao servidor Flask.

Solução: Configuração e suporte a requisições Cross-Origin usando a biblioteca flask-cors.

🔮 O que Ficou Faltando / Próximos Passos (Com Mais Tempo)
Com mais tempo disponível para o desenvolvimento do projeto, as seguintes melhorias seriam implementadas:

Tela de Login do Colaborador: Implementar um fluxo de autenticação e autorização (login/logout) com verificação de credenciais e controle de acesso baseado em níveis de usuário (ex.: vendedor e administrador).

Gestão de Sessões e JWT: Adicionar tokens de autenticação para proteger as rotas da API restritas aos funcionários.

Filtros e Busca Avançada: Adicionar campo de busca por nome de produto, categoria ou faixa de preço no painel.

💬 Respostas da Parte 4 - Perguntas Curtas
1. Diferença entre npm run dev e npm run build (Ambiente de Produção)
O npm run dev sobe um servidor de desenvolvimento local que compila o código em tempo real (com Hot Module Replacement) e inclui arquivos de source maps, sendo mais pesado e lento. Já o npm run build gera arquivos estáticos (HTML, CSS e JS) totalmente minificados e otimizados para alto desempenho. Para produção, deve-se utilizar a versão do build, servida por um web server (como Nginx) ou CDN, garantindo maior velocidade e segurança.
2. Por que não se deve usar o servidor embutido do Flask (flask run) em produção? o que você usaria no lugar?
O servidor interno do Flask é WSGI simples, mono-thread/single-process por padrão, feito apenas para desenvolvimento e não suporta concorrência nem grandes volumes de requisições. Em ambiente de produção, utiliza-se um servidor WSGI robusto como o Gunicorn ou uWSGI, operando atrás de um proxy reverso como o Nginx.
3. Um gerente de loja diz: "a tela de produtos ficou em branco". Quais passos você
seguiria para descobrir a causa?
Inspecionar o navegador: Abrir o DevTools (F12) e checar o Console em busca de erros de JavaScript (ex.: sintaxe ou variável undefined).

Analisar a aba Network: Verificar se as chamadas para a API estão retornando erro (ex.: 404, 500) ou falha de CORS.

Testar a API diretamente: Fazer uma requisição via cURL/Postman para checar se o backend está no ar.

Verificar Logs: Checar os logs do servidor backend e do web server/CDN para identificar falhas internas.
4. Por que guardar valores em dinheiro como (float) evitaria isso no Python e no JavaScript?
O tipo float utiliza representação binária de ponto flutuante (padrão IEEE 754), o que causa imprecisões em dízimas e arredondamentos (ex.: 0.1 + 0.2 resulta em 0.30000000000000004).

Em Python: Deve-se usar o módulo nativo decimal.Decimal ou armazenar os valores inteiros em centavos.

Em JavaScript: Deve-se trabalhar com o valor em centavos (inteiros) e dividir por 100 apenas na exibição, ou utilizar bibliotecas de precisão como dinero.js / big.js.
