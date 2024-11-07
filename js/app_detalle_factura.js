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

    // Cargar facturas para el select
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

    // Cargar detalles de factura
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
                const card = createDetalleCard(detalle);
                detallesList.appendChild(card);
            });
        })
        .catch(error => console.error('Error:', error));
    }

    // Crear tarjeta de detalle
    function createDetalleCard(detalle) {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg shadow-md p-6 mb-4';
        card.innerHTML = `
            <h3 class="text-xl font-semibold mb-2">${detalle.producto_nombre}</h3>
            <p class="text-gray-600 mb-2">Cantidad: ${detalle.cantidad}</p>
            <p class="text-gray-600 mb-2">Precio Unitario: $${detalle.precio_unitario}</p>
            <p class="text-lg font-bold mb-4">Subtotal: $${(detalle.cantidad * detalle.precio_unitario).toFixed(2)}</p>
            <div class="flex justify-end space-x-2">
                <button class="edit-btn px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Editar</button>
                <button class="delete-btn px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Eliminar</button>
            </div>
        `;

        card.querySelector('.edit-btn').addEventListener('click', () => openEditModal(detalle));
        card.querySelector('.delete-btn').addEventListener('click', () => openDeleteModal(detalle.id_detalle));

        return card;
    }

    // Abrir modal para editar
    function openEditModal(detalle) {
        modalTitle.textContent = 'Editar Detalle';
        document.getElementById('detalleId').value = detalle.id_detalle;
        document.getElementById('id_producto').value = detalle.id_producto;
        document.getElementById('cantidad').value = detalle.cantidad;
        document.getElementById('precio_unitario').value = detalle.precio_unitario;
        document.getElementById('subtotal').value = (detalle.cantidad * detalle.precio_unitario).toFixed(2);
        modal.classList.remove('hidden');
    }

    // Abrir modal para eliminar
    function openDeleteModal(id) {
        currentDetalleId = id;
        deleteModal.classList.remove('hidden');
    }

    // Cargar productos para el select
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
            const productoSelect = document.getElementById('id_producto');
            productoSelect.innerHTML = '<option value="">Seleccione un producto</option>';
            productos.forEach(producto => {
                productoSelect.innerHTML += `<option value="${producto.id_producto}" data-precio="${producto.precio}">${producto.nombre}</option>`;
            });
        })
        .catch(error => console.error('Error:', error));
    }

    // Evento para seleccionar factura
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

    // Evento para abrir modal (nuevo detalle)
    openModalButton.addEventListener('click', () => {
        modalTitle.textContent = 'Nuevo Detalle';
        detalleForm.reset();
        document.getElementById('detalleId').value = '';
        modal.classList.remove('hidden');
        loadProductos();
    });

    // Evento para cerrar modal
    closeModalButton.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    // Evento para calcular subtotal
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

    // Evento para enviar formulario
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

    // Evento para cancelar eliminación
    cancelDeleteButton.addEventListener('click', () => {
        deleteModal.classList.add('hidden');
    });

    // Evento para confirmar eliminación
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

    // Cargar facturas al iniciar
    loadFacturas();
});