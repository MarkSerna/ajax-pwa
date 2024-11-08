document.addEventListener('DOMContentLoaded', function() {
    const facturaSelect = document.getElementById('facturaSelect');
    const detallesList = document.getElementById('detallesList');
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const detalleForm = document.getElementById('detalleForm');
    const openModalButton = document.getElementById('openModal');
    const closeModalButton = document.getElementById('closeModal');
    const deleteModal = document.getElementById('deleteModal');
    const cancelDeleteButton = document.getElementById('cancelDelete');
    const confirmDeleteButton = document.getElementById('confirmDelete');
    let currentDetalleId = null;
    let currentFacturaId = null;

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
            facturaSelect.innerHTML = '<option value="">Seleccione una factura</option>';
            facturas.forEach(factura => {
                facturaSelect.innerHTML += `<option value="${factura.id_factura}">Factura #${factura.id_factura} - ${factura.cliente_nombre}</option>`;
            });
        })
        .catch(error => console.error('Error:', error));
    }

function loadDetalles(facturaId) {
    fetch('server_detalle_factura.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `action=fetch&id_factura=${facturaId}`
    })
    .then(response => response.json())
    .then(detalles => {
        detallesList.innerHTML = '';
        detalles.forEach(detalle => {
            const row = createDetalleRow(detalle);
            detallesList.appendChild(row);
        });
    })
    .catch(error => console.error('Error:', error));
}

function createDetalleRow(detalle) {
    const row = document.createElement('div');
    row.className = 'flex items-center justify-between bg-white p-4 border-b border-gray-200';

    const totalPrecio = (detalle.cantidad * detalle.precio_unitario).toFixed(2);

    row.innerHTML = `
        <div>
            <p class="font-semibold">${detalle.producto_nombre}</p>
            <p class="text-sm text-gray-600">Cantidad: ${detalle.cantidad}, Total: $${totalPrecio}</p>
        </div>
        <div class="flex space-x-2">
            <button class="edit-btn bg-blue-500 text-white rounded p-2 hover:bg-blue-700" title="Editar">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="m7 17.013l4.413-.015l9.632-9.54c.378-.378.586-.88.586-1.414s-.208-1.036-.586-1.414l-1.586-1.586c-.756-.756-2.075-.752-2.825-.003L7 12.583zM18.045 4.458l1.589 1.583l-1.597 1.582l-1.586-1.585zM9 13.417l6.03-5.973l1.586 1.586l-6.029 5.971L9 15.006z"/>
                    <path d="M5 21h14c1.103 0 2-.897 2-2v-8.668l-2 2V19H8.158c-.026 0-.053.01-.079.01c-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2"/>
                </svg>
            </button>
            <button class="delete-btn bg-red-500 text-white rounded p-2 hover:bg-blue-700" title="Eliminar">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 11v6m-4-6v6M6 7v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7M4 7h16M7 7l2-4h6l2 4"/>
                </svg>
            </button>
        </div>
    `;
    row.querySelector('.edit-btn').addEventListener('click', () => openEditModal(detalle));
    row.querySelector('.delete-btn').addEventListener('click', () => openDeleteModal(detalle.id_detalle));

    return row;
}

    function openEditModal(detalle) {
        modalTitle.textContent = 'Editar Detalle';
        document.getElementById('detalleId').value = detalle.id_detalle;
        document.getElementById('id_producto').value = detalle.id_producto;
        document.getElementById('cantidad').value = detalle.cantidad;
        document.getElementById('precio_unitario').value = detalle.precio_unitario;
        document.getElementById('subtotal').value = (detalle.cantidad * detalle.precio_unitario).toFixed(2);
        modal.classList.remove('hidden');
    }

    function openDeleteModal(id) {
        currentDetalleId = id;
        deleteModal.classList.remove('hidden');
    }

function loadProductos() {
    fetch('server_producto.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'action=fetch'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
    })
    .then(productos => {
        console.log('Productos cargados:', productos);

        const productoSelect = document.getElementById('id_producto');
        productoSelect.innerHTML = '<option value="">Seleccione un producto</option>';

        if (Array.isArray(productos) && productos.length > 0) {
            productos.forEach(producto => {
                productoSelect.innerHTML += `<option value="${producto.id_producto}" data-precio="${producto.precio}">${producto.nombre}</option>`;
            });
        } else {
            productoSelect.innerHTML = '<option value="">No hay productos disponibles</option>';
        }
    })
    .catch(error => console.error('Error al cargar productos:', error));
}

    facturaSelect.addEventListener('change', function() {
        currentFacturaId = this.value;
        if (currentFacturaId) {
            loadDetalles(currentFacturaId);
            openModalButton.disabled = false;
        } else {
            detallesList.innerHTML = '';
            openModalButton.disabled = true;
        }
    });

    openModalButton.addEventListener('click', () => {
        modalTitle.textContent = 'Nuevo Detalle';
        detalleForm.reset();
        document.getElementById('detalleId').value = '';
        modal.classList.remove('hidden');
        loadProductos();
    });

    closeModalButton.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    document.getElementById('cantidad').addEventListener('input', calcularSubtotal);
    document.getElementById('id_producto').addEventListener('change', calcularSubtotal);

    function calcularSubtotal() {
        const cantidad = document.getElementById('cantidad').value;
        const productoSelect = document.getElementById('id_producto');
        const selectedOption = productoSelect.options[productoSelect.selectedIndex];
        const precio = selectedOption ? selectedOption.dataset.precio : 0;
        
        document.getElementById('precio_unitario').value = precio;
        document.getElementById('subtotal').value = (cantidad * precio).toFixed(2);
    }

    detalleForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(detalleForm);
        const id = document.getElementById('detalleId').value;
        formData.append('action', id ? 'update' : 'add');
        formData.append('id_factura', currentFacturaId);
        if (id) formData.append('id', id);

        fetch('server_detalle_factura.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                modal.classList.add('hidden');
                loadDetalles(currentFacturaId);
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
        if (currentDetalleId) {
            fetch('server_detalle_factura.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `action=delete&id=${currentDetalleId}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    deleteModal.classList.add('hidden');
                    loadDetalles(currentFacturaId);
                } else {
                    alert(data.message);
                }
            })
            .catch(error => console.error('Error:', error));
        }
    });

    loadFacturas();
});