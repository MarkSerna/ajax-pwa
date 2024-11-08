document.addEventListener('DOMContentLoaded', () => {
    const clientesList = document.getElementById('clientesList');
    const modal = document.getElementById('modal');
    const deleteModal = document.getElementById('deleteModal');
    const clienteForm = document.getElementById('clienteForm');
    const modalTitle = document.getElementById('modalTitle');
    let currentClienteId = null;

    function loadClientes() {
        fetch('server_cliente.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'action=fetch'
        })
        .then(response => {
            if (response.headers.get('content-type').includes('application/json')) {
                return response.json();
            } else {
                throw new Error('Invalid JSON response');
            }
        })
        .then(clientes => {
            clientesList.innerHTML = '';
            clientes.forEach(cliente => {
                const card = document.createElement('div');
                card.className = 'bg-white rounded-lg shadow-md p-6';
                card.innerHTML = `
                    <h3 class="text-xl font-semibold mb-2">${cliente.nombre}</h3>
                    <p class="text-gray-600 mb-1">Email: ${cliente.email}</p>
                    <p class="text-gray-600 mb-1">Teléfono: ${cliente.telefono}</p>
                    <p class="text-gray-600 mb-4">Dirección: ${cliente.direccion}</p>
                    <div class="flex justify-end space-x-2">
                        <button onclick="editCliente(${cliente.id_cliente})" class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                            Editar
                        </button>
                        <button onclick="showDeleteModal(${cliente.id_cliente})" class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                            Eliminar
                        </button>
                    </div>
                `;
                clientesList.appendChild(card);
            });
        })
        .catch(error => console.error('Error:', error));
    }

    window.showModal = function(isEdit = false) {
        modalTitle.textContent = isEdit ? 'Editar Cliente' : 'Nuevo Cliente';
        modal.classList.remove('hidden');
    }

    window.editCliente = function(id) {
        currentClienteId = id;
        fetch('server_cliente.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `action=fetch&id=${id}`
        })
        .then(response => response.json())
        .then(cliente => {
            document.getElementById('nombre').value = cliente.nombre;
            document.getElementById('email').value = cliente.email;
            document.getElementById('telefono').value = cliente.telefono;
            document.getElementById('direccion').value = cliente.direccion;
            showModal(true);
        })
        .catch(error => console.error('Error:', error));
    }

    window.showDeleteModal = function(id) {
        currentClienteId = id;
        deleteModal.classList.remove('hidden');
    }

    document.getElementById('openModal').addEventListener('click', () => {
        currentClienteId = null;
        clienteForm.reset();
        showModal(false);
    });

    document.getElementById('closeModal').addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    document.getElementById('cancelDelete').addEventListener('click', () => {
        deleteModal.classList.add('hidden');
    });

    document.getElementById('confirmDelete').addEventListener('click', () => {
        if (currentClienteId) {
            fetch('server_cliente.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `action=delete&id=${currentClienteId}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    deleteModal.classList.add('hidden');
                    loadClientes();
                }
            })
            .catch(error => console.error('Error:', error));
        }
    });

    clienteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(clienteForm);
        formData.append('action', currentClienteId ? 'update' : 'add');
        if (currentClienteId) {
            formData.append('id', currentClienteId);
        }

        fetch('server_cliente.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                modal.classList.add('hidden');
                loadClientes();
            }
        })
        .catch(error => console.error('Error:', error));
    });

    loadClientes();
});