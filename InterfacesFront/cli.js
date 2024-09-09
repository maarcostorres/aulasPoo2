// Geração dos gráficos usando Chart.js
const ctx1 = document.getElementById('chart1').getContext('2d');
const ctx2 = document.getElementById('chart2').getContext('2d');

const chart1 = new Chart(ctx1, {
    type: 'doughnut',
    data: {
        labels: ['Usado', 'Disponível'],
        datasets: [{
            data: [1000, 1000],
            backgroundColor: ['#6056F5', '#A7BBF5'],
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false
    }
});

const chart2 = new Chart(ctx2, {
    type: 'doughnut',
    data: {
        labels: ['Saldo Devedor', 'Limite Disponível'],
        datasets: [{
            data: [0, 2000],
            backgroundColor: ['#452EF7', '#A7BBF5'],
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false
    }
});

// Função para alternar a visibilidade do gráfico
function toggleChart(chartId) {
    const container = document.getElementById(`chart-container-${chartId === 'chart1' ? 1 : 2}`);
    const button = container.querySelector('.toggle-chart');
    
    if (container.classList.contains('minimized')) {
        container.classList.remove('minimized');
        button.textContent = '⬇';
    } else {
        container.classList.add('minimized');
        button.textContent = '⬆';
    }
}
