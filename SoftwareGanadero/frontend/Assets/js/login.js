document.getElementById("form-login").addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://127.0.0.1:5001/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Inicio de sesión exitoso");
            window.location.href = "../index.html";
        } else {
            alert("Error: " + data.error);
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Hubo un problema con la conexión al servidor.");
    }
});
