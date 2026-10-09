function montarTabela(produtos) {
    const tbody = document.getElementById('body_table');
    if (!tbody) {
        console.error("Elemento com id 'body_table' não foi encontrado no HTML.");
        return;
    }

    tbody.innerHTML = ''; // Limpa a tabela antes de preencher

    produtos.forEach(produto => {
        const linha = `
            <tr id="linha-${produto.id}">
                <td class="id-celula">${produto.id}</td>
                <td class="codigo-celula">${produto.codigo}</td>
                <td class="descricao-celula">${produto.descricao || '-'}</td>
                <td class="tipo-celula">${produto.tipo || '-'}</td>
                <td class="indice_refracao-celula">${produto.indice_refracao || '-'}</td>
                <td class="preco-celula">R$ ${produto.preco}</td>
                <td class="estoque-celula">${produto.estoque}</td>
                <td class="atualizado_em-celula">${produto.atualizado_em || '-'}</td>
                <td class="d-flex justify-content-center gap-3">
                    <button type="button" 
                            class="btn btn-link text-secondary p-0 border-0 fs-4" 
                            onclick="entrarEmModoEdicao(${produto.id})">
                        <ion-icon name="pencil-outline"></ion-icon>
                    </button>
                    <button type="button" 
                            class="btn btn-link text-danger p-0 border-0 fs-4" 
                            onclick="deletarProduto(${produto.id})">
                        <ion-icon name="trash-outline"></ion-icon>
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += linha;
    });
}
async function listarProdutos() {
    try {
        // Passamos o id_usuario na URL para o Python saber de quem são as tarefas
        const resposta = await fetch(`http://127.0.0.1:5000/api/produtos`,
        {
            method:'GET',
            headers:{'Content-Type': 'application/json'}
        }
        );
        if (resposta.ok) {
            const listarproduto = await resposta.json();
           montarTabela(listarproduto);
          
           
        } else {
            console.error('Erro ao buscar tarefas do servidor');
        }

     }catch (error) {
        console.error('Erro ao conectar com a API:', error);
    }
 }
document.addEventListener("DOMContentLoaded", async function() {
        await listarProdutos()
    });
async function deletarProduto(idProduto){
const confirmar = confirm("Tem certeza que deseja excluir esta atividade?");
    if (!confirmar) return;

    try{
        const resposta=await fetch(`http://127.0.0.1:5000/api/produtos/${idProduto}`,{
            method:'DELETE',
        });
        if (resposta.ok){
            alert('Produto deletado com sucesso!');
            window.location.reload();
        }else{
            const erro= await resposta.json();
            alert(`Erro ao deletar: ${erro.detail || 'Não foi possível excluir.'}`);
        }
    }catch(error){
        console.error('Erro na requisição delete:',error);
        alert("Não foi possível conectar ao servidor.");
    }
}

// 1️⃣ ETAPA 1: Acionada pelo botão da CANETA (Apenas joga os inputs na tela)
function entrarEmModoEdicao(idProduto) {
    const linha = document.getElementById(`linha-${idProduto}`);
    
    const celulaCodigo = linha.querySelector('.codigo-celula');
    const celulaDescricao = linha.querySelector('.descricao-celula');
    const celulaPreco = linha.querySelector('.preco-celula');
    const celulaEstoque = linha.querySelector('.estoque-celula');
    const celulaTipo = linha.querySelector('.tipo-celula');
    const celulaIndiceRefracao=linha.querySelector('.indice_refracao-celula');

    const codigoAtual = celulaCodigo.innerText;
    const descricaoAtual = celulaDescricao.innerText;
    const precoAtual = celulaPreco.innerText;
    const tipoAtual = celulaTipo.innerText;
    const estoqueAtual=celulaEstoque.innerText;
    const indiceRefracaoAtual=celulaIndiceRefracao.innerText;

    // Transforma o texto em inputs
    celulaCodigo.innerHTML = `<input type="text" id="input-codigo-${idProduto}" class="form-control form-control-sm" value="${codigoAtual}">`;
    celulaDescricao.innerHTML = `<input type="text" id="input-descricao-${idProduto}" class="form-control form-control-sm" value="${descricaoAtual}">`;
    celulaPreco.innerHTML=`<input type="text" id="input-preco-${idProduto}" class="form-control form-control-sm" value="${precoAtual}">`;
    celulaEstoque.innerHTML=`<input type="text" id="input-estoque-${idProduto}" class="form-control form-control-sm" value="${estoqueAtual}">`;
    
    celulaTipo.innerHTML=`
    <select id="input-tipo-${idProduto}" class="form-select form-select-sm">
        <option value="multifocal" ${tipoAtual === 'multifocal' ? 'selected' : ''}>Multifocal</option>
        <option value="monofocal" ${tipoAtual === 'monofocal' ? 'selected' : ''}>Monofocal</option>
        <option value="bifocal" ${tipoAtual === 'bifocal' ? 'selected' : ''}>Bifocal</option>
    </select>
`;
    
    
    celulaIndiceRefracao.innerHTML=`<input type="text" id="input-indice-refracao-${idProduto}" class="form-control form-control-sm" value="${indiceRefracaoAtual}">`;

    
    
    
    // Troca os botões: Caneta vira DISQUETE, Lixeira vira CANCELAR (X)
    const celulaBotoes = linha.lastElementChild;
    celulaBotoes.innerHTML = `
        <button type="button" class="btn btn-link text-success p-0 border-0 fs-4" onclick="salvarAtualizacao(${idProduto})">
            <ion-icon name="save-outline"></ion-icon>
        </button>
        <button type="button" class="btn btn-link text-muted p-0 border-0 fs-4" onclick="window.location.reload()">
            <ion-icon name="close-outline"></ion-icon>
        </button>
    `;}
    async function salvarAtualizacao(idProduto) {
    const confirmar = confirm("Tem certeza que quer atualizar essa atividade?");
    if (!confirmar) return;
    
    
    // Agora sim! O usuário já digitou, então nós lemos o valor atualizado do input
    const novoCodigo = document.getElementById(`input-codigo-${idProduto}`).value;
    const novaDescricao = document.getElementById(`input-descricao-${idProduto}`).value;
    const novoPreco = document.getElementById(`input-preco-${idProduto}`).value;
    const novoTipo = document.getElementById(`input-tipo-${idProduto}`).value;
    const novoEstoque = document.getElementById(`input-estoque-${idProduto}`).value;
    const novoIndiceRefracao = document.getElementById(`input-indice-refracao-${idProduto}`).value;



    const dadosAtualizados = {
        codigo: novoCodigo,
        descricao: novaDescricao,
        preco: novoPreco,
        estoque: novoEstoque,
        tipo:novoTipo,
        indice_refracao: novoIndiceRefracao,
    };

    try {
        const resposta = await fetch(`http://127.0.0.1:5000/api/produtos/${idProduto}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosAtualizados)
        });

        if (resposta.ok) {
            alert("🎉 Atividade atualizada com sucesso!");
            window.location.reload();
        } else {
            const erro = await resposta.json();
            alert(`Erro ao atualizar: ${erro.detail || 'Essa atividade já pertecence outro usuario!.'}`);
        }
    } catch (error) {
        console.error('Erro na requisição update:', error);
        alert("Não foi possível conectar ao servidor.");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const formBusca = document.getElementById('formBusca');
    const filtroTipo = document.getElementById('filtroTipo');
    /*const inputBusca = document.getElementById('buscarProduto');*/

    // Executa a busca ao enviar o formulário (clique no botão ou Enter)
    formBusca.addEventListener('submit', (event) => {
        event.preventDefault();
        carregarProdutosFiltrados();
    });

    // Opcional: Recarrega automaticamente ao mudar o select do tipo
    filtroTipo.addEventListener('change', () => {
        carregarProdutosFiltrados();
    });

    // Carrega todos os produtos na abertura da página
    carregarProdutosFiltrados();
});

async function carregarProdutosFiltrados() {
    const tipo = document.getElementById('filtroTipo')?.value.trim() || '';
    const busca = document.getElementById('buscarProduto')?.value.trim() || '';

    // Monta os parâmetros de Query String dinamicamente
    const params = new URLSearchParams();
    if (tipo !== '') params.append('tipo', tipo);
    if (busca !== '') params.append('busca', busca);

    try {
        const url = `http://127.0.0.1:5000/api/produtos?${params.toString()}`;
        const resposta = await fetch(url);

        if (!resposta.ok) {
            throw new Error('Falha ao buscar produtos');
        }

        const produtos = await resposta.json();
        montarTabela(produtos); // Chame sua função existente que desenha os produtos na tela
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
    }
}
async function carregarEstoqueBaixo() {
    try {
        // Busca os produtos com estoque <= 5 (ou pode passar ?limite=10)
        const resposta = await fetch('http://127.0.0.1:5000/api/relatorios/estoque/baixo?limite=5');

        if (!resposta.ok) {
            throw new Error('Falha ao buscar relatório de estoque');
        }

        const produtosCriticos = await resposta.json();
        montarTabela(produtosCriticos);
        
        // Se não houver nenhum produto com estoque baixo
        if (produtosCriticos.length === 0) {
            alert('Nenhum produto está com o estoque crítico no momento!');
        }
     

    } catch (error) {
        console.error('Erro ao carregar estoque baixo:', error);
        alert('Não foi possível carregar o relatório de estoque.');
    }
}