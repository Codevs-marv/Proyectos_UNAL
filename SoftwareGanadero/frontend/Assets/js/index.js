
// VERIFICAR SI HAY SESION
document.addEventListener("DOMContentLoaded", () => {
    const usuario = sessionStorage.getItem("usuario");

    if (!usuario) {
        // Si no hay usuario en la sesión, redirigir al login
        window.location.href = "login.html";
    }
});



document.addEventListener("DOMContentLoaded", function () {
    const usuarioInfo = document.getElementById("usuario-info");
    const usuarioJSON = sessionStorage.getItem("usuario");

    if (usuarioJSON) {
        try {
            const usuario = JSON.parse(usuarioJSON);
            usuarioInfo.textContent = `Bienvenido, ${usuario.nombre} (${usuario.rol})`;
        } catch (error) {
            console.error("Error al parsear JSON:", error);
            sessionStorage.removeItem("usuario"); // Borra datos corruptos
            usuarioInfo.textContent = "Error al cargar usuario.";
        }
    } else {
        usuarioInfo.textContent = "No hay usuario en sesión.";
    }
});

// Función para cerrar sesión
function cerrarSesion() {
    sessionStorage.removeItem("usuario");
    window.location.href = "login.html"; // Redirige al login
}
