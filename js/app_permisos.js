document.addEventListener('DOMContentLoaded', function() {
    const permisosList = document.getElementById('permisosList');
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const permisoForm = document.getElementById('permisoForm');
    const openModalButton = document.getElementById('openModal');
    const closeModalButton = document.getElementById('closeModal');
    const deleteModal = document.getElementById('deleteModal');
    const cancelDeleteButton = document.getElementById('cancelDelete');
    const confirmDeleteButton = document.getElementById('confirmDelete');
    let currentPermisoId = null;

    // Cargar permisos
    function loadPermisos() {
        fetch('server_permisos_usuario.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'action=fetch'
        })
        .then(response => response.json())
        .then(permisos => {
            permisosList.innerHTML = '';
            permisos.forEach(permiso => {
                const card = createPermisoCard(permiso);
                permisosList.appendChild(card);
            });
        })
        .catch(error => console.error('Error:', error));
    }

    // Crear tarjeta de permiso
    function createPermisoCard(permiso) {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg shadow-md p-6 mb-4';
        card.innerHTML = `
            <h3 class="text-xl font-semibold mb-2">${permiso.usuario_nombre}</h3>
            <p class="text-gray-600 mb-4">Permiso: ${permiso.permiso}</p>
            <div class="flex justify-end space-x-2">
                <button class="edit-btn px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Editar</button>
                <button class="delete-btn px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Eliminar</button>
            </div>
        `;

        card.querySelector('.edit-btn').addEventListener('click', () => openEditModal(permiso));
        card.querySelector('.delete-btn').addEventListener('click', () => openDeleteModal(permiso.id_permiso));

        return card;
    }

    // Abrir modal para editar
    function openEditModal(permiso) {
        modalTitle.textContent = 'Editar Permiso';
        document.getElementById('permisoId').value = permiso.id_permiso;
        document.getElementById('id_usuario').value = permiso.id_usuario;
        document.getElementById('permiso').value = permiso.permiso;
        modal.classList.remove('hidden');
    }

    // Abrir modal para eliminar
    function openDeleteModal(id) {
        currentPermisoId = id;
        deleteModal.classList.remove('hidden');
    }

    // Cargar usuarios para el select
    function loadUsuarios() {
        fetch('server_usuario.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'action=fetch'
        })
        .then(response => response.json())
        .then(usuarios => {
            const usuarioSelect = document.getElementById('id_usuario');
            usuarioSelect.innerHTML = '<option value="">Seleccione un usuario</option>';
            usuarios.forEach(usuario => {
                usuarioSelect.innerHTML += `<option value="${usuario.id}">${usuario.nombre}</option>`;
            });
        })
        .catch(error => console.error('Error:', error));
    }

    // Evento para abrir modal (nuevo permiso)
    openModalButton.addEventListener('click', () => {
        modalTitle.textContent = 'Nuevo Permiso';
        permisoForm.reset();
        document.getElementById('permisoId').value = '';
        modal.classList.remove('hidden');
        loadUsuarios();
    });

    // Evento para cerrar modal
    closeModalButton.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    // Evento para enviar formulario
    permisoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(permisoForm);
        const id = document.getElementById('permisoId').value;
        formData.append('action', id ? 'update' : 'add');
        if (id) formData.append('id', id);

        fetch('server_permisos_usuario.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                modal.classList.add('hidden');
                loadPermisos();
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    });

    // Evento para cancelar eliminación
    cancelDeleteButton.addEventListener('click', () => {
        deleteModal.classList.add('hidden');
    });

    // Evento para confirmar eliminación
    confirmDeleteButton.addEventListener('click', () => {
        if (currentPermisoId) {
            fetch('server_permisos_usuario.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `action=delete&id=${currentPermisoId}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    deleteModal.classList.add('hidden');
                    loadPermisos();
                } else {
                    alert(data.message);
                }
            })
            .catch(error => console.error('Error:', error));
        }
    });

    // Cargar permisos al iniciar
    loadPermisos();
});