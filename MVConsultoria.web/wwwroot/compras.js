// Variável global para armazenar a compra selecionada
let compraSelecionada = null;

// Variável global para armazenar a lista de clientes
let clientes = []; // Inicializa a variável como um array vazio
let compras = [];



// Função para carregar a lista de compras
async function carregarCompras() {
    const token = localStorage.getItem('token');

    if (!token) {
        alert("Você precisa estar logado para ver as compras.");
        window.location.href = "admin.html";
        return;
    }

    try {
        const response = await fetch('/api/Compras', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            compras = await response.json(); // Armazena todas as compras na variável global
            exibirCompras(compras); // Exibe as compras carregadas inicialmente
        } else {
            const errorData = await response.json();
            alert(errorData.message || 'Erro ao carregar compras.');
        }
    } catch (error) {
        console.error('Erro ao carregar compras:', error);
        alert('Ocorreu um erro ao carregar as compras. Tente novamente mais tarde.');
    }
}

// Função para exibir as compras na tabela
function exibirCompras(comprasFiltradas) {
    const tableBody = document.querySelector('#compras-table tbody');
    
    if (tableBody) {
        tableBody.innerHTML = ''; // Limpa a tabela

        comprasFiltradas.forEach(compra => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${compra.id}</td>
                <td>${compra.nomeCliente}</td> <!-- Exibe o nome do cliente -->
                <td>${new Date(compra.dataCompra).toLocaleDateString()}</td> <!-- Formata a data -->
                <td>${compra.valorTotal}</td>
                <td>${compra.quantidadeParcelas}</td>
                <td>
                    <button onclick="mostrarModalVerParcelas(${compra.id})">Ver Parcelas</button>
                </td>
            `;
            tableBody.appendChild(row);

            // Evento de clique para selecionar a compra
            row.addEventListener('click', function () {
                document.querySelectorAll('#compras-table tbody tr').forEach(linha => {
                    linha.classList.remove('selected-row');
                });
                row.classList.add('selected-row'); // Adiciona classe de seleção

                // Define a compra selecionada para edição
                compraSelecionada = compra;
            });
        });
    }
}

// Função para normalizar a data (ignorando fuso horário e horas)
function normalizarData(data) {
    const novaData = new Date(data);
    novaData.setHours(0, 0, 0, 0); // Define a hora para 00:00:00
    return novaData.toISOString().split('T')[0]; // Retorna no formato 'yyyy-mm-dd'
}

// Função para filtrar compras por nome do cliente e data
function filtrarCompras() {
    const nomeQuery = document.getElementById('searchClienteField').value.toLowerCase();
    const dataQuery = document.getElementById('searchDataField').value;

    // Filtra as compras com base no nome do cliente e na data da compra
    const comprasFiltradas = compras.filter(compra => {
        const nomeMatch = compra.nomeCliente.toLowerCase().includes(nomeQuery);
        
        // Normaliza a data da compra e do filtro de data para ignorar a hora
        const dataCompraFormatada = normalizarData(compra.dataCompra);
        const dataMatch = dataQuery ? dataCompraFormatada === dataQuery : true;

        // Retorna true se ambos os filtros forem satisfeitos
        return nomeMatch && dataMatch;
    });

    exibirCompras(comprasFiltradas); // Atualiza a exibição com as compras filtradas
}

// Adiciona os eventos de input nos campos de busca
document.getElementById('searchClienteField').addEventListener('input', filtrarCompras);
document.getElementById('searchDataField').addEventListener('input', filtrarCompras);
document.getElementById('limparFiltrosBtn').addEventListener('click', limparFiltros);

// Função para limpar os filtros e restaurar todas as compras
function limparFiltros() {
    document.getElementById('searchClienteField').value = ''; // Limpa o campo de nome
    document.getElementById('searchDataField').value = ''; // Limpa o campo de data
    exibirCompras(compras); // Exibe todas as compras novamente
}








// Função para abrir o modal de cadastro de compra
function mostrarModalCadastroCompra() {
    document.getElementById('createCompraModal').style.display = 'block';
    document.getElementById('createDataCompra').value = new Date().toISOString().split('T')[0]; // Data atual, não editável
}

// Função para fechar o modal de cadastro de compra
function fecharModalCadastroCompra() {
    document.getElementById('createCompraModal').style.display = 'none';
}

// Função para mostrar o modal de edição de compra
function mostrarModalEditCompra() {
    if (!compraSelecionada) {
        alert('Por favor, selecione uma compra primeiro.');
        return;
    }

    // Exibe o modal de edição
    document.getElementById('editModal').style.display = 'block';

    // Carregar os dados da compra selecionada no formulário de edição
    document.getElementById('editNomeCliente').value = compraSelecionada.nomeCliente; // Nome do Cliente (não editável)
    document.getElementById('editDataCompra').value = new Date(compraSelecionada.dataCompra).toLocaleDateString(); // Data da compra (não editável)
    document.getElementById('editValorTotal').value = compraSelecionada.valorTotal; // Valor total editável
    document.getElementById('editQuantidadeParcelas').value = compraSelecionada.quantidadeParcelas; // Quantidade de parcelas editável
}

// Função para fechar o modal de edição de compra
function fecharModalEditCompra() {
    document.getElementById('editModal').style.display = 'none';
}



// Carregar clientes no DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
    carregarClientes(); // Carrega a lista de clientes no início
});
        

// Função para carregar a lista de clientes
async function carregarClientes() {
    const token = localStorage.getItem('token');

    if (!token) {
        alert("Você precisa estar logado para ver os clientes.");
        window.location.href = "admin.html";
        return;
    }

    try {
        const response = await fetch('/api/Clientes/listarClientes', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            clientes = await response.json();
            clientesListaCompleta = clientes; // Armazena a lista completa de clientes
            //exibirClientes(clientes); // Função para exibir clientes na tabela
        } else {
            const errorData = await response.json();
            alert(errorData.message || 'Erro ao carregar clientes.');
        }
    } catch (error) {
        console.error('Erro ao carregar clientes:', error);
        alert('Ocorreu um erro ao carregar os clientes. Tente novamente mais tarde.');
    }
}


// Função para filtrar clientes conforme o usuário digita
function filtrarClientes() {
    const clienteInput = document.getElementById('createCliente');
    const clienteDropdown = document.getElementById('clienteDropdown');
    const query = clienteInput.value.toLowerCase();

    // Limpa o dropdown
    clienteDropdown.innerHTML = '';

    if (query === '') {
        clienteDropdown.style.display = 'none'; // Oculta o dropdown se o campo estiver vazio
        return;
    }

    // Filtra os clientes com base no nome digitado
    const clientesFiltrados = clientes.filter(cliente =>
        cliente.nome.toLowerCase().includes(query)
    );

    // Popula o dropdown com as opções filtradas
    clientesFiltrados.forEach(cliente => {
        const li = document.createElement('li');
        li.textContent = cliente.nome;
        li.style.cursor = 'pointer';
        li.onclick = () => selecionarCliente(cliente);
        clienteDropdown.appendChild(li);
    });

    // Mostra o dropdown se houver resultados
    clienteDropdown.style.display = clientesFiltrados.length ? 'block' : 'none';

    //console.log(clientesFiltrados); // Verifica os clientes filtrados
}

// Função para selecionar um cliente da lista
function selecionarCliente(cliente) {
    document.getElementById('createCliente').value = cliente.nome; // Mostra o nome selecionado
    document.getElementById('createClienteId').value = cliente.id; // Armazena o ID do cliente
    document.getElementById('clienteDropdown').style.display = 'none'; // Esconde o dropdown
}




// Função para salvar as alterações da compra
document.getElementById('saveCompraBtn').addEventListener('click', async function () {
    if (!compraSelecionada) return;

    const token = localStorage.getItem('token');
    const url = `/api/Compras/${compraSelecionada.id}`;

    const updatedCompra = {
        id: compraSelecionada.id,
        clienteId: compraSelecionada.clienteId, // Mantém o ID do cliente
        nomeCliente: compraSelecionada.nomeCliente, // Mantém o nome do cliente
        dataCompra: compraSelecionada.dataCompra, // Mantém a data da compra
        valorTotal: parseFloat(document.getElementById('editValorTotal').value), // Valor total editado
        quantidadeParcelas: parseInt(document.getElementById('editQuantidadeParcelas').value, 10) // Quantidade de parcelas editada
    };

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedCompra)
        });

        // Corrige o erro de resposta sem JSON
        if (response.ok) {
            const responseData = await response.text();  // Se o retorno for vazio, usar .text()
            if (responseData) {
                console.log('Resposta do servidor:', responseData);
            }

            alert('Compra atualizada com sucesso!');
            document.getElementById('editModal').style.display = 'none'; // Fecha o modal de edição
            carregarCompras(); // Recarrega a lista de compras
        } else {
            const errorData = await response.json();
            alert(errorData.message || 'Erro ao atualizar a compra.');
        }
    } catch (error) {
        console.error('Erro ao atualizar compra:', error);
        alert('Ocorreu um erro ao atualizar a compra. Tente novamente mais tarde.');
    }
});



// Função para salvar a nova compra
document.getElementById('saveNewCompraBtn').addEventListener('click', async function () {
    const dataCompra = new Date().toISOString();
    const valorTotal = parseFloat(document.getElementById('createValorTotal').value);
    const quantidadeParcelas = parseInt(document.getElementById('createQuantidadeParcelas').value);
    const clienteId = parseInt(document.getElementById('createClienteId').value);

    const token = localStorage.getItem('token');

    try {
        const response = await fetch('/api/Compras', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                clienteId,            // Enviando apenas o ClienteId
                dataCompra,           // Data da compra
                valorTotal,           // Valor total da compra
                quantidadeParcelas    // Quantidade de parcelas
            })
        });

        if (response.ok) {
            alert('Compra cadastrada com sucesso!');
            document.getElementById('createCompraModal').style.display = 'none';
            carregarCompras(); // Atualiza a lista de compras
        } else {
            const errorData = await response.json(); // Captura a mensagem de erro detalhada
            alert(`Erro: ${errorData.message || 'Falha ao cadastrar a compra.'}`); // Exibe a mensagem específica de erro
        }
    } catch (error) {
        console.error('Erro ao cadastrar compra:', error);
        alert('Ocorreu um erro ao cadastrar a compra. Tente novamente mais tarde.');
    }
});



// Função para mostrar o modal de ver parcelas
async function mostrarModalVerParcelas(compraId) {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`/api/Parcelas/compras/${compraId}/parcelas`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const parcelas = await response.json();

            // Limpa a tabela de parcelas do modal
            const parcelasTableBody = document.getElementById('parcelas-table-body');
            parcelasTableBody.innerHTML = '';

            // Preenche a tabela com as parcelas recebidas
            parcelas.forEach(parcela => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${parcela.id}</td>
                    <td>${new Date(parcela.dataVencimento).toLocaleDateString()}</td>
                    <td>R$ ${parcela.valor.toFixed(2)}</td>
                    <td>${parcela.pago ? 'Sim' : 'Não'}</td>
                    <td>${parcela.pago ? new Date(parcela.dataPagamento).toLocaleDateString() : '---'}</td>
                    <td>R$ ${parcela.pago ? parcela.valorPago.toFixed(2) : '---'}</td>
                `;
                parcelasTableBody.appendChild(row);
            });

            // Exibe o modal de parcelas
            document.getElementById('parcelasModal').style.display = 'block';

        } else {
            const errorData = await response.json();
            alert(errorData.message || 'Erro ao carregar parcelas.');
        }
    } catch (error) {
        console.error('Erro ao carregar parcelas:', error);
        alert('Ocorreu um erro ao carregar as parcelas. Tente novamente mais tarde.');
    }
}

// Função para fechar o modal de parcelas
function fecharModalParcelas() {
    document.getElementById('parcelasModal').style.display = 'none';
}






// Fechar o modal ao clicar no "X" ou no botão "Cancelar"
document.addEventListener('DOMContentLoaded', function () {
    const closeCreateCompraButton = document.querySelector('.close-create-compra');
    const cancelarCadastroCompraButton = document.getElementById('cancelNewCompraBtn');
    const cancelarEdicaoCompraButton = document.getElementById('cancelEditCompraBtn');
    const closeEditCompraButton = document.querySelector('.close-edit-compra');
    const alterarCompraButton = document.getElementById('alterarCompra');
    const novoCompraButton = document.getElementById('novaCompra');

    // Fechar o modal de cadastro ao clicar no "X" ou no botão "Cancelar"
    if (closeCreateCompraButton) {
        closeCreateCompraButton.addEventListener('click', fecharModalCadastroCompra);
    }

    if (cancelarCadastroCompraButton) {
        cancelarCadastroCompraButton.addEventListener('click', fecharModalCadastroCompra);
    }

    // Fechar o modal de edição ao clicar no "X"
    if (closeEditCompraButton) {
        closeEditCompraButton.addEventListener('click', fecharModalEditCompra);
    }

    if (cancelarEdicaoCompraButton) {
        cancelarEdicaoCompraButton.addEventListener('click', fecharModalEditCompra);
    }

    // Mostrar o modal de edição ao clicar em "Alterar" no menu hambúrguer
    if (alterarCompraButton) {
        alterarCompraButton.addEventListener('click', mostrarModalEditCompra);
    }

    if (novoCompraButton) {
        novoCompraButton.addEventListener('click', mostrarModalCadastroCompra);
    }

    carregarClientes(); // Carrega a lista de clientes no modal de cadastro de compra
});

// Chama a função ao carregar a página
window.onload = carregarCompras;



