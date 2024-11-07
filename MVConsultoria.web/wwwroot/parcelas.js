let parcelas = []; // Variável global para armazenar todas as parcelas
let clienteSelecionado = null; // Variável para armazenar o nome do cliente das parcelas selecionadas

// Função para carregar a lista de parcelas
async function carregarParcelas() {
    const token = localStorage.getItem('token');

    if (!token) {
        alert("Você precisa estar logado para ver as parcelas.");
        window.location.href = "admin.html";
        return;
    }

    try {
        const response = await fetch('/api/Parcelas', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            parcelas = await response.json(); // Armazena as parcelas carregadas
            exibirParcelas(parcelas); // Exibe todas as parcelas inicialmente
        } else {
            const errorData = await response.json();
            alert(errorData.message || 'Erro ao carregar parcelas.');
        }
    } catch (error) {
        console.error('Erro ao carregar parcelas:', error);
        alert('Ocorreu um erro ao carregar as parcelas. Tente novamente mais tarde.');
    }
}

// Função para exibir as parcelas na tabela
function exibirParcelas(parcelasFiltradas) {
    const tableBody = document.querySelector('#parcelas-table tbody');

    if (tableBody) {
        tableBody.innerHTML = ''; // Limpa a tabela

        parcelasFiltradas.forEach(parcela => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="checkbox" class="select-parcela" data-id="${parcela.id}" data-cliente="${parcela.nomeCliente}"></td>
                <td>${parcela.id}</td>
                <td>${parcela.nomeCliente || 'N/A'}</td>
                <td>${parcela.compraId || 'N/A'}</td>
                <td>${new Date(parcela.dataVencimento).toLocaleDateString()}</td>
                <td>${parcela.valor ? parcela.valor.toFixed(2) : '0.00'}</td>
                <td>${parcela.pago ? 'Pago' : 'Pendente'}</td>
                <td>${parcela.dataPagamento ? new Date(parcela.dataPagamento).toLocaleDateString() : '-'}</td>
                <td>${parcela.valorPago ? parcela.valorPago.toFixed(2) : '0.00'}</td>
            `;

      
      // Evento de clique para selecionar a linha (fora do checkbox)
      row.addEventListener('click', function (event) {
        if (event.target.tagName !== 'INPUT') {
            // Remove a seleção de todas as outras linhas
            document.querySelectorAll('#parcelas-table tbody tr').forEach(linha => {
                linha.classList.remove('selected-row');
            });
            // Adiciona a classe 'selected-row' à linha clicada
            row.classList.add('selected-row');
        }
    });

    
      
      
            // Evento para manter a seleção ao marcar o checkbox
const checkbox = row.querySelector('.select-parcela');
checkbox.addEventListener('change', function () {
    const clienteAtual = checkbox.dataset.cliente; // Obtém o nome do cliente da parcela

    if (checkbox.checked) {
        // Se a parcela já estiver paga, desmarca o checkbox e exibe um alerta
        if (parcela.pago === true) {
            alert("Não é possível selecionar parcelas que já foram pagas.");
            checkbox.checked = false;
            return; // Encerra a função para não prosseguir com seleção
        }

        // Se não houver clienteSelecionado, armazena o primeiro cliente
        if (!clienteSelecionado) {
            clienteSelecionado = clienteAtual;
        } else if (clienteSelecionado !== clienteAtual) {
            // Se o cliente for diferente, desmarca o checkbox e exibe um alerta
            alert("Não é possível selecionar parcelas de clientes diferentes.");
            checkbox.checked = false;
        }
    } else {
        // Se desmarcar todos os checkboxes, reseta o clienteSelecionado se não houver mais selecionados
        const algumMarcado = Array.from(document.querySelectorAll('.select-parcela:checked')).length > 0;
        if (!algumMarcado) {
            clienteSelecionado = null;
        }
    }
});


            tableBody.appendChild(row);
        });
    }
}

// Função para normalizar a data (ignorando fuso horário e horas)
function normalizarData(data) {
    const novaData = new Date(data);
    novaData.setHours(0, 0, 0, 0); // Define a hora para 00:00:00
    return novaData.toISOString().split('T')[0]; // Retorna no formato 'yyyy-mm-dd'
}

// Função de filtro de parcelas por nome do cliente e data de vencimento
function filtrarParcelas() {
    const nomeCliente = document.getElementById('searchClienteField').value.toLowerCase();
    const dataVencimento = document.getElementById('searchDataField').value;

    const parcelasFiltradas = parcelas.filter(parcela => {
        const nomeMatch = parcela.nomeCliente.toLowerCase().includes(nomeCliente);

        // Normaliza a data de vencimento e a data do filtro
        const dataVencimentoFormatada = normalizarData(parcela.dataVencimento);
        const dataMatch = dataVencimento ? dataVencimentoFormatada === dataVencimento : true;

        return nomeMatch && dataMatch;
    });

    exibirParcelas(parcelasFiltradas);
}

// Função para limpar os filtros e restaurar todas as parcelas
function limparFiltros() {
    clienteSelecionado = null;
    document.getElementById('searchClienteField').value = ''; // Limpa o campo de nome
    document.getElementById('searchDataField').value = ''; // Limpa o campo de data
    exibirParcelas(parcelas); // Exibe todas as parcelas novamente
}

// Adiciona eventos para os campos de busca e o botão de limpar filtros
document.getElementById('searchClienteField').addEventListener('input', filtrarParcelas);
document.getElementById('searchDataField').addEventListener('input', filtrarParcelas);
document.getElementById('limparFiltrosBtn').addEventListener('click', limparFiltros);

document.getElementById('alterarParcela').addEventListener('click', function() {
    // Verificar se há uma linha selecionada

    //deve-se alterar aqui
    const selectedRow = document.querySelector('.selected-row');
    if (!selectedRow) {
        alert('Selecione uma parcela para alterar.');
        return;
    }

    // Obter os dados da parcela da linha selecionada
    const parcelaId = selectedRow.querySelector('.select-parcela').dataset.id;
    const valor = selectedRow.cells[5].innerText; // Coluna Valor
    const dataVencimento = selectedRow.cells[4].innerText;

    // Função para converter "DD/MM/YYYY" para "YYYY-MM-DD"
    function formatarData(data) {
        const partes = data.split('/');
        
        // Verifica se a data tem exatamente 3 partes (dia, mês e ano)
        if (partes.length === 3) {
            const dia = partes[0];
            const mes = partes[1];
            const ano = partes[2];
            
            // Retorna a data no formato "YYYY-MM-DD"
            return `${ano}-${mes}-${dia}`;
        } else {
            return null;  // Retorna nulo se o formato estiver incorreto
        }
    }

    const dataFormatada = formatarData(dataVencimento);

    if (dataFormatada && !isNaN(Date.parse(dataFormatada))) {
        // Se o valor for uma data válida, formata para o campo de data do modal
        document.getElementById('dataVencimentoParcela').value = new Date(dataFormatada).toISOString().split('T')[0];
    } else {
        console.error("Data inválida:", dataVencimento);
        document.getElementById('dataVencimentoParcela').value = '';  // Limpa o campo ou define um valor padrão
    }

    const status = selectedRow.cells[6].innerText === 'Pago' ? 'true' : 'false'; // Coluna Status (Pago ou Pendente)
    document.getElementById('statusParcela').value = status;

    // Preencher o campo de valor do modal
    document.getElementById('valorParcela').value = parseFloat(valor);

    // Exibir o modal
    document.getElementById('modalParcela').style.display = 'block';
});

document.getElementById('saveParcelaBtn').onclick = function(event) {
    event.preventDefault();  // Previne o comportamento padrão do formulário

    const parcelaId = document.querySelector('.selected-row .select-parcela').dataset.id;
    const valor = parseFloat(document.getElementById('valorParcela').value);
    const dataVencimento = document.getElementById('dataVencimentoParcela').value;
    const status = document.getElementById('statusParcela').value === 'true'; // Converte 'true'/'false' para booleano

    alterarParcela(parcelaId, valor, dataVencimento, status);
};

// Chama a função ao carregar a página
//window.onload = carregarParcelas;





async function alterarParcela(id, valor, dataVencimento) {
    const token = localStorage.getItem('token');

    if (!valor || valor <= 0) {
        alert('Por favor, insira um valor válido.');
        return;
    }

    try {
        // Verificar o formato da data antes de enviar
        const dataFormatada = new Date(dataVencimento).toISOString();

        const response = await fetch(`/api/Parcelas/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                //valor: valor,
                dataVencimento: dataFormatada  // Envia a data formatada corretamente
            })
        });

        if (response.ok) {
            alert('Parcela alterada com sucesso!');
            document.getElementById('modalParcela').style.display = 'none';  // Fecha o modal
            carregarParcelas();  // Atualiza a lista de parcelas
        } else {
            const errorData = await response.json();
            alert(errorData.message || 'Falha ao alterar a parcela.');
        }
    } catch (error) {
        console.error('Erro ao alterar parcela:', error);
        alert('Ocorreu um erro ao alterar a parcela. Tente novamente mais tarde.');
    }
}


// Função para exibir o menu hambúrguer
function mostrarMenuHamburguer() {
    const menu = document.getElementById('hamburgerMenu');
    menu.classList.toggle('show');
}

//começa aqui

// este codigo esta funcionando perfeitamente
// Função para exibir o modal com as parcelas selecionadas
async function exibirModalBaixaParcelas() {
    const selecionadas = document.querySelectorAll('.select-parcela:checked');
    const ids = Array.from(selecionadas).map(cb => cb.dataset.id); // IDs das parcelas selecionadas




    if (ids.length === 0) {
        alert('Nenhuma parcela selecionada.');
        return;
    }

    // Calcula o total das parcelas
    const totalParcelas = ids.reduce((acc, id) => {
        const parcela = parcelas.find(p => p.id == id);
        return acc + parcela.valor;
    }, 0);

    // Exibe o total no modal
    document.getElementById('totalParcelasSelecionadas').innerText = `Total das Parcelas: R$ ${totalParcelas.toFixed(2)}`;

    // Exibe as informações das parcelas selecionadas no modal
    const listaParcelas = document.getElementById('listaParcelasSelecionadas');
    listaParcelas.innerHTML = ''; // Limpa a lista anterior
    ids.forEach(id => {
        const parcela = parcelas.find(p => p.id == id);
        listaParcelas.innerHTML += `<li>Parcela ${parcela.id}: R$ ${parcela.valor.toFixed(2)} - Vencimento: ${new Date(parcela.dataVencimento).toLocaleDateString()}</li>`;
    });

    // Salva os IDs das parcelas selecionadas em uma variável global ou atributo do modal
    document.getElementById('modalBaixaParcelas').dataset.parcelasSelecionadas = JSON.stringify(ids);

    // Exibe o modal
    document.getElementById('modalBaixaParcelas').style.display = 'block';
}

// Função para processar a baixa das parcelas
async function processarBaixaParcelas() {
    const valorPagoTotal = parseFloat(document.getElementById('valorPago').value);

    // Recupera os IDs das parcelas selecionadas do modal
    const ids = JSON.parse(document.getElementById('modalBaixaParcelas').dataset.parcelasSelecionadas);

    if (isNaN(valorPagoTotal) || valorPagoTotal <= 0) {
        alert("Por favor, insira um valor válido.");
        return;
    }

    // Calcula o valor a ser pago por cada parcela individualmente
    const totalParcelas = ids.reduce((acc, id) => acc + parcelas.find(p => p.id == id).valor, 0);
    const valorProporcional = valorPagoTotal / totalParcelas;

    // Processa o pagamento para cada parcela selecionada
    for (let id of ids) {
        const parcela = parcelas.find(p => p.id == id);
        const valorParcelaPago = (parcela.valor * valorProporcional).toFixed(2); // Calcula o valor proporcional para a parcela
        await pagarParcela(id, parseFloat(valorParcelaPago));
    }

    // Recarrega as parcelas após a operação
    carregarParcelas();
    // Fecha o modal
    document.getElementById('modalBaixaParcelas').style.display = 'none';
   
}

// Função para pagar uma parcela individualmente
async function pagarParcela(idParcela, valorPago) {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`/api/Parcelas/${idParcela}/pagar?valorPago=${valorPago}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            // Captura a mensagem de confirmação do backend
            const successMessage = await response.text();
            alert(successMessage); // Exibe a mensagem de sucesso para o usuário
            console.log(`Parcela ${idParcela} paga com sucesso: ${successMessage}`);
        } else {
            // Captura a mensagem de erro do backend
            const errorText = await response.text();
            console.error(`Erro ao pagar parcela ${idParcela}:`, errorText);
            alert(`Erro ao pagar parcela ${idParcela}: ${errorText}`);
        }
    } catch (error) {
        console.error('Erro ao pagar parcela:', error);
        alert('Ocorreu um erro ao pagar a parcela. Tente novamente mais tarde.');
    }
}

// Evento para exibir o modal ao clicar em "Baixar Parcelas Selecionadas"
document.getElementById('baixarParcelasSelecionadas').addEventListener('click', function() {
    exibirModalBaixaParcelas();  // Exibe o modal com as parcelas selecionadas
});

// Adiciona o evento de clique para o botão "Confirmar Pagamento" no modal
document.getElementById('confirmarPagamentoBtn').addEventListener('click', function() {
    processarBaixaParcelas();  // Processa o pagamento das parcelas selecionadas
});

document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.querySelector(".sidebar");
    const hamburgerMenu = document.getElementById("hamburgerMenu");

    // Clique no menu hamburger para mostrar ou esconder sidebar
    hamburgerMenu.addEventListener("click", function () {
        sidebar.classList.toggle("hidden");
    });

    // Função de logout
    document.getElementById('logoutLink').addEventListener('click', function(event) {
        event.preventDefault();
        logout();
    });
});






// Chama a função ao carregar a página
window.onload = carregarParcelas;
