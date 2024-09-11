// Simulando dados dos cenários
const clientes = {
    matheus: {
        nome: "Matheus Martinelli",
        cpf: "123.456.789-01",
        endereco: "Rua Henrique Laranja, 44",
        telefone: "(27) 99668-9530",
        saldoDevedor: 0,
        limiteDisponivel: 600,
        historicoCompras: [
            "Compra 1: R$ 800,00 (4x de R$ 200,00)",
            "Compra 2: R$ 600,00 (3x de R$ 200,00)"
        ],
        proximasParcelas: [
            "R$ 200,00 - Parcela 2 de 4 (Compra 1)",
            "R$ 200,00 - Parcela 1 de 3 (Compra 2)"
        ]
    },
    helena: {
        nome: "Helena Silveira",
        cpf: "109.876.543-21",
        endereco: "Rua Quinze de Novembro, 012",
        telefone: "(27) 99759-5482",
        saldoDevedor: 1200,
        limiteDisponivel: 0,
        historicoCompras: [
            "Compra: R$ 1.200,00 (4x de R$ 300,00)"
        ],
        proximasParcelas: [
            "R$ 300,00 - Parcela 2 atrasada (Compra)"
        ]
    }
};

// Função de login que exibe informações do cliente
function login() {
    const usuario = document.querySelector('input[placeholder="Usuário"]').value.toLowerCase();
    if (clientes[usuario]) {
        const cliente = clientes[usuario];
        document.getElementById('client-name').textContent = cliente.nome;
        document.getElementById('info-nome').textContent = cliente.nome;
        document.getElementById('info-cpf').textContent = cliente.cpf;
        document.getElementById('info-endereco').textContent = cliente.endereco;
        document.getElementById('info-telefone').textContent = cliente.telefone;

        // Atualiza os gráficos com os dados do cliente
        updateSaldoChart(cliente.saldoDevedor, cliente.limiteDisponivel);
        updateLimiteChart(cliente.limiteDisponivel);

        // Atualiza o histórico de compras
        const historicoList = document.getElementById('historico-compras');
        historicoList.innerHTML = cliente.historicoCompras.map(compra => `<li>${compra}</li>`).join('');

        // Atualiza as próximas parcelas
        const parcelasList = document.getElementById('proximas-parcelas');
        parcelasList.innerHTML = cliente.proximasParcelas.map(parcela => `<li>${parcela}</li>`).join('');

        // Exibe a área do cliente
        document.getElementById('client-info').classList.remove('hidden');
    } else {
        alert("Cliente não encontrado!");
    }
}

// Função para alternar a visibilidade das seções
function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    const button = section.querySelector('.toggle-section');
    
    // Alterna entre esconder e mostrar o conteúdo da seção
    const content = section.querySelector('.section-content');
    if (content.style.display === 'none') {
        content.style.display = 'block';
        button.textContent = '⬇';
    } else {
        content.style.display = 'none';
        button.textContent = '⬆';
    }
}

// Função para atualizar o gráfico de saldo devedor
function updateSaldoChart(saldoDevedor, limiteDisponivel) {
    const ctx = document.getElementById('saldoChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Saldo Devedor', 'Limite Disponível'],
            datasets: [{
                data: [saldoDevedor, limiteDisponivel],
                backgroundColor: ['#FF5C5C', '#56F595'],
            }]
        },
        options: {
            responsive: false,  // Mantém o tamanho fixo do gráfico
            maintainAspectRatio: false
        }
    });
}

// Função para atualizar o gráfico de limite de crédito disponível
function updateLimiteChart(limiteDisponivel) {
    const ctx = document.getElementById('limiteChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Utilizado', 'Disponível'],
            datasets: [{
                data: [2000 - limiteDisponivel, limiteDisponivel],
                backgroundColor: ['#6056F5', '#A7BBF5'],
            }]
        },
        options: {
            responsive: false,  // Mantém o tamanho fixo do gráfico
            maintainAspectRatio: false
        }
    });
}
