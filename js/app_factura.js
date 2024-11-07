document.addEventListener('DOMContentLoaded', function() {
    const facturasList = document.getElementById('facturasList');
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const facturaForm = document.getElementById('facturaForm');
    const openModalButton = document.getElementById('openModal');
    const closeModalButton = document.getElementById('closeModal');
    const deleteModal = document.getElementById('deleteModal');
    const cancelDeleteButton = document.getElementById('cancelDelete');
    const confirmDeleteButton = document.getElementById('confirmDelete');
    let currentFacturaId = null;

    // Cargar facturas
    function loadFacturas() {
        fetch('server_factura.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'action=fetch'
        })
        .then(response => response.json())
        .then(facturas => {
            facturasList.innerHTML = '';
            facturas.forEach(factura => {
                const card = createFacturaCard(factura);
                facturasList.appendChild(card);
            });
        })
        .catch(error => console.error('Error:', error));
    }

    // Crear tarjeta de factura
    function createFacturaCard(factura) {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg shadow-md p-6 mb-4';
        card.innerHTML = `
            <h3 class="text-xl font-semibold mb-2">Factura #${factura.id_factura}</h3>
            <p class="text-gray-600 mb-2">Cliente: ${factura.cliente_nombre}</p>
            <p class="text-gray-600 mb-2">Usuario: ${factura.usuario_nombre}</p>
            <p class="text-lg font-bold mb-4">Total: $${factura.total}</p>
            <div class="flex justify-end space-x-2">
                <button class="edit-btn px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Editar</button>
                <button class="delete-btn px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Eliminar</button>
            </div>
        `;

        card.querySelector('.edit-btn').addEventListener('click', () => openEditModal(factura));
        card.querySelector('.delete-btn').addEventListener('click', () => openDeleteModal(factura.id_factura));

        return card;
    }

    // Abrir modal para editar
    function openEditModal(factura) {
        modalTitle.textContent = 'Editar Factura';
        document.getElementById('facturaId').value = factura.id_factura;
        document.getElementById('id_cliente').value = factura.id_cliente;
        document.getElementById('id_usuario').value = factura.id_usuario;
        document.getElementById('total').value = factura.total;
        modal.classList.remove('hidden');
    }

    // Abrir modal para eliminar
    function openDeleteModal(id) {
        currentFacturaId = id;
        deleteModal.classList.remove('hidden');
    }

    // Cargar clientes y usuarios para los selects
    function loadSelectOptions() {
        // Cargar clientes
        fetch('server_cliente.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'action=fetch'
        })
        .then(response => response.json())
        .then(clientes => {
            const clienteSelect = document.getElementById('id_cliente');
            clienteSelect.innerHTML = '<option value="">Seleccione un cliente</option>';
            clientes.forEach(cliente => {
                clienteSelect.innerHTML += `<option value="${cliente.id_cliente}">${cliente.nombre}</option>`;
            });
        })
        .catch(error => console.error('Error:', error));

        // Cargar usuarios
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

    // Evento para abrir modal (nueva factura)
    openModalButton.addEventListener('click', () => {
        modalTitle.textContent = 'Nueva Factura';
        facturaForm.reset();
        document.getElementById('facturaId').value = '';
        modal.classList.remove('hidden');
        loadSelectOptions();
    });

    // Evento para cerrar modal
    closeModalButton.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    // Evento para enviar formulario
    facturaForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(facturaForm);
        const id = document.getElementById('facturaId').value;
        formData.append('action', id ? 'update' : 'add');
        if (id) formData.append('id', id);

        fetch('server_factura.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                modal.classList.add('hidden');
                loadFacturas();
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
        if (currentFacturaId) {
            fetch('server_factura.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `action=delete&id=${currentFacturaId}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    deleteModal.classList.add('hidden');
                    loadFacturas();
                } else {
                    alert(data.message);
                }
            })
            .catch(error => console.error('Error:', error));
        }
    });

    // Cargar facturas al iniciar
    loadFacturas();
});