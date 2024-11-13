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





function logout() {
    console.log('Tentando fazer logout...');
    localStorage.removeItem('token');
    console.log('Token após remoção:', localStorage.getItem('token'));
    window.location.href = "index.html";
}
