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
            const row = createProductoRow(producto);
            productosList.appendChild(row);
        });
    })
    .catch(error => console.error('Error:', error));
}

function createProductoRow(producto) {
    const row = document.createElement('div');
    row.className = 'flex items-center justify-between bg-white p-4 border-b border-gray-200';

    row.innerHTML = `
        <div>
            <p class="font-semibold">${producto.nombre}</p>
            <p class="text-sm text-gray-600">Descripción: ${producto.descripcion}</p>
            <p class="text-sm text-gray-600">Precio: $${producto.precio} | Stock: ${producto.stock}</p>
        </div>
        <div class="flex space-x-2">
            <button class="edit-btn bg-blue-500 text-white rounded p-2 hover:bg-blue-700" title="Editar">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="m7 17.013l4.413-.015l9.632-9.54c.378-.378.586-.88.586-1.414s-.208-1.036-.586-1.414l-1.586-1.586c-.756-.756-2.075-.752-2.825-.003L7 12.583zM18.045 4.458l1.589 1.583l-1.597 1.582l-1.586-1.585zM9 13.417l6.03-5.973l1.586 1.586l-6.029 5.971L9 15.006z"/>
                    <path d="M5 21h14c1.103 0 2-.897 2-2v-8.668l-2 2V19H8.158c-.026 0-.053.01-.079.01c-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2"/>
                </svg>
            </button>
            <button class="delete-btn bg-red-500 text-white rounded p-2 hover:bg-red-700" title="Eliminar">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 11v6m-4-6v6M6 7v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7M4 7h16M7 7l2-4h6l2 4"/>
                </svg>
            </button>
        </div>
    `;

    row.querySelector('.edit-btn').addEventListener('click', () => openEditModal(producto));
    row.querySelector('.delete-btn').addEventListener('click', () => openDeleteModal(producto.id_producto));

    return row;
}

    function openEditModal(producto) {
        modalTitle.textContent = 'Editar Producto';
        document.getElementById('productoId').value = producto.id_producto;
        document.getElementById('nombre').value = producto.nombre;
        document.getElementById('descripcion').value = producto.descripcion;
        document.getElementById('precio').value = producto.precio;
        document.getElementById('stock').value = producto.stock;
        modal.classList.remove('hidden');
    }

    function openDeleteModal(id) {
        currentProductoId = id;
        deleteModal.classList.remove('hidden');
    }

    openModalButton.addEventListener('click', () => {
        modalTitle.textContent = 'Nuevo Producto';
        productoForm.reset();
        document.getElementById('productoId').value = '';
        modal.classList.remove('hidden');
    });

    closeModalButton.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

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

    cancelDeleteButton.addEventListener('click', () => {
        deleteModal.classList.add('hidden');
    });

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

    loadProductos();
});