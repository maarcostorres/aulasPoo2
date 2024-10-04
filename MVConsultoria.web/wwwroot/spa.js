let dataVencimento;
let diaDoVencimento;

document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacao();
});

function verificarAutenticacao() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = "index.html"; // Redireciona para a página de login
        return;
    }

    const userId = obterUserIdDoToken(token);
    if (!userId) {
        alert("Token inválido. Por favor, faça o login novamente.");
        window.location.href = "index.html";
        return;
    }

    carregarDadosCliente(userId, token);
}

function obterUserIdDoToken(token) {
    try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        return decoded.nameid || decoded.sub;
    } catch (error) {
        console.error('Erro ao decodificar o token:', error);
        return null;
    }
}

/*async function carregarDadosCliente(userId, token) {
    try {
        const clienteResponse = await fetch(`/api/Clientes/localizarCliente/${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!clienteResponse.ok) throw new Error('Erro ao buscar informações do cliente.');

        const clienteData = await clienteResponse.json();

        //alterado aqui
        dataVencimento = new Date(clienteData.diaDePagamento);
        diaDoVencimento = dataVencimento.getDate(); // Pega apenas o dia

        const parcelasResponse = await fetch(`/api/Parcelas/cliente/${userId}/todas-parcelas`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!parcelasResponse.ok) throw new Error('Erro ao buscar parcelas do cliente.');

        const parcelas = await parcelasResponse.json();

        if (!parcelas || !Array.isArray(parcelas)) {
            throw new Error('As parcelas do cliente não foram carregadas corretamente.');
        }

        exibirInformacoesPessoais(clienteData);
        exibirHistoricoCompras(clienteData, token); // Adicionando token aqui
        exibirParcelas(parcelas, clienteData.diaDePagamento);
        atualizarGraficoLimite(clienteData.limiteDeCredito, clienteData.limiteDisponivel);
    } catch (error) {
        console.error('Erro ao carregar dados do cliente:', error);
        alert('Ocorreu um erro ao carregar suas informações.');
    }
}*/
async function carregarDadosCliente(userId, token) {
    try {
        const clienteResponse = await fetch(`/api/Clientes/localizarCliente/${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!clienteResponse.ok) throw new Error('Erro ao buscar informações do cliente.');

        const clienteData = await clienteResponse.json();

        dataVencimento = new Date(clienteData.diaDePagamento);
        diaDoVencimento = dataVencimento.getDate(); // Pega apenas o dia

        // Tenta carregar as parcelas, mas trata o erro 404 como um cenário sem parcelas
        let parcelas = [];
        try {
            const parcelasResponse = await fetch(`/api/Parcelas/cliente/${userId}/todas-parcelas`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (parcelasResponse.ok) {
                parcelas = await parcelasResponse.json();
            } else if (parcelasResponse.status === 404) {
                console.warn('Nenhuma parcela encontrada para o cliente.');
            } else {
                throw new Error('Erro ao buscar parcelas do cliente.');
            }
        } catch (error) {
            console.error('Erro ao carregar parcelas:', error);
            alert('Erro ao carregar parcelas. Continuando com os demais dados.');
        }

        // Tenta carregar as compras, mas trata o erro 404 como um cenário sem compras
        let compras = [];
        try {
            const comprasResponse = await fetch(`/api/Compras/cliente/${clienteData.id}/compras`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (comprasResponse.ok) {
                compras = await comprasResponse.json();
            } else if (comprasResponse.status === 404) {
                console.warn('Nenhuma compra encontrada para o cliente.');
            } else {
                throw new Error('Erro ao buscar compras do cliente.');
            }
        } catch (error) {
            console.error('Erro ao carregar compras:', error);
            alert('Erro ao carregar compras. Continuando com os demais dados.');
        }

        // Certifique-se de que a função está definida corretamente e visível
        exibirInformacoesPessoais(clienteData);
        atualizarGraficoLimite(clienteData.limiteDeCredito, clienteData.limiteDisponivel);

        // Exibe as compras e parcelas, mesmo que estejam vazias
        exibirHistoricoCompras(compras);
        exibirParcelas(parcelas, clienteData.diaDePagamento);

    } catch (error) {
        console.error('Erro ao carregar dados do cliente:', error);
        alert('Ocorreu um erro ao carregar suas informações.');
    }
}

// Definindo a função 'exibirInformacoesPessoais' para garantir que ela esteja disponível
function exibirInformacoesPessoais(cliente) {
    document.getElementById('client-name').textContent = cliente.nome;
    document.getElementById('info-nome').textContent = cliente.nome;
    document.getElementById('info-cpf').textContent = cliente.cpf;
    document.getElementById('info-endereco').textContent = cliente.endereco;
    document.getElementById('info-telefone').textContent = cliente.telefone;
    document.getElementById('info-vencimento').textContent = diaDoVencimento;
}
/*function exibirHistoricoCompras(cliente, token) {
    const historicoList = document.getElementById('historico-compras');
    historicoList.innerHTML = '';

    fetch(`/api/Compras/cliente/${cliente.id}/compras`, {
        headers: { 'Authorization': `Bearer ${token}` }  // Passando token no cabeçalho
    })
        .then(response => {
            if (!response.ok) throw new Error(`Erro ao buscar compras. Status: ${response.status}`);
            return response.json();
        })
        .then(compras => {
            if (compras.length > 0) {
                compras.forEach(compra => {
                    const li = document.createElement('li');
                    //const dataCompra = new Date(compra.data); // Cria um objeto Date a partir da data da compra
                    //const dataFormatada = `${dataCompra.getDate().toString().padStart(2, '0')}/${(dataCompra.getMonth() + 1).toString().padStart(2, '0')}/${dataCompra.getFullYear()}`; // Formata a data como dd/mm/aaaa
                    //li.textContent = `Data da Compra: ${dataFormatada} - Valor: R$ ${compra.valorTotal} - Parcelas: ${compra.quantidadeParcelas}`;

                    if (compra.dataCompra) {
                        const dataCompra = new Date(compra.dataCompra);
                    
                        if (!isNaN(dataCompra.getTime())) {
                            const dataFormatada = `${dataCompra.getDate().toString().padStart(2, '0')}/${(dataCompra.getMonth() + 1).toString().padStart(2, '0')}/${dataCompra.getFullYear()}`;
                            li.textContent = `Data da Compra: ${dataFormatada} - Valor: R$ ${compra.valorTotal.toFixed(2)} - Parcelas: ${compra.quantidadeParcelas}`;
                        } else {
                            li.textContent = `Data inválida - Valor: R$ ${compra.valorTotal.toFixed(2)} - Parcelas: ${compra.quantidadeParcelas}`;
                        }
                    } else {
                        li.textContent = `Sem data disponível - Valor: R$ ${compra.valorTotal.toFixed(2)} - Parcelas: ${compra.quantidadeParcelas}`;
                    }
                    

                    //li.textContent = `Data da Compra: ${compra.data} - Valor: R$ ${compra.valorTotal} - Parcelas: ${compra.quantidadeParcelas}`;
                    historicoList.appendChild(li);
                });
            } else {
                historicoList.innerHTML = '<li>Nenhuma compra encontrada.</li>';
            }
        })
        .catch(error => {
            console.error('Erro ao exibir histórico de compras:', error);
            alert('Ocorreu um erro ao carregar o histórico de compras.');
        });
}*/
/*function exibirHistoricoCompras(compras) {
    const historicoList = document.getElementById('historico-compras');
    historicoList.innerHTML = ''; // Limpa a lista

    if (compras.length === 0) {
        historicoList.innerHTML = '<li>Nenhuma compra encontrada.</li>';
        return;
    }

    compras.forEach(compra => {
        const li = document.createElement('li');
        if (compra.dataCompra) {
            const dataCompra = new Date(compra.dataCompra);
            const dataFormatada = `${dataCompra.getDate().toString().padStart(2, '0')}/${(dataCompra.getMonth() + 1).toString().padStart(2, '0')}/${dataCompra.getFullYear()}`;
            li.textContent = `Data da Compra: ${dataFormatada} - Valor: R$ ${compra.valorTotal.toFixed(2)} - Parcelas: ${compra.quantidadeParcelas}`;
        } else {
            li.textContent = `Sem data disponível - Valor: R$ ${compra.valorTotal.toFixed(2)} - Parcelas: ${compra.quantidadeParcelas}`;
        }
        historicoList.appendChild(li);
    });
}*/


/*function exibirParcelas(parcelas, diaDoPagamento) {
    const proximasParcelasList = document.getElementById('proximas-parcelas');
    const vencidasList = document.getElementById('parcelas-vencidas');
    const pagasList = document.getElementById('parcelas-pagas');
    const proximoVencimentoElem = document.getElementById('proximo-vencimento');
    const valorProximaFaturaElem = document.getElementById('valor-proxima-fatura');

    // Verifica se os elementos estão no DOM antes de tentar manipulá-los
    if (!proximasParcelasList || !vencidasList || !pagasList || !proximoVencimentoElem || !valorProximaFaturaElem) {
        console.error('Alguns elementos DOM não estão presentes');
        return;
    }

    proximasParcelasList.innerHTML = '';
    vencidasList.innerHTML = '';
    pagasList.innerHTML = '';

    const proximasParcelas = [];
    const vencidasParcelas = [];
    const pagasParcelas = [];
    const hoje = new Date(); // Data atual

    parcelas.forEach(parcela => {
        const dataVencimento = new Date(parcela.dataVencimento);
        const li = document.createElement('li');
        li.textContent = `R$ ${parcela.valor} - Vencimento: ${dataVencimento.toLocaleDateString('pt-BR')}`;

        if (parcela.pago) {
            pagasParcelas.push(li);
        } else if (dataVencimento < hoje) {
            vencidasParcelas.push(li);
        } else {
            proximasParcelas.push(li);
        }

        //adicionei aqui
   // var valorAVencer = 0;
    //if(parcela.dataVencimento <= proximoVencimento(diaDoVencimento)){
        //valorAVencer += parcela.valor
    //}


    });

    // Exibe as parcelas nas respectivas listas
    proximasParcelas.forEach(li => proximasParcelasList.appendChild(li));
    vencidasParcelas.forEach(li => vencidasList.appendChild(li));
    pagasParcelas.forEach(li => pagasList.appendChild(li));

    //pega a data de vencimento do cliente
   // const dataVencimento = new Date(cliente.diaDePagamento);
    //const diaVenc = dataVencimento.getDate(); // Pega apenas o dia
    //var vencimentoFatura = proximoVencimento(diaVenc)
    //var vencimentoCliente = new Date(cliente.diaDePagamento);
    //var diaVencimento = vencimentoCliente.getDate(); // Pega apenas o dia
    // Exibição do próximo vencimento
    if (proximasParcelas.length > 0) {
        const proximaParcela = proximasParcelas[0];*/

        /*//alert(diaDoVencimento);
       const proximaFatura = proximoVencimento(diaDoVencimento)
       proximoVencimentoElem.textContent = `Próxima Fatura: ${proximaFatura}`;
        

        const valorFatura = calcularValorFatura(parcelas, proximaFatura);
valorProximaFaturaElem.textContent = `Valor da próxima fatura: R$ ${valorFatura}`;


        //valorProximaFaturaElem.textContent = `Valor da próxima fatura: R$ ${calcularValorFatura}`;
        //alert(valorFatura);
    } else {
        proximoVencimentoElem.textContent = 'Nenhum vencimento próximo.';
        valorProximaFaturaElem.textContent = '';
    }*
        const proximaFatura = proximoVencimento(diaDoVencimento);
        const valorFatura = calcularValorFatura(parcelas, proximaFatura);
        
        // Formatação da data para exibição no formato dd/mm/aaaa
        const dia = String(proximaFatura.getDate()).padStart(2, '0');
        const mesFormatado = String(proximaFatura.getMonth() + 1).padStart(2, '0');
        const anoFormatado = proximaFatura.getFullYear();
        const proximaFaturaFormatada = `${dia}/${mesFormatado}/${anoFormatado}`;
        
        proximoVencimentoElem.textContent = `Vencimento: ${proximaFaturaFormatada}`;
        valorProximaFaturaElem.textContent = `Valor: R$ ${valorFatura}`;
        
}
}*/
/*function exibirParcelas(parcelas, diaDoPagamento) {
    const proximasParcelasList = document.getElementById('proximas-parcelas');
    const vencidasList = document.getElementById('parcelas-vencidas');
    const pagasList = document.getElementById('parcelas-pagas');
    const proximoVencimentoElem = document.getElementById('proximo-vencimento');
    const valorProximaFaturaElem = document.getElementById('valor-proxima-fatura');

    proximasParcelasList.innerHTML = '';
    vencidasList.innerHTML = '';
    pagasList.innerHTML = '';

    if (parcelas.length === 0) {
        proximasParcelasList.innerHTML = '<li>Nenhuma parcela encontrada.</li>';
        vencidasList.innerHTML = '<li>Nenhuma parcela vencida.</li>';
        pagasList.innerHTML = '<li>Nenhuma parcela paga.</li>';
        proximoVencimentoElem.textContent = 'Nenhum vencimento próximo.';
        valorProximaFaturaElem.textContent = '';
        return;
    }

    const proximasParcelas = [];
    const vencidasParcelas = [];
    const pagasParcelas = [];
    const hoje = new Date();

    parcelas.forEach(parcela => {
        const dataVencimento = new Date(parcela.dataVencimento);
        const li = document.createElement('li');
        li.textContent = `R$ ${parcela.valor} - Vencimento: ${dataVencimento.toLocaleDateString('pt-BR')}`;

        if (parcela.pago) {
            pagasParcelas.push(li);
        } else if (dataVencimento < hoje) {
            vencidasParcelas.push(li);
        } else {
            proximasParcelas.push(li);
        }
    });

    proximasParcelas.forEach(li => proximasParcelasList.appendChild(li));
    vencidasParcelas.forEach(li => vencidasList.appendChild(li));
    pagasParcelas.forEach(li => pagasList.appendChild(li));

    if (proximasParcelas.length > 0) {
        const proximaFatura = proximoVencimento(diaDoVencimento);
        const valorFatura = calcularValorFatura(parcelas, proximaFatura);
        const dia = String(proximaFatura.getDate()).padStart(2, '0');
        const mesFormatado = String(proximaFatura.getMonth() + 1).padStart(2, '0');
        const anoFormatado = proximaFatura.getFullYear();
        const proximaFaturaFormatada = `${dia}/${mesFormatado}/${anoFormatado}`;

        proximoVencimentoElem.textContent = `Vencimento: ${proximaFaturaFormatada}`;
        valorProximaFaturaElem.textContent = `Valor: R$ ${valorFatura}`;
    } else {
        proximoVencimentoElem.textContent = 'Nenhum vencimento próximo.';
        valorProximaFaturaElem.textContent = '';
    }
}*/


/*function calcularValorFatura() {
parcelas.forEach(parcela => {
    const dataVencimento = new Date(parcela.dataVencimento);
   var valorFatura = 0;
    if (dataVencimento <= proximoVencimento(diaDoVencimento)) {
        valorFatura += parcela.valor;
    }
});
return valorFatura

}*/

function exibirHistoricoCompras(compras) {
    const historicoList = document.getElementById('historico-compras');
    historicoList.innerHTML = ''; // Limpa a lista

    if (compras.length === 0) {
        historicoList.innerHTML = '<li>Nenhuma compra encontrada.</li>';
        return;
    }

    compras.forEach(compra => {
        const li = document.createElement('li');
        if (compra.dataCompra) {
            const dataCompra = new Date(compra.dataCompra);
            const dataFormatada = `${dataCompra.getDate().toString().padStart(2, '0')}/${(dataCompra.getMonth() + 1).toString().padStart(2, '0')}/${dataCompra.getFullYear()}`;
            li.textContent = `Data da Compra: ${dataFormatada} - Valor: R$ ${compra.valorTotal.toFixed(2)} - Parcelas: ${compra.quantidadeParcelas}`;
        } else {
            li.textContent = `Sem data disponível - Valor: R$ ${compra.valorTotal.toFixed(2)} - Parcelas: ${compra.quantidadeParcelas}`;
        }
        historicoList.appendChild(li);
    });
}

function exibirParcelas(parcelas, diaDoPagamento) {
    const proximasParcelasList = document.getElementById('proximas-parcelas');
    const vencidasList = document.getElementById('parcelas-vencidas');
    const pagasList = document.getElementById('parcelas-pagas');
    const proximoVencimentoElem = document.getElementById('proximo-vencimento');
    const valorProximaFaturaElem = document.getElementById('valor-proxima-fatura');

    proximasParcelasList.innerHTML = '';
    vencidasList.innerHTML = '';
    pagasList.innerHTML = '';

    if (parcelas.length === 0) {
        proximasParcelasList.innerHTML = '<li>Nenhuma parcela encontrada.</li>';
        vencidasList.innerHTML = '<li>Nenhuma parcela vencida.</li>';
        pagasList.innerHTML = '<li>Nenhuma parcela paga.</li>';
        proximoVencimentoElem.textContent = 'Nenhum vencimento próximo.';
        valorProximaFaturaElem.textContent = '';
        return;
    }

    const proximasParcelas = [];
    const vencidasParcelas = [];
    const pagasParcelas = [];
    const hoje = new Date();

    parcelas.forEach(parcela => {
        const dataVencimento = new Date(parcela.dataVencimento);
        const li = document.createElement('li');
        li.textContent = `R$ ${parcela.valor} - Vencimento: ${dataVencimento.toLocaleDateString('pt-BR')}`;

        if (parcela.pago) {
            pagasParcelas.push(li);
        } else if (dataVencimento < hoje) {
            vencidasParcelas.push(li);
        } else {
            proximasParcelas.push(li);
        }
    });

    proximasParcelas.forEach(li => proximasParcelasList.appendChild(li));
    vencidasParcelas.forEach(li => vencidasList.appendChild(li));
    pagasParcelas.forEach(li => pagasList.appendChild(li));

    if (proximasParcelas.length > 0) {
        const proximaFatura = proximoVencimento(diaDoVencimento);
        const valorFatura = calcularValorFatura(parcelas, proximaFatura);
        const dia = String(proximaFatura.getDate()).padStart(2, '0');
        const mesFormatado = String(proximaFatura.getMonth() + 1).padStart(2, '0');
        const anoFormatado = proximaFatura.getFullYear();
        const proximaFaturaFormatada = `${dia}/${mesFormatado}/${anoFormatado}`;

        proximoVencimentoElem.textContent = `Vencimento: ${proximaFaturaFormatada}`;
        valorProximaFaturaElem.textContent = `Valor: R$ ${valorFatura}`;
    } else {
        proximoVencimentoElem.textContent = 'Nenhum vencimento próximo.';
        valorProximaFaturaElem.textContent = '';
    }
}



function atualizarGraficoLimite(limiteTotal, limiteDisponivel) {
    const ctx = document.getElementById('limiteChart').getContext('2d');

    if (window.limiteChartInstance) window.limiteChartInstance.destroy();

    window.limiteChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Limite Utilizado', 'Limite Disponível'],
            datasets: [{
                data: [limiteTotal - limiteDisponivel, limiteDisponivel],
                backgroundColor: ['#FF5C5C', '#56F595'],
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    const content = section.querySelector('.section-content');
    const button = section.querySelector('.toggle-section');

    if (content.style.display === 'none' || content.style.display === '') {
        content.style.display = 'block';
        button.textContent = '⬇';
    } else {
        content.style.display = 'none';
        button.textContent = '⬆';
    }
}


//ate agora tudo funcionando
//break point

/*function proximoVencimento(diaVencimento) {
    const hoje = new Date();
    let ano = hoje.getFullYear();
    let mes = hoje.getMonth(); // O mês em JavaScript começa em 0 (Janeiro = 0, Fevereiro = 1, etc.)

    // Verifica se o dia de vencimento já passou no mês atual
    if (hoje.getDate() > diaVencimento) {
        mes++; // Se já passou, o próximo vencimento será no próximo mês
        if (mes > 11) { // Se o mês passar de dezembro (11), incrementa o ano e reseta o mês para janeiro
            mes = 0;
            ano++;
        }
    }

    // Cria a próxima data de vencimento
    const proximoVencimento = new Date(ano, mes, diaVencimento);

    // Formatação no formato dd/mm/aaaa
    const dia = String(proximoVencimento.getDate()).padStart(2, '0');
    const mesFormatado = String(proximoVencimento.getMonth() + 1).padStart(2, '0'); // +1 para ajustar o mês
    const anoFormatado = proximoVencimento.getFullYear();

    return `${dia}/${mesFormatado}/${anoFormatado}`;
}*/

function proximoVencimento(diaVencimento) {
    const hoje = new Date();
    let ano = hoje.getFullYear();
    let mes = hoje.getMonth();

    // Verifica se o dia de vencimento já passou no mês atual
    if (hoje.getDate() > diaVencimento) {
        mes++; // Se já passou, o próximo vencimento será no próximo mês
        if (mes > 11) { // Se o mês passar de dezembro, incrementa o ano e reseta o mês para janeiro
            mes = 0;
            ano++;
        }
    }

    // Retorna a próxima data de vencimento como um objeto Date
    return new Date(ano, mes, diaVencimento);
}


/*function calcularValorFatura(parcelas, proximaFatura) {
    let valorFatura = 0;

    // Obtém o próximo vencimento como uma data válida
    const dataProximoVencimento = proximaFatura;
    const proximoVenc = new Date(dataProximoVencimento.split('/').reverse().join('-')); // Convertendo para um objeto Date

    parcelas.forEach(parcela => {
        // Certifique-se de que parcela e seu valor estão definidos
        if (parcela && parcela.valor) {
            const dataVencimentoParcela = new Date(parcela.dataVencimento);

            // Verificamos se a data de vencimento da parcela é menor ou igual ao próximo vencimento
            if (dataVencimentoParcela <= proximoVenc) {
                valorFatura += parcela.valor; // Somamos o valor da parcela à fatura
            }
        }
    });

    return valorFatura.toFixed(2); // Retorna o valor formatado com duas casas decimais
}*/

function calcularValorFatura(parcelas, proximaFatura) {
    let valorFatura = 0;

    parcelas.forEach(parcela => {
        if (parcela && parcela.valor) {
            const dataVencimentoParcela = new Date(parcela.dataVencimento);

            // Verificamos se a data de vencimento da parcela é menor ou igual ao próximo vencimento
            if (dataVencimentoParcela <= proximaFatura) {
                valorFatura += parcela.valor; // Somamos o valor da parcela à fatura
            }
        }
    });

    return valorFatura.toFixed(2); // Retorna o valor formatado com duas casas decimais
}




// Exemplo de uso:
//const diaVencimento = 19; // Defina o dia de vencimento desejado
///const proximaDataVencimento = proximoVencimento(diaVencimento);
//console.log(`O próximo vencimento será em: ${proximaDataVencimento.toLocaleDateString()}`);


function logout() {
    localStorage.removeItem('token');
    window.location.href = "index.html";
}

//criei o vencimento da fatura agora falta consolidar o valor a pagar

