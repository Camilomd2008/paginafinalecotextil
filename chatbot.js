// ===================================================================
// chatbot.js - Lógica de funciones globales y Chatbot Avanzado
// ===================================================================

// Función global: Actualizar Contador del Header (Universal)
function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const cantidadTotal = carrito.reduce((acc, item) => acc + item.cantidad, 0); 
    
    const contador = document.getElementById('contador-carrito');
    if (contador) contador.textContent = cantidadTotal;
}

// Función global: Añadir Producto al Carrito (para botones onclick)
function agregarAlCarrito() {
    const nombre = document.querySelector('.info h2') ? document.querySelector('.info h2').textContent.trim() : 'Producto Desconocido';
    const precioTexto = document.querySelector('.precio') ? document.querySelector('.precio').textContent.replace(/[^\d]/g, '') : '0';
    const precio = parseInt(precioTexto, 10) || 0;
    const cantidad = 1;
    const imagen = document.getElementById('imagen-principal') ? document.getElementById('imagen-principal').src : '';

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const index = carrito.findIndex(item => item.nombre === nombre);

    if (index > -1) {
        carrito[index].cantidad += cantidad;
    } else {
        carrito.push({ nombre, precio, cantidad, imagen });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Mostrar mensaje de confirmación
    const mensajeOk = document.getElementById('mensaje-ok');
    if (mensajeOk) {
        mensajeOk.style.display = 'block';
        setTimeout(() => {
            mensajeOk.style.display = 'none';
        }, 1500);
    }
    
    // Actualiza el contador
    actualizarContadorCarrito();
}

// ===================================================================
// DATOS Y LÓGICA AVANZADA DEL CHATBOT
// (El resto de las funciones: productos, addMessage, displayCategoryAccordion, etc.)
// ... [Mantenemos el resto del código del chatbot aquí] ...
// ===================================================================

    const productos = [
        { nombre: "Maleta de Jean", link: "productomaleta.html", categoria: "accesorios", precio: "$29.000", caracteristicas: "Hecha de tela de jean reciclada, forrada con tela sintética. Ideal para el día a día. Cómoda y duradera.", medidas: "40cm x 35cm", imagen: "img/maletajean.jpeg" },
        { nombre: "Bolso de Jean", link: "productobolso.html", categoria: "accesorios", precio: "$22.000", caracteristicas: "Hecho de tela de jean reciclada. Ideal para el día a día. Cómodo y duradero.", medidas: "25cm x 30cm", imagen: "img/bolsojean.jpg" },
        { nombre: "Trapo para Limpiar", link: "productotrapo.html", categoria: "hogar", precio: "$6.000", caracteristicas: "Elaborado con telas de algodón reutilizadas. Absorbe líquidos de manera eficiente. Ideal para la limpieza del hogar.", medidas: "24cm x 24cm", imagen: "img/trapo.jpeg" },
        { nombre: "Funda para Almohada", link: "productofunda.html", categoria: "hogar", precio: "$8.000", caracteristicas: "Fabricada con retazos de tela de distintos colores. Suave al tacto y fácil de lavar.", medidas: "43cm x 43cm", imagen: "img/funda.jpeg" },
        { nombre: "Cama para Perro o Gato", link: "productocamaperro.html", categoria: "mascotas", precio: "$30.000", caracteristicas: "Rellena con fibras de ropa reciclada. Proporciona comodidad y calidez a tu mascota.", medidas: "40cm x 40cm", imagen: "img/cama1.jpeg" },
        { nombre: "Pañoleta", link: "productopañoleta.html", categoria: "mascotas", precio: "$8.000", caracteristicas: "Perfecta para complementar el look de tu mascota. Hecha de tela de algodón reutilizada.", medidas: "39cm x 95cm", imagen: "img/pañoleta.jpg" },
]
function addMessage(msg, sender = "bot", isHtml = false) {
    const chatMessages = document.getElementById('chat-messages'); 
    if (!chatMessages) return; 
    
    const div = document.createElement('div');
    div.classList.add('message');
    div.classList.add(sender === "bot" ? "bot-message" : "user-message");
    if (isHtml) {
        div.innerHTML = msg;
    } else {
        div.textContent = msg;
    }
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function displayCategoryAccordion() {
    const categories = ['mascotas', 'hogar', 'accesorios'];
    let html = '<p>Puedes explorar nuestros productos por categoría:</p>';
    
    categories.forEach(category => {
        const categoryProducts = productos.filter(p => p.categoria === category);
        const categoryId = `category-${category}-${Date.now()}`;
        
        html += `
            <div class="product-accordion-item">
                <button class="accordion-button" aria-expanded="false" aria-controls="${categoryId}">
                    ${category.charAt(0).toUpperCase() + category.slice(1)}
                    <span class="accordion-icon">▶</span>
                </button>
                <div id="${categoryId}" class="accordion-content">
                    <div class="category-content-container">
                        ${categoryProducts.map((p, index) => {
                            const productId = `product-${p.nombre.replace(/\s/g, '-')}-${Date.now()}-${index}`;
                            


                            
                            // Lógica para productos sin variantes especiales
                            return `
                                <div class="product-accordion-item-nested">
                                    <button class="accordion-button" aria-expanded="false" aria-controls="${productId}">
                                        ${p.nombre}
                                        <span class="accordion-icon">▶</span>
                                    </button>
                                    <div id="${productId}" class="accordion-content">
                                        <img src="${p.imagen}" alt="${p.nombre}" style="max-width:120px; border-radius:8px; margin-bottom:8px;">
                                        <p><strong>Precio:</strong> ${p.precio}</p>
                                        <p><strong>Características:</strong> ${p.caracteristicas}</p>
                                        <p><strong>Medidas:</strong> ${p.medidas}</p>
                                        <button class="buy-button" onclick="window.location.href='${p.link}'">Ver y Comprar</button>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;
    });
    addMessage(html, "bot", true);
    setupAccordionListeners();
    setupSizeAccordionListeners(); 
}

function setupSizeAccordionListeners() {
    document.querySelectorAll('.accordion-button-size').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); 
            const content = document.getElementById(button.getAttribute('aria-controls'));
            const isExpanded = button.getAttribute('aria-expanded') === 'true';

            const productContent = button.closest('.accordion-content');
            productContent.querySelectorAll('.accordion-button-size').forEach(btn => {
                const cnt = document.getElementById(btn.getAttribute('aria-controls'));
                if (btn !== button && btn.getAttribute('aria-expanded') === 'true') {
                    btn.setAttribute('aria-expanded', 'false');
                    cnt.style.display = 'none';
                    btn.querySelector('.accordion-icon').textContent = '▶';
                }
            });

            button.setAttribute('aria-expanded', !isExpanded);
            content.style.display = isExpanded ? 'none' : 'block';
            button.querySelector('.accordion-icon').textContent = isExpanded ? '▶' : '▼';

            const chatMessages = document.getElementById('chat-messages');
            if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
        });
    });
}

function setupAccordionListeners() {
    document.querySelectorAll('.accordion-button').forEach(button => {
        button.addEventListener('click', () => {
            const content = document.getElementById(button.getAttribute('aria-controls'));
            const isExpanded = button.getAttribute('aria-expanded') === 'true';

            button.setAttribute('aria-expanded', !isExpanded);
            content.classList.toggle('active');

            const innerContent = content.querySelector('.category-content-container');
            if (innerContent) {
                innerContent.classList.toggle('active', !isExpanded);
            }
            
            button.querySelector('.accordion-icon').textContent = isExpanded ? '▶' : '▼';

            const chatMessages = document.getElementById('chat-messages');
            if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
        });
    });
}

function handleBotResponse(query) {
    const welcomeMessage = `
        ¡Hola! Soy el asistente de Ecotextil. 🌱
        <br><br>
        ¿En qué puedo ayudarte?
    `;
    addMessage(welcomeMessage, "bot", true);
    displayCategoryAccordion();
    return;
}

// ===================================================================
// CONTROLADOR DE EVENTOS PRINCIPAL (DOM Content Loaded)
// ===================================================================
document.addEventListener('DOMContentLoaded', () => {
    
    // Lógica del Chatbot (Apertura y envío)
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const closeChat = document.getElementById('close-chat');
    const sendButton = document.getElementById('send-button');
    const userInput = document.getElementById('user-input');
    const clearChatButton = document.getElementById('clear-chat-button');
    const chatMessages = document.getElementById('chat-messages');

    if (chatbotToggle && chatbotWindow && closeChat && sendButton && userInput && clearChatButton && chatMessages) {
        chatbotToggle.addEventListener('click', () => {
            chatbotWindow.style.display = 'flex'; 
            if (chatMessages.children.length === 0) {
                handleBotResponse(""); 
            }
        });

        closeChat.addEventListener('click', () => {
            chatbotWindow.style.display = 'none';
        });

        sendButton.addEventListener('click', () => {
            const query = userInput.value.trim();
            if (query) {
                addMessage(query, "user");
                userInput.value = '';
            }
        });

        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendButton.click();
            }
        });

        clearChatButton.addEventListener('click', () => {
            chatMessages.innerHTML = '';
            handleBotResponse(""); 
        });
    }
    
    // Inicializa el contador del carrito al cargar (para todas las páginas)
    actualizarContadorCarrito();

});