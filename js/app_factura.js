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
    const modalProductos = document.getElementById('modalProductos');
    const closeModalProductos = document.getElementById('closeModalProductos');
    const productosListContainer = document.getElementById('productosListContainer');
    let currentFacturaId = null;

    function getCurrentDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

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

    function createFacturaCard(factura) {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg shadow-md p-6 mb-4';
        card.innerHTML = `
            <h3 class="text-xl font-semibold mb-2">Factura #${factura.id_factura}</h3>
            <p class="text-gray-600 mb-2">Cliente: ${factura.cliente_nombre}</p>
            <p class="text-gray-600 mb-2">Fecha: ${factura.fecha}</p>
            <p class="text-lg font-bold mb-4">Total: $${factura.total}</p>
            <div class="flex justify-end space-x-2">
                <button onclick="showProductos(${factura.id_factura}, '${factura.cliente_nombre}', '${factura.fecha}', ${factura.total})" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Ver Productos</button>
                <button class="edit-btn px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Editar</button>
                <button class="delete-btn px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Eliminar</button>
            </div>
        `;

        card.querySelector('.edit-btn').addEventListener('click', () => openEditModal(factura));
        card.querySelector('.delete-btn').addEventListener('click', () => openDeleteModal(factura.id_factura));

        return card;
    }
    

    window.showProductos = async function(facturaId, clienteNombre, fecha, total) {
        try {
            const response = await fetch('server_factura.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `action=getProducts&id=${facturaId}`
            });
            const productos = await response.json();
            
            productosListContainer.innerHTML = `
                <div class="text-center mb-6 print:text-sm">
                    <h1 class="text-2xl font-bold">Sistema de Facturación S.A.S</h1>
                    <p class="text-sm">123456789-1</p>
                    <p class="text-sm">Calle falsa 123</p>
                    <p class="text-sm">Manizales - Tels: / 3120000000</p>
                    <p class="text-sm">Resolución DIAN 12345678/1234</p>
                    <p class="text-sm">Autorizada el: ${fecha}</p>
                    <p class="text-sm">Prefijo POS Del: 1 Al: 1000000</p>
                    <p class="text-sm">Responsable de IVA</p>
                </div>
                <div class="border-t border-b border-gray-200 py-4 mb-4">
                    <h2 class="text-xl font-semibold text-center mb-2">Factura de venta: POS - ${facturaId}</h2>
                    <div class="grid grid-cols-2 gap-2 text-sm">
                        <p><span class="font-semibold">Fecha:</span> ${fecha}</p>
                        <p><span class="font-semibold">Cliente:</span> ${clienteNombre}</p>
                        <p><span class="font-semibold">C.C / NIT:</span> 222222222-0</p>
                        <p><span class="font-semibold">Dirección:</span> CALLE FALSA 123</p>
                    </div>
                </div>
                <table class="w-full text-sm mb-4">
                    <thead>
                        <tr class="border-b">
                            <th class="text-left py-2">CT</th>
                            <th class="text-left py-2">Descripción</th>
                            <th class="text-right py-2">Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${productos.map(producto => `
                            <tr class="border-b">
                                <td class="py-2">${producto.cantidad}</td>
                                <td class="py-2">${producto.nombre}</td>
                                <td class="py-2 text-right">$${producto.precio}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="border-t pt-4">
                    <div class="flex justify-between font-bold">
                        <span>Total:</span>
                        <span>$${total}</span>
                    </div>
                    <div class="mt-4">
                        <p class="text-center text-sm">Forma de Pago</p>
                        <p class="text-center">Efectivo: $${total}</p>
                        <p class="text-center">Cambio: $0</p>
                    </div>
                    <div class="mt-4 text-center text-xs">
                        <p>Elaborado por: MARKSERNA/POS</p>
                        <p>www.markserna.dev Nit:123.4568.789</p>
                    </div>
                </div>
                <div class="mt-4 flex justify-center">
                    <button onclick="window.print()" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2">
                        Imprimir
                    </button>
                </div>
            `;
            
            modalProductos.classList.remove('hidden');
        } catch (error) {
            console.error('Error:', error);
            productosListContainer.innerHTML = '<p class="text-red-500">Error al cargar los productos.</p>';
        }
    };

    if (closeModalProductos) {
        closeModalProductos.addEventListener('click', () => {
            modalProductos.classList.add('hidden');
        });
    }

    modalProductos.addEventListener('click', (event) => {
        if (event.target === modalProductos) {
            modalProductos.classList.add('hidden');
        }
    });

    function openEditModal(factura) {
        modalTitle.textContent = 'Editar Factura';
        document.getElementById('facturaId').value = factura.id_factura;
        document.getElementById('id_cliente').value = factura.id_cliente;
        const date = new Date(factura.fecha);
        const formattedDate = date.toISOString().split('T')[0];
        document.getElementById('fecha').value = formattedDate;
        document.getElementById('total').value = factura.total;
        loadClientes(factura.id_cliente);
        modal.classList.remove('hidden');
    }

    function openDeleteModal(id) {
        currentFacturaId = id;
        deleteModal.classList.remove('hidden');
    }

    function loadClientes(selectedClienteId = null) {
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
                const option = document.createElement('option');
                option.value = cliente.id_cliente;
                option.textContent = cliente.nombre;
                if (cliente.id_cliente == selectedClienteId) {
                    option.selected = true;
                }
                clienteSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error:', error));
    }

    openModalButton.addEventListener('click', () => {
        modalTitle.textContent = 'Nueva Factura';
        facturaForm.reset();
        document.getElementById('facturaId').value = '';
        document.getElementById('fecha').value = getCurrentDate();
        loadClientes();
        modal.classList.remove('hidden');
    });

    closeModalButton.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

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

    cancelDeleteButton.addEventListener('click', () => {
        deleteModal.classList.add('hidden');
    });

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

    loadFacturas();
});