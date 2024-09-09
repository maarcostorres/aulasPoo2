// Simulação de banco de dados no localStorage
const clientes = JSON.parse(localStorage.getItem('clientes')) || [];

// Referências dos elementos
const registerForm = document.getElementById('register-form');
const clientList = document.getElementById('client-list');

// Função para cadastrar clientes
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('client-name').value;
    const cpf = document.getElementById('cpf').value;
    const limit = document.getElementById('limit').value;
    
    const cliente = { name, cpf, limit, compras: [], parcelas: [], saldoDevedor: 0 };
    clientes.push(cliente);
    localStorage.setItem('clientes', JSON.stringify(clientes));
    renderClientList();
});

// Função para renderizar a lista de clientes
function renderClientList() {
    clientList.innerHTML = '';
    clientes.forEach(cliente => {
        const li = document.createElement('li');
        li.textContent = `${cliente.name} - CPF: ${cliente.cpf} - Limite: R$ ${cliente.limit}`;
        clientList.appendChild(li);
    });
}

// Renderiza a lista de clientes ao carregar a página
document.addEventListener('DOMContentLoaded', renderClientList);
