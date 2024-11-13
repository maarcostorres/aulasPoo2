async function login() {
    const usuario = document.getElementById('usuario').value.trim();
    const senha = document.getElementById('senha').value.trim();

    if (!usuario || !senha) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    try {
        const response = await fetch('/api/Auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ login: usuario, senha: senha })
        });

        if (response.ok) {
            const data = await response.json();
            const token = data.token;  // Token JWT recebido do servidor
            const userType = data.userType;  // Tipo de usuário recebido do servidor
            localStorage.setItem('token', token); // Armazena o token no localStorage

            // Redireciona para a página correta com base no tipo de usuário
            if (userType === 'Administrador') {
                window.location.href = "admin.html";
            } else {
                window.location.href = "spa.html";
            }
        } else {
            const errorData = await response.json();
            alert(errorData.message || 'Usuário ou senha incorretos!');
        }
    } catch (error) {
        console.error('Erro durante o login:', error);
        alert('Ocorreu um erro durante o login. Tente novamente mais tarde.');
    }
}



