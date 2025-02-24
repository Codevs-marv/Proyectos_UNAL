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

    // Obtener elementos del buscador
    const inputBuscar = document.getElementById("buscar-animal");
    const btnBuscar = document.getElementById("btn-buscar");

    // Evento para buscar un animal
    btnBuscar.addEventListener("click", () => {
        const query = inputBuscar.value.trim().toLowerCase();

        if (query === "") {
            alert("Por favor, ingrese un ID o raza para buscar.");
            return;
        }

        // Filtrar animales que coincidan con la búsqueda
        const animalesFiltrados = animalesData.filter(animal =>
            animal.id.toString() === query || animal.raza.toLowerCase().includes(query)
        );

        // Mostrar los resultados
        mostrarAnimales(animalesFiltrados);
    });

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

// Función para abrir el formulario de edición
function editarAnimal(id) {
    console.log(`✏ Intentando editar el animal con ID: ${id}`);

    const animal = animalesData.find(animal => animal.id === id);
    if (!animal) {
        console.error("❌ No se encontró el animal.");
        alert("No se encontró el animal.");
        return;
    }

    console.log("✅ Animal encontrado:", animal);

    // Si ya existe un modal abierto, lo eliminamos antes de crear otro
    const modalExistente = document.querySelector(".modal");
    if (modalExistente) {
        modalExistente.remove();
    }

    // Crear el modal de edición
    const modal = document.createElement("div");
    modal.classList.add("modal");

    modal.innerHTML = `
        <div class="modal-content">
            <h2>Editar Animal (ID: ${animal.id})</h2>
            <label>Raza:</label>
            <input type="text" id="edit-raza" value="${animal.raza}">
            <label>Edad:</label>
            <input type="number" id="edit-edad" value="${animal.edad}">
            <label>Peso:</label>
            <input type="number" id="edit-peso" value="${animal.peso}">
            <button id="guardar-edicion">Guardar</button>
            <button id="cerrar-modal">Cancelar</button>
        </div>
    `;

    document.body.appendChild(modal);

    // Evento para cerrar el modal
    document.getElementById("cerrar-modal").addEventListener("click", () => {
        console.log("🛑 Edición cancelada.");
        modal.remove();
    });

    // Evento para guardar cambios
    document.getElementById("guardar-edicion").addEventListener("click", async () => {
        console.log("💾 Guardando cambios...");

        const nuevaRaza = document.getElementById("edit-raza").value.trim();
        const nuevaEdad = parseInt(document.getElementById("edit-edad").value);
        const nuevoPeso = parseFloat(document.getElementById("edit-peso").value);

        if (!nuevaRaza || isNaN(nuevaEdad) || isNaN(nuevoPeso)) {
            alert("Por favor, complete todos los campos correctamente.");
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:5001/animales/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ raza: nuevaRaza, edad: nuevaEdad, peso: nuevoPeso })
            });

            if (!response.ok) {
                throw new Error("No se pudo actualizar el animal.");
            }

            alert("✅ Animal actualizado correctamente.");
            modal.remove();
            btnAnimales.click(); // Recargar lista de animales
        } catch (error) {
            console.error("❌ Error al actualizar el animal:", error);
            alert("Hubo un error al actualizar el animal.");
        }
    });
}



function eliminarAnimal(id) {
    console.log(`🗑 Eliminar animal con ID: ${id}`);
}
