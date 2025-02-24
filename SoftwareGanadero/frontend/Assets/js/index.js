document.addEventListener("DOMContentLoaded", () => {
    const usuario = sessionStorage.getItem("usuario");

    if (!usuario) {
        // Si no hay usuario en la sesión, redirigir al login
        window.location.href = "login.html";
    }

    // Obtener el botón del menú "Animales"
    const btnAnimales = document.querySelector(".menu li:nth-child(3)");
    const seccionAnimales = document.getElementById("seccion-animales");
    const contenedorAnimales = document.querySelector(".animales-container");

    btnAnimales.addEventListener("click", async () => {
        // Mostrar la sección de animales
        seccionAnimales.classList.remove("inactive");

        // Obtener datos de los animales desde el backend
        try {
            const response = await fetch("http://127.0.0.1:5001/animales");
            const animales = await response.json();

            // Limpiar el contenedor antes de agregar nuevos elementos
            contenedorAnimales.innerHTML = "";

            // Crear tarjetas para cada animal
            animales.forEach(animal => {
                const tarjeta = document.createElement("div");
                tarjeta.classList.add("tarjeta-animal");

                tarjeta.innerHTML = `
                    <img src="${animal.foto}" alt="Foto de ${animal.raza}">
                    <div class="info">
                        <h3>Raza: ${animal.raza}</h3>
                        <p><strong>ID:</strong> ${animal.id}</p>
                        <p><strong>Edad:</strong> ${animal.edad} años</p>
                        <p><strong>Peso:</strong> ${animal.peso} kg</p>
                        <button class="btn-editar">Editar</button>
                        <button class="btn-eliminar">Eliminar</button>
                    </div>
                `;

                contenedorAnimales.appendChild(tarjeta);
            });
        } catch (error) {
            console.error("❌ Error al obtener los animales:", error);
        }
    });
});
