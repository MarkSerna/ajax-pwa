document.addEventListener('DOMContentLoaded', function() {
    const mainContent = document.getElementById('mainContent');

    // Función para crear una tarjeta
    function createCard(title, value, icon, link) {
        const card = document.createElement('a');
        card.href = link;
        card.className = 'bg-white shadow-md rounded-lg p-6 flex items-center justify-between hover:bg-indigo-50 transition-colors duration-300';
        card.innerHTML = `
            <div>
                <h3 class="text-xl font-semibold text-gray-700">${title}</h3>
                <p class="text-3xl font-bold text-indigo-600 mt-2">${value}</p>
            </div>
            <div class="text-indigo-500 text-4xl">
                ${icon}
            </div>
        `;
        return card;
    }

    // Función para cargar los datos y crear las tarjetas
    function loadDashboardData() {
        Promise.all([
            fetch('server_cliente.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'action=countActiveClients'
            }).then(response => response.json()),
            fetch('server_factura.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'action=countInvoices'
            }).then(response => response.json()),
            fetch('server_producto.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'action=countProducts'
            }).then(response => response.json())
        ]).then(([activeClients, invoices, products]) => {
            const cardContainer = document.createElement('div');
            cardContainer.className = 'grid grid-cols-1 md:grid-cols-3 gap-6 mt-6';

            cardContainer.appendChild(createCard('Clientes con Facturas', activeClients.count, '<svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>', 'cliente.html'));
            cardContainer.appendChild(createCard('Facturas Generadas', invoices.count, '<svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>', 'factura.html'));
            cardContainer.appendChild(createCard('Productos Creados', products.count, '<svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>', 'productos.html'));

            mainContent.appendChild(cardContainer);
        }).catch(error => {
            console.error('Error:', error);
            mainContent.innerHTML += '<p class="text-red-500 mt-4">Error al cargar los datos del dashboard.</p>';
        });
    }

    // Cargar los datos del dashboard
    loadDashboardData();
});