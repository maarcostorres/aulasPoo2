/*

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

*/

// Função para carregar a lista de clientes
/*async function carregarClientes() {
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

                    // Adiciona o evento de clique para selecionar a linha
                    row.addEventListener('click', function () {
                        // Remove a seleção de qualquer linha previamente selecionada
                        document.querySelectorAll('#clientes-table tbody tr').forEach(linha => {
                            linha.classList.remove('selected-row');
                        });

                        // Adiciona a classe 'selected-row' à linha clicada
                        row.classList.add('selected-row');
                    });
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

// Selecionar cliente para edição
let clienteSelecionado = null;

// Mostrar modal ao clicar em "Alterar" no menu hambúrguer
document.getElementById('alterarCliente').addEventListener('click', function () {
    if (!clienteSelecionado) {
        alert('Por favor, selecione um cliente primeiro.');
        return;
    }

    // Exibe o modal
    document.getElementById('editModal').style.display = "block";

    // Carregar os dados do cliente selecionado no formulário
    document.getElementById('editNome').value = clienteSelecionado.nome;
    document.getElementById('editCpf').value = clienteSelecionado.cpf;
    document.getElementById('editEmail').value = clienteSelecionado.email;
    document.getElementById('editEndereco').value = clienteSelecionado.endereco;
    document.getElementById('editTelefone').value = clienteSelecionado.telefone;
    document.getElementById('editLimiteDeCredito').value = clienteSelecionado.limiteDeCredito;
});

// Fechar o modal ao clicar no "X"
document.querySelector('.close').addEventListener('click', function () {
    document.getElementById('editModal').style.display = "none";
});

// Captura o cliente selecionado ao clicar na linha da tabela
document.querySelectorAll('#clientes-table tbody tr').forEach(row => {
    row.addEventListener('click', function () {
        // Obtenha o cliente da linha selecionada
        const clienteId = this.cells[0].textContent; // O ID do cliente está na primeira célula
        clienteSelecionado = {
            id: clienteId,
            nome: this.cells[1].textContent,
            cpf: this.cells[2].textContent,
            email: this.cells[3].textContent,
            endereco: this.cells[4].textContent,
            telefone: this.cells[5].textContent,
            limiteDeCredito: this.cells[6].textContent
        };
    });
});

// Função para salvar as alterações do cliente
document.getElementById('saveClientBtn').addEventListener('click', async function () {
    const token = localStorage.getItem('token');
    const url = `/api/Clientes/alterarCliente/${clienteSelecionado.id}`;

    const updatedClient = {
        nome: document.getElementById('editNome').value,
        cpf: document.getElementById('editCpf').value,
        email: document.getElementById('editEmail').value,
        endereco: document.getElementById('editEndereco').value,
        telefone: document.getElementById('editTelefone').value,
        limiteDeCredito: document.getElementById('editLimiteDeCredito').value
    };

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedClient)
        });

        if (response.ok) {
            alert('Cliente atualizado com sucesso!');
            document.getElementById('editModal').style.display = "none";
            carregarClientes(); // Recarregar a lista de clientes
        } else {
            const errorData = await response.json();
            alert(errorData.message || 'Erro ao atualizar cliente.');
        }
    } catch (error) {
        console.error('Erro ao atualizar cliente:', error);
        alert('Ocorreu um erro ao atualizar o cliente. Tente novamente mais tarde.');
    }
});


// Chama a função ao carregar a página
window.onload = carregarClientes;*/

/*// Variável global para armazenar o cliente selecionado
let clienteSelecionado = null;

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
            const clientes = await response.json();
            const tableBody = document.querySelector('#clientes-table tbody');

            if (tableBody) {
                tableBody.innerHTML = ''; // Limpa a tabela

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
                            <button onclick="toggleBloqueioCliente(${cliente.id}, ${cliente.bloqueado})">
                                ${cliente.bloqueado ? 'Desbloquear' : 'Bloquear'}
                            </button>
                            <button onclick="alterarLimite(${cliente.id})">Alterar Limite</button>
                        </td>
                    `;
                    tableBody.appendChild(row);

                    // Evento de clique para selecionar o cliente
                    row.addEventListener('click', function () {
                        // Remove seleção anterior
                        document.querySelectorAll('#clientes-table tbody tr').forEach(linha => {
                            linha.classList.remove('selected-row');
                        });
                        row.classList.add('selected-row'); // Adiciona classe de seleção

                        // Define o cliente selecionado para edição
                        clienteSelecionado = cliente;
                    });
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

// Função para mostrar o modal
function mostrarModal() {
    if (!clienteSelecionado) {
        alert('Por favor, selecione um cliente primeiro.');
        return;
    }

    // Exibe o modal
    document.getElementById('editModal').style.display = 'block';

    // Carregar os dados do cliente selecionado no formulário
    document.getElementById('editNome').value = clienteSelecionado.nome;
    document.getElementById('editCpf').value = clienteSelecionado.cpf;
    document.getElementById('editEmail').value = clienteSelecionado.email;
    document.getElementById('editEndereco').value = clienteSelecionado.endereco;
    document.getElementById('editTelefone').value = clienteSelecionado.telefone;
    document.getElementById('editLimiteDeCredito').value = clienteSelecionado.limiteDeCredito;
}




// Função para salvar as alterações do cliente
document.getElementById('saveClientBtn').addEventListener('click', async function () {
    if (!clienteSelecionado) return;

    const token = localStorage.getItem('token');
    const url = `/api/Clientes/atualizarCliente/${clienteSelecionado.id}`;

    // Inclua o campo Senha no corpo da requisição
    const updatedClient = {
        id: clienteSelecionado.id,
        nome: document.getElementById('editNome').value,
        cpf: document.getElementById('editCpf').value,
        email: document.getElementById('editEmail').value,
        endereco: document.getElementById('editEndereco').value,
        telefone: document.getElementById('editTelefone').value,
        limiteDeCredito: parseFloat(document.getElementById('editLimiteDeCredito').value),
        senha: document.getElementById('editSenha').value // Adicionando a senha
    };

    try {
        // Primeira chamada: Atualizar os dados do cliente
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedClient)
        });

        if (response.ok) {
            // Segunda chamada: Ajustar o limite após a atualização
            const limiteUrl = `/api/Clientes/alterarLimite/${clienteSelecionado.id}`;
            const limiteDto = { NovoLimite: updatedClient.limiteDeCredito };

            const limiteResponse = await fetch(limiteUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(limiteDto)
            });

            if (limiteResponse.ok) {
                alert('Cliente atualizado com sucesso e limite recalculado!');
                document.getElementById('editModal').style.display = 'none'; // Fecha o modal
                carregarClientes(); // Recarrega a lista de clientes
            } else {
                const errorData = await limiteResponse.json();
                alert(errorData.message || 'Erro ao ajustar o limite do cliente.');
            }
        } else {
            const errorData = await response.json();
            console.error('Erro ao atualizar cliente:', errorData);
            alert(errorData.message || 'Erro ao atualizar cliente.');
        }
    } catch (error) {
        console.error('Erro ao atualizar cliente:', error);
        alert('Ocorreu um erro ao atualizar o cliente. Tente novamente mais tarde.');
    }
});



// Mostrar modal ao clicar em "Alterar" no menu hambúrguer
document.getElementById('alterarCliente').addEventListener('click', mostrarModal);

// Fechar o modal ao clicar no "X"
document.querySelector('.close').addEventListener('click', function () {
    document.getElementById('editModal').style.display = 'none';
});

// Chama a função ao carregar a página
window.onload = carregarClientes;
*/



/*// Função para mostrar o modal
function mostrarModal() {
    if (!clienteSelecionado) {
        alert('Por favor, selecione um cliente primeiro.');
        return;
    }

    // Exibe o modal
    document.getElementById('editModal').style.display = 'block';

    // Carregar os dados do cliente selecionado no formulário
    document.getElementById('editNome').value = clienteSelecionado.nome;
    document.getElementById('editCpf').value = clienteSelecionado.cpf;
    document.getElementById('editEmail').value = clienteSelecionado.email;
    document.getElementById('editEndereco').value = clienteSelecionado.endereco;
    document.getElementById('editTelefone').value = clienteSelecionado.telefone;
    document.getElementById('editLimiteDeCredito').value = clienteSelecionado.limiteDeCredito;
}

// Função para salvar as alterações do cliente
document.getElementById('saveClientBtn').addEventListener('click', async function () {
    if (!clienteSelecionado) return;

    const token = localStorage.getItem('token');
    const url = `/api/Clientes/atualizarCliente/${clienteSelecionado.id}`;

    // Inclua o campo Senha no corpo da requisição
    const updatedClient = {
        id: clienteSelecionado.id,
        nome: document.getElementById('editNome').value,
        cpf: document.getElementById('editCpf').value,
        email: document.getElementById('editEmail').value,
        endereco: document.getElementById('editEndereco').value,
        telefone: document.getElementById('editTelefone').value,
        limiteDeCredito: parseFloat(document.getElementById('editLimiteDeCredito').value),
        senha: document.getElementById('editSenha').value // Adicionando a senha
    };

    try {
        // Primeira chamada: Atualizar os dados do cliente
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedClient)
        });

        if (response.ok) {
            // Segunda chamada: Ajustar o limite após a atualização
            const limiteUrl = `/api/Clientes/alterarLimite/${clienteSelecionado.id}`;
            const limiteDto = { NovoLimite: updatedClient.limiteDeCredito };

            const limiteResponse = await fetch(limiteUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(limiteDto)
            });

            if (limiteResponse.ok) {
                alert('Cliente atualizado com sucesso e limite recalculado!');
                document.getElementById('editModal').style.display = 'none'; // Fecha o modal
                carregarClientes(); // Recarrega a lista de clientes
            } else {
                const errorData = await limiteResponse.json();
                alert(errorData.message || 'Erro ao ajustar o limite do cliente.');
            }
        } else {
            const errorData = await response.json();
            console.error('Erro ao atualizar cliente:', errorData);
            alert(errorData.message || 'Erro ao atualizar cliente.');
        }
    } catch (error) {
        console.error('Erro ao atualizar cliente:', error);
        alert('Ocorreu um erro ao atualizar o cliente. Tente novamente mais tarde.');
    }
});
*/




/*// Fechar o modal ao clicar no "X"
document.querySelector('.close').addEventListener('click', function () {
    document.getElementById('createClientModal').style.display = 'none';
});*/


/*
// Função para salvar o novo cliente
document.getElementById('saveNewClientBtn').addEventListener('click', async function () {
    const nome = document.getElementById('createNome').value;
    const cpf = document.getElementById('createCpf').value;
    const email = document.getElementById('createEmail').value;
    const senha = document.getElementById('createSenha').value;
    const endereco = document.getElementById('createEndereco').value;
    const telefone = document.getElementById('createTelefone').value;
    const limiteDeCredito = parseFloat(document.getElementById('createLimiteDeCredito').value) || 0;

    const token = localStorage.getItem('token');

   


    try {
        const response = await fetch('/api/Clientes/cadastrarCliente', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                nome,
                cpf,
                email,
                senha,
                endereco,
                telefone,
                limiteDeCredito
            })
        });

        if (response.ok) {
            alert('Cliente cadastrado com sucesso!');
            document.getElementById('createClientModal').style.display = 'none';
            carregarClientes(); // Atualiza a lista de clientes
        } else {
            const errorData = await response.json();
            alert(`Erro: ${errorData.message || 'Falha ao cadastrar o cliente.'}`);
        }
    } catch (error) {
        console.error('Erro ao cadastrar cliente:', error);
        alert('Ocorreu um erro ao cadastrar o cliente. Tente novamente mais tarde.');
    }
});
*/

/*// Verifica se o formulário de cadastro está na página antes de adicionar o event listener
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
}*/


/*// Função para cadastrar um novo cliente
const clienteForm = document.getElementById('clienteForm');
if (clienteForm) {
    clienteForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        const nome = document.getElementById('nome').value;
        const cpf = document.getElementById('cpf').value;
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        const endereco = document.getElementById('endereco').value;
        const telefone = document.getElementById('telefone').value;
        const diaDePagamento = document.getElementById('diaDePagamento').value;

        const limiteDeCredito = parseFloat(document.getElementById('limiteDeCredito').value) || 0;

        const token = localStorage.getItem('token'); // Obtém o token de autenticação

        try {
            const response = await fetch('/api/Clientes/cadastrarCliente', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
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
}*/

/*// Função para abrir o modal de cadastro de cliente
function mostrarModalCadastro() {
    document.getElementById('createClientModal').style.display = 'block';
}

// Fechar o modal ao clicar no "X"
document.querySelector('.close-create').addEventListener('click', function () {
    document.getElementById('createClientModal').style.display = 'none';
});

// Mostrar modal de cadastro ao clicar no botão "Novo" no menu hambúrguer
document.getElementById('novoCliente').addEventListener('click', mostrarModalCadastro);


// Função para fechar o modal de cadastro
function fecharModalCadastro() {
    document.getElementById('createClientModal').style.display = 'none';
}

// Mostrar modal ao clicar em "Alterar" no menu hambúrguer
document.getElementById('alterarCliente').addEventListener('click', mostrarModal);


// Função para fechar o modal de cadastro
function fecharModalEdit() {
    document.getElementById('editModal').style.display = 'none';
}

// Fechar o modal ao clicar no "X"
document.querySelector('.close').addEventListener('click', function () {
    document.getElementById('editModal').style.display = 'none';
});*/
/*
// Função para abrir o modal de cadastro de cliente
function mostrarModalCadastro() {
    document.getElementById('createClientModal').style.display = 'block';
}

// Função para fechar o modal de cadastro
function fecharModalCadastro() {
    document.getElementById('createClientModal').style.display = 'none';
}

// Função para fechar o modal de edição
function fecharModalEdit() {
    document.getElementById('editModal').style.display = 'none';
}*/
/*
// Verifica se os elementos existem antes de adicionar os event listeners
document.addEventListener('DOMContentLoaded', function () {
    
    const closeCreateButton = document.querySelector('.close-create');
    const novoClienteButton = document.getElementById('novoCliente');
    //const closeEditButton = document.querySelector('.close');
    const cancelarCadastroButton = document.getElementById('cancelNewClientBtn');
    //const alterarClienteButton = document.getElementById('alterarCliente');

    // Fechar o modal de cadastro ao clicar no "X" ou no botão "Cancelar"
    if (closeCreateButton) {
        closeCreateButton.addEventListener('click', fecharModalCadastro);
    }

    if (cancelarCadastroButton) {
        cancelarCadastroButton.addEventListener('click', fecharModalCadastro);
    }

    // Mostrar modal de cadastro ao clicar no botão "Novo" no menu hambúrguer
    if (novoClienteButton) {
        novoClienteButton.addEventListener('click', mostrarModalCadastro);
    }
*/
    /*// Fechar o modal de edição ao clicar no "X"
    if (closeEditButton) {
        closeEditButton.addEventListener('click', fecharModalEdit);
    }

    // Mostrar modal de edição ao clicar no botão "Alterar" no menu hambúrguer
    if (alterarClienteButton) {
        alterarClienteButton.addEventListener('click', mostrarModal);
    }*//*
});

// Fechar o modal ao clicar no "X" ou no botão "Cancelar" no modal de edição
document.addEventListener('DOMContentLoaded', function () {
    const closeEditButton = document.querySelector('.close');
    const alterarClienteButton = document.getElementById('alterarCliente');

    // Fechar o modal de edição ao clicar no "X"
    if (closeEditButton) {
        closeEditButton.addEventListener('click', function () {
            document.getElementById('editModal').style.display = 'none';
        });
    }

    // Mostrar o modal de edição ao clicar em "Alterar" no menu hambúrguer
    if (alterarClienteButton) {
        alterarClienteButton.addEventListener('click', mostrarModal);
    }
});
*/

// Variável global para armazenar o cliente selecionado
//let clienteSelecionado = null;
// Variável global para armazenar o cliente selecionado
let clienteSelecionado = null;

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
            const clientes = await response.json();
            const tableBody = document.querySelector('#clientes-table tbody');

            if (tableBody) {
                tableBody.innerHTML = ''; // Limpa a tabela

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
                            <button onclick="toggleBloqueioCliente(${cliente.id}, ${cliente.bloqueado})">
                                ${cliente.bloqueado ? 'Desbloquear' : 'Bloquear'}
                            </button>
                            <button onclick="alterarLimite(${cliente.id})">Alterar Limite</button>
                        </td>
                    `;
                    tableBody.appendChild(row);

                    // Evento de clique para selecionar o cliente
                    row.addEventListener('click', function () {
                        // Remove seleção anterior
                        document.querySelectorAll('#clientes-table tbody tr').forEach(linha => {
                            linha.classList.remove('selected-row');
                        });
                        row.classList.add('selected-row'); // Adiciona classe de seleção

                        // Define o cliente selecionado para edição
                        clienteSelecionado = cliente;
                    });
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


// Função para mostrar o modal de cadastro de cliente
function mostrarModalCadastro() {
    document.getElementById('createClientModal').style.display = 'block';
}

// Função para fechar o modal de cadastro
function fecharModalCadastro() {
    document.getElementById('createClientModal').style.display = 'none';
}

// Função para mostrar o modal de edição de cliente
function mostrarModalEdit() {
    if (!clienteSelecionado) {
        alert('Por favor, selecione um cliente primeiro.');
        return;
    }

    // Exibe o modal de edição
    document.getElementById('editModal').style.display = 'block';

    // Carregar os dados do cliente selecionado no formulário de edição
    document.getElementById('editNome').value = clienteSelecionado.nome;
    document.getElementById('editCpf').value = clienteSelecionado.cpf;
    document.getElementById('editEmail').value = clienteSelecionado.email;
    document.getElementById('editEndereco').value = clienteSelecionado.endereco;
    document.getElementById('editTelefone').value = clienteSelecionado.telefone;
    document.getElementById('editLimiteDeCredito').value = clienteSelecionado.limiteDeCredito;
}

// Função para fechar o modal de edição
function fecharModalEdit() {
    document.getElementById('editModal').style.display = 'none';
}

// Função para salvar as alterações do cliente
document.getElementById('saveClientBtn').addEventListener('click', async function () {
    if (!clienteSelecionado) return;

    const token = localStorage.getItem('token');
    const url = `/api/Clientes/atualizarCliente/${clienteSelecionado.id}`;

    const updatedClient = {
        id: clienteSelecionado.id,
        nome: document.getElementById('editNome').value,
        cpf: document.getElementById('editCpf').value,
        email: document.getElementById('editEmail').value,
        endereco: document.getElementById('editEndereco').value,
        telefone: document.getElementById('editTelefone').value,
        limiteDeCredito: parseFloat(document.getElementById('editLimiteDeCredito').value),
        senha: document.getElementById('editSenha').value // Incluindo a senha
    };

    try {
        // Primeira chamada: Atualizar os dados do cliente
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedClient)
        });

        if (response.ok) {
            // Segunda chamada: Ajustar o limite após a atualização
            const limiteUrl = `/api/Clientes/alterarLimite/${clienteSelecionado.id}`;
            const limiteDto = { NovoLimite: updatedClient.limiteDeCredito };

            const limiteResponse = await fetch(limiteUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(limiteDto)
            });

            if (limiteResponse.ok) {
                alert('Cliente atualizado com sucesso e limite recalculado!');
                document.getElementById('editModal').style.display = 'none'; // Fecha o modal de edição
                carregarClientes(); // Recarrega a lista de clientes
            } else {
                const errorData = await limiteResponse.json();
                alert(errorData.message || 'Erro ao ajustar o limite do cliente.');
            }
        } else {
            const errorData = await response.json();
            console.error('Erro ao atualizar cliente:', errorData);
            alert(errorData.message || 'Erro ao atualizar cliente.');
        }
    } catch (error) {
        console.error('Erro ao atualizar cliente:', error);
        alert('Ocorreu um erro ao atualizar o cliente. Tente novamente mais tarde.');
    }
});

// Função para salvar o novo cliente
document.getElementById('saveNewClientBtn').addEventListener('click', async function () {
    const nome = document.getElementById('createNome').value;
    const cpf = document.getElementById('createCpf').value;
    const email = document.getElementById('createEmail').value;
    const senha = document.getElementById('createSenha').value;
    const endereco = document.getElementById('createEndereco').value;
    const telefone = document.getElementById('createTelefone').value;
    const limiteDeCredito = parseFloat(document.getElementById('createLimiteDeCredito').value) || 0;

    const token = localStorage.getItem('token');

    try {
        const response = await fetch('/api/Clientes/cadastrarCliente', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                nome,
                cpf,
                email,
                senha,
                endereco,
                telefone,
                limiteDeCredito
            })
        });

        if (response.ok) {
            alert('Cliente cadastrado com sucesso!');
            document.getElementById('createClientModal').style.display = 'none';
            carregarClientes(); // Atualiza a lista de clientes
        } else {
            const errorData = await response.json();
            alert(`Erro: ${errorData.message || 'Falha ao cadastrar o cliente.'}`);
        }
    } catch (error) {
        console.error('Erro ao cadastrar cliente:', error);
        alert('Ocorreu um erro ao cadastrar o cliente. Tente novamente mais tarde.');
    }
});

// Fechar o modal ao clicar no "X" ou no botão "Cancelar"
document.addEventListener('DOMContentLoaded', function () {
    const closeCreateButton = document.querySelector('.close-create');
    const cancelarCadastroButton = document.getElementById('cancelNewClientBtn');
    const closeEditButton = document.querySelector('.close');
    const alterarClienteButton = document.getElementById('alterarCliente');
    const novoClienteButton = document.getElementById('novoCliente');

    // Fechar o modal de cadastro ao clicar no "X" ou no botão "Cancelar"
    if (closeCreateButton) {
        closeCreateButton.addEventListener('click', fecharModalCadastro);
    }

    if (cancelarCadastroButton) {
        cancelarCadastroButton.addEventListener('click', fecharModalCadastro);
    }

    // Fechar o modal de edição ao clicar no "X"
    if (closeEditButton) {
        closeEditButton.addEventListener('click', fecharModalEdit);
    }

    // Mostrar o modal de edição ao clicar em "Alterar" no menu hambúrguer
    if (alterarClienteButton) {
        alterarClienteButton.addEventListener('click', mostrarModalEdit);
    }

    if (novoClienteButton) {
        novoClienteButton.addEventListener('click', mostrarModalCadastro);
    }
});

// Chama a função ao carregar a página
window.onload = carregarClientes;


// Chama a função ao carregar a página
//window.onload = carregarClientes;
