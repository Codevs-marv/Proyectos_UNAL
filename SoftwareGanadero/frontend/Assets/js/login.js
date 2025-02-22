document.addEventListener("DOMContentLoaded", () => {
    const formLogin = document.getElementById("form-login");

    formLogin.addEventListener("submit", async (event) => {
        event.preventDefault(); // Evita que la página se recargue

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch("http://127.0.0.1:5001/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ correo: email, contrasena: password }),
            });

            // Intenta parsear la respuesta
            let data;
            try {
                data = await response.json();
            } catch (error) {
                console.error("❌ Error al convertir la respuesta en JSON:", error);
                alert("Error en el servidor. Inténtalo de nuevo.");
                return;
            }

            // Verificamos si la respuesta es correcta y contiene datos de usuario
            if (response.ok && data.usuario) {
                console.log("✅ Usuario logueado:", data.usuario);

                // Guardar usuario en sessionStorage
                sessionStorage.setItem("usuario", JSON.stringify(data.usuario));

                // Verificar si el usuario se guardó correctamente
                const usuarioGuardado = sessionStorage.getItem("usuario");
                if (usuarioGuardado) {
                    console.log("🔹 Usuario en sessionStorage:", usuarioGuardado);

                    // 🔹 Agregar log antes de redirigir
                    console.log("🔄 Redirigiendo a index.html...");

                    // Redirigir a index.html
                    window.location.href = "index.html";
                } else {
                    console.error("❌ Error: No se pudo guardar el usuario en sessionStorage");
                    alert("Error al procesar la sesión. Inténtalo de nuevo.");
                }
            } else {
                console.error("❌ Error en login:", data);
                alert("Usuario o contraseña incorrectos");
            }
        } catch (error) {
            console.error("❌ Error en la petición:", error);
            alert("Error al conectar con el servidor");
        }
    });
});
