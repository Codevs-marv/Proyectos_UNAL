document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form-login");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();  // Evita que la página se recargue

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const errorMsg = document.querySelector(".error");

        try {
            const response = await fetch("http://127.0.0.1:5001/usuarios/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ correo: email, contraseña: password })  // Enviar datos al backend
            });

            const data = await response.json();

            if (response.ok) {
                alert("Bienvenido, " + data.usuario);
                window.location.href = "index.html";  // Redirigir a la página principal
            } else {
                errorMsg.textContent = data.error;
                errorMsg.classList.remove("inactive");
            }
        } catch (error) {
            console.error("Error en la petición:", error);
            errorMsg.textContent = "Error de conexión con el servidor";
            errorMsg.classList.remove("inactive");
        }
    });
});
