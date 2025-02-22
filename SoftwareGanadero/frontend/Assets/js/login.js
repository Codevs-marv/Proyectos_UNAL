document.getElementById("form-login").addEventListener("submit", async function (event) {
    event.preventDefault(); // Evita que la página se recargue

    // Obtener valores de los campos
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        // Enviar datos al backend
        const response = await fetch("http://127.0.0.1:5001/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                correo: email,  // El backend espera "correo", no "email"
                contrasena: password  // El backend espera "contrasena"
            })
        });

        const data = await response.json(); // Convertir la respuesta a JSON

        if (response.ok) {
            // Guardar datos en localStorage para mantener la sesión
            localStorage.setItem("usuario", JSON.stringify(data.usuario));

            // Redirigir a la página principal
            window.location.href = "index.html";
        } else {
            // Mostrar mensaje de error
            console.log("Error: " + data.error);
            document.querySelector(".error").classList.remove("inactive");
        }
    } catch (error) {
        console.error("Error en la conexión:", error);
    }
});
