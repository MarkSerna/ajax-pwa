document.addEventListener('DOMContentLoaded', function() {
    const productosList = document.getElementById('productosList');
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const productoForm = document.getElementById('productoForm');
    const openModalButton = document.getElementById('openModal');
    const closeModalButton = document.getElementById('closeModal');
    const deleteModal = document.getElementById('deleteModal');
    const cancelDeleteButton = document.getElementById('cancelDelete');
    const confirmDeleteButton = document.getElementById('confirmDelete');
    let currentProductoId = null;

    // Cargar productos
    function loadProductos() {
        fetch('server_producto.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'action=fetch'
        })
        .then(response => response.json())
        .then(productos => {
            productosList.innerHTML = '';
            productos.forEach(producto => {
                const card = createProductoCard(producto);
                productosList.appendChild(card);
            });
        })
        .catch(error => console.error('Error:', error));
    }

    // Crear tarjeta de producto
    function createProductoCard(producto) {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg shadow-md p-6';
        card.innerHTML = `
            <h3 class="text-xl font-semibold mb-2">${producto.nombre}</h3>
            <p class="text-gray-600 mb-4">${producto.descripcion}</p>
            <p class="text-lg font-bold mb-2">Precio: $${producto.precio}</p>
            <p class="text-md mb-4">Stock: ${producto.stock}</p>
            <div class="flex justify-end space-x-2">
                <button class="edit-btn px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Editar</button>
                <button class="delete-btn px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Eliminar</button>
            </div>
        `;

        card.querySelector('.edit-btn').addEventListener('click', () => openEditModal(producto));
        card.querySelector('.delete-btn').addEventListener('click', () => openDeleteModal(producto.id_producto));

        return card;
    }

    // Abrir modal para editar
    function openEditModal(producto) {
        modalTitle.textContent = 'Editar Producto';
        document.getElementById('productoId').value = producto.id_producto;
        document.getElementById('nombre').value = producto.nombre;
        document.getElementById('descripcion').value = producto.descripcion;
        document.getElementById('precio').value = producto.precio;
        document.getElementById('stock').value = producto.stock;
        modal.classList.remove('hidden');
    }

    // Abrir modal para eliminar
    function openDeleteModal(id) {
        currentProductoId = id;
        deleteModal.classList.remove('hidden');
    }

    // Evento para abrir modal (nuevo producto)
    openModalButton.addEventListener('click', () => {
        modalTitle.textContent = 'Nuevo Producto';
        productoForm.reset();
        document.getElementById('productoId').value = '';
        modal.classList.remove('hidden');
    });

    // Evento para cerrar modal
    closeModalButton.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    // Evento para enviar formulario
    productoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(productoForm);
        const id = document.getElementById('productoId').value;
        formData.append('action', id ? 'update' : 'add');
        if (id) formData.append('id', id);

        fetch('server_producto.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                modal.classList.add('hidden');
                loadProductos();
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
        if (currentProductoId) {
            fetch('server_producto.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `action=delete&id=${currentProductoId}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    deleteModal.classList.add('hidden');
                    loadProductos();
                } else {
                    alert(data.message);
                }
            })
            .catch(error => console.error('Error:', error));
        }
    });

    // Cargar productos al iniciar
    loadProductos();
});