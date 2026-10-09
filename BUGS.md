Markdown
# 🐛 Análise e Correção de Bugs — Parte 3

> **Status:** Finalizado & Revisitado  
> **Arquivo:** `BUGS.md`  
> **Descrição:** Mapeamento detalhado dos erros encontrados nos trechos de código em JavaScript e Python/Flask, com explicações sobre o impacto e suas devidas correções.

---

## 💻 3.1 JavaScript

### 🔍 1. Mês Baseado em Índice Zero na Classe `Date`
| Campo | Descrição |
| :--- | :--- |
| **O que está errado** | O construtor `new Date(ano, mes, dia)` no JavaScript trata o mês com base zero (onde `0` é Janeiro e `11` é Dezembro). |
| **Efeito** | Ao converter a string `"15/05/2026"`, a função cria uma data no mês de Junho (`15/06/2026`), ficando um mês à frente do pretendido. |

```javascript
// 🟢 Código Corrigido
function parseLocalDate(str) {
  if (!str || typeof str !== 'string') return null;
  const [dia, mes, ano] = str.split('/');
  return new Date(Number(ano), Number(mes) - 1, Number(dia));
}
🔍 2. Condição de Parada no Laço for (Off-by-One)
Campo	Descrição
O que está errado	A condição i <= vendas.length faz o laço tentar acessar o índice vendas[vendas.length], que não existe.
Efeito	Tenta somar undefined.valor, resultando em NaN (Not a Number) ou lançando uma exceção de execução.
JavaScript
// 🟢 Código Corrigido
function totalVendas(vendas) {
  if (!Array.isArray(vendas)) return 0;
  let total = 0;
  for (let i = 0; i < vendas.length; i++) {
    total += vendas[i]?.valor || 0;
  }
  return total;
}
🔍 3. Validação de Tipos e Formatação em precoComDesconto
Campo	Descrição
O que está errado	Falta de validação dos tipos de entrada. Caso preco ou desconto não sejam números válidos ou sejam nulos/indefinidos.
Efeito	O cálculo resulta em NaN, fazendo o retorno final formatar de maneira quebrada como 'R$ NaN'.
JavaScript
// 🟢 Código Corrigido
function precoComDesconto(preco, desconto) {
  if (typeof preco !== 'number' || typeof desconto !== 'number' || isNaN(preco) || isNaN(desconto)) {
    return 'R$ 0,00';
  }
  const descontoValido = Math.min(Math.max(desconto, 0), 100);
  const final = preco - (preco * descontoValido / 100);
  return `R$ ${final.toFixed(2)}`;
}
🔍 4. Chave Duplicada no Objeto de Configuração
Campo	Descrição
O que está errado	A chave apiUrl foi declarada duas vezes dentro do objeto config ('http://localhost:5000' e '/api').
Efeito	A segunda atribuição ('/api') sobrescreve a primeira em silêncio, corrompendo a URL base completa das requisições.
JavaScript
// 🟢 Código Corrigido
const config = {
  apiUrl: 'http://localhost:5000/api',
  timeout: 5000
};
🐍 3.2 Python / Flask
🔍 1. Argumento Padrão Mutável (itens=[])
Campo	Descrição
O que está errado	A assinatura da função def criar_pedido(itens=[]) utiliza uma lista mutável como argumento padrão.
Efeito	A lista é compartilhada em memória entre todas as chamadas da API, fazendo os dados acumularem e vazarem entre diferentes requisições de clientes.
🔍 2. Estrutura Mal Formada e Falta de Validação
Campo	Descrição
O que está errado	O código fazia itens.append(dados) de forma genérica e tentava somar campos sem tratar entradas nulas ou mal formatadas.
Efeito	Se a requisição recebesse um corpo JSON sem a chave 'itens' ou com tipos errados, o servidor Flask lançava um erro interno (HTTP 500).
🔍 3. Rota Mal Definida sem Variável na URL
Campo	Descrição
O que está errado	O decorator @app.route('/api/pedidos/') não continha o parâmetro <id> no caminho.
Efeito	A função buscar_pedido(id) não conseguia extrair o ID da URL, inviabilizando a busca.
🔍 4. Comparação de Tipos Incompatíveis e Ausência de Retorno 404
Campo	Descrição
O que está errado	Comparação direta entre a str recebida na URL e o int armazenado no banco (p['id'] == id).
Efeito	A condição sempre resultava em False (1 == '1'). Quando o pedido não era encontrado, a função não retornava resposta de erro.
🟢 Código Python / Flask Refatorado & Estilizado
Python
from flask import Flask, request, jsonify

app = Flask(__name__)
pedidos = []

@app.route('/api/pedidos', methods=['POST'])
def criar_pedido():
    dados = request.get_json(silent=True)
    
    # 1. Validação do corpo da requisição
    if not dados or 'itens' not in dados or not isinstance(dados['itens'], list):
        return jsonify({'erro': 'Corpo da requisição inválido ou sem lista de itens'}), 400

    # 2. Cálculo seguro do total dos itens
    try:
        total = sum(item['preco'] * item['qtd'] for item in dados['itens'])
    except (KeyError, TypeError):
        return jsonify({'erro': 'Os itens devem conter "preco" e "qtd" válidos'}), 400

    # 3. Cálculo de desconto e total final
    desconto_percentual = dados.get('desconto', 0)
    desconto = total * (desconto_percentual / 100)
    total_final = total - desconto

    # 4. Estruturação do novo pedido
    novo_pedido = {
        'id': len(pedidos) + 1,
        'itens': dados['itens'],
        'total': total_final,
        'desconto': desconto
    }
    pedidos.append(novo_pedido)

    return jsonify(novo_pedido), 201


@app.route('/api/pedidos/<id>', methods=['GET'])
def buscar_pedido(id):
    # Comparação segura convertendo ambos os IDs para string
    for p in pedidos:
        if str(p.get('id')) == str(id):
            return jsonify(p), 200
            
    return jsonify({'erro': 'Pedido não encontrado'}), 404

---

Se estiveres a usar o **VS Code**, podes pressionar `Ctrl + K` e depois `V` (ou `Cmd + K` e depois `V` no Mac) para ver o **Preview** de como o arquivo renderiza com o estilo final!

