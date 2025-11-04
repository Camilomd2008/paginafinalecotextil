// ===================================================================
// carrito.js - Lógica EXCLUSIVA de la tabla del carrito
// Este archivo DEBE cargarse DESPUÉS de chatbot.js en el HTML.
// ===================================================================

// Formatear precio a COP
function formatearPrecio(num) {
    return num.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 });
}

// Recuperar carrito del localStorage
// Se declara como "let" para poder reasignarla al eliminar y actualizar
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Elementos del DOM
const tbody = document.querySelector('#carrito-items tbody');
const totalDiv = document.getElementById('total');
const filtroInput = document.getElementById('filtro-productos');
const ordenarSelect = document.getElementById('ordenar-precio');
const clearCartBtn = document.getElementById('clear-cart');

// Mostrar carrito
function mostrarCarrito() {
    // Re-leer el carrito desde localStorage para sincronizar con otras páginas
    carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Debug: ver lo que hay en localStorage
    console.log('mostrarCarrito - carrito leído desde localStorage:', carrito);

    // Si la tabla del carrito no existe en esta página, solo actualizamos el contador global.
    if (!tbody) {
        if (typeof actualizarContadorCarrito === 'function') {
            actualizarContadorCarrito();
        } else {
            // Fallback: actualizar contador directamente si la función global no existe
            const contador = document.getElementById('contador-carrito');
            if (contador) {
                const cantidadTotal = carrito.reduce((acc, item) => acc + (item.cantidad || 0), 0);
                contador.textContent = cantidadTotal;
            }
        }
        return;
    }

    tbody.innerHTML = '';
    let total = 0;

    const filtro = filtroInput ? filtroInput.value.toLowerCase() : '';
    let productos = carrito.filter(p => (p.nombre || '').toLowerCase().includes(filtro));

    // Ordenar por precio (asegurar que precio sea número)
    if (ordenarSelect) {
        if (ordenarSelect.value === 'asc') productos.sort((a, b) => (Number(a.precio) || 0) - (Number(b.precio) || 0));
        if (ordenarSelect.value === 'desc') productos.sort((a, b) => (Number(b.precio) || 0) - (Number(a.precio) || 0));
    }

    productos.forEach(p => {
        const subtotal = (Number(p.precio) || 0) * (Number(p.cantidad) || 0);
        total += subtotal;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${p.imagen || 'https://via.placeholder.com/50'}" style="width:50px; height:50px; object-fit:cover; border-radius:8px; margin-right:10px;" />
                ${p.nombre || ''}
            </td>
            <td>
                <input type="number" class="cantidad-input" data-nombre="${p.nombre}" value="${p.cantidad}" min="1" style="width:50px; text-align:center;" />
            </td>
            <td>${formatearPrecio(Number(p.precio) || 0)}</td>
            <td>${formatearPrecio(subtotal)}</td>
            <td><button class="remove-item" data-nombre="${p.nombre}">Eliminar</button></td>
        `;
        tbody.appendChild(row);
    });

    if (totalDiv) totalDiv.textContent = `Total: ${formatearPrecio(total)}`;

    // Guardar el carrito sincronizado (por si hubo modificaciones indirectas)
    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Actualizar el contador (llama la función global o fallback)
    if (typeof actualizarContadorCarrito === 'function') {
        actualizarContadorCarrito();
    } else {
        const contador = document.getElementById('contador-carrito');
        if (contador) {
            const cantidadTotal = carrito.reduce((acc, item) => acc + (item.cantidad || 0), 0);
            contador.textContent = cantidadTotal;
        }
    }
}


// ===================================================================
// CONTROLADOR DE EVENTOS PRINCIPAL (DOM Content Loaded)
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {

    // Cambiar cantidad y Eliminar producto (solo si tbody existe)
    if (tbody) {
        // Delegación para cambios de cantidad
        tbody.addEventListener('input', e => {
            if (e.target.classList.contains('cantidad-input')) {
                const nombre = e.target.dataset.nombre;
                let nuevaCantidad = parseInt(e.target.value, 10);
                if (isNaN(nuevaCantidad) || nuevaCantidad < 1) {
                    nuevaCantidad = 1;
                    e.target.value = 1;
                }
                // Actualiza en la variable carrito en memoria
                const producto = carrito.find(p => p.nombre === nombre);
                if (producto) {
                    producto.cantidad = nuevaCantidad;
                    // IMPORTANTE: persistir inmediatamente antes de volver a renderizar
                    localStorage.setItem('carrito', JSON.stringify(carrito));
                    mostrarCarrito(); // Vuelve a renderizar y actualiza el contador
                } else {
                    // Si por alguna razón no existe (sincronización), forzar re-render
                    mostrarCarrito();
                }
            }
        });

        // Delegación para eliminar
        tbody.addEventListener('click', e => {
            if (e.target.classList.contains('remove-item')) {
                const nombre = e.target.dataset.nombre;
                carrito = carrito.filter(p => p.nombre !== nombre);
                // IMPORTANTE: persistir inmediatamente antes de volver a renderizar
                localStorage.setItem('carrito', JSON.stringify(carrito));
                mostrarCarrito(); // Vuelve a renderizar y actualiza el contador
            }
        });
    }

    // Vaciar carrito con confirmación
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            if (confirm("¿Seguro que deseas vaciar el carrito?")) {
                carrito = [];
                localStorage.removeItem('carrito');
                mostrarCarrito(); // Vuelve a renderizar y actualiza el contador
                alert("El carrito ha sido vaciado correctamente.");
            }
        });
    }

    // Filtrar y ordenar
    if (filtroInput) filtroInput.addEventListener('input', mostrarCarrito);
    if (ordenarSelect) ordenarSelect.addEventListener('change', mostrarCarrito);

    // Inicializar la vista del carrito
    mostrarCarrito();

    // Confirmación de sugerencia
    const form = document.getElementById('sugerencias-form');
    const mensaje = document.getElementById('mensaje-confirmacion');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (mensaje) mensaje.style.display = 'block';
            form.reset();
        });
    }
});
