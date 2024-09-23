async function login() {
    const usuario = document.getElementById('usuario').value.trim();
    const senha = document.getElementById('senha').value.trim();

    if (!usuario || !senha) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    try {
        const response = await fetch('/api/Auth/login', { // Certifique-se que o endpoint está correto
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ login: usuario, senha: senha })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            window.location.href = "spa.html"; // Redireciona para a SPA
        } else {
            const errorData = await response.json();
            alert(errorData.message || 'Usuário ou senha incorretos!');
        }
    } catch (error) {
        console.error('Erro durante o login:', error);
        alert('Ocorreu um erro durante o login. Tente novamente mais tarde.');
    }
}
