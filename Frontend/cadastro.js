
    async function cadastrarProduto() {
    // 1. Captura os valores de cada input pelo ID
    const novoProduto = {
        codigo: document.getElementById('codigo').value,
        descricao: document.getElementById('descricao').value,
        tipo: document.getElementById('tipo').value,
        indice_refracao: document.getElementById('indice_refracao').value,
        preco: parseFloat(document.getElementById('preco').value) || 0,
        estoque: parseInt(document.getElementById('estoque').value) || 0
    };

    try {
        // 2. Envia para a API Flask
        const resposta = await fetch('http://127.0.0.1:5000/api/produtos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novoProduto) // Converte o objeto JS para String JSON
        });

        const resultado = await resposta.json();

        if (resposta.ok) {
            alert('Produto cadastrado com sucesso!');
      
        } else {
            alert(`Erro: ${resultado.erro || 'Falha ao cadastrar'}`);
        }
    } catch (error) {
        console.error('Erro ao cadastrar produto:', error);
    }
}