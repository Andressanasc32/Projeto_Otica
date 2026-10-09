import sqlite3
import os
# 1. Pega o caminho absoluto da pasta 'backend' onde este script está salvo
DIRETORIO_ATUAL = os.path.dirname(os.path.abspath(__file__))

# 2. Define o caminho completo para o arquivo do banco dentro da pasta backend
CAMINHO_BANCO = os.path.join(DIRETORIO_ATUAL, "otica.db")

# 3. Conecta ao banco de dados no local correto
conn = sqlite3.connect(CAMINHO_BANCO)

cursor=conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS produtos(
   id INTEGER PRIMARY KEY,
   codigo TEXT NOT NULL UNIQUE,
   descricao TEXT NOT NULL CHECK(length(descricao)<=120),
   tipo TEXT NOT NULL CHECK(tipo IN ('monofocal', 'bifocal', 'multifocal')),
   indice_refracao REAL NOT NULL CHECK(indice_refracao BETWEEN 1.50 AND 1.74),
   preco REAL NOT NULL CHECK(preco>0),
   estoque INTEGER NOT NULL CHECK(estoque>=0),
   atualizado_em DATETIME NOT NULL DEFAULT (datetime('now', 'localtime'))

   )""")

cursor.execute("""
INSERT INTO produtos(codigo,descricao,tipo,indice_refracao,preco,estoque)
VALUES('LEN-0001',
'Lente multifocal com tratamento antirreflexo avançado, proteção UV400 total e alta resistência a riscos no dia a dia.',
'multifocal',
1.60,
350.00,
20)""")

conn.commit()
conn.close()