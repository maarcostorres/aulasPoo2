

// Função para carregar a lista de clientes
async function carregarClientes() {
    const token = localStorage.getItem('token');

    if (!token) {
        alert("Você precisa estar logado para ver os clientes.");
        window.location.href = "admin.html"; // Redireciona se não estiver logado
        return;
    }

    try {
        const response = await fetch('/api/Clientes/listarClientes', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Inclui o token no cabeçalho
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const clientes = await response.json();
            const tableBody = document.querySelector('#clientes-table tbody');

            if (tableBody) {
                tableBody.innerHTML = ''; // Limpa a tabela antes de inserir os dados

                clientes.forEach(cliente => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${cliente.id}</td>
                        <td>${cliente.nome}</td>
                        <td>${cliente.cpf}</td>
                        <td>${cliente.email}</td>
                        <td>${cliente.endereco}</td>
                        <td>${cliente.telefone}</td>
                        <td>${cliente.limiteDeCredito}</td>
                        <td>${cliente.limiteDisponivel}</td>
                        <td>
                            <button onclick="toggleBloqueioCliente(${cliente.id}, ${cliente.bloqueado})">${cliente.bloqueado ? 'Desbloquear' : 'Bloquear'}</button>
                            <button onclick="alterarLimite(${cliente.id})">Alterar Limite</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
            }
        } else {
            const errorData = await response.json();
            alert(errorData.message || 'Erro ao carregar clientes.');
        }
    } catch (error) {
        console.error('Erro ao carregar clientes:', error);
        alert('Ocorreu um erro ao carregar os clientes. Tente novamente mais tarde.');
    }
}

// Função para alternar bloqueio do cliente
async function toggleBloqueioCliente(clienteId, bloqueado) {
    const token = localStorage.getItem('token');
    const url = `/api/Clientes/${bloqueado ? 'desbloquearCliente' : 'bloquearCliente'}/${clienteId}`;

    try {
        const response = await fetch(url, {
            method: 'PUT', // Usa PUT, conforme especificado no endpoint
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            alert(`Cliente ${bloqueado ? 'desbloqueado' : 'bloqueado'} com sucesso!`);
            carregarClientes(); // Recarrega a lista de clientes
        } else {
            const errorData = await response.json();
            alert(errorData.message || 'Erro ao alterar status do cliente.');
        }
    } catch (error) {
        console.error('Erro ao alterar status do cliente:', error);
        alert('Ocorreu um erro ao alterar o status do cliente. Tente novamente mais tarde.');
    }
}

// Função para alterar o limite do cliente
async function alterarLimite(clienteId) {
    const token = localStorage.getItem('token');
    let novoLimite = prompt("Insira o novo limite de crédito:");

    // Valida o valor de novoLimite
    if (novoLimite === null || novoLimite.trim() === '' || isNaN(novoLimite) || parseFloat(novoLimite) < 0) {
        alert("Por favor, insira um valor numérico válido para o limite de crédito.");
        return;
    }

    novoLimite = parseFloat(novoLimite);

    const url = `/api/Clientes/alterarLimite/${clienteId}`;

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ novoLimite }) // Enviando o valor corretamente no corpo da requisição
        });

        if (response.ok) {
            alert('Limite de crédito alterado com sucesso!');
            carregarClientes(); // Recarrega a lista de clientes
        } else {
            const errorData = await response.json();
            alert(errorData.message || 'Erro ao alterar o limite do cliente.');
        }
    } catch (error) {
        console.error('Erro ao alterar o limite do cliente:', error);
        alert('Ocorreu um erro ao alterar o limite do cliente. Tente novamente mais tarde.');
    }
}

// Verifica se o formulário de cadastro está na página antes de adicionar o event listener
const clienteForm = document.getElementById('clienteForm');
if (clienteForm) {
    
document.getElementById('clienteForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const endereco = document.getElementById('endereco').value;
    const telefone = document.getElementById('telefone').value;
    const diaDePagamento = document.getElementById('diaDePagamento').value;

    // Se o limite não for fornecido, ele será zero por padrão
    const limiteDeCredito = parseFloat(document.getElementById('limiteDeCredito').value) || 0;

    const token = localStorage.getItem('token'); // Obtém o token de autenticação, se necessário

    try {
        const response = await fetch('/api/Clientes/cadastrarCliente', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Adiciona o token, se necessário
            },
            body: JSON.stringify({
                nome,
                cpf,
                email,
                senha,
                endereco,
                telefone,
                diaDePagamento,
                limiteDeCredito
            })
        });

        if (response.ok) {
            alert('Cliente cadastrado com sucesso!');
            window.location.href = 'clientes.html'; // Redireciona para a lista de clientes
        } else {
            const errorData = await response.json();
            alert(`Erro: ${errorData.message || 'Falha ao cadastrar o cliente.'}`);
        }
    } catch (error) {
        console.error('Erro ao cadastrar cliente:', error);
        alert('Ocorreu um erro ao cadastrar o cliente. Tente novamente mais tarde.');
    }
});
}

// Chama a função ao carregar a página
window.onload = carregarClientes;


