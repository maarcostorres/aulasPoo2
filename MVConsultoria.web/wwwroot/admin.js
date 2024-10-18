document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('logoutLink').addEventListener('click', function(event) {
        event.preventDefault(); // Impede o comportamento padrão do link
        logout(); // Chama a função logout
    });
});

function logout() {
    console.log('Tentando fazer logout...'); // Adicione isso para verificar
    localStorage.removeItem('token');
    console.log('Token após remoção:', localStorage.getItem('token')); // Verifica se foi removido
    window.location.href = "index.html";
}
