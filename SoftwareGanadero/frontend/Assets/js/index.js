document.addEventListener("DOMContentLoaded", function () {
    fetch("http://127.0.0.1:5001/usuario", { credentials: "include" })
        .then(response => response.json())
        .then(data => {
            if (data.usuario) {
                document.getElementById("usuario-info").textContent = `Bienvenido, ${data.usuario.nombre}`;
            } else {
                window.location.href = "login.html"; // Si no hay sesión, redirigir al login
            }
        })
        .catch(error => console.error("Error al obtener usuario:", error));
});

function cerrarSesion() {
    fetch("http://127.0.0.1:5001/logout", {
        method: "POST",
        credentials: "include"
    })
    .then(response => response.json())
    .then(() => {
        window.location.href = "login.html"; // Redirigir al login tras cerrar sesión
    })
    .catch(error => console.error("Error al cerrar sesión:", error));
}
