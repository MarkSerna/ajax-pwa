const modal = document.getElementById("modal");
const openModal = document.getElementById("openModal");
const closeModal = document.getElementById("closeModal");
const dataForm = document.getElementById("dataForm");
const dataList = document.getElementById("dataList");
const modalExito = document.getElementById("modalExito");
const mensajeExito = document.getElementById("mensajeExito");
const modalEliminar = document.getElementById("modalEliminar");
const btnEliminar = document.getElementById("btnEliminar");
let currentId = null;

function abrirModal() {
    modal.classList.remove("hidden");
    modal.classList.add("active");
    dataForm.reset();
    document.getElementById("id").value = '';
}

function cerrarModal() {
    modal.classList.remove("active");
    modal.classList.add("hidden");
    currentId = null;
}

openModal.addEventListener("click", abrirModal);
closeModal.addEventListener("click", cerrarModal);

modal.addEventListener("click", (event) => {
    if (event.target === modal) cerrarModal();
});

function showModalExito(message) {
    mensajeExito.textContent = message;
    modalExito.classList.remove("hidden");
    setTimeout(() => {
        modalExito.classList.add("hidden");
        cerrarModal();
    }, 3000);
}

async function fetchUsers() {
    try {
        const response = await fetch("server_usuario.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: "action=fetch",
        });
        const users = await response.json();
        
        dataList.innerHTML = users.length ? '' : "<p>No hay usuarios disponibles.</p>";
        users.forEach(user => {
            const userCard = document.createElement("div");
            userCard.className = "p-4 border rounded-lg shadow-md bg-white";
            userCard.innerHTML = `
                <h3 class="text-lg font-semibold">${user.nombre}</h3>
                <p>Email: ${user.email}</p>
                <p>Teléfono: ${user.telefono}</p>
                <div class="mt-4 flex justify-between">
                    <button onclick="editUser(${user.id})" class="bg-blue-500 text-white px-4 py-2 rounded">Editar</button>
                    <button onclick="confirmDelete(${user.id})" class="bg-red-500 text-white px-4 py-2 rounded">Eliminar</button>
                </div>
            `;
            dataList.appendChild(userCard);
        });
    } catch (error) {
        console.error("Error al cargar usuarios:", error);
        dataList.innerHTML = "<p>Ocurrió un error al cargar los usuarios.</p>";
    }
}

async function editUser(id) {
    try {
        const formData = new FormData();
        formData.append('action', 'fetch');
        formData.append('id', id);

        const response = await fetch("server_usuario.php", {
            method: "POST",
            body: formData
        });
        
        const user = await response.json();

        if (user && user.id) {
            document.getElementById("id").value = user.id;
            document.getElementById("nombre").value = user.nombre;
            document.getElementById("email").value = user.email;
            document.getElementById("telefono").value = user.telefono;
            document.getElementById("contrasenia").value = user.password;
            currentId = id;
            modal.classList.remove("hidden");
            modal.classList.add("active");
        } else {
            showModalExito("Error al cargar los datos del usuario.");
        }
    } catch (error) {
        console.error("Error al cargar usuario:", error);
        showModalExito("Ocurrió un error al intentar cargar los datos del usuario.");
    }
}

dataForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(dataForm);
    const action = currentId ? "update" : "add";
    formData.append("action", action);
    if (currentId) formData.append("id", currentId);

    try {
        const response = await fetch("server_usuario.php", {
            method: "POST",
            body: formData,
        });
        const data = await response.json();
        
        if (data.success) {
            showModalExito(data.message);
            fetchUsers();
            currentId = null;
        } else {
            console.log("Error: " + data.message);
        }
    } catch (error) {
        console.error("Error en el guardado:", error);
    }
});

function confirmDelete(id) {
    currentId = id;
    modalEliminar.classList.remove("hidden");
}

btnEliminar.addEventListener("click", async () => {
    try {
        const formData = new FormData();
        formData.append('action', 'delete');
        formData.append('id', currentId);

        const response = await fetch("server_usuario.php", {
            method: "POST",
            body: formData
        });
        const data = await response.json();
        
        if (data.success) {
            showModalExito(data.message);
            fetchUsers();
            currentId = null;
        }
        modalEliminar.classList.add("hidden");
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
    }
});

document.getElementById("btnCancelar").addEventListener("click", () => {
    modalEliminar.classList.add("hidden");
});

document.addEventListener("DOMContentLoaded", fetchUsers);