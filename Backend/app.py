from flask import Flask, g, jsonify, request
from flask_cors import CORS
from datetime import datetime
import sqlite3
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "otica.db"

app=Flask(__name__)
CORS(app)
def get_db():
    """Abre uma nova conexão se ainda não existir uma para a requisição atual."""
    if "db" not in g:
        g.db=sqlite3.connect(DB_PATH)
        # Permite acessar os resultados das consultas como dicionários em vez de tuplas
        g.db.row_factory = sqlite3.Row
    return g.db

@app.teardown_appcontext
def close_db(exception):
    """Fecha a conexão automaticamente ao finalizar a requisição."""
    db = g.pop("db", None)
    if db is not None:
        db.close()


@app.post("/api/produtos")
def cadastrar_produto():
    dados = request.get_json()

    """ Extração dos dados do corpo da requisição"""
    codigo = dados.get("codigo")
    descricao = dados.get("descricao")
    tipo = dados.get("tipo")
    indice_refracao = dados.get("indice_refracao")
    preco = dados.get("preco")
    estoque = dados.get("estoque")

    db = get_db()
    cursor = db.cursor()

    try:
        cursor.execute(
            """
            INSERT INTO produtos (codigo, descricao, tipo, indice_refracao, preco, estoque)
            VALUES (?, ?, ?, ?, ?, ?)
        """,
            (codigo, descricao, tipo, indice_refracao, preco, estoque),
        )

        db.commit()
        """ Recupera o ID gerado para o novo produto"""
        novo_id = cursor.lastrowid

        return (
            jsonify(
                {
                    "mensagem": "Produto cadastrado com sucesso!",
                    "id": novo_id,
                    "codigo": codigo,
                }
            ),
            201,
        )

    except sqlite3.IntegrityError as error:
        db.rollback()
        # Retorna o erro caso alguma regra CHECK ou UNIQUE seja violada
        return (
            jsonify(
                {
                    "erro": "Falha de validação ou código já cadastrado.",
                    "detalhe": str(error),
                }
            ),
            400,
        )
@app.route('/api/produtos/<int:id_produto>', 
methods=['PUT', 'PATCH'],
strict_slashes=False,)
def editar_produto(id_produto):
    dados = request.get_json()

    # Captura os dados atualizados vindos do frontend
    codigo = dados.get('codigo')
    descricao = dados.get('descricao')
    tipo = dados.get('tipo', '').lower()
    indice_refracao = dados.get('indice_refracao')
    preco = dados.get('preco')
    estoque = dados.get('estoque')
    atualizado_em = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    db = get_db()
    cursor = db.cursor()

    try:
        # Verifica se o produto existe
        cursor.execute("SELECT id FROM produtos WHERE id = ?", (id_produto,))
        if not cursor.fetchone():
            return jsonify({"erro": "Produto não encontrado"}), 404

        # Executa o UPDATE no banco de dados
        cursor.execute(
            """
            UPDATE produtos 
            SET codigo = ?, descricao = ?, tipo = ?, indice_refracao = ?, preco = ?, estoque = ?
            WHERE id = ?
            """,
            (
                codigo,
                descricao,
                tipo,
                indice_refracao,
                preco,
                estoque,
                id_produto,
            ),
        )

        db.commit()

        return (
            jsonify({"mensagem": "Produto atualizado com sucesso!"}),
            200,
        )

    except sqlite3.Error as error:
        db.rollback()
        return (
            jsonify(
                {
                    "erro": "Erro ao atualizar produto no banco",
                    "detalhe": str(error),
                }
            ),
            500,
        )
@app.delete('/api/produtos/<int:id_produto>', strict_slashes=False)
def deletar_produto(id_produto):
    db=get_db()
    cursor=db.cursor()
    try:
     
        cursor.execute("SELECT id FROM produtos WHERE id = ?", (id_produto,))
        if not cursor.fetchone():
            return jsonify({"erro": "Produto não encontrado"}), 404

       
        cursor.execute("DELETE FROM produtos WHERE id = ?", (id_produto,))
        db.commit()  

        return jsonify({"mensagem": "Produto deletado com sucesso!"}), 200
    except sqlite3.Error as error:
        db.rollback()
        return(
            jsonify({"error":"Erro ao deletar o produto", "detalhe":str(error),}),500,
        )
@app.get('/api/produtos', strict_slashes=False)
def buscar_produtos():
    tipo = request.args.get('tipo', '').strip()
    busca = request.args.get('busca', '').strip()

    db = get_db()
    cursor = db.cursor()

    query = "SELECT id, codigo, descricao, tipo, indice_refracao, preco, estoque, atualizado_em FROM produtos WHERE 1=1"
    parametros = []

   # 1. Filtro por tipo (força comparação em minúsculas)
    if tipo:
        query += " AND LOWER(tipo) = LOWER(?)"
        parametros.append(tipo)


   # 2. Busca parcial no código OU na descrição (força comparação case-insensitive)
    if busca:
        query += " AND (LOWER(codigo) LIKE LOWER(?) OR LOWER(descricao) LIKE LOWER(?))"
        termo = f"%{busca}%"
        parametros.append(termo)
        parametros.append(termo)
    query += " ORDER BY id DESC"

    cursor.execute(query, parametros)
    produtos = cursor.fetchall()

    # Formatação do retorno em JSON
    resultado = [
        {
            "id": p[0],
            "codigo": p[1],
            "descricao": p[2],
            "tipo": p[3],
            "indice_refracao": p[4],
            "preco": p[5],
            "estoque": p[6],
            "atualizado_em": p[7],
        }
        for p in produtos
    ]

    return jsonify(resultado), 200
@app.get('/api/relatorios/estoque/baixo', strict_slashes=False)
def relatorio_estoque_baixo():
    # Obtém o limite da query string (padrão é 5)
    limite = request.args.get('limite', default=5, type=int)

    db = get_db()
    cursor = db.cursor()

    # Busca produtos com estoque <= limite, ordenados do menor para o maior estoque
    query = """
        SELECT id, codigo, descricao, tipo, preco, estoque, atualizado_em
        FROM produtos 
        WHERE estoque <= ? 
        ORDER BY estoque ASC
    """

    cursor.execute(query, (limite,))
    produtos = cursor.fetchall()

    resultado = [
        {
            "id": p[0],
            "codigo": p[1],
            "descricao": p[2],
            "tipo": p[3],
            "preco": p[4],
            "estoque": p[5],
            "atualizado_em": p[6]
        }
        for p in produtos
    ]

    return jsonify(resultado), 200
if __name__ == "__main__":
    app.run(debug=True)