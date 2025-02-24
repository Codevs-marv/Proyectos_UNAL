// Verificar si hay sesión activa y mostrar información del usuario
document.addEventListener("DOMContentLoaded", function () {
    const usuarioInfo = document.getElementById("usuario-info");
    const usuarioJSON = sessionStorage.getItem("usuario");

    if (usuarioJSON) {
        try {
            const usuario = JSON.parse(usuarioJSON);
            usuarioInfo.textContent = `Bienvenido, ${usuario.nombre} (${usuario.rol})`;
        } catch (error) {
            console.error("❌ Error al parsear JSON:", error);
            sessionStorage.removeItem("usuario"); // Borra datos corruptos
            usuarioInfo.textContent = "Error al cargar usuario.";
        }
    } else {
        usuarioInfo.textContent = "No hay usuario en sesión.";
    }
});

// Verificar sesión y redirigir si no hay usuario
document.addEventListener("DOMContentLoaded", () => {
    const usuario = sessionStorage.getItem("usuario");

    if (!usuario) {
        console.warn("⚠ No hay usuario en sesión. Redirigiendo al login...");
        window.location.href = "login.html";
    }

    // Obtener el botón del menú "Animales" y la sección de animales
    const btnAnimales = document.querySelector(".menu li:nth-child(3)");
    const seccionAnimales = document.getElementById("seccion-animales");
    const contenedorAnimales = document.querySelector(".animales-container");

    // Función para obtener la ruta de la imagen según la raza
    const obtenerRutaImagen = (raza) => {
        const nombreArchivo = raza.toLowerCase().replace(/\s+/g, "") + ".jpg";
        const ruta = `./assets/img/${nombreArchivo}`;
        return ruta;
    };

    // Agregar evento para mostrar la sección de animales al hacer clic en el menú
    btnAnimales.addEventListener("click", async () => {
        console.log("🐄 Cargando lista de animales...");

        // Mostrar la sección de animales
        seccionAnimales.classList.remove("inactive");

        try {
            const response = await fetch("http://127.0.0.1:5001/animales");

            if (!response.ok) {
                throw new Error(`❌ Error en la respuesta del servidor: ${response.status}`);
            }

            const animales = await response.json();
            console.log("✅ Datos de los animales recibidos:", animales);

            // Limpiar el contenedor antes de agregar nuevos elementos
            contenedorAnimales.innerHTML = "";

            // Crear tarjetas para cada animal
            animales.forEach(animal => {
                const tarjeta = document.createElement("div");
                tarjeta.classList.add("tarjeta-animal");

                tarjeta.innerHTML = `
                    <img src="${obtenerRutaImagen(animal.raza)}" 
                         alt="Foto de ${animal.raza}" 
                         onerror="this.onerror=null; this.src='./assets/img/animal-placeholder.jpg';">
                    <div class="info">
                        <h3><strong>ID:</strong> ${animal.id}</h3>
                        <p><strong>Raza:</strong> ${animal.raza}</p>
                        <p><strong>Edad:</strong> ${animal.edad} años</p>
                        <p><strong>Peso:</strong> ${animal.peso} kg</p>
                        <button class="btn-editar" onclick="editarAnimal(${animal.id})">Editar</button>
                        <button class="btn-eliminar" onclick="eliminarAnimal(${animal.id})">Eliminar</button>
                    </div>
                `;

                contenedorAnimales.appendChild(tarjeta);
            });

        } catch (error) {
            console.error("❌ Error al obtener los animales:", error);
        }
    });
});

// Función para cerrar sesión
function cerrarSesion() {
    console.log("👋 Cerrando sesión...");
    sessionStorage.removeItem("usuario");
    window.location.href = "login.html"; // Redirige al login
}

// Funciones vacías para editar y eliminar (se implementarán después)
function editarAnimal(id) {
    console.log(`✏ Editar animal con ID: ${id}`);
}

function eliminarAnimal(id) {
    console.log(`🗑 Eliminar animal con ID: ${id}`);
}
// Verificar si hay sesión activa y mostrar información del usuario
document.addEventListener("DOMContentLoaded", function () {
    const usuarioInfo = document.getElementById("usuario-info");
    const usuarioJSON = sessionStorage.getItem("usuario");

    if (usuarioJSON) {
        try {
            const usuario = JSON.parse(usuarioJSON);
            usuarioInfo.textContent = `Bienvenido, ${usuario.nombre} (${usuario.rol})`;
        } catch (error) {
            console.error("❌ Error al parsear JSON:", error);
            sessionStorage.removeItem("usuario");
            usuarioInfo.textContent = "Error al cargar usuario.";
        }
    } else {
        usuarioInfo.textContent = "No hay usuario en sesión.";
    }
});

// Verificar sesión y redirigir si no hay usuario
document.addEventListener("DOMContentLoaded", () => {
    const usuario = sessionStorage.getItem("usuario");

    if (!usuario) {
        console.warn("⚠ No hay usuario en sesión. Redirigiendo al login...");
        window.location.href = "login.html";
    }

    // Obtener elementos del DOM
    const btnAnimales = document.querySelector(".menu li:nth-child(3)");
    const seccionAnimales = document.getElementById("seccion-animales");
    const contenedorAnimales = document.querySelector(".animales-container");
    const btnAnterior = document.getElementById("btn-anterior");
    const btnSiguiente = document.getElementById("btn-siguiente");
    const paginaActualSpan = document.getElementById("pagina-actual");

    let animales = [];  
    let paginaActual = 1;
    const animalesPorPagina = 20; // Número de tarjetas por página

    // Función para obtener la imagen de la raza
    const obtenerRutaImagen = (raza) => {
        const nombreArchivo = raza.toLowerCase().replace(/\s+/g, "") + ".jpg";
        return `./assets/img/${nombreArchivo}`;
    };

    // Cargar lista de animales desde el backend
    async function cargarAnimales() {
        console.log("🐄 Cargando lista de animales...");
        try {
            const response = await fetch("http://127.0.0.1:5001/animales");
            if (!response.ok) {
                throw new Error(`❌ Error en la respuesta del servidor: ${response.status}`);
            }

            animales = await response.json();
            console.log("✅ Datos de los animales recibidos:", animales);

            paginaActual = 1;
            mostrarPagina(paginaActual);
        } catch (error) {
            console.error("❌ Error al obtener los animales:", error);
        }
    }

    // Mostrar los animales en la página actual
    function mostrarPagina(pagina) {
        contenedorAnimales.innerHTML = "";

        const inicio = (pagina - 1) * animalesPorPagina;
        const fin = inicio + animalesPorPagina;
        const animalesPagina = animales.slice(inicio, fin);

        // Renderizar cada animal
        animalesPagina.forEach(animal => {
            const tarjeta = document.createElement("div");
            tarjeta.classList.add("tarjeta-animal");

            tarjeta.innerHTML = `
                <img src="${obtenerRutaImagen(animal.raza)}" 
                     alt="Foto de ${animal.raza}" 
                     onerror="this.onerror=null; this.src='./assets/img/animal-placeholder.jpg';">
                <div class="info">
                    <h3><strong>ID:</strong> ${animal.id}</h3>
                    <p><strong>Raza:</strong> ${animal.raza}</p>
                    <p><strong>Edad:</strong> ${animal.edad} años</p>
                    <p><strong>Peso:</strong> ${animal.peso} kg</p>
                    <button class="btn-editar" onclick="editarAnimal(${animal.id})">Editar</button>
                    <button class="btn-eliminar" onclick="eliminarAnimal(${animal.id})">Eliminar</button>
                </div>
            `;

            contenedorAnimales.appendChild(tarjeta);
        });

        // Actualizar número de página
        paginaActualSpan.textContent = `Página ${pagina} de ${Math.ceil(animales.length / animalesPorPagina)}`;

        // Deshabilitar botones si es necesario
        btnAnterior.disabled = pagina === 1;
        btnSiguiente.disabled = fin >= animales.length;
    }

    // Eventos de paginación
    btnAnterior.addEventListener("click", () => {
        if (paginaActual > 1) {
            paginaActual--;
            mostrarPagina(paginaActual);
        }
    });

    btnSiguiente.addEventListener("click", () => {
        if (paginaActual * animalesPorPagina < animales.length) {
            paginaActual++;
            mostrarPagina(paginaActual);
        }
    });

    // Evento para mostrar animales cuando se haga clic en el menú
    btnAnimales.addEventListener("click", () => {
        console.log("📢 Click en Animales");
        seccionAnimales.classList.remove("inactive");
        cargarAnimales();
    });
});

// Función para cerrar sesión
function cerrarSesion() {
    console.log("👋 Cerrando sesión...");
    sessionStorage.removeItem("usuario");
    window.location.href = "login.html";
}

// Funciones vacías para editar y eliminar
function editarAnimal(id) {
    console.log(`✏ Editar animal con ID: ${id}`);
}

function eliminarAnimal(id) {
    console.log(`🗑 Eliminar animal con ID: ${id}`);
}
