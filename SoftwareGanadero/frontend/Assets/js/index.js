// Verificar si hay sesión activa y mostrar información del usuario
document.addEventListener("DOMContentLoaded", function () {
    const usuarioInfo = document.getElementById("usuario-info");
    const usuarioJSON = sessionStorage.getItem("usuario");

    if (usuarioJSON) {
        try {
            const usuario = JSON.parse(usuarioJSON);
            usuarioInfo.textContent = ` ${usuario.nombre} (${usuario.rol})`;
        } catch (error) {
            console.error("❌ Error al parsear JSON:", error);
            sessionStorage.removeItem("usuario");
            usuarioInfo.textContent = "Error al cargar usuario.";
        }
    } else {
        usuarioInfo.textContent = "No hay usuario en sesión.";
    }
});

// Variables globales
let animalesData = [];
let paginaActual = 1;
const animalesPorPagina = 20;

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
    const buscadorAnimales = document.getElementById("buscador-animales");
    const inputBuscar = document.getElementById("buscar-animal");
    const btnBuscar = document.getElementById("btn-buscar");
    const btnAnterior = document.getElementById("btn-anterior");
    const btnSiguiente = document.getElementById("btn-siguiente");
    const paginaActualSpan = document.getElementById("pagina-actual");
    const btnAgregarAnimal = document.getElementById("btn-agregar-animal"); // 🔹 Botón "Agregar Animal"
    btnAgregarAnimal.addEventListener("click", mostrarFormularioAgregar);


    // 🔹 Ocultar el buscador al cargar la página
    buscadorAnimales.classList.add("inactive");

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

            animalesData = await response.json();
            console.log("✅ Datos de los animales recibidos:", animalesData);

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
        const animalesPagina = animalesData.slice(inicio, fin);

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
        paginaActualSpan.textContent = `Página ${pagina} de ${Math.ceil(animalesData.length / animalesPorPagina)}`;

        // Deshabilitar botones si es necesario
        btnAnterior.disabled = pagina === 1;
        btnSiguiente.disabled = fin >= animalesData.length;
    }

    // Eventos de paginación
    btnAnterior.addEventListener("click", () => {
        if (paginaActual > 1) {
            paginaActual--;
            mostrarPagina(paginaActual);
        }
    });

    btnSiguiente.addEventListener("click", () => {
        if (paginaActual * animalesPorPagina < animalesData.length) {
            paginaActual++;
            mostrarPagina(paginaActual);
        }
    });

    // Evento para mostrar animales y buscador al hacer clic en "Animales"
    btnAnimales.addEventListener("click", () => {
        console.log("📢 Click en Animales");
        seccionAnimales.classList.remove("inactive");
        buscadorAnimales.classList.remove("inactive"); // 🔹 Mostrar buscador
        cargarAnimales();
    });

    // Evento para buscar animales en tiempo real
    inputBuscar.addEventListener("input", () => {
        const query = inputBuscar.value.trim().toLowerCase();

        if (query === "") {
            mostrarPagina(1); // Si está vacío, mostramos la lista completa
            return;
        }

        // Filtrar animales que coincidan con el ID exacto o parcialmente con la raza
        const animalesFiltrados = animalesData.filter(animal =>
            animal.id.toString() === query || animal.raza.toLowerCase().includes(query)
        );

        // Mostrar resultados
        if (animalesFiltrados.length > 0) {
            mostrarResultadosBusqueda(animalesFiltrados);
        } else {
            contenedorAnimales.innerHTML = `<p class="mensaje-busqueda">No se encontraron animales.</p>`;
        }
    });

    // Función para mostrar los resultados filtrados
    function mostrarResultadosBusqueda(animales) {
        contenedorAnimales.innerHTML = ""; // Limpiar contenedor antes de agregar los nuevos resultados

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
    }

});

// Función para cerrar sesión
function cerrarSesion() {
    console.log("👋 Cerrando sesión...");
    sessionStorage.removeItem("usuario");
    window.location.href = "login.html";
}



// Función para abrir el formulario de edición
// Función para abrir el modal de edición
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
    modal.classList.add("modal", "show");

    modal.innerHTML = `
        <div class="modal-content">
            <h2>Editar Animal (ID: ${animal.id})</h2>
            
            <label>Sexo:</label>
            <select id="edit-sexo">
                <option value="Macho" ${animal.sexo === "Macho" ? "selected" : ""}>Macho</option>
                <option value="Hembra" ${animal.sexo === "Hembra" ? "selected" : ""}>Hembra</option>
            </select>

            <label>Marca:</label>
            <select id="edit-marca">
                <option value="BHQZ" ${animal.marca === "BHQZ" ? "selected" : ""}>BHQZ</option>
                <option value="PP8" ${animal.marca === "PP8" ? "selected" : ""}>PP8</option>
            </select>

            <label>Edad:</label>
            <input type="number" id="edit-edad" value="${animal.edad}">

            <label>Raza:</label>
            <input type="text" id="edit-raza" value="${animal.raza}">

            <label>Peso:</label>
            <input type="number" id="edit-peso" value="${animal.peso}">

            <label>Propósito:</label>
            <select id="edit-proposito">
                <option value="Lecheria" ${animal.proposito === "Lecheria" ? "selected" : ""}>Lechería</option>
                <option value="Cria" ${animal.proposito === "Cria" ? "selected" : ""}>Cría</option>
                <option value="DobleProposito" ${animal.proposito === "DobleProposito" ? "selected" : ""}>Doble Propósito</option>
            </select>

            <label>Fecha de Nacimiento:</label>
            <input type="date" id="edit-fechaNacimiento" value="${animal.fechaNacimiento}">

            <label>Lote:</label>
            <input type="text" id="edit-lote" value="${animal.lote}">

            <label>Cantidad de Partos:</label>
            <input type="number" id="edit-cantidadPartos" value="${animal.cantidadPartos}">

            <label>Fecha Último Parto:</label>
            <input type="date" id="edit-fechaUltimoParto" value="${animal.fechaUltimoParto}">

            <div class="modal-buttons">
                <button id="guardar-edicion">Guardar</button>
                <button id="cerrar-modal">Cancelar</button>
            </div>
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

        const nuevoSexo = document.getElementById("edit-sexo").value;
        const nuevaMarca = document.getElementById("edit-marca").value;
        const nuevaEdad = parseInt(document.getElementById("edit-edad").value);
        const nuevaRaza = document.getElementById("edit-raza").value.trim();
        const nuevoPeso = parseFloat(document.getElementById("edit-peso").value);
        const nuevoProposito = document.getElementById("edit-proposito").value;
        const nuevaFechaNacimiento = document.getElementById("edit-fechaNacimiento").value;
        const nuevoLote = document.getElementById("edit-lote").value.trim();
        const nuevaCantidadPartos = parseInt(document.getElementById("edit-cantidadPartos").value);
        const nuevaFechaUltimoParto = document.getElementById("edit-fechaUltimoParto").value;

        if (!nuevoSexo || !nuevaMarca || isNaN(nuevaEdad) || !nuevaRaza || isNaN(nuevoPeso) || !nuevoProposito || !nuevaFechaNacimiento || !nuevoLote || isNaN(nuevaCantidadPartos) || !nuevaFechaUltimoParto) {
            alert("Por favor, complete todos los campos correctamente.");
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:5001/animales/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sexo: nuevoSexo,
                    marca: nuevaMarca,
                    edad: nuevaEdad,
                    raza: nuevaRaza,
                    peso: nuevoPeso,
                    proposito: nuevoProposito,
                    fechaNacimiento: nuevaFechaNacimiento,
                    lote: nuevoLote,
                    cantidadPartos: nuevaCantidadPartos,
                    fechaUltimoParto: nuevaFechaUltimoParto
                })
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



// FUNCION PARA ELIMINAR ANIMAL
async function eliminarAnimal(id) {
    const confirmacion = confirm("¿Estás seguro de que deseas eliminar este animal?");
    if (!confirmacion) {
        console.log("❌ Eliminación cancelada.");
        return;
    }

    console.log(`🗑 Eliminando animal con ID: ${id}...`);

    try {
        const response = await fetch(`http://127.0.0.1:5001/animales/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error("No se pudo eliminar el animal.");
        }

        alert("✅ Animal eliminado correctamente.");
        btnAnimales.click(); // Recargar lista de animales
    } catch (error) {
        console.error("❌ Error al eliminar el animal:", error);
        alert("Hubo un error al eliminar el animal.");
    }
}


// FUNCION PARA DESPLEGAR FORMULARIO AGREGAR ANIMAL
function mostrarFormularioAgregar() {
    console.log("➕ Mostrando formulario para agregar un nuevo animal");

    // Si ya existe un modal abierto, lo eliminamos antes de crear otro
    const modalExistente = document.querySelector(".modal");
    if (modalExistente) {
        modalExistente.remove();
    }

    // Crear el modal de agregar
    const modal = document.createElement("div");
    modal.classList.add("modal", "show");

    modal.innerHTML = `
        <div class="modal-content">
            <h2>Agregar Nuevo Animal</h2>

            <label>Sexo:</label>
            <select id="add-sexo">
                <option value="Macho">Macho</option>
                <option value="Hembra">Hembra</option>
            </select>

            <label>Marca:</label>
            <select id="add-marca">
                <option value="BHQZ">BHQZ</option>
                <option value="PP8">PP8</option>
            </select>

            <label>Edad:</label>
            <input type="number" id="add-edad">

            <label>Raza:</label>
            <input type="text" id="add-raza">

            <label>Peso:</label>
            <input type="number" id="add-peso">

            <label>Propósito:</label>
            <select id="add-proposito">
                <option value="Lecheria">Lechería</option>
                <option value="Cria">Cría</option>
                <option value="DobleProposito">Doble Propósito</option>
            </select>

            <label>Fecha de Nacimiento:</label>
            <input type="date" id="add-fechaNacimiento">

            <label>Lote:</label>
            <input type="text" id="add-lote">

            <label>Cantidad de Partos:</label>
            <input type="number" id="add-cantidadPartos">

            <label>Fecha Último Parto:</label>
            <input type="date" id="add-fechaUltimoParto">

            <div class="modal-buttons">
                <button id="guardar-animal">Guardar</button>
                <button id="cerrar-modal-agregar">Cancelar</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Evento para cerrar el modal
    document.getElementById("cerrar-modal-agregar").addEventListener("click", () => {
        console.log("🛑 Cancelando agregar animal.");
        modal.remove();
    });

    // Evento para guardar el nuevo animal
    document.getElementById("guardar-nuevo-animal").addEventListener("click", agregarAnimal);
}


    



// FUNCION PARA ENVIAR LOS DATOS AL BACKEND DE AGREGAR ANIMAL
async function agregarAnimal() {
    console.log("💾 Guardando nuevo animal...");

    const nuevoAnimal = {
        sexo: document.getElementById("new-sexo").value,
        marca: document.getElementById("new-marca").value,
        edad: parseInt(document.getElementById("new-edad").value),
        raza: document.getElementById("new-raza").value.trim(),
        peso: parseFloat(document.getElementById("new-peso").value),
        proposito: document.getElementById("new-proposito").value,
        fechaNacimiento: document.getElementById("new-fechaNacimiento").value,
        lote: document.getElementById("new-lote").value.trim(),
        cantidadPartos: parseInt(document.getElementById("new-cantidadPartos").value) || 0,
        fechaUltimoParto: document.getElementById("new-fechaUltimoParto").value || null
    };

    if (!nuevoAnimal.raza || isNaN(nuevoAnimal.edad) || isNaN(nuevoAnimal.peso) || !nuevoAnimal.fechaNacimiento || !nuevoAnimal.lote) {
        alert("⚠ Por favor, complete todos los campos obligatorios.");
        return;
    }

    try {
        const response = await fetch("http://127.0.0.1:5001/animales", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevoAnimal)
        });

        if (!response.ok) {
            throw new Error("No se pudo agregar el animal.");
        }

        alert("✅ Animal agregado correctamente.");
        document.querySelector(".modal").remove();
        cargarAnimales(); // Recargar la lista
    } catch (error) {
        console.error("❌ Error al agregar el animal:", error);
        alert("Hubo un error al agregar el animal.");
    }
}
