document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('logoutLink').addEventListener('click', function(event) {
        event.preventDefault(); // Impede o comportamento padrão do link
        logout(); 
    });
});

function logout() {
    console.log('Tentando fazer logout...'); 
    localStorage.removeItem('token');
    console.log('Token após remoção:', localStorage.getItem('token')); 
    window.location.href = "index.html";
}
