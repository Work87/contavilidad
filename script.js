// ============================================
// ARREGLOS PARA CHROME MÓVIL - AÑADIR AL PRINCIPIO
// ============================================

// Función para arreglar problemas de visualización en Chrome para móviles
function fixChromeIssues() {
    // Detectar si estamos en Chrome para Android
    const esChrome = /Chrome/i.test(navigator.userAgent);
    const esAndroid = /Android/i.test(navigator.userAgent);
    const esChromeMobile = esChrome && esAndroid;
    
    if (esChromeMobile) {
        console.log("Aplicando correcciones para Chrome en Android");
        
        // Forzar un nuevo contexto de apilamiento para corregir position:fixed
        document.body.style.transform = 'translateZ(0)';
        
        // Arreglar elementos con position:fixed
        const elementosFixed = document.querySelectorAll('.modal, .calculadora-modal, .notification-container');
        elementosFixed.forEach(elem => {
            if (elem) {
                elem.style.transform = 'translateZ(0)';
            }
        });
        
        // Forzar modo oscuro correctamente
        document.body.classList.add('dark-mode');
        
        // Corregir contenedor principal
        const container = document.querySelector('.container');
        if (container) {
            container.style.margin = '0';
            container.style.width = '100%';
            container.style.boxSizing = 'border-box';
            container.style.borderRadius = '0';
        }
        
        // Mejorar la visualización de botones y controles
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.style.minHeight = '44px';
        });
        
        // Prevenir zoom en inputs
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.style.fontSize = '16px';
        });
    }
}

// Funciones mejoradas para modales que funcionan bien en móviles
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        // Aplicar transformación para forzar un nuevo contexto de apilamiento
        modal.style.transform = 'translateZ(0)';
        modal.style.display = 'flex';
        
        // Prevenir scrolling en el fondo
        document.body.style.overflow = 'hidden';
        
        // Si estamos en Chrome para Android, aplicar correcciones adicionales
        if (/Chrome/i.test(navigator.userAgent) && /Android/i.test(navigator.userAgent)) {
            // Posicionar correctamente
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.right = '0';
            modal.style.bottom = '0';
            
            // Asegurar que el modal se muestra por encima de todo
            modal.style.zIndex = '9999';
        }
    }
}

function cerrarModal() {
    const modales = document.querySelectorAll('.modal, .calculadora-modal');
    modales.forEach(modal => {
        if (modal && modal.style.display !== 'none') {
            modal.style.display = 'none';
        }
    });
    
    // Restaurar scrolling
    document.body.style.overflow = '';
}

// Función para detectar y corregir problemas en pantallas táctiles
function mejorarExperienciaTactil() {
    // Detectar dispositivo táctil
    const esTactil = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (esTactil) {
        console.log("Aplicando mejoras para pantalla táctil");
        
        // Eliminar el delay de 300ms en toques
        document.documentElement.style.touchAction = 'manipulation';
        
        // Mejorar botones para evitar toques accidentales
        const botones = document.querySelectorAll('button');
        botones.forEach(boton => {
            boton.addEventListener('touchend', function(e) {
                // Prevenir comportamiento por defecto que podría causar doble activación
                e.preventDefault();
            });
        });
        
        // Asegurar que los inputs numéricos solo acepten números
        const inputsNumericos = document.querySelectorAll('input[type="number"]');
        inputsNumericos.forEach(input => {
            input.setAttribute('inputmode', 'numeric');
            input.addEventListener('input', function() {
                this.value = this.value.replace(/[^0-9]/g, '');
            });
        });
    }
}

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Aplicar correcciones para Chrome
    fixChromeIssues();
    
    // Mejorar experiencia táctil
    mejorarExperienciaTactil();
    
    // Reconfigurar cuando cambia la orientación del dispositivo
    window.addEventListener('orientationchange', function() {
        setTimeout(function() {
            fixChromeIssues();
            
            // Hacer scroll al contenido activo
            const tabcontent = document.querySelector('.tabcontent[style*="display: block"]');
            if (tabcontent) {
                tabcontent.scrollIntoView({ behavior: 'smooth' });
            }
        }, 300);
    });
});

// ============================================
// FIN DE ARREGLOS PARA CHROME MÓVIL
// ============================================

// Patrones de formato válidos
const patrones = {
    // Formatos básicos originales
    numeroSimple: /^\d{1,2}[-.+=, /;]+\d+$/,                      // 25-10
    linea: /^l(?:inea)?(?:[-., /]+\d{1,2}){1,2}[-.+=, /]+(?:con[-.,]*)*\d+$/i, // Linea-80-20 / L-01-10-05 / l-0-10-5 / l-0-20-5
    decena: /^dece(?:na)?[-., /]+\d{1,2}[-.+=, /]+(?:con[-.,]*)*\d+$/i,        // decena-80-20
    terminal: /^(?:t(?:erminal)?[-.+=, /]+\d{1,2}[-., /](?:con[-.,/]*)*\d+)$/i,   // Terminal-5-10
    pareja: /^(?:p(?:areja)?[-.+=, /]+(?:con[-.,]*)*\d+)$/i,                   // Pareja-10

    // Números separados por comas con monto
    numerosComaMonto: /^\d{1,3}(?:[-.+=, /]+\d{1,3})*\d+$/i,        // 37,98,1000

    // Números con "con"
    conSimple: /^\d{1,3}-con-\d+$/i,                        // 10-con-100

    // Múltiples números con "con"
    multiplesCon: /^(?:\d{1,3}(?:[-.+=, /]+\d{1,3})*)-con-\d+$/i,// 35 36 37 57-con-20
    // 54-96-con-50
    // 46-98-83-12-07-58-con-10

    // Tres números separados por guion
    tresNumeros: /^(?:\d{1,2}[-.+=, /]+)+\d+$/i,              // 04-10-17

    // Formatos especiales adicionales
    terminalMultiple: /^t(?:erminal)?-\d{1,2}(?:[-.+=, /]+\d{1,2})*[-.+=, /]+(?:con[-.,]*)*\d+$/i,
    lineaConY: /^(?:l(?:inea)?-\d{1,2}-y-\d{1,2}[-.+=, /]+(?:con[-.,]*)*\d+)$/i,
    rangoConMonto: /^\d{1,2}-\d{1,2}-\d+\/\d+$/,

    // Nuevos formatos de terminal al, parejas al, y numero al numero
    terminalAl: /^(?:0?[1-9]|10)[-_\s]*al[-_\s]*(?:9[1-9]|100|00)[-.,+=, /]+(?:con[-.,]*)*\d+$/i,
    parejasAl: /^(?:11|00|100)[-_\s]*al[-_\s]*(?:00|99|100|109)[-_\s]*(?:con)[-_\s]*\d+$/i,
    numeroAlNumero: /^(?:del[-\s]*)?\d+\W+aL\W+\d+\W*(?:c|con)*\W*\d+$/i,
    // Detecta números solitarios de 3 o más dígitos
    numeroSolitario: /^\d{3,}$/i,
};

// Función para actualizar el botón de modo oscuro
function updateToggleDarkModeButton() {
    const btn = document.querySelector('.btn-theme');
    if (btn) {
        btn.textContent = document.body.classList.contains('dark-mode')
            ? 'Cambiar a Modo Claro'
            : 'Cambiar a Modo Oscuro';
    }
}

/**
 * Función mejorada para obtener una fecha formateada o un objeto Date para realizar cálculos
 * @param {Date|string|null} fechaInput - Fecha de entrada en cualquier formato compatible
 * @param {string} tipoRetorno - Tipo de retorno: 'string' (DD/MM/YYYY) o 'date' (objeto Date)
 * @returns {string|Date} - Fecha formateada como string o como objeto Date según el parámetro tipoRetorno
 */
function obtenerFechaFormateada(fechaInput, tipoRetorno = 'string') {
    const padNumber = (n, l) => `${n}`.padStart(l, '0');
    let fechaObj;
    
    // Determinar el objeto Date a partir de la entrada
    if (!fechaInput) {
        // Si no se proporciona fecha, usar la fecha actual
        fechaObj = new Date();
    } else if (fechaInput instanceof Date) {
        // Si ya es un objeto Date, crear una copia
        fechaObj = new Date(fechaInput);
        
        // Verificar si es una fecha válida
        if (isNaN(fechaObj.getTime())) {
            console.error("Fecha inválida:", fechaInput);
            fechaObj = new Date(); // Usar fecha actual si no es válida
        }
    } else if (typeof fechaInput === 'string') {
        // Si es un string, intentar varios formatos
        
        // Si ya está en formato DD/MM/YYYY, convertirla
        if (fechaInput.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
            const partes = fechaInput.split('/');
            fechaObj = new Date(partes[2], parseInt(partes[1]) - 1, partes[0]);
        } 
        // Si está en formato YYYY-MM-DD, convertirla
        else if (fechaInput.match(/^\d{4}-\d{2}-\d{2}$/)) {
            const partes = fechaInput.split('-');
            fechaObj = new Date(partes[0], parseInt(partes[1]) - 1, partes[2]);
        }
        // Intentar conversión directa para otros formatos
        else {
            fechaObj = new Date(fechaInput);
        }
        
        // Verificar si la conversión fue exitosa
        if (isNaN(fechaObj.getTime())) {
            console.error("Formato de fecha no reconocido:", fechaInput);
            fechaObj = new Date(); // Usar fecha actual si no se reconoce el formato
        }
    } else {
        // Para otros tipos de datos, intentar conversión directa
        try {
            fechaObj = new Date(fechaInput);
            if (isNaN(fechaObj.getTime())) {
                console.error("No se pudo convertir a fecha:", fechaInput);
                fechaObj = new Date();
            }
        } catch (e) {
            console.error("Error al convertir fecha:", e);
            fechaObj = new Date();
        }
    }
    
    // Retornar según el tipo solicitado
    if (tipoRetorno === 'date') {
        return fechaObj; // Retornar objeto Date para cálculos
    } else {
        // Formatear como DD/MM/YYYY
        return `${padNumber(fechaObj.getDate(), 2)}/${padNumber(fechaObj.getMonth() + 1, 2)}/${fechaObj.getFullYear()}`;
    }
}

// Ejemplos de uso:

// 1. Obtener la fecha actual formateada como string
const fechaHoy = obtenerFechaFormateada();
console.log("Fecha actual:", fechaHoy); // Ejemplo: "14/03/2025"

// 2. Convertir una fecha en formato ISO a DD/MM/YYYY
const fechaISO = obtenerFechaFormateada("2025-03-14");
console.log("Fecha ISO convertida:", fechaISO); // "14/03/2025"

// 3. Obtener un objeto Date para realizar cálculos
const fechaObjeto = obtenerFechaFormateada("14/03/2025", 'date');
// Ahora puedes usar fechaObjeto para cálculos:
fechaObjeto.setDate(fechaObjeto.getDate() + 5); // Sumar 5 días
console.log("Fecha + 5 días:", obtenerFechaFormateada(fechaObjeto)); // "19/03/2025"

// 4. Comparar dos fechas
const fecha1 = obtenerFechaFormateada("14/03/2025", 'date');
const fecha2 = obtenerFechaFormateada("20/03/2025", 'date');
const esMayor = fecha2 > fecha1;
console.log("¿fecha2 es posterior a fecha1?", esMayor); // true

// 5. Calcular diferencia en días
const diffTiempo = Math.abs(fecha2 - fecha1);
const diffDias = Math.ceil(diffTiempo / (1000 * 60 * 60 * 24));
console.log("Diferencia en días:", diffDias); // 6

function normalizarTodasLasFechas() {
    let contadorCambios = 0;
    
    // Normalizar fechas en vendedores
    vendedores.forEach(vendedor => {
        if (vendedor.ventas && Array.isArray(vendedor.ventas)) {
            vendedor.ventas.forEach(venta => {
                // Guardar el formato original para log
                const formatoOriginal = venta.fecha;
                
                // Normalizar la fecha
                venta.fecha = obtenerFechaFormateada(venta.fecha);
                
                // Contar el cambio si hubo una normalización
                if (formatoOriginal !== venta.fecha) {
                    contadorCambios++;
                    console.log(`Normalizada: ${formatoOriginal} → ${venta.fecha}`);
                }
            });
        }
    });
    
    // Normalizar fechas en jefes
    jefes.forEach(jefe => {
        if (jefe.ventas && Array.isArray(jefe.ventas)) {
            jefe.ventas.forEach(venta => {
                const formatoOriginal = venta.fecha;
                venta.fecha = obtenerFechaFormateada(venta.fecha);
                
                if (formatoOriginal !== venta.fecha) {
                    contadorCambios++;
                }
            });
        }
    });
    
    // Guardar los cambios
    guardarDatos();
    
    return contadorCambios;
}

// Función para agregar estilos de mensajes
function agregarEstilosMensajes() {
    // Verificar si los estilos ya existen
    if (document.getElementById('mensajes-styles')) return;

    const style = document.createElement('style');
    style.id = 'mensajes-styles';
    style.textContent = `
        .mensajes-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            max-width: 300px;
        }

        .mensaje {
            padding: 10px 20px;
            margin: 5px 0;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            opacity: 1;
            transition: opacity 0.5s ease;
        }

        .mensaje-success {
            background-color: #e8f5e9;
            color: #2e7d32;
            border-left: 4px solid #2e7d32;
        }

        .mensaje-error {
            background-color: #ffebee;
            color: #c62828;
            border-left: 4px solid #c62828;
        }

        .mensaje-info {
            background-color: #e3f2fd;
            color: #1565c0;
            border-left: 4px solid #1565c0;
        }

        .dark-mode .mensaje-success {
            background-color: #1b5e20;
            color: #fff;
        }

        .dark-mode .mensaje-error {
            background-color: #b71c1c;
            color: #fff;
        }

        .dark-mode .mensaje-info {
            background-color: #0d47a1;
            color: #fff;
        }
    `;
    document.head.appendChild(style);
}

// Función para mostrar mensajes
/**
 * Muestra un mensaje temporal en la interfaz
 * @param {string} mensaje - Texto del mensaje a mostrar
 * @param {string} tipo - Tipo de mensaje: 'info', 'error', 'success', 'warning'
 * @param {Object} opciones - Opciones adicionales
 * @param {number} opciones.duracion - Duración en ms antes de que desaparezca (0 para no desaparecer)
 * @param {boolean} opciones.cerrable - Si es true, muestra un botón para cerrar el mensaje
 * @param {Function} opciones.onClose - Callback que se ejecuta cuando el mensaje se cierra
 * @returns {HTMLElement} - El elemento del mensaje creado
 */

function mostrarMensaje(mensaje, tipo = 'info', opciones = {}) {
    // Configuración por defecto
    const config = {
        duracion: opciones.duracion !== undefined ? opciones.duracion : 5000,
        cerrable: opciones.cerrable !== undefined ? opciones.cerrable : false,
        onClose: opciones.onClose || null
    };
    
    // Crear o obtener el contenedor de mensajes
    const contenedor = document.querySelector('.mensajes-container') || crearContenedorMensajes();
    
    // Crear el elemento del mensaje
    const mensajeElement = document.createElement('div');
    mensajeElement.className = `mensaje mensaje-${tipo}`;
    mensajeElement.setAttribute('role', 'alert'); // Para accesibilidad
    
    // Crear el contenido del mensaje
    const contenidoElement = document.createElement('div');
    contenidoElement.className = 'mensaje-contenido';
    contenidoElement.textContent = mensaje;
    mensajeElement.appendChild(contenidoElement);
    
    // Añadir botón de cierre si es cerrable
    if (config.cerrable) {
        const botonCerrar = document.createElement('button');
        botonCerrar.className = 'mensaje-cerrar';
        botonCerrar.innerHTML = '&times;';
        botonCerrar.setAttribute('aria-label', 'Cerrar mensaje');
        botonCerrar.onclick = () => cerrarMensaje(mensajeElement, config.onClose);
        mensajeElement.appendChild(botonCerrar);
    }
    
    // Estilos según el tipo de mensaje
    const estilos = {
        info: {
            backgroundColor: '#e3f2fd',
            color: '#1565c0',
            borderLeft: '4px solid #1565c0',
            icon: '&#9432;' // Símbolo de información
        },
        error: {
            backgroundColor: '#ffebee',
            color: '#c62828',
            borderLeft: '4px solid #c62828',
            icon: '&#9888;' // Símbolo de advertencia
        },
        success: {
            backgroundColor: '#e8f5e9',
            color: '#2e7d32',
            borderLeft: '4px solid #2e7d32',
            icon: '&#10004;' // Símbolo de check
        },
        warning: {
            backgroundColor: '#fff8e1',
            color: '#f57f17',
            borderLeft: '4px solid #f57f17',
            icon: '&#9888;' // Símbolo de advertencia
        }
    };
    
    // Aplicar estilos según el tipo
    const estilo = estilos[tipo] || estilos.info;
    Object.assign(mensajeElement.style, {
        backgroundColor: estilo.backgroundColor,
        color: estilo.color,
        borderLeft: estilo.borderLeft,
        padding: '12px 20px',
        margin: '8px 0',
        borderRadius: '4px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        opacity: '0',
        transform: 'translateY(-10px)',
        transition: 'opacity 0.3s ease, transform 0.3s ease'
    });
    
    // Añadir icono si está disponible
    if (estilo.icon) {
        const iconoElement = document.createElement('span');
        iconoElement.className = 'mensaje-icono';
        iconoElement.innerHTML = estilo.icon;
        iconoElement.style.marginRight = '10px';
        iconoElement.style.fontSize = '18px';
        // Insertar antes del contenido
        mensajeElement.insertBefore(iconoElement, contenidoElement);
    }
    
    // Añadir estilos para los botones de cierre
    if (config.cerrable) {
        const botonCerrar = mensajeElement.querySelector('.mensaje-cerrar');
        Object.assign(botonCerrar.style, {
            background: 'none',
            border: 'none',
            color: 'inherit',
            fontSize: '20px',
            cursor: 'pointer',
            marginLeft: '15px',
            padding: '0 5px',
            opacity: '0.7'
        });
    }
    
    // Agregar al contenedor
    contenedor.appendChild(mensajeElement);
    
    // Forzar un reflow para que la animación funcione correctamente
    void mensajeElement.offsetWidth;
    
    // Mostrar con animación
    mensajeElement.style.opacity = '1';
    mensajeElement.style.transform = 'translateY(0)';
    
    // Configurar la eliminación automática si hay duración
    if (config.duracion > 0) {
        setTimeout(() => {
            if (mensajeElement.parentNode) {
                cerrarMensaje(mensajeElement, config.onClose);
            }
        }, config.duracion);
    }
    
    return mensajeElement;
}

/**
 * Crea el contenedor para los mensajes si no existe
 * @returns {HTMLElement} El contenedor de mensajes
 */
function crearContenedorMensajes() {
    let contenedor = document.getElementById('mensajes');
    
    if (!contenedor) {
        contenedor = document.createElement('div');
        contenedor.id = 'mensajes';
        contenedor.className = 'mensajes-container';
        
        Object.assign(contenedor.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            maxWidth: '350px',
            zIndex: '9999'
        });
        
        document.body.appendChild(contenedor);
    }
    
    return contenedor;
}

/**
 * Cierra un mensaje con animación
 * @param {HTMLElement} mensajeElement - El elemento del mensaje a cerrar
 * @param {Function} callback - Función a ejecutar después de cerrar
 */
function cerrarMensaje(mensajeElement, callback) {
    mensajeElement.style.opacity = '0';
    mensajeElement.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
        if (mensajeElement.parentNode) {
            mensajeElement.remove();
            if (typeof callback === 'function') {
                callback();
            }
        }
    }, 300); // Duración de la animación
}

// 3. Función para configurar el autoguardado
function configurarAutoguardado() {
    // Guardar datos cuando se agregue un vendedor
    const btnAgregarVendedor = document.querySelector('button[onclick="agregarVendedor()"]');
    if (btnAgregarVendedor) {
        const originalAgregarVendedor = window.agregarVendedor;
        window.agregarVendedor = function () {
            originalAgregarVendedor();
            guardarDatos();
        };
    }

    // Guardar datos cuando se agregue un jefe
    const btnAgregarJefe = document.querySelector('button[onclick="agregarJefe()"]');
    if (btnAgregarJefe) {
        const originalAgregarJefe = window.agregarJefe;
        window.agregarJefe = function () {
            originalAgregarJefe();
            guardarDatos();
        };
    }

    // Guardar datos cuando se elimine un vendedor o jefe
    const originalEliminarVendedor = window.eliminarVendedor;
    window.eliminarVendedor = function (index) {
        originalEliminarVendedor(index);
        guardarDatos();
    };

    const originalEliminarJefe = window.eliminarJefe;
    window.eliminarJefe = function (index) {
        originalEliminarJefe(index);
        guardarDatos();
    };
}

// 4. Mejorar la función guardarDatos
function guardarDatos() {
    try {
        // Usar la función obtenerFechaFormateada para mantener consistencia
        const fechaActual = obtenerFechaFormateada();
        
        const datosActuales = {
            vendedores: vendedores,
            jefes: jefes,
            fecha: fechaActual,
            timestamp: new Date().getTime()
        };
        
        // Guardar en historial
        historialDatos.fechas[fechaActual] = datosActuales;
        historialDatos.ultimaActualizacion = fechaActual;
        
        // Limpiar datos antiguos (mantener solo los últimos 15 días)
        const fechas = Object.keys(historialDatos.fechas).sort();
        while (fechas.length > CONFIG.DIAS_HISTORICO) {
            delete historialDatos.fechas[fechas.shift()];
        }
        
        // Guardar datos actuales
        localStorage.setItem('datosLoteria', JSON.stringify(datosActuales));
        
        // Guardar historial
        localStorage.setItem('historialLoteria', JSON.stringify(historialDatos));
        
        // Guardar vendedores
        localStorage.setItem('vendedores', JSON.stringify(vendedores));
        
        console.log("Datos guardados con fecha:", fechaActual);
        mostrarMensaje('Datos guardados correctamente', 'success');
    } catch (error) {
        console.error('Error al guardar datos:', error);
        mostrarMensaje('Error al guardar los datos', 'error');
    }
}

// Función para exportar el historial completo
function exportarHistorial() {
    try {
        const datosExportados = {
            historialLoteria: JSON.parse(localStorage.getItem('historialLoteria')) || {},
            datosLoteria: JSON.parse(localStorage.getItem('datosLoteria')) || {},
            vendedores: JSON.parse(localStorage.getItem('vendedores')) || []
        };

        const blob = new Blob([JSON.stringify(datosExportados, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `historial_loteria_${new Date().toLocaleDateString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        mostrarMensaje('Historial exportado correctamente', 'success');
    } catch (error) {
        console.error('Error al exportar historial:', error);
        mostrarMensaje('Error al exportar el historial', 'error');
    }
}

// Función para importar historial
function importarHistorial(event) {
    try {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const datosImportados = JSON.parse(e.target.result);
                if (datosImportados.historialLoteria) {
                    localStorage.setItem('historialLoteria', JSON.stringify(datosImportados.historialLoteria));
                    historialDatos = datosImportados.historialLoteria;
                }
                if (datosImportados.datosLoteria) {
                    localStorage.setItem('datosLoteria', JSON.stringify(datosImportados.datosLoteria));
                }
                if (datosImportados.vendedores) {
                    localStorage.setItem('vendedores', JSON.stringify(datosImportados.vendedores));
                    vendedores = datosImportados.vendedores;
                }
                
                mostrarMensaje('Historial importado correctamente', 'success');
            } catch (error) {
                console.error('Error al procesar el archivo importado:', error);
                mostrarMensaje('Error al procesar el archivo', 'error');
            }
        };
        reader.readAsText(file);
    } catch (error) {
        console.error('Error al importar historial:', error);
        mostrarMensaje('Error al importar el historial', 'error');
    }
}

// 5. Mejorar la función cargarDatos
function cargarDatos() {
    try {
        // Cargar datos actuales
        const datosGuardados = localStorage.getItem('datosLoteria');
        // Cargar historial
        const historialGuardado = localStorage.getItem('historialLoteria');
        if (datosGuardados) {
            const datos = JSON.parse(datosGuardados);
            vendedores = datos.vendedores || [];
            jefes = datos.jefes || [];

            // Verificar y corregir la estructura de los vendedores
            vendedores.forEach((vendedor, index) => {
                // Asegurarse de que cada vendedor tenga la propiedad jefes
                if (!vendedor.jefes) {
                    vendedor.jefes = [];
                    console.warn(`Vendedor ${index} no tiene jefes definidos. Inicializando como array vacío.`);
                }

                // Asegurarse de que otras propiedades importantes existan
                if (!vendedor.ventas) vendedor.ventas = [];
                if (!vendedor.nombre) vendedor.nombre = `Vendedor ${index}`;
                if (typeof vendedor.fondo !== 'number') vendedor.fondo = 0;
                if (typeof vendedor.fondoDia !== 'number') vendedor.fondoDia = 0;
                if (typeof vendedor.porcentaje !== 'number') vendedor.porcentaje = 10;
                if (typeof vendedor.precioVenta !== 'number') vendedor.precioVenta = 1000;
            });
        }
        if (historialGuardado) {
            window.historialDatos = JSON.parse(historialGuardado);
        }

        // Llamar a las funciones de actualización
        try {
            if (typeof actualizarListaVendedores === 'function') {
                actualizarListaVendedores();
            }
        } catch (error) {
            console.error('Error al actualizar lista de vendedores:', error);
        }

        try {
            if (typeof actualizarListaJefes === 'function') {
                actualizarListaJefes();
            }
        } catch (error) {
            console.error('Error al actualizar lista de jefes:', error);
        }

        try {
            if (typeof actualizarSelectVendedores === 'function') {
                actualizarSelectVendedores();
            }
        } catch (error) {
            console.error('Error al actualizar select de vendedores:', error);
        }

        try {
            if (typeof actualizarSelectJefes === 'function') {
                actualizarSelectJefes();
            }
        } catch (error) {
            console.error('Error al actualizar select de jefes:', error);
        }

        mostrarMensaje('Datos cargados correctamente', 'success');
    } catch (error) {
        console.error('Error al cargar datos:', error);
        mostrarMensaje('Error al cargar los datos', 'error');
    }
}
// 6. Asegurarse de que se llame a inicializarAplicacion cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializarAplicacion);

function mostrarTooltip(elemento, tipo, index) {
    const tooltip = document.getElementById('tooltip-system');
    if (!tooltip) return;

    // Obtener datos según el tipo
    let data;
    if (tipo === 'vendedor') {
        const vendedor = vendedores[index];
        data = `
            <div class="tooltip-content">
                <p><strong>Precio de Venta:</strong> ${vendedor.precioVenta}</p>
                <p><strong>Porcentaje:</strong> ${vendedor.porcentaje}%</p>
                <p><strong>Fondo:</strong> ${vendedor.fondo.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                <p><strong>Jefes:</strong> ${vendedor.jefes.join(', ')}</p>
            </div>
        `;
    } else if (tipo === 'jefe') {
        const jefe = jefes[index];
        data = `
            <div class="tooltip-content">
                <p><strong>Precio de Venta:</strong> ${jefe.precioVenta}</p>
                <p><strong>Porcentaje:</strong> ${jefe.porcentaje}%</p>
            </div>
        `;
    }

    // Posicionar y mostrar tooltip
    const rect = elemento.getBoundingClientRect();
    tooltip.innerHTML = data;
    tooltip.style.display = 'block';

    // Calcular posición
    const tooltipRect = tooltip.getBoundingClientRect();
    let left = rect.right + window.scrollX + 8;
    let top = rect.top + window.scrollY + (rect.height / 2) - (tooltipRect.height / 2);

    // Ajustar si se sale de la pantalla
    if (left + tooltipRect.width > window.innerWidth) {
        left = rect.left - tooltipRect.width - 8;
        tooltip.classList.add('left');
        tooltip.classList.remove('right');
    } else {
        tooltip.classList.add('right');
        tooltip.classList.remove('left');
    }

    // Ajustar posición vertical
    if (top + tooltipRect.height > window.innerHeight) {
        top = window.innerHeight - tooltipRect.height - 8;
    }
    if (top < 0) {
        top = 8;
    }

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
}

function ocultarTooltip() {
    const tooltip = document.getElementById('tooltip-system');
    if (tooltip) {
        tooltip.style.display = 'none';
        tooltip.innerHTML = '';
    }
}

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    
    // Ocultar todos los contenidos de pestañas
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    
    // Quitar la clase "active" de todos los botones
    // Modifiqué para usar nav-button en lugar de tablinks
    tablinks = document.getElementsByClassName("nav-button");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }
    
    // Mostrar el contenido y activar el botón
    const tabContent = document.getElementById(tabName);
    tabContent.style.display = "block";
    
    // Usamos classList.add en lugar de concatenar strings
    evt.currentTarget.classList.add("active");
    
    // Agregar esta parte nueva para manejar las estadísticas
    if (tabName === 'Estadisticas') {
        const hasData = document.querySelectorAll('.stats-card.has-data').length > 0;
        const cards = document.querySelectorAll('.stats-card');
        cards.forEach(card => {
            if (!hasData) {
                card.style.display = 'none';
            }
        });
    }
    
    // Agregar esta parte nueva para el scroll en móvil
    if (window.innerWidth <= 768) {
        document.getElementById(tabName).scrollIntoView({behavior: 'smooth'});
    }
    
    // Guardar la pestaña activa en localStorage para recordarla
    localStorage.setItem("activeTab", tabName);
}

// Función para recuperar la pestaña activa al cargar la página
document.addEventListener("DOMContentLoaded", function() {
    // Recuperar la pestaña activa del localStorage
    var activeTab = localStorage.getItem("activeTab") || "Bienvenida";
    
    // Encontrar el botón correspondiente y simular un clic
    var tabButtons = document.getElementsByClassName("nav-button");
    for (var i = 0; i < tabButtons.length; i++) {
        if (tabButtons[i].getAttribute("onclick") && 
            tabButtons[i].getAttribute("onclick").includes(activeTab)) {
            // Simular un clic en el botón
            tabButtons[i].click();
            break;
        }
    }
});

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    updateToggleDarkModeButton();
}

// Parte 2: Area de Ventas
// Selector de los Vendedores en Mensajes

// Modificar la función actualizarSelectVendedores para que use el filtro si existe
function actualizarSelectVendedores() {
    const vendedorSelect = document.getElementById('vendedorSelect');
    if (!vendedorSelect) return;
    
    const jefeFilterSelect = document.getElementById('jefeFilterSelect');
    
    // Si existe el filtro, usar la función de filtrado
    if (jefeFilterSelect) {
        const jefeSeleccionado = jefeFilterSelect.value;
        if (jefeSeleccionado) {
            // Solo mostrar y actualizar si hay un jefe seleccionado
            vendedorSelect.style.display = '';
            filtrarVendedoresPorJefe(jefeSeleccionado);
        } else {
            // Si no hay jefe seleccionado, mantener oculto
            vendedorSelect.style.display = 'none';
        }
        return;
    }
    
    // Si no existe filtro, comportamiento original
    // Limpiar el select
    vendedorSelect.innerHTML = '';
    // Agregar la opción vacía por defecto
    const optionVacia = document.createElement('option');
    optionVacia.value = '';
    optionVacia.textContent = '-- Seleccione un vendedor --';
    vendedorSelect.appendChild(optionVacia);
    // Agregar los vendedores
    vendedores.forEach((vendedor, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = vendedor.nombre;
        vendedorSelect.appendChild(option);
    });
    // Forzar la selección de la opción vacía
    vendedorSelect.value = '';
}

// Función mejorada de inicialización
function inicializarAplicacion() {

    // Asegurarse que las variables globales estén definidas
    if (typeof vendedores === 'undefined') vendedores = [];
    if (typeof jefes === 'undefined') jefes = [];
    if (typeof mensajesNoProcesados === 'undefined') mensajesNoProcesados = [];
    if (typeof mensajesInvalidos === 'undefined') mensajesInvalidos = [];
    if (typeof ventaYaRegistrada === 'undefined') ventaYaRegistrada = false;

    // Cargar datos guardados
    cargarDatos();

    // Inicializar elementos UI
    document.getElementById('Bienvenida').style.display = 'block';
    agregarEstilosMensajes();
    actualizarSelectJefes();
    updateToggleDarkModeButton();

    // Configurar event listeners
    const numeroGanadorInput = document.getElementById('numeroGanador');
    if (numeroGanadorInput) {
        numeroGanadorInput.addEventListener('input', function (e) {
            validarNumero(this);
        });
    }

    // Configurar el botón de agregar mensaje
    const btnAgregarMensaje = document.querySelector('.button-group .btn-success');

    if (btnAgregarMensaje) {
        btnAgregarMensaje.addEventListener('click', function (e) {
            agregarMensaje();
        });
    } else {
        //console.error('No se encontró el botón de agregar mensaje');
    }

    // Agregar el listener de resize para el manejo móvil
    window.addEventListener('resize', function () {
        const activeTab = document.querySelector('.nav-button.active');
        if (activeTab) {
            const tabName = activeTab.getAttribute('onclick').match(/'([^']+)'/)[1];
            const tabContent = document.getElementById(tabName);
            if (tabContent && window.innerWidth <= 768) {
                tabContent.scrollIntoView({behavior: 'smooth'});
            }
        }
    });

}

// Asegurarse de que la inicialización se ejecute cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializarAplicacion);

// Función de validación del número ganador
function validarNumero(input) {
    // Eliminar cualquier carácter que no sea número
    let valor = input.value.replace(/[^0-9]/g, '');

    // Si está vacío, permitirlo
    if (valor === '') {
        input.value = '';
        return;
    }

    // Convertir a número
    let num = parseInt(valor, 10);

    // Validar el rango (0-99)
    if (num >= 0 && num <= 99) {
        input.value = valor;
    } else {
        input.value = '99';
    }
}

// Función para obtener el número ganador
function obtenerNumeroGanador() {
    const input = document.getElementById('numeroGanador');
    const valor = input.value;
    // Si el valor es '00', retornar 100, de lo contrario el número normal
    return valor === '00' ? 100 : parseInt(valor, 10);
}

// Asegurarse de que solo haya una instancia del event listener
document.addEventListener('DOMContentLoaded', function () {
    const numeroGanadorInput = document.getElementById('numeroGanador');
    if (numeroGanadorInput) {
        // Remover listeners previos si existen
        const nuevoInput = numeroGanadorInput.cloneNode(true);
        numeroGanadorInput.parentNode.replaceChild(nuevoInput, numeroGanadorInput);

        // Agregar el nuevo listener
        nuevoInput.addEventListener('input', function (e) {
            validarNumero(this);
        });
    }
});

// Modificar el inicio de la función agregarMensaje
// Primero, asegurarnos de que la función sea accesible globalmente
window.agregarMensaje = function () {

    // Obtener y validar todos los campos requeridos
    const campos = {
        mensajeVenta: document.getElementById('mensajeVenta')?.value?.trim() || '',
        vendedorSelect: document.getElementById('vendedorSelect'),
        horarioSelect: document.getElementById('horarioSelect'),
        fechaVenta: document.getElementById('fechaVenta'),
        numeroGanador: document.getElementById('numeroGanador')?.value?.trim() || ''
    };

    console.log("Campos obtenidos en agregarMensaje:", campos); // Verifica los valores obtenidos

    // Validaciones básicas
    if (!campos.vendedorSelect?.value) {
        mostrarMensaje('Por favor seleccione un vendedor', 'error');
        return;
    }

    if (!campos.horarioSelect?.value) {
        mostrarMensaje('Por favor seleccione un horario', 'error');
        return;
    }

    if (!campos.fechaVenta?.value) {
        mostrarMensaje('Por favor seleccione una fecha', 'error');
        return;
    }

    if (!campos.mensajeVenta) {
        mostrarMensaje('Por favor ingrese un mensaje de venta', 'error');
        return;
    }

    // Obtener el vendedor
    const vendedorIndex = parseInt(campos.vendedorSelect.value);
    const vendedor = vendedores[vendedorIndex];

    if (!vendedor) {
        mostrarMensaje('Error: Vendedor no encontrado', 'error');
        return;
    }

    console.log("Vendedor seleccionado:", vendedor); // Verifica que el vendedor se haya encontrado

    // Procesar venta
    try {
        if (campos.mensajeVenta.toUpperCase().startsWith('TOTAL:')) {
            console.log("Procesando venta directa con mensaje:", campos.mensajeVenta);
            procesarVentaDirecta(
                vendedor,
                campos.mensajeVenta,
                campos.horarioSelect.value,
                campos.fechaVenta.value
            );
        } else {
            // Validar número ganador para ventas normales
            if (!campos.numeroGanador) {
                mostrarMensaje('Por favor ingrese el número ganador', 'error');
                return;
            }

            console.log("Procesando venta normal con mensaje:", campos.mensajeVenta);
            procesarVentaNormal(
                vendedor,
                campos.mensajeVenta,
                campos.horarioSelect.value,
                campos.fechaVenta.value
            );
        }

        // Guardar y actualizar
        guardarDatos();
        actualizarListaVendedores();

        // Limpiar formulario
        document.getElementById('mensajeVenta').value = '';
        document.getElementById('numeroGanador').value = '';

    } catch (error) {
        console.error('Error al procesar la venta:', error);
        mostrarMensaje('Error al procesar la venta: ' + error.message, 'error');
    }
};

function procesarVentaDirecta(vendedor, mensajeVenta, horario, fecha) {
    console.log("Iniciando procesarVentaDirecta con valores:", { vendedor, mensajeVenta, horario, fecha });
   
    const totalStr = mensajeVenta.split(':')[1].trim();
    const total = parseFloat(totalStr);
    
    if (isNaN(total)) {
        throw new Error('El total no es un número válido');
    }
    
    // Normalizar la fecha usando tu función existente
    const fechaNormalizada = obtenerFechaFormateada(fecha);
    
    const nuevaVenta = {
        fecha: fechaNormalizada, // Usar la fecha normalizada en formato DD/MM/YYYY
        horario: horario,
        totalVenta: total,
        premio: 0,
        numeroGanador: null
    };
    
    console.log("Nueva venta directa creada:", nuevaVenta); // Verifica los datos antes de agregarlos
    vendedor.ventas.push(nuevaVenta);
    console.log("Ventas actualizadas del vendedor:", vendedor.ventas); // Verifica que la venta se agregue correctamente
    
    mostrarMensaje(`Total de ${total.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} registrado correctamente`, 'success');
}

// Función que se Encarga de Guardar las Ventas a los Vendedores
function procesarVentaNormal(vendedor, mensajeVenta, horario, fechaVenta) {
    console.log("Iniciando procesarVentaNormal con valores:", { vendedor, mensajeVenta, horario, fechaVenta });
    
    const numeroGanador = obtenerNumeroGanador();
    if (!numeroGanador && numeroGanador !== 0) {
        throw new Error('Por favor ingrese el número ganador');
    }
    
    console.log("Número ganador obtenido:", numeroGanador); // Verifica el número ganador
    
    const resultado = reprocesarPatrones(); // Cambiado a la nueva función
    if (!resultado) {
        throw new Error('Error al procesar el mensaje');
    }
    
    console.log("Resultado de reprocesarPatrones:", resultado); // Verifica que haya un resultado válido
    
    // Normalizar la fecha usando tu función existente
    const fechaNormalizada = obtenerFechaFormateada(fechaVenta);
    
    const nuevaVenta = {
        fecha: fechaNormalizada, // Usar la fecha normalizada en formato DD/MM/YYYY
        horario: horario,
        totalVenta: resultado.totalVenta,
        premio: resultado.premioEncontrado,
        numeroGanador: numeroGanador
    };
    
    console.log("Nueva venta normal creada:", nuevaVenta); // Verifica la estructura de la venta antes de agregarla
    vendedor.ventas.push(nuevaVenta);
    console.log("Ventas actualizadas del vendedor:", vendedor.ventas); // Verifica que la venta se agregue correctamente
    
    // Verifica si el vendedor tiene jefes y actualiza sus ventas
    if (vendedor.jefes && vendedor.jefes.length > 0) {
        vendedor.jefes.forEach(jefeNombre => {
            const jefe = jefes.find(j => j.nombre === jefeNombre);
            if (jefe) {
                jefe.ventas.push({...nuevaVenta});
                console.log(`Venta añadida al jefe ${jefeNombre}:`, jefe.ventas); // Verifica que los jefes también reciban la venta
            }
        });
    }
    
    mostrarMensaje('Venta registrada correctamente', 'success');
}

//Lineas fijas al reves y normales
function procesarLineaConGanador(linea, numeroGanador) {
    linea = linea.toLowerCase();
    const numeros = linea.match(/\b\d+\b/g).map(num => parseInt(num));
    let monto = numeros[numeros.length - 1]; // El último número siempre es el monto
    let cabeza = numeros.slice(0, numeros.length - 1);
   
    numeroGanador = numeroGanador === "00" || numeroGanador === 0 ? 100 : numeroGanador;
    
    // Verificar si es una jugada tipo "linea" con el patrón "linea-X-Y-Z"
    const regexLineaDosCabezas = /^l(?:inea)?[-., /]+\d{1,2}[-., /]+\d{1,2}[-., /]+\d+$/i;
    
    // Si es una línea con dos cabezas separadas por al menos 10 y que no son 00-10 ni 00-20
    if (regexLineaDosCabezas.test(linea) && cabeza.length >= 2 && 
        Math.abs(cabeza[0] - cabeza[1]) >= 10 &&
        !(cabeza[0] === 0 && cabeza[1] === 10) && 
        !(cabeza[0] === 0 && cabeza[1] === 20) &&
        !(cabeza[1] === 0 && cabeza[0] === 10) && 
        !(cabeza[1] === 0 && cabeza[0] === 20)) {
        
        // Para jugadas tipo "linea" con dos cabezas distantes, generar las decenas completas
        let jugadas = {};
        
        // Procesar solo las primeras dos cabezas
        [cabeza[0], cabeza[1]].forEach(c => {
            // Calcular la base de la decena
            const baseDecena = Math.floor(c / 10) * 10;
            
            // Generar los 10 números de la decena
            for (let i = 0; i < 10; i++) {
                const numero = baseDecena + i;
                jugadas[numero] = monto;
            }
        });
        
        // Calcular venta total
        const totalVenta = monto * Object.keys(jugadas).length;
        
        // Verificar si el número ganador está entre los números jugados
        const premioEncontrado = Object.keys(jugadas).includes(String(numeroGanador)) ? monto : 0;
        
        return {
            totalVenta: totalVenta,
            premioEncontrado: premioEncontrado,
            jugadas: jugadas
        };
    } else {
        // Código original para otros tipos de jugadas
        if (cabeza.length === 1) cabeza.push(cabeza[0] + 9); // 🔥 Ahora se suma 9 en lugar de 10
        let cantidadNumeros = (cabeza[1] - cabeza[0]) + 1;
        return {
            totalVenta: monto * cantidadNumeros,
            premioEncontrado: (cabeza[0] <= numeroGanador && numeroGanador <= cabeza[1]) ? monto : 0,
            jugadas: Object.fromEntries(Array.from({length: cantidadNumeros}, (_, i) => [cabeza[0] + i, monto]))
        }
    }
}

function procesarLineaConYGanador(linea, numeroGanador) {
    linea = linea.toLowerCase();
    const numeros = linea.match(/\b\d+\b/g).map(num => parseInt(num));
    let monto = numeros[numeros.length - 1]; // El último número siempre es el monto
    let cabeza = numeros.slice(0, numeros.length - 1);
    let parcial = {};
    let result = {totalVenta: 0, premioEncontrado: 0, jugadas: {}};

    cabeza.forEach((numero) => {
        parcial = procesarLineaConGanador(`l-${numero}-${monto}`, numeroGanador);
        Object.assign(result.jugadas, parcial.jugadas);
        result.totalVenta += parcial.totalVenta;
        result.premioEncontrado += parcial.premioEncontrado;
    })
    return result;
}

// Luego tu función de procesar terminales
function procesarTerminalesConGanador(linea, numeroGanador) {
    console.log(`procesarTerminalesConGanador ${linea}, ${numeroGanador}`);
    linea = linea.toLowerCase();
    const numeros = linea.match(/\b\d+\b/g).map(num => parseInt(num));
    let monto = numeros[numeros.length - 1]; // El último número siempre es el monto
    let cabeza = numeros.slice(0, numeros.length - 1);
    console.log(`cabeza: ${cabeza}, monto: ${monto}`);

    let resultado = {
        totalVenta: 0,
        premioEncontrado: 0,
        jugadas: {}
    };

    cabeza.forEach((value) => {
        resultado.totalVenta += monto * 10;
        resultado.premioEncontrado += numeroGanador % 10 === value % 10 ? monto : 0
        Object.assign(resultado.jugadas, Object.fromEntries(Array.from({length: 10}, (_, i) => [10 * i + value, monto])))
        console.log(`resultado parcial: ${Object.entries(resultado)}`);
    });

    console.log(`resultado: ${Object.entries(resultado)}`);
    return resultado;
}

function procesarTerminalAl(linea, numeroGanador) {
    linea = linea.toLowerCase().trim();

    // Patrón para extraer los números incluyendo el formato con "con"
    const numeros = linea.match(/\b\d+\b/g).map(num => parseInt(num));
    let monto = numeros[numeros.length - 1]; // El último número siempre es el monto

    if (!isNaN(monto)) {
        // Obtener el último dígito del número antes de "con"
        const numeroJugada = numeros[numeros.length - 2]; // El número antes de "con"
        const ultimoDigito = numeroJugada % 10; // Último dígito de la jugada

        // Generar los números que terminan en el último dígito (del 1 al 100)
        const numerosProcesados = [];
        for (let i = ultimoDigito; i <= 100; i += 10) {
            numerosProcesados.push(i);
        }

        // Modificamos la verificación del premio
        // Si el número ganador es 100, debemos tratarlo como 00 para la comparación
        const numeroComparar = numeroGanador === 100 ? 0 : numeroGanador % 100;

        // Jugadas: solo incluir los números que terminan en el último dígito
        const jugadas = Object.fromEntries(
            numerosProcesados.map(num => [num, monto])
        );

        // Imprimir los números procesados
        console.log("Números procesados:", numerosProcesados);

        return {
            totalVenta: monto * numerosProcesados.length,  // Total basado en los números procesados
            premioEncontrado: numerosProcesados.includes(numeroComparar) ? monto : 0, // Premio si el número está en la lista de jugadas
            jugadas: jugadas,  // Muestra las jugadas y sus montos
        };
    }

    return null;
}

function procesarParejasConGanador(linea, numeroGanador) {
    if (!linea || typeof linea !== 'string') return null;
    linea = linea.toLowerCase().trim();
    // Nueva expresión regular más precisa para ambos formatos
    const patron = /^(p|pareja)([\s\/\-\.\+\:,])?\s*(\d+)$/;

    if (patron.test(linea)) {
        // Extraer el monto usando una expresión más simple
        const monto = parseInt(linea.match(/\d+$/)[0]);

        if (!isNaN(monto) && monto > 0) {
            return {
                totalVenta: monto * 10,
                premioEncontrado: [0, 11, 22, 33, 44, 55, 66, 77, 88, 99].indexOf(numeroGanador) >= 0 ? monto : 0,
                jugadas: Object.fromEntries([0, 11, 22, 33, 44, 55, 66, 77, 88, 99].map((num) => [num, monto])),
            };
        }
    }

    return null;
}

function procesarParejasAlConGanador(linea, numeroGanador) {
    const numeros = linea.match(/\b\d+\b/g).map(num => parseInt(num));
    const monto = numeros.slice(-1)[0];
    console.log(`procesarParejasAlConGanador ${linea} ${numeros} ${monto} ${numeroGanador}`);
    if (!isNaN(monto)) {
        return {
            totalVenta: monto * 10,
            premioEncontrado: [0, 11, 22, 33, 44, 55, 66, 77, 88, 99].indexOf(numeroGanador) >= 0 ? monto : 0,
            jugadas: Object.fromEntries([0, 11, 22, 33, 44, 55, 66, 77, 88, 99].map((num) => [num, monto])),
        };
    }
    return null;
}

function procesarNumeroAlNumero(linea, numeroGanador) {
    // Preparar la línea para manejar "00" y "100" por igual
    // Reemplazar "00" con "100" antes de extraer los números
    const lineaPreparada = linea.replace(/\b00\b/g, "100");
    
    // Extraer los números de la línea
    const numeros = lineaPreparada.match(/\b\d+\b/g).map(num => parseInt(num));
    
    let inicio = numeros[0];
    let final = numeros[1];
    const monto = numeros[2];
    
    console.log(`procesarNumeroAlNumero "${linea}" - inicio: ${inicio}, final: ${final}, monto: ${monto}`);
    
    // Generar el rango de números
    let jugadas = [];
    for (let i = inicio; i <= final; i++) {
        // Normalizar la representación: 100 se representa como 0
        const numeroRepresentacion = i === 100 ? 0 : i;
        jugadas.push(numeroRepresentacion);
    }
    
    // Normalizar el número ganador si es necesario
    const numeroGanadorNormalizado = numeroGanador === 100 ? 0 : numeroGanador;
    
    if (!isNaN(monto)) {
        return {
            totalVenta: monto * jugadas.length,
            premioEncontrado: jugadas.includes(numeroGanadorNormalizado) ? monto : 0,
            jugadas: Object.fromEntries(jugadas.map((num) => [num, monto])),
        };
    }
    return null;
}

function procesarGenerica(linea, numeroGanador) {
    const numeros = linea.match(/\b\d+\b/g).map(num => parseInt(num));
    let monto = numeros.slice(-1)[0];
    let cabeza = numeros.slice(0, numeros.length - 1);
    console.log(`monto: ${monto} cabea: ${cabeza}`);
    const cantidad = cabeza.filter(num => num === numeroGanador).length;
    if (!isNaN(monto) && !cabeza.some(num => num > 100)) {
        return {
            totalVenta: monto * cabeza.length,
            premioEncontrado: cantidad > 0 ? cantidad * monto : 0,
            jugadas: Object.fromEntries(cabeza.map((num) => [num, monto])),
        };
    }
    return null;
}

function procesarJugadaUnaLinea(jugada, numeroGanador) {
    console.log('procesarJugadaUnaLinea[1516]');
    if (!jugada || typeof jugada !== 'string') return null;
    jugada = jugada.trim();

    // Validar SMS
    if (jugada.toUpperCase().match(/^SMS\s*:?\s*$/)) {
        return {
            totalVenta: 0,
            premioEncontrado: 0
        };
    }

    // Manejar formato con "con" (10-con-100, 35 36 37 57-con-20)
    const conMatch = jugada.match(/^((?:\d+(?:[\s-]|,\s*)?)+)-con-(\d+)$/);
    if (conMatch) {
        const numeros = conMatch[1].split(/[\s-,]+/).map(n => parseInt(n));
        const monto = parseInt(conMatch[2]);
        if (!isNaN(monto) && numeros.every(n => !isNaN(n))) {
            return {
                totalVenta: monto * numeros.length,
                premioEncontrado: numeros.includes(numeroGanador) ? monto : 0
            };
        }
    }

    // Manejar formato con comas y monto al final (37,98,1000)
    const comasMatch = jugada.match(/^(\d+(?:,\d+)*),(\d+)$/);
    if (comasMatch) {
        const numeros = comasMatch[1].split(',').map(n => parseInt(n));
        const monto = parseInt(comasMatch[2]);
        if (!isNaN(monto) && numeros.every(n => !isNaN(n))) {
            return {
                totalVenta: monto * numeros.length,
                premioEncontrado: numeros.includes(numeroGanador) ? monto : 0
            };
        }
    }

    // Manejar formato de tres números (04-10-17)
    const tresNumerosMatch = jugada.match(/^(\d+)-(\d+)-(\d+)$/);
    if (tresNumerosMatch) {
        const numeros = [
            parseInt(tresNumerosMatch[1]),
            parseInt(tresNumerosMatch[2])
        ];
        const monto = parseInt(tresNumerosMatch[3]);
        if (!isNaN(monto) && numeros.every(n => !isNaN(n))) {
            return {
                totalVenta: monto * numeros.length,
                premioEncontrado: numeros.includes(numeroGanador) ? monto : 0
            };
        }
    }

    // Formato original
    const numerosMatch = jugada.match(/\b\d+\b/g);
    if (!numerosMatch) return null;

    const numeros = numerosMatch.map(num => parseInt(num));
    if (numeros.length < 2) return null;

    let monto = numeros.slice(-1)[0];
    let cabeza = numeros.slice(0, numeros.length - 1);
    if (isNaN(monto)) return null;

    return {
        totalVenta: monto * cabeza.length,
        premioEncontrado: cabeza.includes(numeroGanador) ? monto : 0
    };
}

function procesarJugadasMultilinea(lineas, numeroGanador) {
    console.log('procesarJugadasMultilinea[1708] - para borrar algun dia')
    lineas = lineas.filter(l => l.trim() !== '');
    const montoLinea = lineas[lineas.length - 1];

    // Manejo de diferentes formatos de la línea de monto
    let monto;
    if (montoLinea.includes('-con-')) {
        monto = parseInt(montoLinea.split('-con-')[1]);
    } else if (montoLinea.toLowerCase().includes('con')) {
        monto = parseInt(montoLinea.split(/\s+/).pop());
    } else {
        return null;
    }

    if (isNaN(monto)) return null;

    // Procesar números en las líneas anteriores
    const numeros = lineas.slice(0, -1).map(linea => {
        // Manejar números separados por comas en una línea
        if (linea.includes(',')) {
            return linea.split(',').map(n => parseInt(n.trim()));
        }
        // Manejar números separados por espacios o guiones
        if (linea.includes(' ') || linea.includes('-')) {
            return linea.split(/[\s-]+/).map(n => parseInt(n.trim()));
        }
        return parseInt(linea.trim());
    }).flat();

    const numerosValidos = numeros.filter(n => !isNaN(n));

    return {
        totalVenta: monto * numerosValidos.length,
        premioEncontrado: numerosValidos.includes(numeroGanador) ? monto : 0
    };
}

// Parte 3: Gestión de Vendedores
function agregarVendedor() {
    const nombre = document.getElementById('nombreVendedor').value;
    const precioVenta = parseFloat(document.getElementById('precioVenta').value);
    const porcentaje = parseFloat(document.getElementById('porcentaje').value);
    const fondo = parseFloat(document.getElementById('fondo').value);

    // Obtener los jefes seleccionados del select múltiple
    const jefeSelect = document.getElementById('jefeVendedorSelect');
    const jefesSeleccionados = Array.from(jefeSelect.selectedOptions).map(option => {
        const jefe = jefes[option.value];
        return jefe.nombre;
    });

    // Validación modificada para aceptar fondo = 0
    if (nombre &&
        !isNaN(precioVenta) &&
        !isNaN(porcentaje) &&
        !isNaN(fondo) &&
        jefesSeleccionados.length > 0) {

        vendedores.push({
            nombre,
            precioVenta,
            porcentaje,
            fondo,
            ventas: [],
            jefes: jefesSeleccionados,
            bancoRecogio: 0,
            bancoEntrego: 0
        });
        actualizarListaVendedores();

        // Limpiar campos
        document.getElementById('nombreVendedor').value = '';
        document.getElementById('precioVenta').value = '';
        document.getElementById('porcentaje').value = '';
        document.getElementById('fondo').value = '';
        jefeSelect.selectedIndex = -1; // Desseleccionar todos los jefes

        mostrarMensaje('Vendedor agregado exitosamente', 'success');
    } else {
        mostrarMensaje('Por favor, complete todos los campos y seleccione al menos un jefe.', 'error');
    }
}
function toggleBotones(index) {
    const botonesDiv = document.getElementById(`botones-vendedor-${index}`);
    if (botonesDiv) {
        botonesDiv.style.display = botonesDiv.style.display === 'none' ? 'flex' : 'none';
    }
}

function verVentasVendedorPorHorario(vendedorIndex, horario) {
    const vendedor = vendedores[vendedorIndex];
    // Depuración específica para Miguel
if (vendedor.nombre === "Migue") {
    console.log("DEPURACIÓN ESPECIAL PARA MIGUEL");
    
    // Filtrar solo por horario para ver todas las ventas por fecha
    const todasVentasHorario = vendedor.ventas
        .filter(v => v.horario === horario)
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    console.log("Ventas de Miguel ordenadas por fecha (solo filtradas por horario):");
    todasVentasHorario.forEach(v => {
        console.log(`Fecha: ${v.fecha}, Número ganador: ${v.numeroGanador}, Tipo: ${typeof v.numeroGanador}`);
    });
    
    // Ahora el filtro normal con número ganador
    const ventasConNumeroGanador = vendedor.ventas
        .filter(v => v.horario === horario && v.numeroGanador !== null)
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    console.log("Ventas de Miguel con número ganador:");
    ventasConNumeroGanador.forEach(v => {
        console.log(`Fecha: ${v.fecha}, Número ganador: ${v.numeroGanador}, Tipo: ${typeof v.numeroGanador}`);
    });
}
    console.log(vendedor);
    console.log("Todas las ventas sin filtrar:", vendedor.ventas);
    // Sincronizar fondos al inicio para asegurar consistencia
    sincronizarFondosEntreHorarios(vendedor, vendedorIndex);
    
    // Obtener fecha actual usando la función existente
    const fechaActual = obtenerFechaFormateada();
    // Inicializar correctamente los fondos por horario
    inicializarFondosPorHorario(vendedor);
    
    // SINCRONIZACIÓN MANUAL: Si es noche y no hay ventas
    if (horario === 'noche') {
        const ventasNoche = vendedor.ventas.filter(v => v.horario === 'noche');
        if (ventasNoche.length === 0 && vendedor.fondosPorHorario.dia && vendedor.fondosPorHorario.dia.actual) {
            // Usar el valor actual del día para noche
            vendedor.fondosPorHorario.noche.actual = vendedor.fondosPorHorario.dia.actual;
            vendedor.fondosPorHorario.noche.anterior = vendedor.fondosPorHorario.dia.actual;
            guardarVendedores(vendedores);
        }
    }
    
    // Filtrar ventas por horario
    const ventasHorario = vendedor.ventas.filter(v => v.horario === horario);

    // Obtener el número ganador de la última venta
    const ventasRecientes = vendedor.ventas
    .filter(v => v.horario === horario && v.numeroGanador !== null)
    .sort((a, b) => {
        // Usar la función existente para normalizar las fechas antes de compararlas
        const fechaA = normalizarFecha(a.fecha);
        const fechaB = normalizarFecha(b.fecha);
        return fechaB - fechaA; // Ordenar de más reciente a más antigua
    });

    const numeroGanador = ventasRecientes.length > 0 ? ventasRecientes[0].numeroGanador : null;
    
    // Determinar la fecha del reporte
    let fechaReporteVenta = fechaActual;
    if (ventasRecientes.length > 0 && ventasRecientes[0].fecha) {
        // Asegurarse de usar la fecha de la venta más reciente
        fechaReporteVenta = ventasRecientes[0].fecha;
        console.log("Usando fecha de la venta más reciente:", fechaReporteVenta);
    } else if (ventasHorario.length > 0 && ventasHorario[0].fecha) {
        // Si no hay número ganador pero sí hay ventas, usar la fecha de la primera venta del horario
        fechaReporteVenta = ventasHorario[0].fecha;
        console.log("Usando fecha de la primera venta del horario:", fechaReporteVenta);
    }

    // IMPORTANTE: Normalizar la fecha y verificar si hay fondos históricos
    const fechaReporteNormalizada = obtenerFechaFormateada(fechaReporteVenta);
    console.log("Buscando fondos históricos para:", fechaReporteNormalizada, horario);
    
    // Ahora que tenemos fechaReporteNormalizada, filtrar las ventas por fecha también
    const ventasHorarioFiltradas = ventasHorario.filter(v => {
        const fechaVentaNormalizada = obtenerFechaFormateada(v.fecha);
        return fechaVentaNormalizada === fechaReporteNormalizada;
    });

    const fondosHistoricos = obtenerFondosHistoricos(vendedor, fechaReporteNormalizada, horario);

    // Obtener fondos - priorizar fondos históricos si existen
    let fondoActual, fondoAnterior;

    if (fondosHistoricos) {
        console.log("Encontrados fondos históricos:", fondosHistoricos);
        
        // Si hay valor actual, usarlo
        if (fondosHistoricos.actual !== null && fondosHistoricos.actual !== undefined) {
            fondoActual = fondosHistoricos.actual;
        } else {
            // Si no hay valor actual pero sí hay anterior, usar el actual normal
            fondoActual = obtenerFondoActual(vendedor, horario);
        }
        
        // Si hay valor anterior, usarlo
        if (fondosHistoricos.anterior !== null && fondosHistoricos.anterior !== undefined) {
            fondoAnterior = fondosHistoricos.anterior;
        } else {
            // Si no hay valor anterior, usar el anterior normal
            fondoAnterior = obtenerFondoAnterior(vendedor, horario);
        }
    } else {
        // Si no hay fondos históricos, usar los valores actuales
        fondoActual = obtenerFondoActual(vendedor, horario);
        fondoAnterior = obtenerFondoAnterior(vendedor, horario);
    }

    console.log("Fondos determinados para el reporte:", {
        actual: fondoActual,
        anterior: fondoAnterior,
        fuente: fondosHistoricos ? "históricos" : "actuales"
    });

    // Agrega los logs para diagnóstico
    console.log("Datos para el reporte:");
    console.log("Tipo de fondoActual:", typeof fondoActual);
    console.log("Valor de fondoActual:", fondoActual);
    console.log("Tipo de fondoAnterior:", typeof fondoAnterior);
    console.log("Valor de fondoAnterior:", fondoAnterior);
    console.log("fondosPorHorario completo:", JSON.stringify(vendedor.fondosPorHorario));
    
    // Revisar si hay movimientos para mostrarlos en el informe
    let movimientosHoy = [];
    if (vendedor.movimientos && vendedor.movimientos.length > 0) {
        // Normalizar la fecha del reporte
        const fechaReporteNormalizada = obtenerFechaFormateada(fechaReporteVenta);
        
        // Filtrar movimientos por fecha normalizada y horario
        movimientosHoy = vendedor.movimientos.filter(mov => {
            const movFechaNormalizada = obtenerFechaFormateada(mov.fecha);
            return movFechaNormalizada === fechaReporteNormalizada && mov.horario === horario;
        });
        
        // Añadir un log para depuración
        console.log("Fecha del reporte normalizada:", fechaReporteNormalizada);
        console.log("Movimientos disponibles:", vendedor.movimientos);
        console.log("Movimientos filtrados para este reporte:", movimientosHoy);
    }

    // Calcular totales de movimientos para este informe específico
    let totalAgregado = 0;
    let totalQuitado = 0;

    movimientosHoy.forEach(mov => {
        if (mov.tipo === 'agregar') {
            totalAgregado += parseFloat(mov.cantidad);
            console.log(`Movimiento de agregar encontrado: ${mov.cantidad}`);
        } else if (mov.tipo === 'quitar') {
            totalQuitado += parseFloat(mov.cantidad);
            console.log(`Movimiento de quitar encontrado: ${mov.cantidad}`);
        }
    });

    console.log("Total agregado:", totalAgregado);
    console.log("Total quitado:", totalQuitado);

    // Obtener todos los movimientos de la fecha del reporte
    let movimientosDelDia = [];
    let totalAgregadoHoy = 0;
    let totalQuitadoHoy = 0;

    if (vendedor.movimientos && vendedor.movimientos.length > 0) {
        // Normalizar la fecha del reporte
        const fechaReporteNormalizada = obtenerFechaFormateada(fechaReporteVenta);
        
        // Filtrar por la fecha del reporte normalizada (todos los horarios)
        movimientosDelDia = vendedor.movimientos.filter(mov => {
            return obtenerFechaFormateada(mov.fecha) === fechaReporteNormalizada;
        });
        
        console.log("Movimientos para la fecha del reporte (todos los horarios):", movimientosDelDia);
        
        // Calcular totales de movimientos para esa fecha
        movimientosDelDia.forEach(mov => {
            if (mov.tipo === 'agregar') {
                totalAgregadoHoy += parseFloat(mov.cantidad);
            } else if (mov.tipo === 'quitar') {
                totalQuitadoHoy += parseFloat(mov.cantidad);
            }
        });
    }

    // Inicializar variables
    let totalVenta = 0;
    let totalPremios = 0;
    let gananciaVendedor = 0;
    let pagoPremios = 0;
    let entrega = 0;
    let fondoRecomendado = fondoAnterior;
    
    // Calcular totales si hay ventas
    if (ventasHorarioFiltradas.length > 0) {
        ventasHorarioFiltradas.forEach(venta => {
            totalVenta += venta.totalVenta;
            totalPremios += venta.premio;
        });

       // Calcular resultados
pagoPremios = Math.round(totalPremios * vendedor.precioVenta);
gananciaVendedor = Math.round(totalVenta * (vendedor.porcentaje / 100));
entrega = Math.round(totalVenta - gananciaVendedor);
const diferencia = Math.round(entrega - pagoPremios);

// Calcular cuál sería el nuevo fondo, incluyendo los movimientos de fondo
fondoRecomendado = Math.round(
    asegurarNumero(fondoAnterior) + 
    asegurarNumero(diferencia) + 
    asegurarNumero(totalAgregado) - 
    asegurarNumero(totalQuitado)
);

// Agregar log para verificar el cálculo
console.log("Cálculo de Fondo Recomendado:", {
    fondoAnterior,
    diferencia,
    totalAgregado,
    totalQuitado,
    fondoRecomendado });
    }
    
    // ========= CREAR REPORTE EN FORMATO TEXTO PLANO ==========
    let reporte = "";
    // Información de fecha y horario
    let fechaMostrar = fechaReporteVenta;
    // Verificar si la fecha necesita ser formateada
    if (fechaReporteVenta !== fechaActual && typeof fechaReporteVenta === 'string' && !fechaReporteVenta.includes('/')) {
        // Intentar formatear si no está en formato dd/mm/yyyy
        const partes = fechaReporteVenta.split('-');
        if (partes.length === 3) {
            fechaMostrar = `${partes[2]}/${partes[1]}/${partes[0]}`;
        }
    }
    if (numeroGanador !== null)
        // Encabezado
    reporte += `${vendedor.nombre}  ${horario === 'dia' ? 'Día' : 'Noche'}  ${numeroAEmoji(numeroGanador)} ${fechaMostrar} \n`;
            
    // RESUMEN GENERAL en formato de texto
    reporte += '----- RESUMEN GENERAL ------\n';
    
    if (ventasHorarioFiltradas.length > 0) {
        // Usar espacios para alinear como una tabla
        const etiquetas = [
            'Número de Ventas:',
            'Venta Total:',
            'Premio Total:',
            'Pago Total:',
            'Entrega Total:',
            `${fondoAnterior < 0 ? 'Fondo Banco Debe:' : 'Fondo Anterior:'}`
        ];
        
        // Formatear todos los valores, convirtiendo a string y alineando
        const valores = [
            ventasHorarioFiltradas.length.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
            Math.round(asegurarNumero(totalVenta)).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
            asegurarNumero(totalPremios).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
            asegurarNumero(pagoPremios).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
            Math.round(asegurarNumero(entrega)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
            asegurarNumero(fondoAnterior).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        ];
            // CÓDIGO NUEVO: Agregar línea de Ganancia o Pérdida
        // Calcular la ganancia o pérdida del banco
        const gananciaOPerdidaBanco = entrega - pagoPremios;

        // Agregar etiqueta de Ganancia o Pérdida según corresponda
        if (gananciaOPerdidaBanco >= 0) {
            etiquetas.push('Ganancia:');
        } else {
            etiquetas.push('Pérdida:');
        }

        // Formatear el valor (valor absoluto)
        const valorAbsoluto = Math.abs(gananciaOPerdidaBanco);
        valores.push(asegurarNumero(valorAbsoluto).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));

        // Encontrar la etiqueta más larga para calcular el padding
        const longitudMaxima = Math.max(...etiquetas.map(e => e.length));

        // Encontrar el valor más largo para calcular cuánto espacio reservar
        const longitudMaximaValores = Math.max(...valores.map(v => v.length));

        // Crear cada línea con alineación
        etiquetas.forEach((etiqueta, index) => {
            // Padding a la derecha para alinear el inicio de los valores
            const espaciosEtiqueta = ' '.repeat(longitudMaxima - etiqueta.length + 5);
            
            // Padding a la izquierda para alinear los valores a la derecha
            const valor = valores[index];
            const espaciosValor = ' '.repeat(longitudMaximaValores - valor.length);
            
            // Combinar todo con el valor alineado a la derecha
            reporte += `${etiqueta}${espaciosEtiqueta}${espaciosValor}${valor}\n`;
        });
        
        // Añadir información de "Banco Entregó" si hay fondos agregados hoy
        if (totalAgregado > 0) {
            const espacios = ' '.repeat(longitudMaxima - 13 + 5);
            reporte += `Banco Entregó:${espacios}+${Math.round(asegurarNumero(totalAgregadoHoy)).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}\n`;
        }
        
        // Añadir información de "Banco Recogió" si hay fondos quitados hoy
        if (totalQuitado > 0) {
            // Usar la misma lógica de alineación que para las etiquetas regulares
            const etiqueta = 'Banco Recogió:';
            const valor = Math.round(asegurarNumero(totalQuitadoHoy)).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
            // Padding a la derecha para alinear el inicio de los valores (igual que en etiquetas)
            const espaciosEtiqueta = ' '.repeat(longitudMaxima - etiqueta.length + 5);
            
            // Padding a la izquierda para alinear los valores a la derecha
            const espaciosValor = ' '.repeat(longitudMaximaValores - valor.length);
            
            // Combinar todo con el valor alineado a la derecha y con signo negativo
            reporte += `${etiqueta}${espaciosEtiqueta}${espaciosValor}-${valor}\n`;
        }
        // CÓDIGO NUEVO: Añadir el Fondo Actual al final de los movimientos
            const etiquetaFondoAct = 'Fondo Actual:';
            const valorFondoAct = asegurarNumero(fondoActual).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        // Usar la misma lógica de alineación que para las etiquetas regulares
            const espaciosEtiquetaFondoAct = ' '.repeat(longitudMaxima - etiquetaFondoAct.length + 5);
            const espaciosValorFondoAct = longitudMaximaValores > valorFondoAct.length ? 
            ' '.repeat(longitudMaximaValores - valorFondoAct.length) : '';

        // Agregar al reporte
            reporte += `${etiquetaFondoAct}${espaciosEtiquetaFondoAct}${espaciosValorFondoAct}${valorFondoAct}\n`;

        } else {
        reporte += 'No hay ventas registradas para este horario y fecha.\n';
    }
    
    // Agregar sección de fondos al reporte
    reporte += '\n----- FONDOS ACTUALES -----\n';
    
    // Crear las etiquetas y valores para la información de fondos
    const etiquetasFondos = [
        `${fondoAnterior < 0 ? 'Fondo Banco Debe:' : 'Fondo Anterior:'}`
    ];
    
    const valoresFondos = [
        asegurarNumero(fondoAnterior).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    ];
    // Agregar información de fondos agregados/quitados si existen
    if (totalAgregado > 0) {
        etiquetasFondos.push('Banco Entregó:');
        valoresFondos.push("+" + asegurarNumero(totalAgregado).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
    }

    if (totalQuitado > 0) {
        etiquetasFondos.push('Banco Recogió:');
        valoresFondos.push("-" + asegurarNumero(totalQuitado).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
    }
    // Añadir fondo recomendado si hay ventas
    if (ventasHorarioFiltradas.length > 0) {
        etiquetasFondos.push('Fondo Recomendado:');
        valoresFondos.push(asegurarNumero(fondoRecomendado).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
    }
    
    // Añadir fondo actual según condición
    if (horario === 'dia' || (horario === 'noche' && ventasHorarioFiltradas.length > 0)) {
        etiquetasFondos.push('Fondo Actual:');
        valoresFondos.push(asegurarNumero(fondoActual).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
    }
    
    // Encontrar la etiqueta más larga para calcular el padding
    const longitudMaximaFondos = Math.max(...etiquetasFondos.map(e => e.length));
    
    // Encontrar el valor más largo para calcular la alineación a la derecha
    const longitudMaximaValoresFondos = Math.max(...valoresFondos.map(v => v.length));
    
    // Crear cada línea de información de fondos con alineación (valores a la derecha)
    etiquetasFondos.forEach((etiqueta, index) => {
        // Espacio entre etiqueta y valor
        const espaciosEtiqueta = ' '.repeat(longitudMaximaFondos - etiqueta.length + 5);
        
        // Espacio para alinear valores a la derecha
        const valor = valoresFondos[index];
        const espaciosValor = ' '.repeat(longitudMaximaValoresFondos - valor.length);
        
        // Combinar todo con el valor alineado a la derecha
        reporte += `${etiqueta}${espaciosEtiqueta}${espaciosValor}${valor}\n`;
    });
    
    // Agregar movimientos de fondo si los hay
    // CÓDIGO NUEVO (alineación dinámica a la derecha)
    if (movimientosHoy.length > 0) {
        reporte += '\n---------- MOVIMIENTOS DE FONDO HOY ----------\n';
    
        // Arrays para las etiquetas y valores de movimientos
        const etiquetasMovimientos = [];
        const valoresMovimientos = [];
        
        // Preparar los datos
        movimientosHoy.forEach(mov => {
            if (mov.tipo === 'agregar') {
                etiquetasMovimientos.push('Banco Entrego:');
                valoresMovimientos.push(Math.round(mov.cantidad).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
            } else if (mov.tipo === 'quitar') {
                etiquetasMovimientos.push('Banco Recogio:');
                valoresMovimientos.push(Math.round(mov.cantidad).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
            }
        });
        
        // Calcular longitudes máximas
        const longitudMaximaMovimientos = Math.max(...etiquetasMovimientos.map(e => e.length));
        const longitudMaximaValoresMovimientos = Math.max(...valoresMovimientos.map(v => v.length));
        
        // Formatear cada línea de movimiento con valores alineados a la derecha
        etiquetasMovimientos.forEach((etiqueta, index) => {
            const espaciosEtiqueta = ' '.repeat(longitudMaximaMovimientos - etiqueta.length + 5);
            const espaciosValor = ' '.repeat(longitudMaximaValoresMovimientos - valoresMovimientos[index].length);
            
            reporte += `${etiqueta}${espaciosEtiqueta}${espaciosValor}${valoresMovimientos[index]}\n`;
        });
    }
    
    // Crear modal (mantener esta parte pero con la visualización del texto)
    const modalContainer = document.createElement('div');
    modalContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background-color: #a9a9a9; /* Gris oscuro */
        color: black;
        padding: 20px;
        border-radius: 8px;
        max-width: 80%;
        max-height: 80%;
        overflow-y: auto;
        position: relative;
    `;

    // Usar un elemento pre para mantener el formato del texto
    const preElement = document.createElement('pre');
    preElement.style.cssText = `
        margin: 0;
        font-family: monospace;
        white-space: pre;
        font-size: 14px;
    `;
    preElement.textContent = reporte;
    modalContent.appendChild(preElement);

    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 20px;
    `;

    // Botón para actualizar el fondo
    const updateFondoButton = document.createElement('button');
    updateFondoButton.textContent = 'Actualizar Fondo';
    updateFondoButton.style.cssText = `
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        background-color: #2196F3;
        color: white;
        cursor: pointer;
    `;
    
    // En el evento onclick del botón updateFondoButton
    // Botón para actualizar el fondo
    updateFondoButton.onclick = () => {
        // Obtener los fondos actuales
        const fondoActual = obtenerFondoActual(vendedor, horario);
        
        if (ventasHorarioFiltradas.length === 0) {
            alert('No hay ventas para actualizar el fondo.');
            return;
        }
        
        // Obtener la fecha de la venta que estamos procesando
        const fechaVenta = ventasHorarioFiltradas[0].fecha;
        const fechaVentaFormateada = obtenerFechaFormateada(fechaVenta);
        
        console.log("Procesando venta con fecha:", fechaVentaFormateada);
        
        if (confirm(`¿Deseas actualizar el fondo a ${fondoRecomendado}?`)) {
            console.log(`Actualizando fondo a ${fondoRecomendado} para la fecha ${fechaVentaFormateada}`);
            
            // 1. Actualizar o crear el registro histórico para esta fecha y horario específicos
            if (!vendedor.historialFondos) {
                vendedor.historialFondos = [];
            }
            
            // Buscar si ya existe un registro para esta fecha/horario
            const indiceRegistro = vendedor.historialFondos.findIndex(h => 
                obtenerFechaFormateada(h.fecha) === fechaVentaFormateada && 
                h.horario === horario);
            
            if (indiceRegistro !== -1) {
                // Actualizar registro existente
                vendedor.historialFondos[indiceRegistro].fondoActual = fondoRecomendado;
                vendedor.historialFondos[indiceRegistro].actualizadoEl = new Date().toISOString();
                
                console.log(`Actualizado registro existente para ${fechaVentaFormateada}, ${horario}`);
            } else {
                // Crear nuevo registro histórico
                vendedor.historialFondos.push({
                    fecha: fechaVenta,
                    horario: horario,
                    fondoActual: fondoRecomendado,
                    fondoAnterior: fondoAnterior,
                    actualizadoEl: new Date().toISOString()
                });
                
                console.log(`Creado nuevo registro para ${fechaVentaFormateada}, ${horario}`);
            }
            
            // 2. NUEVA LÓGICA: Mantener coherencia cronológica en registros futuros
            
            // Ordenar el historialFondos cronológicamente
            vendedor.historialFondos.sort((a, b) => {
                const fechaA = obtenerFechaFormateada(a.fecha).split('/').map(Number);
                const fechaB = obtenerFechaFormateada(b.fecha).split('/').map(Number);
                
                const dateA = new Date(fechaA[2], fechaA[1] - 1, fechaA[0]);
                const dateB = new Date(fechaB[2], fechaB[1] - 1, fechaB[0]);
                
                // Primero comparamos por fecha
                if (dateA.getTime() !== dateB.getTime()) {
                    return dateA.getTime() - dateB.getTime();
                }
                
                // Si la fecha es la misma, día va antes que noche
                if (a.horario === 'dia' && b.horario === 'noche') return -1;
                if (a.horario === 'noche' && b.horario === 'dia') return 1;
                
                return 0;
            });
            
            // Propagar el cambio a los siguientes registros en la secuencia
            let ultimoFondoActual = fondoRecomendado;
            let ultimaFecha = fechaVentaFormateada;
            let ultimoHorario = horario;
            
            // Recorremos todos los registros para actualizar los fondos anteriores según la cronología
            for (let i = 0; i < vendedor.historialFondos.length; i++) {
                const registro = vendedor.historialFondos[i];
                const fechaRegistro = obtenerFechaFormateada(registro.fecha);
                
                // Convertir a fechas para comparar
                const fechaRegistroObj = new Date(fechaRegistro.split('/')[2], 
                                                 fechaRegistro.split('/')[1] - 1, 
                                                 fechaRegistro.split('/')[0]);
                const ultimaFechaObj = new Date(ultimaFecha.split('/')[2], 
                                               ultimaFecha.split('/')[1] - 1, 
                                               ultimaFecha.split('/')[0]);
                
                // Verificar si este registro es posterior al que acabamos de actualizar
                const esPosterior = (fechaRegistroObj > ultimaFechaObj) || 
                                   (fechaRegistroObj.getTime() === ultimaFechaObj.getTime() && 
                                    ultimoHorario === 'dia' && registro.horario === 'noche');
                
                if (esPosterior) {
                    // Determinar si debemos actualizar el fondo anterior de este registro
                    let debeActualizar = false;
                    
                    // Si es el día siguiente al último registro de noche
                    if (ultimoHorario === 'noche' && registro.horario === 'dia') {
                        // Verificar si es el día siguiente
                        const siguienteDia = new Date(ultimaFechaObj);
                        siguienteDia.setDate(siguienteDia.getDate() + 1);
                        
                        if (fechaRegistroObj.getTime() === siguienteDia.getTime()) {
                            debeActualizar = true;
                        }
                    }
                    // Si es noche del mismo día que el último registro de día
                    else if (ultimoHorario === 'dia' && registro.horario === 'noche' &&
                            fechaRegistroObj.getTime() === ultimaFechaObj.getTime()) {
                        debeActualizar = true;
                    }
                    
                    if (debeActualizar) {
                        console.log(`Actualizando fondo anterior de registro ${fechaRegistro}, ${registro.horario} a ${ultimoFondoActual}`);
                        registro.fondoAnterior = ultimoFondoActual;
                        
                        // Si este registro ya tiene un fondo actual, lo usamos para el siguiente
                        if (registro.fondoActual !== null && registro.fondoActual !== undefined) {
                            ultimoFondoActual = registro.fondoActual;
                            ultimaFecha = fechaRegistro;
                            ultimoHorario = registro.horario;
                        }
                    }
                }
            }
            
            // 3. Si la fecha de la venta es la actual, también actualizamos los fondos actuales
            const fechaActualFormateada = obtenerFechaFormateada();
            if (fechaVentaFormateada === fechaActualFormateada) {
                console.log("La venta es de hoy, actualizando fondos actuales");
                
                // Asegurarse de que la estructura existe
                if (!vendedor.fondosPorHorario) {
                    vendedor.fondosPorHorario = {
                        dia: { anterior: 0, actual: 0 },
                        noche: { anterior: 0, actual: 0 }
                    };
                }
                
                // Actualizar el fondo actual para este horario
                vendedor.fondosPorHorario[horario].actual = fondoRecomendado;
                
                // Si es horario de día, actualizar el fondo anterior de la noche
                if (horario === 'dia') {
                    vendedor.fondosPorHorario.noche.anterior = fondoRecomendado;
                }
                
                // Guardar en localStorage
                localStorage.setItem(`fondoVendedor_${vendedorIndex}_${horario}`, 
                    JSON.stringify(vendedor.fondosPorHorario[horario]));
                    
                if (horario === 'dia') {
                    localStorage.setItem(`fondoVendedor_${vendedorIndex}_noche`, 
                        JSON.stringify(vendedor.fondosPorHorario.noche));
                }
            }
            
            // 4. Guardar todos los cambios
            guardarVendedores(vendedores);
            
            // 5. Registrar la actualización
            registrarActualizacionFondo(
                vendedorIndex,          
                fondoActual,            
                fondoRecomendado,       
                fondoRecomendado - fondoActual,             
                fechaVenta,            
                horario                 
            );
            
            alert('Fondo actualizado correctamente');
            document.body.removeChild(modalContainer);
            
            // Volver a mostrar el reporte actualizado
            verVentasVendedorPorHorario(vendedorIndex, horario);
            
            return false;
        }
    };

    // Botón Copiar
    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copiar';
    copyButton.style.cssText = `
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        background-color: #4CAF50;
        color: white;
        cursor: pointer;
    `;

    copyButton.onclick = async () => {
        try {
            // Obtener el texto completo del reporte
            const reporteCompleto = preElement.textContent;
            
            // Extraer solo el encabezado y el resumen general
            let reporteReducido = "";
            
            // Dividir el reporte en líneas
            const lineas = reporteCompleto.split('\n');
            
            // Variable para rastrear en qué sección estamos
            let enSeccionRelevante = true;
            
            // Recorrer cada línea del reporte
            for (let i = 0; i < lineas.length; i++) {
                const linea = lineas[i];
                
                // Siempre incluir el encabezado (las primeras líneas hasta RESUMEN GENERAL)
                if (i < 3 || linea.includes('RESUMEN GENERAL')) {
                    reporteReducido += linea + '\n';
                    enSeccionRelevante = true;
                    continue;
                }
                
                // Detectar cuando termina la sección de RESUMEN GENERAL
                if (linea.includes('FONDOS ACTUALES')) {
                    enSeccionRelevante = false;
                }
                
                // Añadir líneas solo si estamos en una sección relevante
                if (enSeccionRelevante) {
                    reporteReducido += linea + '\n';
                }
            }
            
            // Copiar el texto reducido al portapapeles
            await navigator.clipboard.writeText(reporteReducido);
            
            // Crear imagen en canvas basada en el texto reducido
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Calcular dimensiones según el contenido
            const lineasReducidas = reporteReducido.split('\n');
            const anchoCanvas = 300; // Ancho fijo para dar espacio suficiente
            const altoLinea = 20; // Altura por línea en píxeles
            const margen = 40; // Margen superior e inferior
            
            canvas.width = anchoCanvas;
            canvas.height = lineasReducidas.length * altoLinea + margen;
    
            // Fondo gris claro
            ctx.fillStyle = '#a9a9a9';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
    
            // Configurar texto monoespaciado para preservar alineación
            ctx.fillStyle = '#000000';
            ctx.font = '16px monospace';
            ctx.textAlign = 'left';
            
            // Dibujar cada línea exactamente como está en el texto reducido
            lineasReducidas.forEach((linea, index) => {
                ctx.fillText(linea, 20, 25 + (index * altoLinea));
            });
    
            // Convertir canvas a Blob (imagen)
            canvas.toBlob(async (blobImage) => {
                if (blobImage) {
                    try {
                        // Copiar ambos formatos: texto e imagen
                        const clipboardItems = [
                            new ClipboardItem({
                                'text/plain': new Blob([reporteReducido], {type: 'text/plain'}),
                                'image/png': blobImage
                            })
                        ];
                        
                        await navigator.clipboard.write(clipboardItems);
                        console.log("Texto e imagen copiados con éxito");
                    } catch (e) {
                        console.error("Error al escribir en el portapapeles:", e);
                        // Ya tenemos el texto copiado, así que no necesitamos volver a intentarlo
                    }
                }
            }, 'image/png');
    
            copyButton.textContent = 'Copiado!';
            setTimeout(() => copyButton.textContent = 'Copiar', 2000);
        } catch (err) {
            console.error('Error al copiar:', err);
            copyButton.textContent = 'Error al copiar';
            setTimeout(() => copyButton.textContent = 'Copiar', 2000);
        }
    };

    // Botón Aceptar
    const acceptButton = document.createElement('button');
    acceptButton.textContent = 'Aceptar';
    acceptButton.style.cssText = `
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        background-color: #4CAF50;
        color: white;
        cursor: pointer;
    `;
    acceptButton.onclick = () => {
        document.body.removeChild(modalContainer);
    };

    buttonContainer.appendChild(updateFondoButton);
    buttonContainer.appendChild(copyButton);
    buttonContainer.appendChild(acceptButton);
    modalContent.appendChild(buttonContainer);
    modalContainer.appendChild(modalContent);
    document.body.appendChild(modalContainer);
}

// Función para asegurarse de que un valor sea un número
function asegurarNumero(valor) {
    // Si el valor es undefined o null, devolver 0
    if (valor === undefined || valor === null) {
        console.log("Valor indefinido o nulo convertido a 0");
        return 0;
    }
    
    // Intentar convertir a número
    const numero = Number(valor);
    
    // Si es NaN, devolver 0 y registrar
    if (isNaN(numero)) {
        console.log("Valor NaN detectado y convertido a 0:", valor);
        return 0;
    }
    
    // Devolver el número tal cual, sin restricciones de mínimo
    return numero;
}

// Función para determinar el fondo anterior basado en la secuencia natural de ventas
function determinarFondoAnterior(vendedor, fecha, horario) {
    console.log(`Determinando fondo ANTERIOR para: ${fecha}, ${horario}`);
    
    // 1. Si es horario DÍA, el fondo anterior debe ser:
    //    - El fondo actual de la NOCHE ANTERIOR
    if (horario === 'dia') {
        // Calcular la fecha del día anterior
        const partes = fecha.split('/');
        const fechaObj = new Date(partes[2], partes[1] - 1, partes[0]);
        fechaObj.setDate(fechaObj.getDate() - 1);
        
        // Formatear a DD/MM/YYYY
        const diaAnterior = fechaObj.getDate().toString().padStart(2, '0');
        const mesAnterior = (fechaObj.getMonth() + 1).toString().padStart(2, '0');
        const anioAnterior = fechaObj.getFullYear();
        const fechaAnterior = `${diaAnterior}/${mesAnterior}/${anioAnterior}`;
        
        console.log(`Buscando noche de la fecha anterior: ${fechaAnterior}`);
        
        // Buscar en historialFondos un registro de la noche anterior
        if (vendedor.historialFondos && Array.isArray(vendedor.historialFondos)) {
            const fondoNocheAnterior = vendedor.historialFondos.find(f => 
                obtenerFechaFormateada(f.fecha) === fechaAnterior && 
                f.horario === 'noche');
                
            if (fondoNocheAnterior && fondoNocheAnterior.fondoActual) {
                console.log(`Encontrado fondo de la noche anterior: ${fondoNocheAnterior.fondoActual}`);
                return fondoNocheAnterior.fondoActual;
            }
        }
    }
    
    // 2. Si es horario NOCHE, el fondo anterior debe ser:
    //    - El fondo actual del DÍA ACTUAL
    else if (horario === 'noche') {
        console.log(`Buscando día de la misma fecha: ${fecha}`);
        
        // Buscar en historialFondos un registro del día de la misma fecha
        if (vendedor.historialFondos && Array.isArray(vendedor.historialFondos)) {
            const fondoDiaMismaFecha = vendedor.historialFondos.find(f => 
                obtenerFechaFormateada(f.fecha) === fecha && 
                f.horario === 'dia');
                
            if (fondoDiaMismaFecha && fondoDiaMismaFecha.fondoActual) {
                console.log(`Encontrado fondo del día actual: ${fondoDiaMismaFecha.fondoActual}`);
                return fondoDiaMismaFecha.fondoActual;
            }
        }
    }
    
    // 3. Si no se encontró según las reglas anteriores, buscar el registro más reciente
    // que sea anterior a esta fecha/horario
    console.log("Buscando el registro más reciente anterior a esta fecha/horario");
    
    if (vendedor.historialFondos && Array.isArray(vendedor.historialFondos)) {
        // Filtrar registros anteriores a esta fecha/horario
        const registrosAnteriores = vendedor.historialFondos.filter(reg => {
            const fechaReg = obtenerFechaFormateada(reg.fecha);
            
            // Convertir ambas fechas a arrays [día, mes, año]
            const partesActual = fecha.split('/').map(Number);
            const partesReg = fechaReg.split('/').map(Number);
            
            // Si año es menor, es anterior
            if (partesReg[2] < partesActual[2]) return true;
            // Si año es mayor, es posterior
            if (partesReg[2] > partesActual[2]) return false;
            
            // Mismo año, comparar mes
            if (partesReg[1] < partesActual[1]) return true;
            if (partesReg[1] > partesActual[1]) return false;
            
            // Mismo mes, comparar día
            if (partesReg[0] < partesActual[0]) return true;
            if (partesReg[0] > partesActual[0]) return false;
            
            // Misma fecha, comparar horario
            if (fechaReg === fecha) {
                // Si actual es noche y registro es día, registro es anterior
                if (horario === 'noche' && reg.horario === 'dia') return true;
                // En cualquier otro caso, no es anterior
                return false;
            }
            
            return false; // Mismo día pero no cumple las condiciones
        });
        
        // Ordenar por fecha, del más reciente al más antiguo
        registrosAnteriores.sort((a, b) => {
            const fechaA = obtenerFechaFormateada(a.fecha);
            const fechaB = obtenerFechaFormateada(b.fecha);
            
            const partesA = fechaA.split('/').map(Number);
            const partesB = fechaB.split('/').map(Number);
            
            // Comparar año
            if (partesB[2] !== partesA[2]) return partesB[2] - partesA[2];
            
            // Mismo año, comparar mes
            if (partesB[1] !== partesA[1]) return partesB[1] - partesA[1];
            
            // Mismo año y mes, comparar día
            if (partesB[0] !== partesA[0]) return partesB[0] - partesA[0];
            
            // Misma fecha, comparar horario (noche es más reciente que día)
            if (a.horario === 'noche' && b.horario === 'dia') return -1;
            if (a.horario === 'dia' && b.horario === 'noche') return 1;
            
            return 0;
        });
        
        // Si hay registros anteriores, usar el más reciente
        if (registrosAnteriores.length > 0) {
            const registroMasReciente = registrosAnteriores[0];
            
            // Verificar que tenga fondoActual
            if (registroMasReciente.fondoActual !== null && registroMasReciente.fondoActual !== undefined) {
                console.log("Encontrado registro más reciente:", registroMasReciente);
                return registroMasReciente.fondoActual;
            }
            else if (registroMasReciente.fondoAnterior !== null && registroMasReciente.fondoAnterior !== undefined) {
                console.log("Usando fondoAnterior del registro más reciente:", registroMasReciente);
                return registroMasReciente.fondoAnterior;
            }
        }
    }
    
    // 4. Si todo lo anterior falla, usar el fondo guardado en la estructura del vendedor
    console.log("No se encontraron registros históricos, usando valores del vendedor");
    return obtenerFondoAnterior(vendedor, horario);
}

// Función auxiliar para obtener la fecha del día anterior
function obtenerFechaAnterior(fecha) {
    // Si fecha es string en formato DD/MM/YYYY
    if (typeof fecha === 'string' && fecha.includes('/')) {
        const partes = fecha.split('/');
        const fechaObj = new Date(partes[2], partes[1] - 1, partes[0]);
        fechaObj.setDate(fechaObj.getDate() - 1);
        
        const dia = String(fechaObj.getDate()).padStart(2, '0');
        const mes = String(fechaObj.getMonth() + 1).padStart(2, '0');
        const anio = fechaObj.getFullYear();
        
        return `${dia}/${mes}/${anio}`;
    }
    // Si fecha es string en formato ISO (YYYY-MM-DD)
    else if (typeof fecha === 'string' && fecha.includes('-')) {
        const fechaObj = new Date(fecha);
        fechaObj.setDate(fechaObj.getDate() - 1);
        
        const dia = String(fechaObj.getDate()).padStart(2, '0');
        const mes = String(fechaObj.getMonth() + 1).padStart(2, '0');
        const anio = fechaObj.getFullYear();
        
        return `${dia}/${mes}/${anio}`;
    }
    // Para otros formatos de fecha
    else {
        try {
            const fechaObj = new Date(fecha);
            if (!isNaN(fechaObj.getTime())) {
                fechaObj.setDate(fechaObj.getDate() - 1);
                
                const dia = String(fechaObj.getDate()).padStart(2, '0');
                const mes = String(fechaObj.getMonth() + 1).padStart(2, '0');
                const anio = fechaObj.getFullYear();
                
                return `${dia}/${mes}/${anio}`;
            } else {
                console.error("Formato de fecha no reconocido:", fecha);
                return null;
            }
        } catch (error) {
            console.error("Error al calcular la fecha anterior:", error);
            return null;
        }
    }
}

// Función auxiliar para calcular la fecha del día siguiente
function obtenerFechaSiguiente(fecha) {
    // Si fecha es un string en formato ISO (YYYY-MM-DD)
    if (typeof fecha === 'string' && fecha.includes('-')) {
        const fechaObj = new Date(fecha);
        fechaObj.setDate(fechaObj.getDate() + 1);
        
        // Devolver en el mismo formato
        const anio = fechaObj.getFullYear();
        const mes = String(fechaObj.getMonth() + 1).padStart(2, '0');
        const dia = String(fechaObj.getDate()).padStart(2, '0');
        
        return `${anio}-${mes}-${dia}`;
    }
    // Si fecha es un objeto Date
    else if (fecha instanceof Date) {
        const fechaObj = new Date(fecha);
        fechaObj.setDate(fechaObj.getDate() + 1);
        return fechaObj;
    }
    // Si es un string en otro formato, convertir primero
    else {
        // Intentar convertir a Date y luego procesar
        const fechaObj = new Date(fecha);
        if (!isNaN(fechaObj.getTime())) { // Verificar si es una fecha válida
            fechaObj.setDate(fechaObj.getDate() + 1);
            return fechaObj.toISOString().split('T')[0]; // Formato YYYY-MM-DD
        } else {
            console.error("Formato de fecha no reconocido:", fecha);
            return null;
        }
    }
}

// Función para obtener fondos históricos para una fecha y horario específicos
function obtenerFondosHistoricos(vendedor, fechaConsulta, horarioConsulta) {
    console.log(`Buscando fondos históricos para fecha: ${fechaConsulta}, horario: ${horarioConsulta}`);
    
    if (!vendedor.historialFondos || !Array.isArray(vendedor.historialFondos) || vendedor.historialFondos.length === 0) {
        console.log("No hay historial de fondos disponible");
        return null;
    }
    
    // 1. Primero verificamos si existe un registro exacto para esta fecha y horario
    const registroDirecto = vendedor.historialFondos.find(h => 
        obtenerFechaFormateada(h.fecha) === fechaConsulta && 
        h.horario === horarioConsulta);
        
    if (registroDirecto) {
        console.log("Encontrado registro directo:", registroDirecto);
        return {
            actual: registroDirecto.fondoActual,
            anterior: registroDirecto.fondoAnterior
        };
    }
    
    // 2. Si no hay registro directo, determinamos el fondo anterior según reglas de secuencia natural
    const partesFecha = fechaConsulta.split('/').map(Number); // [día, mes, año]
    
    // Creamos una fecha de referencia para comparaciones
    const fechaRef = new Date(partesFecha[2], partesFecha[1] - 1, partesFecha[0]);
    
    // Filtramos registros cronológicamente ANTERIORES a la fecha de consulta
    const registrosAnteriores = vendedor.historialFondos.filter(h => {
        const fechaRegistro = obtenerFechaFormateada(h.fecha);
        const partesRegistro = fechaRegistro.split('/').map(Number);
        
        // Creamos fecha del registro para comparar
        const fechaReg = new Date(partesRegistro[2], partesRegistro[1] - 1, partesRegistro[0]);
        
        // Si es una fecha anterior, incluir
        if (fechaReg < fechaRef) return true;
        
        // Si es la misma fecha, depende del horario
        if (fechaReg.getTime() === fechaRef.getTime()) {
            if (horarioConsulta === 'noche' && h.horario === 'dia') return true;
            return false; // Cualquier otro caso no se considera anterior
        }
        
        return false; // Fecha posterior
    });
    
    // Si estamos consultando un registro del día
    if (horarioConsulta === 'dia') {
        // Para el día, necesitamos el fondo de la noche anterior como fondo anterior
        
        // Calculamos la fecha anterior
        const fechaAnterior = new Date(fechaRef);
        fechaAnterior.setDate(fechaAnterior.getDate() - 1);
        const fechaAnteriorStr = obtenerFechaFormateada(fechaAnterior);
        
        // Buscamos registro de la noche anterior
        const registroNocheAnterior = vendedor.historialFondos.find(h => 
            obtenerFechaFormateada(h.fecha) === fechaAnteriorStr && 
            h.horario === 'noche');
            
        if (registroNocheAnterior && registroNocheAnterior.fondoActual !== null) {
            console.log("Encontrado registro de noche anterior:", registroNocheAnterior);
            return {
                actual: null, // No sabemos el actual aún
                anterior: registroNocheAnterior.fondoActual
            };
        }
    } 
    // Si estamos consultando un registro de la noche
    else if (horarioConsulta === 'noche') {
        // Para la noche, necesitamos el fondo del día de la misma fecha como fondo anterior
        
        // Buscamos registro del día de la misma fecha
        const registroDiaMismaFecha = vendedor.historialFondos.find(h => 
            obtenerFechaFormateada(h.fecha) === fechaConsulta && 
            h.horario === 'dia');
            
        if (registroDiaMismaFecha && registroDiaMismaFecha.fondoActual !== null) {
            console.log("Encontrado registro del día de la misma fecha:", registroDiaMismaFecha);
            return {
                actual: null, // No sabemos el actual aún
                anterior: registroDiaMismaFecha.fondoActual
            };
        }
    }
    
    // 3. Si no encontramos según reglas específicas, buscamos el registro cronológicamente más reciente
    if (registrosAnteriores.length > 0) {
        // Ordenamos los registros por fecha (más reciente primero)
        registrosAnteriores.sort((a, b) => {
            // Convertir fechas a objetos Date para comparar
            const fechaA = obtenerFechaFormateada(a.fecha).split('/').map(Number);
            const fechaB = obtenerFechaFormateada(b.fecha).split('/').map(Number);
            
            const dateA = new Date(fechaA[2], fechaA[1] - 1, fechaA[0]);
            const dateB = new Date(fechaB[2], fechaB[1] - 1, fechaB[0]);
            
            // Primero comparamos por fecha
            if (dateA.getTime() !== dateB.getTime()) {
                return dateB.getTime() - dateA.getTime();
            }
            
            // Si la fecha es la misma, comparamos por horario (noche es más reciente que día)
            if (a.horario === 'noche' && b.horario === 'dia') return -1;
            if (a.horario === 'dia' && b.horario === 'noche') return 1;
            
            return 0;
        });
        
        // Tomamos el registro más reciente
        const registroMasReciente = registrosAnteriores[0];
        console.log("Usando el registro más reciente encontrado:", registroMasReciente);
        
        // Si el registro más reciente tiene fondoActual, ese es el que necesitamos
        if (registroMasReciente.fondoActual !== null && registroMasReciente.fondoActual !== undefined) {
            return {
                actual: null, // No sabemos el actual aún
                anterior: registroMasReciente.fondoActual
            };
        }
        // Si no tiene fondoActual pero sí fondoAnterior, usamos ese
        else if (registroMasReciente.fondoAnterior !== null && registroMasReciente.fondoAnterior !== undefined) {
            return {
                actual: null,
                anterior: registroMasReciente.fondoAnterior
            };
        }
    }
    
    // 4. Si todo lo anterior falla, volver a los valores por defecto
    console.log("No se encontraron registros históricos adecuados, usando valores actuales");
    return null;
}

function determinarFondoAnteriorCronologico(vendedor, fechaConsulta, horarioConsulta) {
    console.log(`Determinando fondo ANTERIOR para: ${fechaConsulta}, ${horarioConsulta}`);
    
    // Reglas:
    // 1. Para DÍA: El fondo anterior debe ser el fondo actual de la NOCHE ANTERIOR
    // 2. Para NOCHE: El fondo anterior debe ser el fondo actual del DÍA del MISMO DÍA
    
    const partesFecha = fechaConsulta.split('/').map(Number); // [día, mes, año]
    
    if (horarioConsulta === 'dia') {
        // Calcular la fecha del día anterior
        const fechaAnterior = new Date(partesFecha[2], partesFecha[1] - 1, partesFecha[0]);
        fechaAnterior.setDate(fechaAnterior.getDate() - 1);
        
        // Formatear a DD/MM/YYYY
        const fechaAnteriorStr = obtenerFechaFormateada(fechaAnterior);
        
        // Buscar un registro de la noche anterior
        if (vendedor.historialFondos && Array.isArray(vendedor.historialFondos)) {
            const fondoNocheAnterior = vendedor.historialFondos.find(f => 
                obtenerFechaFormateada(f.fecha) === fechaAnteriorStr && 
                f.horario === 'noche');
                
            if (fondoNocheAnterior && fondoNocheAnterior.fondoActual !== null) {
                return fondoNocheAnterior.fondoActual;
            }
        }
    } 
    else if (horarioConsulta === 'noche') {
        // Buscar un registro del día del mismo día
        if (vendedor.historialFondos && Array.isArray(vendedor.historialFondos)) {
            const fondoDiaMismaFecha = vendedor.historialFondos.find(f => 
                obtenerFechaFormateada(f.fecha) === fechaConsulta && 
                f.horario === 'dia');
                
            if (fondoDiaMismaFecha && fondoDiaMismaFecha.fondoActual !== null) {
                return fondoDiaMismaFecha.fondoActual;
            }
        }
    }
    
    // Si no se encontró según las reglas, buscar el registro cronológicamente más reciente
    // pero anterior a la fecha/horario que estamos consultando
    
    if (vendedor.historialFondos && Array.isArray(vendedor.historialFondos)) {
        // Convertir la fecha de consulta a objeto Date para comparaciones
        const fechaConsultaObj = new Date(partesFecha[2], partesFecha[1] - 1, partesFecha[0]);
        
        // Filtrar registros anteriores a esta fecha/horario
        const registrosAnteriores = vendedor.historialFondos.filter(reg => {
            const fechaReg = obtenerFechaFormateada(reg.fecha);
            const partesReg = fechaReg.split('/').map(Number);
            const fechaRegObj = new Date(partesReg[2], partesReg[1] - 1, partesReg[0]);
            
            // Si la fecha es anterior, incluir
            if (fechaRegObj < fechaConsultaObj) return true;
            
            // Si es la misma fecha, depende del horario
            if (fechaRegObj.getTime() === fechaConsultaObj.getTime()) {
                if (horarioConsulta === 'noche' && reg.horario === 'dia') return true;
                return false;
            }
            
            return false;
        });
        
        // Ordenar por fecha, del más reciente al más antiguo
        registrosAnteriores.sort((a, b) => {
            const fechaA = obtenerFechaFormateada(a.fecha).split('/').map(Number);
            const fechaB = obtenerFechaFormateada(b.fecha).split('/').map(Number);
            
            const dateA = new Date(fechaA[2], fechaA[1] - 1, fechaA[0]);
            const dateB = new Date(fechaB[2], fechaB[1] - 1, fechaB[0]);
            
            // Primero comparamos por fecha
            if (dateA.getTime() !== dateB.getTime()) {
                return dateB.getTime() - dateA.getTime();
            }
            
            // Si la fecha es la misma, noche va después de día
            if (a.horario === 'noche' && b.horario === 'dia') return -1;
            if (a.horario === 'dia' && b.horario === 'noche') return 1;
            
            return 0;
        });
        
        // Si hay registros anteriores, usar el más reciente
        if (registrosAnteriores.length > 0) {
            const registroMasReciente = registrosAnteriores[0];
            
            // Verificar que tenga fondoActual
            if (registroMasReciente.fondoActual !== null && registroMasReciente.fondoActual !== undefined) {
                return registroMasReciente.fondoActual;
            }
            else if (registroMasReciente.fondoAnterior !== null && registroMasReciente.fondoAnterior !== undefined) {
                return registroMasReciente.fondoAnterior;
            }
        }
    }
    
    // Si todo lo anterior falla, usar el fondo por defecto
    return obtenerFondoAnterior(vendedor, horarioConsulta);
}

// Función que puedes llamar después de registrar una venta
function actualizarFondoAutomaticamente(vendedorIndex, horario, fechaActual) {
    // Obtener el vendedor
    const vendedor = vendedores[vendedorIndex];
    if (!vendedor) {
        console.error("Vendedor no encontrado");
        return;
    }
    
    // Obtener el fondo actual (que pasará a ser el fondo anterior)
    const fondoActual = parseFloat(localStorage.getItem(`fondoActual_${vendedorIndex}_${horario}`)) || 0;
    
    // Calcular el fondo recomendado basado en la venta más reciente
    const fondoRecomendado = calcularFondoRecomendado(vendedorIndex, horario);
    
    // Registrar el cambio, el fondo actual pasa a ser el anterior
    registrarActualizacionFondo(
        vendedorIndex,
        fondoActual,         // Fondo anterior (el que era actual)
        fondoRecomendado,    // Nuevo fondo actual (el recomendado)
        fondoRecomendado - fondoActual, // Diferencia
        fechaActual,
        horario,
        true // Es automático
    );
    
    // Actualizar el fondo actual al recomendado
    localStorage.setItem(`fondoActual_${vendedorIndex}_${horario}`, fondoRecomendado.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
    
    // Mantener un registro del fondo anterior
    localStorage.setItem(`fondoAnterior_${vendedorIndex}_${horario}`, fondoActual.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
    
    // Actualizar el objeto vendedor
    if (!vendedor.fondosPorHorario) {
        vendedor.fondosPorHorario = {};
    }
    vendedor.fondosPorHorario[horario] = {
        actual: fondoRecomendado,
        anterior: fondoActual
    };
    
    guardarVendedores(vendedores);
    
    // Actualizar la UI si es necesario
    actualizarInterfazFondos(vendedorIndex, horario);
    
    console.log('Fondo actualizado: Anterior =', fondoActual, 'Nuevo =', fondoRecomendado);
}

// Función para actualizar la interfaz de usuario
function actualizarInterfazFondos(vendedorIndex, horario) {
    const fondoActual = parseFloat(localStorage.getItem(`fondoActual_${vendedorIndex}_${horario}`)) || 0;
    const fondoAnterior = parseFloat(localStorage.getItem(`fondoAnterior_${vendedorIndex}_${horario}`)) || 0;
    
    // Actualizar los elementos del modal
    if (document.getElementById('fondoActualDisplay')) {
        document.getElementById('fondoActualDisplay').textContent = fondoActual.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    
    if (document.getElementById('fondoAnteriorDisplay')) {
        document.getElementById('fondoAnteriorDisplay').textContent = fondoAnterior.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
}

// Función para obtener el fondo actual de forma segura
function actualizarFondo(vendedor, horario, nuevoFondo, vendedorIndex) {
    // Asegurar que nuevoFondo sea un número válido
    nuevoFondo = asegurarNumero(nuevoFondo);
    
    // Obtener el fondo actual (que pasará a ser el anterior)
    const fondoActual = obtenerFondoActual(vendedor, horario);
    
    console.log(`Actualizando fondo para ${vendedor.nombre}:`);
    console.log(`- Horario: ${horario}`);
    console.log(`- Fondo actual: ${fondoActual} → Nuevo fondo: ${nuevoFondo}`);
    
    // Asegurarse de que fondosPorHorario esté inicializado
    if (!vendedor.fondosPorHorario) {
        vendedor.fondosPorHorario = {};
    }
    
    // Asegurarse de que ambos horarios estén inicializados
    if (!vendedor.fondosPorHorario.dia) {
        vendedor.fondosPorHorario.dia = {
            actual: vendedor.fondo || 0,
            anterior: vendedor.fondo || 0
        };
    }
    
    if (!vendedor.fondosPorHorario.noche) {
        vendedor.fondosPorHorario.noche = {
            actual: vendedor.fondo || 0,
            anterior: vendedor.fondo || 0
        };
    }
    
    // Convertir cualquier valor que no sea objeto a formato de objeto
    if (typeof vendedor.fondosPorHorario.dia !== 'object') {
        const valor = vendedor.fondosPorHorario.dia;
        vendedor.fondosPorHorario.dia = {
            actual: asegurarNumero(valor),
            anterior: asegurarNumero(valor)
        };
    }
    
    if (typeof vendedor.fondosPorHorario.noche !== 'object') {
        const valor = vendedor.fondosPorHorario.noche;
        vendedor.fondosPorHorario.noche = {
            actual: asegurarNumero(valor),
            anterior: asegurarNumero(valor)
        };
    }
    
    // Actualizar el fondo del horario actual
    vendedor.fondosPorHorario[horario] = {
        actual: nuevoFondo,
        anterior: fondoActual
    };
    
    // IMPORTANTE: Actualizar el "actual" del otro horario también
    const otroHorario = (horario === 'dia') ? 'noche' : 'dia';
    vendedor.fondosPorHorario[otroHorario].actual = nuevoFondo;
    
    // Guardar en localStorage para ambos horarios
    localStorage.setItem(`fondoVendedor_${vendedorIndex}_dia`, JSON.stringify(vendedor.fondosPorHorario.dia));
    localStorage.setItem(`fondoVendedor_${vendedorIndex}_noche`, JSON.stringify(vendedor.fondosPorHorario.noche));
    
    // Guardar los cambios
    guardarVendedores(vendedores);
    
    console.log("Fondos actualizados:", {
        dia: vendedor.fondosPorHorario.dia,
        noche: vendedor.fondosPorHorario.noche
    });
    
    return {
        actual: nuevoFondo,
        anterior: fondoActual
    };
}

function corregirFondosEntreHorarios(vendedor, vendedorIndex) {
    console.log("Corrigiendo fondos entre horarios para", vendedor.nombre);
    console.log("Fondos actuales:", JSON.stringify(vendedor.fondosPorHorario));
    
    // Asegurarse de que la estructura existe
    if (!vendedor.fondosPorHorario) {
        vendedor.fondosPorHorario = {
            dia: { anterior: 0, actual: 0 },
            noche: { anterior: 0, actual: 0 }
        };
    }
    
    // IMPORTANTE: Solo sincronizamos el fondo anterior, NO el actual
    // Para el DÍA: El fondo anterior debería ser el último fondo actual guardado de la noche anterior
    // Para la NOCHE: El fondo anterior debería ser el último fondo actual guardado del día actual
    
    // Verificar si están guardados en localStorage
    const fondoDiaGuardado = localStorage.getItem(`fondoVendedor_${vendedorIndex}_dia`);
    const fondoNocheGuardado = localStorage.getItem(`fondoVendedor_${vendedorIndex}_noche`);
    
    let fondoDia = fondoDiaGuardado ? JSON.parse(fondoDiaGuardado) : { anterior: 0, actual: 0 };
    let fondoNoche = fondoNocheGuardado ? JSON.parse(fondoNocheGuardado) : { anterior: 0, actual: 0 };
    
    // Ahora corregimos los valores
    
    // 1. El fondo anterior del día debería ser el fondo actual de la noche anterior
    // (Solo en el cambio de día, que no es este caso)
    
    // 2. El fondo anterior de la noche debería ser el fondo actual del día
    fondoNoche.anterior = fondoDia.actual;
    
    console.log("Después de corregir:", {
        dia: fondoDia,
        noche: fondoNoche
    });
    
    // Guardar los valores corregidos
    vendedor.fondosPorHorario.dia = fondoDia;
    vendedor.fondosPorHorario.noche = fondoNoche;
    
    // Guardar en localStorage
    localStorage.setItem(`fondoVendedor_${vendedorIndex}_dia`, JSON.stringify(fondoDia));
    localStorage.setItem(`fondoVendedor_${vendedorIndex}_noche`, JSON.stringify(fondoNoche));
    
    // Guardar en el array de vendedores
    guardarVendedores(vendedores);
    
    return vendedor.fondosPorHorario;
}

// Función para obtener el fondo anterior de forma segura
function obtenerFondoAnterior(vendedor, horario) {
    // Verificar si existe el objeto fondosPorHorario
    if (!vendedor.fondosPorHorario) {
        return vendedor.fondo || 0;
    }
    
    // Verificar si existe el valor para el horario específico
    if (!vendedor.fondosPorHorario[horario]) {
        return vendedor.fondo || 0;
    }
    
    // Si es un objeto completo con la propiedad anterior
    if (typeof vendedor.fondosPorHorario[horario] === 'object' && 
        vendedor.fondosPorHorario[horario] !== null && 
        'anterior' in vendedor.fondosPorHorario[horario]) {
        return vendedor.fondosPorHorario[horario].anterior;
    } 
    // Si es un número directo (usamos el mismo valor como anterior)
    else if (typeof vendedor.fondosPorHorario[horario] === 'number') {
        return vendedor.fondosPorHorario[horario];
    }
    // Si es un objeto vacío u otro tipo
    else {
        return 0;
    }
}

// Función para inicializar correctamente los fondos por horario
function inicializarFondosPorHorario(vendedor) {
    // Crear el objeto si no existe
    if (!vendedor.fondosPorHorario) {
        vendedor.fondosPorHorario = {};
    }
   
    // Inicializar día si no existe o si es un objeto vacío
    if (!vendedor.fondosPorHorario.dia ||
        (typeof vendedor.fondosPorHorario.dia === 'object' &&
         Object.keys(vendedor.fondosPorHorario.dia).length === 0)) {
        // Si noche existe y es un número, usar ese valor
        if (vendedor.fondosPorHorario.noche && typeof vendedor.fondosPorHorario.noche === 'number') {
            vendedor.fondosPorHorario.dia = {
                actual: vendedor.fondosPorHorario.noche,
                anterior: vendedor.fondosPorHorario.noche
            };
        } else {
            // Si no, usar el fondo general
            vendedor.fondosPorHorario.dia = {
                actual: vendedor.fondo || 0,
                anterior: vendedor.fondo || 0
            };
        }
    }
   
    // Inicializar noche si no existe
    if (!vendedor.fondosPorHorario.noche) {
        // Si día existe y tiene estructura correcta, usar ese valor
        if (vendedor.fondosPorHorario.dia &&
            typeof vendedor.fondosPorHorario.dia === 'object' &&
            'actual' in vendedor.fondosPorHorario.dia) {
            vendedor.fondosPorHorario.noche = {
                actual: vendedor.fondosPorHorario.dia.actual,
                anterior: vendedor.fondosPorHorario.dia.actual
            };
        } else {
            // Si no, usar el fondo general
            vendedor.fondosPorHorario.noche = {
                actual: vendedor.fondo || 0,
                anterior: vendedor.fondo || 0
            };
        }
    }
   
    // Convertir noche a objeto si es un número
    if (typeof vendedor.fondosPorHorario.noche === 'number') {
        const valorNoche = vendedor.fondosPorHorario.noche;
        vendedor.fondosPorHorario.noche = {
            actual: valorNoche,
            anterior: valorNoche
        };
    }
   
    // Guardar cambios
    guardarVendedores(vendedores);
   
    return vendedor.fondosPorHorario;
}

// Calcular el fondo recomendado sin modificar los valores actuales
function calcularFondoRecomendado(vendedorIndex, horario) {
    const vendedor = vendedores[vendedorIndex];
    
    // Filtrar ventas por horario
    const ventasHorario = vendedor.ventas.filter(v => v.horario === horario);
    
    if (ventasHorario.length === 0) {
        // Si no hay ventas, el fondo recomendado es el mismo que el actual
        return obtenerFondoActual(vendedor, horario);
    }
    
    // Inicializar variables
    let totalVenta = 0;
    let totalPremios = 0;
    
    // Calcular totales
    ventasHorario.forEach(venta => {
        totalVenta += venta.totalVenta;
        totalPremios += venta.premio;
    });
    
    // Calcular resultados
    const pagoPremios = Math.round(totalPremios * vendedor.precioVenta);
    const gananciaVendedor = Math.round(totalVenta * (vendedor.porcentaje / 100));
    const entrega = Math.round(totalVenta - gananciaVendedor);
    const diferencia = Math.round(entrega - pagoPremios);
    
    // Obtener fondo actual
    const fondoActual = obtenerFondoActual(vendedor, horario);
    
    // Calcular fondo recomendado
    const fondoRecomendado = Math.round(fondoActual + diferencia);
    
    return fondoRecomendado;
}

// Función para obtener el fondo actual con más diagnóstico
function obtenerFondoActual(vendedor, horario) {
    console.log(`Obteniendo fondo actual para ${vendedor.nombre}, horario: ${horario}`);
    console.log("fondosPorHorario:", vendedor.fondosPorHorario);
    
    // Valor predeterminado si no hay datos
    if (!vendedor || !horario) {
        console.log("No hay vendedor o horario definido");
        return 0;
    }
    
    // Si no existe fondosPorHorario
    if (!vendedor.fondosPorHorario) {
        console.log("No existe fondosPorHorario, usando fondo general:", vendedor.fondo);
        return Number(vendedor.fondo) || 0;
    }
    
    // Si no existe el horario específico
    if (!vendedor.fondosPorHorario[horario]) {
        console.log(`No existe fondosPorHorario[${horario}], usando fondo general:`, vendedor.fondo);
        return Number(vendedor.fondo) || 0;
    }
    
    console.log(`Tipo de fondosPorHorario[${horario}]:`, typeof vendedor.fondosPorHorario[horario]);
    console.log(`Valor de fondosPorHorario[${horario}]:`, vendedor.fondosPorHorario[horario]);
    
    // Si es un objeto con propiedad 'actual'
    if (typeof vendedor.fondosPorHorario[horario] === 'object' && 
        vendedor.fondosPorHorario[horario] !== null) {
        if ('actual' in vendedor.fondosPorHorario[horario]) {
            console.log(`Encontrado fondo actual:`, vendedor.fondosPorHorario[horario].actual);
            return Number(vendedor.fondosPorHorario[horario].actual) || 0;
        } else {
            console.log(`Objeto sin propiedad 'actual'`);
            return 0;
        }
    } 
    
    // Si es un número directo
    if (typeof vendedor.fondosPorHorario[horario] === 'number') {
        console.log(`Encontrado fondo como número directo:`, vendedor.fondosPorHorario[horario]);
        return vendedor.fondosPorHorario[horario];
    }
    
    // Cualquier otro caso
    console.log(`Tipo de dato no esperado:`, typeof vendedor.fondosPorHorario[horario]);
    return 0;
}

// Función para sincronizar fondos entre horarios y días
function sincronizarFondosEntreHorarios(vendedor, vendedorIndex) {
    // Asegurarse de que la estructura existe
    if (!vendedor.fondosPorHorario) {
        vendedor.fondosPorHorario = {
            dia: { anterior: 0, actual: 0 },
            noche: { anterior: 0, actual: 0 }
        };
    }
    
    // Obtener la hora actual para determinar qué horario es
    const ahora = new Date();
    const hora = ahora.getHours();
    const esHorarioDia = hora >= 6 && hora < 18; // De 6am a 6pm es horario de día
    
    // Si estamos en horario de día
    if (esHorarioDia) {
        // El fondo actual de la noche anterior se convierte en el fondo anterior del día
        const fondoNocheAnterior = vendedor.fondosPorHorario.noche.actual;
        
        if (fondoNocheAnterior !== undefined && fondoNocheAnterior !== null) {
            vendedor.fondosPorHorario.dia.anterior = fondoNocheAnterior;
            console.log(`Sincronizado: Fondo actual noche (${fondoNocheAnterior}) -> Fondo anterior día`);
        }
    } 
    // Si estamos en horario de noche
    else {
        // El fondo actual del día se convierte en el fondo anterior de la noche
        const fondoDiaActual = vendedor.fondosPorHorario.dia.actual;
        
        if (fondoDiaActual !== undefined && fondoDiaActual !== null) {
            vendedor.fondosPorHorario.noche.anterior = fondoDiaActual;
            console.log(`Sincronizado: Fondo actual día (${fondoDiaActual}) -> Fondo anterior noche`);
        }
    }
    
    // Guardar los cambios
    localStorage.setItem(`fondoVendedor_${vendedorIndex}_dia`, JSON.stringify(vendedor.fondosPorHorario.dia));
    localStorage.setItem(`fondoVendedor_${vendedorIndex}_noche`, JSON.stringify(vendedor.fondosPorHorario.noche));
    guardarVendedores(vendedores);
    
    return vendedor.fondosPorHorario;
}

// Función para registrar actualizaciones de fondo
function registrarActualizacionFondo(vendedorIndex, fondoAnterior, fondoNuevo, diferencia, fecha, horario, automatico = false) {
    // Crear un nuevo registro
    const registro = {
        fecha: fecha,
        hora: new Date().toLocaleTimeString(),
        horario: horario,
        fondoAnterior: fondoAnterior,
        fondoNuevo: fondoNuevo,
        diferencia: diferencia,
        automatico: automatico
    };
   
    // Obtener registros existentes o crear array vacío
    let registrosActualizaciones = JSON.parse(localStorage.getItem('registrosActualizacionesFondo') || '[]');
   
    // Agregar nuevo registro
    registrosActualizaciones.push(registro);
   
    // Guardar en localStorage
    localStorage.setItem('registrosActualizacionesFondo', JSON.stringify(registrosActualizaciones));
   
    console.log('Registro de actualización guardado:', registro);
}

document.getElementById("borrarFondosBtn").addEventListener("click", limpiarFondos);

function limpiarFondos() {
    // Reemplaza con el número total de vendedores o usa un array con sus índices
    const vendedores = [0, 1, 2, 3, 4]; // Ajusta según la cantidad de vendedores

    vendedores.forEach(vendedorIndex => {
        localStorage.removeItem(`fondoVendedor_${vendedorIndex}_dia`);
        localStorage.removeItem(`fondoVendedor_${vendedorIndex}_noche`);
        localStorage.removeItem(`fondoVendedor_${vendedorIndex}`);
    });

    alert("Fondos de los vendedores borrados correctamente.");
}

function editarVendedor(index) {
    const vendedor = vendedores[index];
    
    // Añadir edición del nombre
    const nuevoNombre = prompt(`Nombre actual: ${vendedor.nombre}. Ingrese el nuevo nombre:`);
    
    const nuevoPrecioVenta = parseFloat(prompt(`Precio de Venta actual: ${vendedor.precioVenta}. Ingrese el nuevo Precio de Venta:`));
    const nuevoPorcentaje = parseFloat(prompt(`Porcentaje actual: ${vendedor.porcentaje}%. Ingrese el nuevo Porcentaje:`));
    
    // Actualizar el nombre si se ingresó uno nuevo
    if (nuevoNombre !== null && nuevoNombre.trim() !== '') {
        vendedor.nombre = nuevoNombre;
    }
    
    if (!isNaN(nuevoPrecioVenta)) {
        vendedor.precioVenta = nuevoPrecioVenta;
    }
    
    if (!isNaN(nuevoPorcentaje)) {
        vendedor.porcentaje = nuevoPorcentaje;
    }
    
    actualizarListaVendedores();
    mostrarMensaje('Vendedor actualizado exitosamente', 'success');
}

function modificarSaldo(index) {
    const vendedor = vendedores[index];
    
    // Crear modal para agregar/quitar fondo
    const movimientoModal = document.createElement('div');
    movimientoModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1001;
    `;

    const movimientoContent = document.createElement('div');
    movimientoContent.style.cssText = `
        background-color: #a9a9a9;
        color: black;
        padding: 20px;
        border-radius: 8px;
        width: 300px;
        position: relative;
    `;

    // Título
    const title = document.createElement('h3');
    title.textContent = 'Movimiento de Fondo';
    title.style.cssText = `
        margin-top: 0;
        text-align: center;
    `;
    movimientoContent.appendChild(title);

    // Formulario
    const form = document.createElement('form');
    form.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 10px;
    `;

    // Campo de tipo (agregar/quitar)
    const tipoContainer = document.createElement('div');
    tipoContainer.style.cssText = `
        display: flex;
        justify-content: space-between;
    `;

    const tipoLabel = document.createElement('label');
    tipoLabel.textContent = 'Tipo:';
    tipoContainer.appendChild(tipoLabel);

    const tipoSelect = document.createElement('select');
    tipoSelect.style.cssText = `
        width: 70%;
        padding: 5px;
    `;

    const optionAgregar = document.createElement('option');
    optionAgregar.value = 'agregar';
    optionAgregar.textContent = 'Agregar Fondo';
    tipoSelect.appendChild(optionAgregar);

    const optionQuitar = document.createElement('option');
    optionQuitar.value = 'quitar';
    optionQuitar.textContent = 'Quitar Fondo';
    tipoSelect.appendChild(optionQuitar);

    tipoContainer.appendChild(tipoSelect);
    form.appendChild(tipoContainer);

    // Campo de cantidad
    const cantidadContainer = document.createElement('div');
    cantidadContainer.style.cssText = `
        display: flex;
        justify-content: space-between;
    `;

    const cantidadLabel = document.createElement('label');
    cantidadLabel.textContent = 'Cantidad:';
    cantidadContainer.appendChild(cantidadLabel);

    const cantidadInput = document.createElement('input');
    cantidadInput.type = 'number';
    cantidadInput.min = '1';
    cantidadInput.value = '0';
    cantidadInput.style.cssText = `
        width: 70%;
        padding: 5px;
    `;
    cantidadContainer.appendChild(cantidadInput);
    form.appendChild(cantidadContainer);

    // Campo de fecha
    const fechaContainer = document.createElement('div');
    fechaContainer.style.cssText = `
        display: flex;
        justify-content: space-between;
    `;

    const fechaLabel = document.createElement('label');
    fechaLabel.textContent = 'Fecha:';
    fechaContainer.appendChild(fechaLabel);

    const fechaInput = document.createElement('input');
    fechaInput.type = 'date';
    
    // Establecer la fecha actual como valor predeterminado
    const hoy = new Date();
    const año = hoy.getFullYear();
    let mes = hoy.getMonth() + 1;
    let dia = hoy.getDate();
    
    // Asegurar formato de dos dígitos
    mes = mes < 10 ? '0' + mes : mes;
    dia = dia < 10 ? '0' + dia : dia;
    
    fechaInput.value = `${año}-${mes}-${dia}`;
    fechaInput.style.cssText = `
        width: 70%;
        padding: 5px;
    `;
    fechaContainer.appendChild(fechaInput);
    form.appendChild(fechaContainer);

    // Campo de horario
    const horarioContainer = document.createElement('div');
    horarioContainer.style.cssText = `
        display: flex;
        justify-content: space-between;
    `;

    const horarioLabel = document.createElement('label');
    horarioLabel.textContent = 'Horario:';
    horarioContainer.appendChild(horarioLabel);

    const horarioSelect = document.createElement('select');
    horarioSelect.style.cssText = `
        width: 70%;
        padding: 5px;
    `;

    const optionDia = document.createElement('option');
    optionDia.value = 'dia';
    optionDia.textContent = 'Día';
    horarioSelect.appendChild(optionDia);

    const optionNoche = document.createElement('option');
    optionNoche.value = 'noche';
    optionNoche.textContent = 'Noche';
    horarioSelect.appendChild(optionNoche);

    horarioContainer.appendChild(horarioSelect);
    form.appendChild(horarioContainer);

    // Botones
    const formButtons = document.createElement('div');
    formButtons.style.cssText = `
        display: flex;
        justify-content: space-between;
        margin-top: 15px;
    `;

    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.textContent = 'Cancelar';
    cancelButton.style.cssText = `
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        background-color: #F44336;
        color: white;
        cursor: pointer;
    `;
    cancelButton.onclick = () => {
        document.body.removeChild(movimientoModal);
    };
    formButtons.appendChild(cancelButton);

    const saveButton = document.createElement('button');
    saveButton.type = 'button';
    saveButton.textContent = 'Guardar';
    saveButton.style.cssText = `
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        background-color: #4CAF50;
        color: white;
        cursor: pointer;
    `;
    
    saveButton.onclick = () => {
        // Validar cantidad
        const cantidad = parseFloat(cantidadInput.value);
        if (isNaN(cantidad) || cantidad <= 0) {
            alert('Por favor, ingresa una cantidad válida.');
            return;
        }
    
        // CAMBIO IMPORTANTE: Usar obtenerFechaFormateada() en lugar de formatear manualmente
        // Obtener la fecha formateada usando tu función existente
        const fechaInputValue = fechaInput.value;
        
        // Convertir la fecha del formato YYYY-MM-DD al formato DD/MM/YYYY
        const partesFecha = fechaInputValue.split('-');
        const fechaSeleccionada = `${partesFecha[2]}/${partesFecha[1]}/${partesFecha[0]}`;
        console.log("Fecha seleccionada por el usuario:", fechaSeleccionada);

        const tipo = tipoSelect.value;
        const horarioSel = horarioSelect.value;
        
        // Crear el movimiento
        const nuevoMovimiento = {
            tipo: tipo,
            cantidad: cantidad,
            fecha: fechaSeleccionada, // Usar la fecha formateada de tu función
            horario: horarioSel
        };
        
        // Inicializar el array de movimientos si no existe
        if (!vendedor.movimientos) {
            vendedor.movimientos = [];
        }
        
        // Añadir el movimiento
        vendedor.movimientos.push(nuevoMovimiento);
        
        // Obtener el fondo actual del horario seleccionado
        const fondoHorarioSel = obtenerFondoActual(vendedor, horarioSel);
        
        // Guardar el fondo anterior original antes de cualquier cambio
        const fondoAnteriorOriginal = obtenerFondoAnterior(vendedor, horarioSel);
        
        console.log("Fondo actual obtenido correctamente:", fondoHorarioSel);
        console.log("Fondo anterior original:", fondoAnteriorOriginal);
        
        // Verificar si la cantidad es válida
        if (cantidad <= 0) {
            alert("Por favor, ingresa una cantidad válida mayor que cero.");
            return; // Detener la ejecución si la cantidad no es válida
        }
    
        // Calcular el nuevo fondo
        let nuevoFondo;
        if (tipo === 'agregar') {
            nuevoFondo = fondoHorarioSel + cantidad;
            console.log(`Agregando ${cantidad} al fondo actual ${fondoHorarioSel}. Nuevo fondo: ${nuevoFondo}`);
        } else if (tipo === 'quitar') {
            nuevoFondo = fondoHorarioSel - cantidad;
            console.log(`Quitando ${cantidad} del fondo actual ${fondoHorarioSel}. Nuevo fondo: ${nuevoFondo}`);
            
            // Permite fondos negativos pero muestra una advertencia
            if (nuevoFondo < 0 && !confirm(`Esta operación dejará el fondo en ${nuevoFondo}. ¿Estás seguro de continuar?`)) {
                return; // Cancelar si el usuario no confirma
            }
        }
    
        // Verificar que el resultado sea un número válido
        if (isNaN(nuevoFondo)) {
            console.error("Error al calcular el nuevo fondo");
            alert("Ha ocurrido un error al calcular el nuevo fondo. Por favor, intenta nuevamente.");
            return;
        }
    
        console.log("Operación de fondo:", {
            tipo,
            fondoHorarioSel,
            cantidad,
            nuevoFondo,
            fondoAnteriorOriginal
        });
        
        // Registrar el cambio
        registrarActualizacionFondo(
            index,
            fondoHorarioSel,
            nuevoFondo,
            tipo === 'agregar' ? cantidad : -cantidad,
            fechaSeleccionada, // Usar la fecha formateada de tu función
            horarioSel
        );
        
        // Inicializar la estructura de fondos por horario si no existe
        if (!vendedor.fondosPorHorario) {
            vendedor.fondosPorHorario = {};
        }
        
        // Asegurarse de que ambos horarios estén inicializados
        if (!vendedor.fondosPorHorario.dia) {
            vendedor.fondosPorHorario.dia = {
                actual: vendedor.fondo || 0,
                anterior: vendedor.fondo || 0
            };
        }
        
        if (!vendedor.fondosPorHorario.noche) {
            vendedor.fondosPorHorario.noche = {
                actual: vendedor.fondo || 0,
                anterior: vendedor.fondo || 0
            };
        }
        
        // CASO ESPECIAL: Si el fondo anterior es 0 (vendedor nuevo) o no hay ventas,
        // actualizar también el fondo anterior al mismo valor que el actual
        const esVendedorNuevo = fondoAnteriorOriginal === 0;
        const tieneVentas = vendedor.ventas && vendedor.ventas.filter(v => v.horario === horarioSel).length > 0;
        
        if (esVendedorNuevo && !tieneVentas) {
            console.log("Vendedor nuevo detectado: actualizando tanto el fondo actual como el anterior");
            
            // Actualizar tanto el fondo actual como el anterior para ambos horarios
            vendedor.fondosPorHorario[horarioSel].actual = nuevoFondo;
            vendedor.fondosPorHorario[horarioSel].anterior = nuevoFondo;
            
            const otroHorario = horarioSel === 'dia' ? 'noche' : 'dia';
            vendedor.fondosPorHorario[otroHorario].actual = nuevoFondo;
            vendedor.fondosPorHorario[otroHorario].anterior = nuevoFondo;
        } else {
            // Comportamiento normal: Actualizar SOLO el fondo actual, manteniendo el anterior intacto
            vendedor.fondosPorHorario[horarioSel].actual = nuevoFondo;
            
            // Actualizar también el fondo actual del otro horario para mantener sincronía
            const otroHorario = horarioSel === 'dia' ? 'noche' : 'dia';
            vendedor.fondosPorHorario[otroHorario].actual = nuevoFondo;
        }
        
        // Guardar en localStorage
        localStorage.setItem(`fondoVendedor_${index}_dia`, JSON.stringify(vendedor.fondosPorHorario.dia));
        localStorage.setItem(`fondoVendedor_${index}_noche`, JSON.stringify(vendedor.fondosPorHorario.noche));
        
        // Guardar los cambios
        guardarVendedores(vendedores);
        
        console.log("Fondos actualizados:", {
            dia: vendedor.fondosPorHorario.dia,
            noche: vendedor.fondosPorHorario.noche
        });
        
        alert('Movimiento registrado correctamente');
        document.body.removeChild(movimientoModal);
        
        // Actualizar la interfaz - reemplazar por una llamada a tu función existente
        verVentasVendedorPorHorario(index, horarioSel);
    };
    formButtons.appendChild(saveButton);

    form.appendChild(formButtons);
    movimientoContent.appendChild(form);
    movimientoModal.appendChild(movimientoContent);
    document.body.appendChild(movimientoModal);
}

// Función para validar el formato de fecha ingresado
function validarFormatoFecha(fecha) {
    // Verificar si la fecha tiene el formato DD/MM/YYYY
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!regex.test(fecha)) {
        return false;
    }
    
    // Verificar si la fecha es válida
    const partes = fecha.split('/');
    const dia = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10);
    const año = parseInt(partes[2], 10);
    
    // Crear un objeto Date y verificar que sea válido
    const fechaObj = new Date(año, mes - 1, dia);
    
    return (
        fechaObj.getFullYear() === año &&
        fechaObj.getMonth() === mes - 1 &&
        fechaObj.getDate() === dia
    );
}

function agregarFondo(index, horario, fechaSeleccionada) {
    // Obtenemos el fondo actual desde localStorage si existe
    let fondoActual = 0;
    const storedFondo = localStorage.getItem(`fondoVendedor_${index}`);
    if (storedFondo !== null) {
        fondoActual = parseFloat(storedFondo);
    } else {
        fondoActual = vendedores[index].fondo;
    }
    
    const vendedor = vendedores[index];
    
    // Mostramos el fondo actual obtenido del localStorage
    const fondoAgregar = parseFloat(prompt(`Fondo actual: ${fondoActual.toLocaleString()}.\nIngrese la cantidad a agregar:`));
    
    if (isNaN(fondoAgregar) || fondoAgregar <= 0) {
        alert("Por favor, ingrese una cantidad válida mayor que cero.");
        return;
    }
    
    // Actualizar el fondo en localStorage y en el objeto vendedor
    const nuevoFondo = fondoActual + fondoAgregar;
    localStorage.setItem(`fondoVendedor_${index}`, nuevoFondo.toString());
    
    // Actualizar el objeto vendedor en memoria
    vendedor.fondo = nuevoFondo;
    vendedor.bancoEntrego = (vendedor.bancoEntrego || 0) + fondoAgregar;
    
    // Registrar el movimiento
    if (!vendedor.movimientos) vendedor.movimientos = [];
    vendedor.movimientos.push({
        tipo: 'agregar',
        cantidad: fondoAgregar,
        fecha: fechaSeleccionada,
        horario: horario,
        saldoResultante: nuevoFondo,
        timestamp: new Date().toISOString()
    });
    
    // Guardar el vendedor actualizado
    guardarVendedores(vendedores);
    
    alert(`Se agregó ${fondoAgregar.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} al fondo (${horario === 'dia' ? 'Día' : 'Noche'}) en la fecha ${fechaSeleccionada}.\nNuevo saldo: ${nuevoFondo.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`);
    
    actualizarListaVendedores();
}

function quitarFondo(index, horario, fechaSeleccionada) {
    // Obtenemos el fondo actual desde localStorage si existe
    let fondoActual = 0;
    const storedFondo = localStorage.getItem(`fondoVendedor_${index}`);
    if (storedFondo !== null) {
        fondoActual = parseFloat(storedFondo);
    } else {
        fondoActual = vendedores[index].fondo;
    }
    
    const vendedor = vendedores[index];
    
    // Mostramos el fondo actual obtenido del localStorage
    const fondoQuitar = parseFloat(prompt(`Fondo actual: ${fondoActual.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.\nIngrese la cantidad a quitar:`));
    
    if (isNaN(fondoQuitar) || fondoQuitar <= 0) {
        alert("Por favor, ingrese una cantidad válida mayor que cero.");
        return;
    }
    
    if (fondoQuitar > fondoActual) {
        alert(`No puede quitar más del fondo disponible (${fondoActual.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}).`);
        return;
    }
    
    // Actualizar el fondo en localStorage y en el objeto vendedor
    const nuevoFondo = fondoActual - fondoQuitar;
    localStorage.setItem(`fondoVendedor_${index}`, nuevoFondo.toString());
    
    // Actualizar el objeto vendedor en memoria
    vendedor.fondo = nuevoFondo;
    vendedor.bancoRecogio = (vendedor.bancoRecogio || 0) + fondoQuitar;
    
    // Registrar el movimiento
    if (!vendedor.movimientos) vendedor.movimientos = [];
    vendedor.movimientos.push({
        tipo: 'quitar',
        cantidad: fondoQuitar,
        fecha: fechaSeleccionada,
        horario: horario,
        saldoResultante: nuevoFondo,
        timestamp: new Date().toISOString()
    });
    
    // Guardar el vendedor actualizado
    guardarVendedores(vendedores);
    
    alert(`Se quitó ${fondoQuitar.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} del fondo (${horario === 'dia' ? 'Día' : 'Noche'}) en la fecha ${fechaSeleccionada}.\nNuevo saldo: ${nuevoFondo.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`);
    
    actualizarListaVendedores();
}

// Función para guardar los vendedores en localStorage
function guardarVendedores(vendedores) {
    localStorage.setItem('vendedores', JSON.stringify(vendedores));
}

// Función para cargar los vendedores desde localStorage
function cargarVendedores() {
    const vendedoresJSON = localStorage.getItem('vendedores');
    if (vendedoresJSON) {
        return JSON.parse(vendedoresJSON);
    }
    return vendedores || []; // Devolver array existente o vacío si no hay datos guardados
}

// Función registrarVenta mejorada
function registrarVenta(index) {
    const vendedor = vendedores[index];
    // Pedir fecha
    // Adaptación: Usar obtenerFechaFormateada() para la fecha por defecto
    const fechaDefault = obtenerFechaFormateada(); // Cambio aquí
    const fechaSeleccionada = prompt("Ingrese la fecha de la venta (DD/MM/YYYY):", fechaDefault);
    if (!fechaSeleccionada) return;
    
    // Pedir horario
    const horarioOpciones = prompt("Seleccione horario:\n1. Día\n2. Noche");
    if (!horarioOpciones || (horarioOpciones !== "1" && horarioOpciones !== "2")) {
        alert("Horario inválido");
        return;
    }
    const horario = horarioOpciones === "1" ? "dia" : "noche";
    
    // Preguntar si es un ajuste de venta existente o un registro de venta de premio
    const tipoOperacion = prompt("Seleccione operación:\n1. Ajustar venta existente\n2. Registrar venta de premio");
    
    // Inicializar el array de ventas si no existe
    if (!vendedor.ventas) {
        vendedor.ventas = [];
    }
    
    if (tipoOperacion === "1") {
        // CÓDIGO PARA AJUSTAR VENTA EXISTENTE
        // Modificado para normalizar las fechas al comparar
        const ventasFiltradas = vendedor.ventas.filter(v => 
            obtenerFechaFormateada(v.fecha) === obtenerFechaFormateada(fechaSeleccionada) && 
            v.horario === horario
        );
        
        if (ventasFiltradas.length === 0) {
            alert("No hay ventas registradas en este período.");
            return;
        }
        
        let mensajeVentas = "Seleccione la venta a modificar:\n";
        ventasFiltradas.forEach((venta, i) => {
            mensajeVentas += `${i + 1}. Venta Total: ${venta.totalVenta.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}, Premio: ${venta.premio.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}\n`;
        });
        const seleccionVenta = parseInt(prompt(mensajeVentas), 10);
        if (isNaN(seleccionVenta) || seleccionVenta < 1 || seleccionVenta > ventasFiltradas.length) {
            alert("Selección inválida.");
            return;
        }
        
        const venta = ventasFiltradas[seleccionVenta - 1];
        
        const ajusteVenta = parseFloat(prompt(`Ingrese el ajuste al total de la venta (puede ser positivo o negativo):`, "0"));
        if (isNaN(ajusteVenta)) {
            alert("Monto inválido.");
            return;
        }
        
        const ajustePremio = parseFloat(prompt(`Ingrese el ajuste al premio (puede ser positivo o negativo, o 0 si no cambia):`, "0"));
        if (isNaN(ajustePremio)) {
            alert("Monto inválido.");
            return;
        }
        
        // Aplicar ajustes
        venta.totalVenta += ajusteVenta;
        venta.premio += ajustePremio;
        
        // Actualizar totales del vendedor
        if (horario === "dia") {
            vendedor.ventasDia += ajusteVenta;
        } else {
            vendedor.ventasNoche += ajusteVenta;
        }
        
        // Actualizar fondo del vendedor
        const ingreso = ajusteVenta * (vendedor.porcentaje / 100);
        const gasto = ajustePremio * vendedor.precioVenta;
        vendedor.fondo += (ingreso - gasto);
        
        alert(`Venta ajustada correctamente.\nNuevo Total Venta: ${venta.totalVenta.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}\nNuevo Premio: ${venta.premio.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}\nNuevo Fondo: ${vendedor.fondo.toLocaleString()}`);
        
        guardarDatos();

        // Refrescar el modal con la nueva información
        verVentasVendedorPorHorario(index, horario);

    } 
    else if (tipoOperacion === "2") {
        // CÓDIGO PARA REGISTRAR VENTA DE PREMIO
        // Modificado para normalizar las fechas al comparar
        let ventaExistente = vendedor.ventas.find(v => 
            obtenerFechaFormateada(v.fecha) === obtenerFechaFormateada(fechaSeleccionada) && 
            v.horario === horario
        );
        
        if (!ventaExistente) {
            ventaExistente = {
                fecha: fechaSeleccionada,
                horario: horario,
                totalVenta: 0,
                premio: 0
            };
            vendedor.ventas.push(ventaExistente);
        }
        
        const cantidadPremios = parseInt(prompt("Ingrese la cantidad de premios vendidos:", "1"), 10);
        if (isNaN(cantidadPremios) || cantidadPremios <= 0) {
            alert("Cantidad inválida.");
            return;
        }
        
        ventaExistente.premio += cantidadPremios;
        
        const gasto = cantidadPremios * vendedor.precioVenta;
        vendedor.fondo -= gasto;
        
        if (horario === "dia") {
            if (!vendedor.premiosVendidosDia) vendedor.premiosVendidosDia = 0;
            vendedor.premiosVendidosDia += cantidadPremios;
        } else {
            if (!vendedor.premiosVendidosNoche) vendedor.premiosVendidosNoche = 0;
            vendedor.premiosVendidosNoche += cantidadPremios;
        }
        
        alert(`Venta de premios registrada correctamente.\nPremios vendidos: ${cantidadPremios}\nTotal Premios: ${ventaExistente.premio}\nNuevo Fondo: ${vendedor.fondo.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`);
        
        guardarDatos();

        // Refrescar el modal con la nueva información
        verVentasVendedorPorHorario(index, horario);

    } 
    else {
        alert("Operación cancelada o inválida.");
        return;
    }
    
    actualizarListaVendedores();
}

// 1. Función actualizarListaVendedores modificada para incluir configurarDragAndDrop
function actualizarListaVendedores() {
    const listaVendedores = document.getElementById('listaVendedores');
    listaVendedores.innerHTML = '';

    // Primero, identificar vendedores con múltiples jefes
    const vendedoresMultijefe = {};
    const vendedoresProcesados = new Set();

    // Identificar vendedores con múltiples jefes y agruparlos
    vendedores.forEach((vendedor, index) => {
        if (vendedor.jefes.length > 1) {
            const jefesClave = vendedor.jefes.sort().join('|');
            if (!vendedoresMultijefe[jefesClave]) {
                vendedoresMultijefe[jefesClave] = {
                    jefesNombres: vendedor.jefes,
                    vendedores: []
                };
            }
            vendedoresMultijefe[jefesClave].vendedores.push({...vendedor, index});
            vendedoresProcesados.add(index);
        }
    });

    // Organizar vendedores con un solo jefe
    const vendedoresPorJefe = {};

    // Inicializar las listas para cada jefe
    jefes.forEach(jefe => {
        vendedoresPorJefe[jefe.nombre] = [];
    });

    // Agregar vendedores de un solo jefe a sus respectivos jefes
    vendedores.forEach((vendedor, index) => {
        if (!vendedoresProcesados.has(index)) {
            const jefeNombre = vendedor.jefes[0]; // Tomamos el primer y único jefe
            if (vendedoresPorJefe[jefeNombre]) {
                vendedoresPorJefe[jefeNombre].push({...vendedor, index});
            }
        }
    });

    // Crear secciones para jefes individuales
    jefes.forEach(jefe => {
        const vendedoresDelJefe = vendedoresPorJefe[jefe.nombre];

        // Solo crear la sección si tiene vendedores
        if (vendedoresDelJefe.length > 0) {
            crearSeccionJefe(jefe.nombre, vendedoresDelJefe, listaVendedores);
        }
    });

    // Crear secciones para grupos de jefes (vendedores multi-jefe)
    Object.values(vendedoresMultijefe).forEach(grupo => {
        const nombreJefesAgrupados = grupo.jefesNombres.join(' / ');
        crearSeccionJefe(nombreJefesAgrupados, grupo.vendedores, listaVendedores, true);
    });

    // Añadir la funcionalidad de arrastrar y soltar a todos los vendedores
    configurarDragAndDrop();

    // Agregar estilos necesarios si no existen
    if (!document.getElementById('vendedores-por-jefe-styles')) {
        const style = document.createElement('style');
        style.id = 'vendedores-por-jefe-styles';
        style.textContent = `
            .jefe-section {
                margin-bottom: 20px;
                border: 1px solid #ddd;
                border-radius: 8px;
                overflow: hidden;
            }
            
            .dark-mode .jefe-section {
                border-color: #444;
            }
            
            .jefe-header {
                background-color: #f5f5f5;
                padding: 10px 15px;
                cursor: pointer;
            }
            
            .dark-mode .jefe-header {
                background-color: #333;
            }
            
            .jefe-title {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .btn-toggle-jefe {
                background: none;
                border: none;
                cursor: pointer;
                font-size: 16px;
                padding: 0 5px;
            }
            
            .vendedores-count {
                color: #666;
                font-size: 0.9em;
            }
            
            .dark-mode .vendedores-count {
                color: #999;
            }
            
            .vendedores-list {
                padding: 10px;
            }
            
            .vendedor-item {
                margin: 5px 0;
                padding: 10px;
                background-color: #fff;
                border-radius: 4px;
                border: 1px solid #eee;
            }
            
            .dark-mode .vendedor-item {
                background-color: #222;
                border-color: #444;
            }
            
            .vendedor-item.dragging {
                opacity: 0.5;
                border: 2px dashed #007bff;
            }
            
            .drag-handle {
                cursor: grab;
                margin-right: 10px;
                user-select: none;
            }
            
            .multi-jefe {
                background-color: #f0f7ff;
            }
            
            .dark-mode .multi-jefe {
                background-color: #1a2733;
            }
            
            .order-controls {
                display: flex;
                gap: 5px;
                margin-left: auto;
            }
            
            .btn-order {
                background: none;
                border: none;
                cursor: pointer;
                font-size: 14px;
                color: #007bff;
                padding: 2px 5px;
            }
            
            .btn-order:hover {
                background-color: #f0f0f0;
                border-radius: 3px;
            }
            
            .dark-mode .btn-order:hover {
                background-color: #444;
            }
            
            .vendedor-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            
            .vendedor-nombre-container {
                display: flex;
                align-items: center;
            }
        `;
        document.head.appendChild(style);
    }

    actualizarSelectVendedores();
}

// 2. Modificación de la función crearSeccionJefe para mantener tus botones pero añadir ordenamiento
function crearSeccionJefe(nombreJefe, vendedoresLista, contenedor, esMultiJefe = false) {
    // Crear sección del jefe
    const jefeSection = document.createElement('div');
    jefeSection.className = 'jefe-section';
    jefeSection.dataset.jefe = nombreJefe;
    
    if (esMultiJefe) {
        jefeSection.classList.add('multi-jefe');
    }
    
    // Encabezado del jefe con botón para expandir/colapsar
    const jefeHeader = document.createElement('div');
    jefeHeader.className = 'jefe-header';
    
    // Título del jefe con botones de ordenamiento
    const headerContent = document.createElement('div');
    headerContent.className = 'jefe-title';
    
    const expandButton = document.createElement('button');
    expandButton.className = 'btn-toggle-jefe';
    expandButton.textContent = '▲';
    
    const jefeNombre = document.createElement('strong');
    jefeNombre.textContent = nombreJefe;
    
    const vendedoresCount = document.createElement('span');
    vendedoresCount.className = 'vendedores-count';
    vendedoresCount.textContent = `(${vendedoresLista.length} ${vendedoresLista.length === 1 ? 'vendedor' : 'vendedores'})`;
    
    headerContent.appendChild(expandButton);
    headerContent.appendChild(jefeNombre);
    headerContent.appendChild(vendedoresCount);
    
    // Añadir controles de ordenamiento
    const orderControls = document.createElement('div');
    orderControls.className = 'order-controls';
    
    const btnOrderAlpha = document.createElement('button');
    btnOrderAlpha.className = 'btn-order';
    btnOrderAlpha.textContent = 'A-Z';
    btnOrderAlpha.title = 'Ordenar alfabéticamente';
    btnOrderAlpha.onclick = function(e) {
        e.stopPropagation(); // Evitar que active el toggle de la sección
        ordenarVendedoresEnSeccion(nombreJefe, 'nombre');
    };
    
    const btnOrderRev = document.createElement('button');
    btnOrderRev.className = 'btn-order';
    btnOrderRev.textContent = '↑↓';
    btnOrderRev.title = 'Invertir orden';
    btnOrderRev.onclick = function(e) {
        e.stopPropagation(); // Evitar que active el toggle de la sección
        invertirOrdenEnSeccion(nombreJefe);
    };
    
    orderControls.appendChild(btnOrderAlpha);
    orderControls.appendChild(btnOrderRev);
    
    const headerContainer = document.createElement('div');
    headerContainer.style.display = 'flex';
    headerContainer.style.justifyContent = 'space-between';
    headerContainer.style.alignItems = 'center';
    headerContainer.style.width = '100%';
    
    headerContainer.appendChild(headerContent);
    headerContainer.appendChild(orderControls);
    
    jefeHeader.appendChild(headerContainer);
    
    // Lista de vendedores oculta por defecto
    const vendedoresList = document.createElement('div');
    vendedoresList.className = 'vendedores-list';
    vendedoresList.dataset.jefe = nombreJefe;
    vendedoresList.style.display = 'none';  // Asegurar que esté oculta al inicio
    
    vendedoresLista.forEach(vendedor => {
        const vendedorItem = document.createElement('div');
        vendedorItem.className = 'vendedor-item';
        vendedorItem.dataset.index = vendedor.index;
        vendedorItem.dataset.jefe = nombreJefe;
        vendedorItem.draggable = true; // Hacer el elemento arrastrable
        
        const headerDiv = document.createElement('div');
        headerDiv.className = 'vendedor-header';
        
        const nombreContainer = document.createElement('div');
        nombreContainer.className = 'vendedor-nombre-container';
        
        const dragHandle = document.createElement('span');
        dragHandle.className = 'drag-handle';
        dragHandle.innerHTML = '☰';
        dragHandle.title = 'Arrastrar para reordenar';
        
        const nombreSpan = document.createElement('span');
        nombreSpan.className = 'vendedor-nombre';
        nombreSpan.textContent = vendedor.nombre;
        
        nombreContainer.appendChild(dragHandle);
        nombreContainer.appendChild(nombreSpan);
        
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'btn-toggle';
        toggleBtn.textContent = 'Mostrar/Ocultar';
        toggleBtn.onclick = function() {
            toggleBotones(vendedor.index);
        };
        
        headerDiv.appendChild(nombreContainer);
        headerDiv.appendChild(toggleBtn);
        
        const botonesDiv = document.createElement('div');
        botonesDiv.id = `botones-vendedor-${vendedor.index}`;
        botonesDiv.className = 'vendedor-buttons';
        botonesDiv.style.display = 'none';
        
        botonesDiv.innerHTML = `
            <button onclick="verVentasVendedorPorHorario(${vendedor.index}, 'dia')" class="btn-primary">Ver Ventas Día</button>
            <button onclick="verVentasVendedorPorHorario(${vendedor.index}, 'noche')" class="btn-primary">Ver Ventas Noche</button>
            <button onclick="editarVendedor(${vendedor.index})" class="btn-secondary">Editar</button>
            <button onclick="modificarSaldo(${vendedor.index})" class="btn btn-warning btn-sm">Modificar Saldo</button>
            <button onclick="registrarVenta(${vendedor.index})" class="btn btn-success btn-sm">Registrar Venta</button>
            <button onclick="editarJefesVendedor(${vendedor.index})" class="btn-secondary">Editar Jefes</button>
            <button onclick="verVentasVendedorPorFecha(${vendedor.index})" class="btn-primary">Ver Ventas por Fecha</button>
            <button onclick="eliminarVendedor(${vendedor.index})" class="btn-danger">Eliminar</button>
            <button onclick="abrirModalEliminarVenta(${vendedor.index})" class="btn-danger">Eliminar Venta</button>
        `;
        
        vendedorItem.appendChild(headerDiv);
        vendedorItem.appendChild(botonesDiv);
        vendedoresList.appendChild(vendedorItem);
    });
    
    jefeSection.appendChild(jefeHeader);
    jefeSection.appendChild(vendedoresList);
    contenedor.appendChild(jefeSection);
    
    // Agregar funcionalidad de expandir/colapsar
    jefeHeader.addEventListener('click', () => {
        const isCollapsed = vendedoresList.style.display === 'none';
        vendedoresList.style.display = isCollapsed ? 'block' : 'none';
        expandButton.textContent = isCollapsed ? '▼' : '▲';
    });
}

// === NUEVAS FUNCIONES PARA ORDENAMIENTO ===

// Variables para el arrastrar y soltar
let draggedItem = null;
let draggedJefe = null;
let originalIndex = null;

// Configurar eventos de arrastrar y soltar
function configurarDragAndDrop() {
    const vendedorItems = document.querySelectorAll('.vendedor-item');
    
    vendedorItems.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
    });
    
    const vendedoresLists = document.querySelectorAll('.vendedores-list');
    
    vendedoresLists.forEach(list => {
        list.addEventListener('dragover', handleDragOver);
        list.addEventListener('dragenter', handleDragEnter);
        list.addEventListener('dragleave', handleDragLeave);
        list.addEventListener('drop', handleDrop);
    });
}

function handleDragStart(e) {
    // Prevenir arrastre si se hizo clic en un botón
    if (e.target.tagName === 'BUTTON') {
        e.preventDefault();
        return false;
    }
    
    draggedItem = this;
    originalIndex = parseInt(this.dataset.index);
    draggedJefe = this.dataset.jefe;
    
    // Añadir clase para estilo durante el arrastre
    setTimeout(() => {
        this.classList.add('dragging');
    }, 0);
    
    e.dataTransfer.effectAllowed = 'move';
    return true;
}

function handleDragEnd() {
    this.classList.remove('dragging');
    draggedItem = null;
    draggedJefe = null;
    originalIndex = null;
    
    // Eliminar estilos temporales de todos los contenedores
    document.querySelectorAll('.vendedores-list').forEach(list => {
        list.classList.remove('drag-over');
    });
}

function handleDragOver(e) {
    e.preventDefault();
    return false;
}

function handleDragEnter(e) {
    e.preventDefault();
    // Solo resaltar si pertenece al mismo jefe
    if (this.dataset.jefe === draggedJefe) {
        this.classList.add('drag-over');
    }
}

function handleDragLeave() {
    this.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    
    this.classList.remove('drag-over');
    
    // Verificar que estamos en la misma sección de jefe
    if (this.dataset.jefe !== draggedJefe) {
        return false;
    }
    
    // Obtener todos los vendedores de este jefe
    const vendedoresItems = Array.from(this.querySelectorAll('.vendedor-item'));
    
    // Encuentra el elemento objetivo sobre el que estamos soltando
    const y = e.clientY;
    const dropTarget = vendedoresItems.find(item => {
        if (item === draggedItem) return false;
        const box = item.getBoundingClientRect();
        return y > box.top && y < box.bottom;
    });
    
    if (dropTarget && dropTarget !== draggedItem) {
        // Encontrar los índices originales en el array de vendedores
        const draggedItemIndex = originalIndex;
        const dropTargetIndex = parseInt(dropTarget.dataset.index);
        
        // Reordenar el array de vendedores
        const draggedVendedor = {...vendedores[draggedItemIndex]};
        
        // Encontrar todos los vendedores con el mismo jefe para mantener su orden
        let vendedoresDelMismoJefe = vendedores.filter(v => {
            const jefeKey = v.jefes.length > 1 ? v.jefes.sort().join(' / ') : v.jefes[0];
            return jefeKey === draggedJefe;
        });
        
        // Actualizar el orden en la sección vendedoresDelMismoJefe
        const draggedVendedorPos = vendedoresDelMismoJefe.findIndex(v => 
            v.nombre === draggedVendedor.nombre && 
            v.precioVenta === draggedVendedor.precioVenta
        );
        
        const dropVendedorPos = vendedoresDelMismoJefe.findIndex(v => 
            v.nombre === vendedores[dropTargetIndex].nombre && 
            v.precioVenta === vendedores[dropTargetIndex].precioVenta
        );
        
        // Reordenar localmente
        const movedItem = vendedoresDelMismoJefe.splice(draggedVendedorPos, 1)[0];
        vendedoresDelMismoJefe.splice(dropVendedorPos, 0, movedItem);
        
        // Reconstruir el array de vendedores con el nuevo orden
        const vendedoresReordenados = [];
        
        vendedores.forEach(v => {
            const jefeKey = v.jefes.length > 1 ? v.jefes.sort().join(' / ') : v.jefes[0];
            if (jefeKey !== draggedJefe) {
                vendedoresReordenados.push(v);
            }
        });
        
        // Añadir los vendedores reordenados
        vendedoresReordenados.push(...vendedoresDelMismoJefe);
        
        // Actualizar el array de vendedores original
        vendedores.length = 0;
        vendedores.push(...vendedoresReordenados);
        
        // Actualizar la UI
        actualizarListaVendedores();
        mostrarMensaje('Orden de vendedores actualizado', 'success');
    }
    
    return false;
}

// Funciones de ordenamiento automático
function ordenarVendedoresEnSeccion(nombreJefe, criterio) {
    // Obtener todos los vendedores de este jefe
    let vendedoresDelJefe = [];
    const otrosVendedores = [];
    
    vendedores.forEach(v => {
        const jefeKey = v.jefes.length > 1 ? v.jefes.sort().join(' / ') : v.jefes[0];
        if (jefeKey === nombreJefe) {
            vendedoresDelJefe.push(v);
        } else {
            otrosVendedores.push(v);
        }
    });
    
    // Ordenar por el criterio (por defecto, nombre)
    vendedoresDelJefe.sort((a, b) => {
        if (criterio === 'nombre') {
            return a.nombre.localeCompare(b.nombre);
        } else if (criterio === 'precioVenta') {
            return a.precioVenta - b.precioVenta;
        } else if (criterio === 'porcentaje') {
            return a.porcentaje - b.porcentaje;
        }
        return 0;
    });
    
    // Reconstruir el array completo manteniendo el orden de los otros vendedores
    vendedores.length = 0;
    vendedores.push(...otrosVendedores);
    vendedores.push(...vendedoresDelJefe);
    
    // Actualizar la UI
    actualizarListaVendedores();
    mostrarMensaje(`Vendedores ordenados por ${criterio}`, 'success');
}

function invertirOrdenEnSeccion(nombreJefe) {
    // Obtener todos los vendedores de este jefe
    let vendedoresDelJefe = [];
    const otrosVendedores = [];
    
    vendedores.forEach(v => {
        const jefeKey = v.jefes.length > 1 ? v.jefes.sort().join(' / ') : v.jefes[0];
        if (jefeKey === nombreJefe) {
            vendedoresDelJefe.push(v);
        } else {
            otrosVendedores.push(v);
        }
    });
    
    // Invertir el orden
    vendedoresDelJefe.reverse();
    
    // Actualizar el array de vendedores con el nuevo orden
    vendedores.length = 0;
    vendedores.push(...otrosVendedores);
    vendedores.push(...vendedoresDelJefe);
    
    // Actualizar la UI
    actualizarListaVendedores();
    mostrarMensaje('Orden invertido', 'success');
}

// Función para alternar la visibilidad de los botones del vendedor
function toggleBotones(index) {
    const botonesVendedor = document.getElementById(`botones-vendedor-${index}`);
    if (botonesVendedor) {
        botonesVendedor.style.display = botonesVendedor.style.display === 'none' ? 'block' : 'none';
    }
}

function editarJefesVendedor(index) {
    const vendedor = vendedores[index];

    // Crear el modal para editar jefes
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Editar Jefes para ${vendedor.nombre}</h3>
            <select multiple id="editJefesSelect" style="width: 100%; height: 200px;">
                ${jefes.map(jefe => `
                    <option value="${jefe.nombre}" ${vendedor.jefes.includes(jefe.nombre) ? 'selected' : ''}>
                        ${jefe.nombre}
                    </option>
                `).join('')}
            </select>
            <div class="modal-buttons">
                <button onclick="guardarJefesVendedor(${index})" class="btn-primary">Guardar</button>
                <button onclick="cerrarModal()" class="btn-secondary">Cancelar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function guardarJefesVendedor(index) {
    const vendedor = vendedores[index];
    const select = document.getElementById('editJefesSelect');
    const nuevosJefes = Array.from(select.selectedOptions).map(option => option.value);

    if (nuevosJefes.length === 0) {
        mostrarMensaje('Debe seleccionar al menos un jefe', 'error');
        return;
    }

    vendedor.jefes = nuevosJefes;
    actualizarListaVendedores();
    cerrarModal();
    mostrarMensaje('Jefes actualizados exitosamente', 'success');
}

function verVentasVendedorPorFecha(index) {
    // Crear el modal con un ID único
    const modalId = `modal-ventas-${Date.now()}`;
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = modalId;
   
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Ver Ventas por Fecha</h3>
            <div class="fecha-inputs">
                <div>
                    <label for="fecha-${modalId}">Fecha:</label>
                    <input type="date" id="fecha-${modalId}" required>
                </div>
                <div>
                    <label for="horarioSelect-${modalId}">Horario:</label>
                    <select id="horarioSelect-${modalId}">
                        <option value="">Todos</option>
                        <option value="dia">Día</option>
                        <option value="noche">Noche</option>
                    </select>
                </div>
            </div>
            <div class="modal-buttons">
                <button class="btn-primary btn-ver-ventas">Ver Ventas</button>
                <button onclick="cerrarModal()" class="btn-secondary">Cancelar</button>
            </div>
        </div>
    `;
   
    document.body.appendChild(modal);
   
    // Asignar el evento al botón dentro del modal
    const btnVerVentas = modal.querySelector('.btn-ver-ventas');
    btnVerVentas.addEventListener('click', function() {
        // Obtener los elementos dentro de este modal específico
        const fecha = document.getElementById(`fecha-${modalId}`).value;
        const horarioSelect = document.getElementById(`horarioSelect-${modalId}`);
        const horarioFiltro = horarioSelect.value;
       
        console.log(`Modal ${modalId} - Fecha: "${fecha}", Horario seleccionado: "${horarioFiltro}"`);
       
        if (!fecha) {
            alert("Por favor, selecciona una fecha.");
            return;
        }
       
        // Obtener el vendedor
        const vendedor = vendedores[index];
        if (!vendedor) {
            alert("Error: Vendedor no encontrado");
            return;
        }
       
        // Filtrar ventas - Usamos la misma fecha para inicio y fin para obtener un solo día
        const ventasFiltradas = filtrarVentasPorFecha(vendedor, fecha, fecha, horarioFiltro);
       
        // Mostrar el reporte
        mostrarReporteVentas(vendedor, ventasFiltradas, horarioFiltro, fecha, fecha);
        cerrarModal();
    });
}

function verVentasVendedor(index) {
    // Obtener las fechas seleccionadas
    const fechaInicio = document.getElementById('fechaInicio').value;
    const fechaFin = document.getElementById('fechaFin').value;
    const horarioSelect = document.getElementById('horarioSelect');
    
    // CORRECCIÓN: Obtener el valor directo del select
    const horarioFiltro = horarioSelect.value;
    
    if (!fechaInicio || !fechaFin) {
        alert("Por favor, selecciona ambas fechas.");
        return;
    }
    
    console.log(`Fechas seleccionadas: ${fechaInicio} al ${fechaFin}`);
    console.log(`Horario seleccionado para filtrado: "${horarioFiltro}"`);
    
    // Obtener el vendedor
    const vendedor = vendedores[index];
    if (!vendedor) {
        alert("Error: Vendedor no encontrado");
        return;
    }
    
    // Filtrar ventas por fecha y horario
    let ventasFiltradas = filtrarVentasPorFecha(vendedor, fechaInicio, fechaFin, horarioFiltro);
    
    // Mostrar el reporte con las ventas correctamente filtradas
    mostrarReporteVentas(vendedor, ventasFiltradas, horarioFiltro, fechaInicio, fechaFin);
    cerrarModal();
}

// 2. REEMPLAZAR ESTA FUNCIÓN COMPLETA
function mostrarReporteVentas(vendedor, ventas, horario, fechaInicio, fechaFin) {
    console.log(`Generando reporte para ${vendedor.nombre}: ${ventas.length} ventas, horario=${horario || 'todos'}`);
    
    // Formatear fechas correctamente para el reporte
    const formatoFecha = (fechaStr) => {
        // Si es formato de input date (YYYY-MM-DD)
        if (fechaStr.includes('-')) {
            const partes = fechaStr.split('-');
            return `${partes[2]}/${partes[1]}/${partes[0]}`; // Convertir a DD/MM/YYYY
        }
        // Si ya está en otro formato, devolver tal cual
        return fechaStr;
    };
    
    // Crear una estructura para el reporte
    const reporteHTML = document.createElement('div');
    reporteHTML.style.cssText = `
        font-family: Arial, sans-serif;
        color: black;
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        text-align: left;
    `;
    
    // Título y período
    const titulo = document.createElement('h2');
    titulo.style.cssText = `text-align: center; margin-bottom: 5px;`;
    titulo.textContent = `Reporte de Ventas - ${vendedor.nombre}`;
    reporteHTML.appendChild(titulo);
    
    // Modificación para mostrar correctamente el período (si es un solo día o un rango)
    const periodo = document.createElement('p');
    periodo.style.cssText = `text-align: center; margin-bottom: 15px;`;
    
    // Comprobar si es un solo día o un rango
    if (fechaInicio === fechaFin) {
        periodo.textContent = `Fecha: ${formatoFecha(fechaInicio)}`;
    } else {
        periodo.textContent = `Período: ${formatoFecha(fechaInicio)} al ${formatoFecha(fechaFin)}`;
    }
    
    // Agregar el horario si está especificado
    if (horario) {
        periodo.textContent += ` - Horario: ${horario === 'dia' ? 'Día' : 'Noche'}`;
    }
    reporteHTML.appendChild(periodo);
    
    // Separador
    const separador = document.createElement('hr');
    separador.style.cssText = `border: none; border-top: 1px solid #333; margin: 10px 0;`;
    reporteHTML.appendChild(separador);
    
    // Contenido principal
    if (ventas.length === 0) {
        const noVentas = document.createElement('p');
        noVentas.style.cssText = `text-align: center; margin: 20px 0;`;
        noVentas.textContent = 'No hay ventas registradas para este período.';
        reporteHTML.appendChild(noVentas);
    } else {
        // Crear una tabla para el formato de dos columnas
        const tabla = document.createElement('table');
        tabla.style.cssText = `
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        `;
        
        // Si el horario es "todos", separar ventas por horario
        if (!horario) {
            // Filtrar ventas por horario
            const ventasDia = ventas.filter(v => v.horario.toLowerCase().replace(/\B(?=(\d{3})+(?!\d))/g, ',') === 'dia');
            const ventasNoche = ventas.filter(v => v.horario.toLowerCase().replace(/\B(?=(\d{3})+(?!\d))/g, ',') === 'noche');
            
            // Mostrar resumen general
            agregarFila(tabla, 'Total de Ventas:', ventas.length);
            agregarFila(tabla, '- Ventas Día:', ventasDia.length);
            agregarFila(tabla, '- Ventas Noche:', ventasNoche.length);
            
            // Procesamiento por horario
            procesarVentasPorHorario(tabla, vendedor, 'dia', ventasDia);
            procesarVentasPorHorario(tabla, vendedor, 'noche', ventasNoche);
            
            // Totales generales
            let totalVentaGeneral = 0;
            let totalPremiosGeneral = 0;
            
            ventas.forEach(venta => {
                totalVentaGeneral += venta.totalVenta || 0;
                totalPremiosGeneral += venta.premio || 0;
            });
            
            agregarSeparador(tabla);
            agregarEncabezado(tabla, 'TOTALES GENERALES');
            agregarFila(tabla, 'Venta Total General:', totalVentaGeneral.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
            agregarFila(tabla, 'Premio Total General:', totalPremiosGeneral.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
            
        } else {
            // Si se seleccionó un horario específico (día o noche)
            procesarVentasPorHorario(tabla, vendedor, horario, ventas);
        }
        
        reporteHTML.appendChild(tabla);
    }
    
    // Información de fondos
    mostrarInformacionFondos(reporteHTML, vendedor, horario, fechaInicio, fechaFin, ventas.length === 0);
    
    // Preparar el texto para copiar
    const reporteTexto = generarReporteTexto(reporteHTML, vendedor, fechaInicio, fechaFin, horario);
    
    // Mostrar el modal con el reporte
    mostrarModalReporte(reporteHTML, reporteTexto, horario, ventas);
}
// Función para mostrar el modal con el reporte
function mostrarModalReporte(reporteHTML, reporteTexto, horario, ventas) {
    const modalContainer = document.createElement('div');
    modalContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background-color: #a9a9a9; /* Gris oscuro */
        color: black;
        padding: 20px;
        border-radius: 8px;
        max-width: 80%;
        max-height: 80%;
        overflow-y: auto;
        position: relative;
    `;

    // Usar un elemento pre para mantener el formato del texto como en el primer modal
    const preElement = document.createElement('pre');
    preElement.style.cssText = `
        margin: 0;
        font-family: monospace;
        white-space: pre;
        font-size: 14px;
    `;
    preElement.textContent = reporteTexto;
    modalContent.appendChild(preElement);

    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 20px;
    `;

    // Botón Copiar
    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copiar';
    copyButton.style.cssText = `
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        background-color: #4CAF50;
        color: white;
        cursor: pointer;
    `;

    copyButton.onclick = async () => {
        try {
            // Obtener el texto exactamente como se muestra en el reporte
            const reporteTexto = preElement.textContent;
            
            // Copiar el texto al portapapeles
            await navigator.clipboard.writeText(reporteTexto);
            
            // Crear imagen en canvas basada en el texto exacto del reporte
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Calcular dimensiones según el contenido
            const lineas = reporteTexto.split('\n');
            const anchoCanvas = 600; // Ancho fijo para dar espacio suficiente
            const altoLinea = 20; // Altura por línea en píxeles
            const margen = 40; // Margen superior e inferior
            
            canvas.width = anchoCanvas;
            canvas.height = lineas.length * altoLinea + margen;
    
            // Fondo gris claro
            ctx.fillStyle = '#a9a9a9';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
    
            // Configurar texto monoespaciado para preservar alineación
            ctx.fillStyle = '#000000';
            ctx.font = '16px monospace';
            ctx.textAlign = 'left';
            
            // Dibujar cada línea exactamente como está en el texto
            lineas.forEach((linea, index) => {
                ctx.fillText(linea, 20, 25 + (index * altoLinea));
            });
    
            // Convertir canvas a Blob (imagen)
            canvas.toBlob(async (blobImage) => {
                if (blobImage) {
                    try {
                        // Copiar ambos formatos: texto e imagen
                        const clipboardItems = [
                            new ClipboardItem({
                                'text/plain': new Blob([reporteTexto], {type: 'text/plain'}),
                                'image/png': blobImage
                            })
                        ];
                        
                        await navigator.clipboard.write(clipboardItems);
                        console.log("Texto e imagen copiados con éxito");
                    } catch (e) {
                        console.error("Error al escribir en el portapapeles:", e);
                        // Ya tenemos el texto copiado, así que no necesitamos volver a intentarlo
                    }
                }
            }, 'image/png');
    
            copyButton.textContent = 'Copiado!';
            setTimeout(() => copyButton.textContent = 'Copiar', 2000);
        } catch (err) {
            console.error('Error al copiar:', err);
            copyButton.textContent = 'Error al copiar';
            setTimeout(() => copyButton.textContent = 'Copiar', 2000);
        }
    };

    // Botón Aceptar
    const acceptButton = document.createElement('button');
    acceptButton.textContent = 'Aceptar';
    acceptButton.style.cssText = `
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        background-color: #4CAF50;
        color: white;
        cursor: pointer;
    `;
    acceptButton.onclick = () => {
        document.body.removeChild(modalContainer);
    };

    buttonContainer.appendChild(copyButton);
    buttonContainer.appendChild(acceptButton);
    modalContent.appendChild(buttonContainer);
    modalContainer.appendChild(modalContent);
    document.body.appendChild(modalContainer);
}

// 3. ASEGÚRATE DE QUE ESTAS FUNCIONES EXISTAN
// Funciones auxiliares para crear la tabla
function agregarFila(tabla, etiqueta, valor, colorValor = null, esSubtexto = false) {
    const fila = tabla.insertRow();
    
    // Celda para la etiqueta
    const celdaEtiqueta = fila.insertCell();
    celdaEtiqueta.style.cssText = `
        text-align: left;
        padding: 5px 0;
        ${esSubtexto ? 'font-size: 0.9em;' : ''}
    `;
    celdaEtiqueta.textContent = etiqueta;
    
    // Celda para el valor
    const celdaValor = fila.insertCell();
    celdaValor.style.cssText = `
        text-align: right;
        padding: 5px 0;
        ${colorValor ? `color: ${colorValor};` : ''}
        ${esSubtexto ? 'font-size: 0.9em;' : ''}
    `;
    celdaValor.textContent = valor;
}

function agregarSeparador(tabla) {
    const fila = tabla.insertRow();
    const celda = fila.insertCell();
    celda.colSpan = 2;
    celda.style.cssText = `
        padding: 5px 0;
        border-bottom: 1px solid #333;
    `;
}

function agregarEncabezado(tabla, texto) {
    const fila = tabla.insertRow();
    const celda = fila.insertCell();
    celda.colSpan = 2;
    celda.style.cssText = `
        text-align: center;
        font-weight: bold;
        padding: 5px 0;
    `;
    celda.textContent = texto;
}

// CORRECCIÓN 4: Función filtrarVentasPorFecha mejorada
function filtrarVentasPorFecha(vendedor, fechaInicio, fechaFin, horario) {
    console.log(`Iniciando filtrado: de ${fechaInicio} a ${fechaFin}, horario="${horario}"`);
    
    const inicio = new Date(fechaInicio);
    inicio.setHours(0, 0, 0, 0);
    
    const fin = new Date(fechaFin);
    fin.setHours(23, 59, 59, 999);
    
    // Array para almacenar todas las ventas combinadas
    let todasLasVentas = [];
    
    // Obtener ventas del estado actual
    if (vendedor.ventas && Array.isArray(vendedor.ventas)) {
        console.log(`Encontradas ${vendedor.ventas.length} ventas en el vendedor actual`);
        todasLasVentas = [...vendedor.ventas];
    }
    
    // Obtener ventas del historial
    if (historialDatos && historialDatos.fechas) {
        console.log("Buscando ventas en historial...");
        let ventasHistoricas = 0;
        
        // Recorrer todas las fechas guardadas
        Object.keys(historialDatos.fechas).forEach(fecha => {
            const datosHistoricos = historialDatos.fechas[fecha];
            // Verificar si hay datos de vendedores para esa fecha
            if (datosHistoricos && datosHistoricos.vendedores) {
                // Buscar el vendedor en esa fecha por su ID o nombre
                const vendedorHistorico = datosHistoricos.vendedores.find(v => 
                    v.id === vendedor.id || v.nombre === vendedor.nombre
                );
                
                if (vendedorHistorico && vendedorHistorico.ventas && Array.isArray(vendedorHistorico.ventas)) {
                    console.log(`Encontradas ${vendedorHistorico.ventas.length} ventas históricas para fecha ${fecha}`);
                    ventasHistoricas += vendedorHistorico.ventas.length;
                    
                    // Combinar las ventas, asegurando que no haya duplicados
                    vendedorHistorico.ventas.forEach(ventaHistorica => {
                        // Comprobar si la venta ya existe en nuestro array combinado
                        const yaExiste = todasLasVentas.some(v => 
                            v.fecha === ventaHistorica.fecha && 
                            v.horario === ventaHistorica.horario &&
                            v.totalVenta === ventaHistorica.totalVenta
                        );
                        
                        if (!yaExiste) {
                            todasLasVentas.push(ventaHistorica);
                        }
                    });
                }
            }
        });
        
        console.log(`Total de ventas históricas añadidas: ${ventasHistoricas}`);
    }
    
    console.log(`Total de ventas combinadas antes de filtrar: ${todasLasVentas.length}`);
    
    // Filtrar primero por fecha
    let ventasFiltradas = todasLasVentas.filter(venta => {
        let fechaVenta;
        try {
            // Normalización de fecha (convertir a objeto Date)
            if (typeof venta.fecha === 'string' && venta.fecha.includes('-')) {
                // Formato ISO (YYYY-MM-DD)
                fechaVenta = new Date(venta.fecha);
            } else if (typeof venta.fecha === 'string' && venta.fecha.includes('/')) {
                // Formato DD/MM/YYYY
                const partes = venta.fecha.split('/');
                fechaVenta = new Date(partes[2], partes[1]-1, partes[0]);
            } else if (venta.fecha instanceof Date) {
                // Ya es un objeto Date
                fechaVenta = new Date(venta.fecha);
            } else {
                // Intentar conversión directa
                fechaVenta = new Date(venta.fecha);
            }
            
            // Verificar si la conversión fue exitosa
            if (isNaN(fechaVenta.getTime())) {
                console.error("Formato de fecha no válido:", venta.fecha);
                return false;
            }
        } catch (e) {
            console.error("Error al procesar fecha:", venta.fecha, e);
            return false;
        }
        
        // Filtrar por fecha
        const coincideFecha = fechaVenta >= inicio && fechaVenta <= fin;
        
        if (coincideFecha) {
            console.log(`Venta dentro del rango de fechas: ${venta.fecha}, horario=${venta.horario}`);
        }
        
        return coincideFecha;
    });
    
    console.log(`Ventas en rango de fechas: ${ventasFiltradas.length}`);
    
    // Filtrar por horario si se especificó
    if (horario && horario.trim() !== "") {
        console.log(`Aplicando filtro de horario: "${horario}"`);
        
        // Normalizar el horario de búsqueda a minúsculas
        const horarioFiltroLower = horario.toLowerCase();
        
        ventasFiltradas = ventasFiltradas.filter(venta => {
            if (!venta.horario) {
                console.warn("Venta sin propiedad 'horario':", venta);
                return false;
            }
            
            // Normalizar el horario de la venta a minúsculas
            const horarioVentaLower = venta.horario.toLowerCase();
            
            // Comparar los horarios normalizados
            const coincide = horarioVentaLower === horarioFiltroLower;
            
            if (!coincide) {
                console.log(`Descartando venta: fecha=${venta.fecha}, horario=${venta.horario} (buscando=${horario})`);
            } else {
                console.log(`Aceptando venta: fecha=${venta.fecha}, horario=${venta.horario}`);
            }
            
            return coincide;
        });
        
        console.log(`Después de filtrar por horario "${horario}": ${ventasFiltradas.length} ventas coinciden`);
        
        // Verificación final para confirmar que todas las ventas tienen el horario correcto
        const ventasHorarioCorrecto = ventasFiltradas.filter(v => 
            v.horario.toLowerCase() === horarioFiltroLower
        );
        
        if (ventasHorarioCorrecto.length !== ventasFiltradas.length) {
            console.error(`ERROR: ${ventasFiltradas.length - ventasHorarioCorrecto.length} ventas tienen horario incorrecto`);
            return ventasHorarioCorrecto;
        }
    }
    
    return ventasFiltradas;
}

// Nueva función para obtener todas las ventas en un rango de fechas
function obtenerTodasVentasEnRango(vendedor, fechaInicio, fechaFin) {
    const inicio = new Date(fechaInicio);
    inicio.setHours(0, 0, 0, 0);
    
    const fin = new Date(fechaFin);
    fin.setHours(23, 59, 59, 999);
    
    // Array para almacenar todas las ventas combinadas
    let todasLasVentas = [];
    
    // Obtener ventas del estado actual
    if (vendedor.ventas) {
        todasLasVentas = [...vendedor.ventas];
    }
    
    // Obtener ventas del historial
    if (historialDatos && historialDatos.fechas) {
        // Recorrer todas las fechas guardadas
        Object.keys(historialDatos.fechas).forEach(fecha => {
            const datosHistoricos = historialDatos.fechas[fecha];
            // Verificar si hay datos de vendedores para esa fecha
            if (datosHistoricos && datosHistoricos.vendedores) {
                // Buscar el vendedor en esa fecha por su ID o nombre
                const vendedorHistorico = datosHistoricos.vendedores.find(v => v.id === vendedor.id);
                if (vendedorHistorico && vendedorHistorico.ventas) {
                    // Combinar las ventas, asegurando que no haya duplicados
                    vendedorHistorico.ventas.forEach(ventaHistorica => {
                        // Comprobar si la venta ya existe en nuestro array combinado
                        const yaExiste = todasLasVentas.some(v => 
                            v.fecha === ventaHistorica.fecha && 
                            v.horario === ventaHistorica.horario &&
                            v.totalVenta === ventaHistorica.totalVenta
                        );
                        
                        if (!yaExiste) {
                            todasLasVentas.push(ventaHistorica);
                        }
                    });
                }
            }
        });
    }
    
    // Filtrar solo por fecha, no por horario
    return todasLasVentas.filter(venta => {
        let fechaVenta;
        try {
            // Intentar convertir la fecha de la venta a objeto Date
            fechaVenta = new Date(venta.fecha);
            if (isNaN(fechaVenta.getTime())) {
                // Si el formato no es estándar, intentar con formato dd/mm/yyyy
                const partes = venta.fecha.split('/');
                if (partes.length === 3) {
                    fechaVenta = new Date(partes[2], partes[1]-1, partes[0]);
                }
                
                // Si sigue sin ser válida
                if (isNaN(fechaVenta.getTime())) {
                    console.error("Formato de fecha no válido:", venta.fecha);
                    return false;
                }
            }
        } catch (e) {
            console.error("Error al procesar fecha:", venta.fecha);
            return false;
        }
        
        // Solo filtrar por fecha, no por horario
        return fechaVenta >= inicio && fechaVenta <= fin;
    });
}

function filtrarVentasPorFecha(vendedor, fechaInicio, fechaFin, horario) {
    console.log(`Iniciando filtrado: de ${fechaInicio} a ${fechaFin}, horario="${horario}"`);
    
    // Normalizar las fechas de inicio y fin para comparación
    const inicio = normalizarFecha(fechaInicio);
    inicio.setHours(0, 0, 0, 0);
    
    const fin = normalizarFecha(fechaFin);
    fin.setHours(23, 59, 59, 999);
    
    console.log(`Fechas normalizadas para filtro: desde ${inicio.toISOString()} hasta ${fin.toISOString()}`);
    
    // Array para almacenar todas las ventas combinadas
    let todasLasVentas = [];
    
    // Obtener ventas del estado actual
    if (vendedor.ventas && Array.isArray(vendedor.ventas)) {
        console.log(`Encontradas ${vendedor.ventas.length} ventas en el vendedor`);
        todasLasVentas = [...vendedor.ventas];
    }
    
    // (Código para obtener ventas del historial si existe)
    
    console.log(`Total de ventas antes de filtrar: ${todasLasVentas.length}`);
    
    // Filtrar las ventas por fecha
    const ventasFiltradas = todasLasVentas.filter(venta => {
        // Normalizar la fecha de la venta
        let fechaVenta = normalizarFecha(venta.fecha);
        
        // Si la normalización falló, registrar y descartar
        if (!fechaVenta) {
            console.error("No se pudo normalizar la fecha:", venta.fecha);
            return false;
        }
        
        // Para comparación justa, ajustar la hora a mediodía
        fechaVenta.setHours(12, 0, 0, 0);
        
        // Verificar si está dentro del rango
        const dentroDeRango = fechaVenta >= inicio && fechaVenta <= fin;
        
        if (dentroDeRango) {
            console.log(`Venta dentro del rango: ${venta.fecha} (normalizada: ${fechaVenta.toISOString()}), horario: ${venta.horario}`);
        }
        
        return dentroDeRango;
    });
    
    console.log(`Después de filtrar por fecha: ${ventasFiltradas.length} ventas coinciden`);
    
    // Filtrar por horario si se especificó
    if (horario && horario.trim() !== "") {
        console.log(`Filtrando ventas por horario: ${horario}`);
        
        const ventasPorHorario = ventasFiltradas.filter(venta => {
            if (!venta.horario) {
                console.warn("Venta sin propiedad horario:", venta);
                return false;
            }
            
            // Comparación insensible a mayúsculas/minúsculas
            const coincide = venta.horario.toLowerCase() === horario.toLowerCase();
            
            if (!coincide) {
                console.log(`Venta descartada por horario incorrecto: fecha=${venta.fecha}, horario venta=${venta.horario}, horario filtro=${horario}`);
            } else {
                console.log(`Venta aceptada por horario: fecha=${venta.fecha}, horario=${venta.horario}`);
            }
            
            return coincide;
        });
        
        console.log(`Ventas filtradas: ${ventasPorHorario.length} ventas coinciden con fecha=${fechaInicio} a ${fechaFin} y horario=${horario}`);
        
        // Verificación final
        const ventasHorarioCorrecto = ventasPorHorario.filter(v => 
            v.horario.toLowerCase() === horario.toLowerCase()
        );
        
        console.log(`Verificación horario: ${ventasHorarioCorrecto.length} de ${ventasPorHorario.length} tienen horario=${horario}`);
        
        return ventasPorHorario;
    }
    
    return ventasFiltradas;
}
function normalizarFecha(fecha) {
    return obtenerFechaFormateada(fecha, 'date');
}

// Función para generar el reporte en formato texto
function generarReporteTexto(reporteHTML, vendedor, fechaInicio, fechaFin, horario) {
    let reporteTexto = "";
    
    // Convertir la tabla HTML a texto para copiar
    const tablas = reporteHTML.querySelectorAll('table');
    tablas.forEach(tabla => {
        const filas = tabla.querySelectorAll('tr');
        filas.forEach(fila => {
            const celdas = fila.querySelectorAll('td, th');
            if (celdas.length === 1 && celdas[0].colSpan === 2) {
                // Es un encabezado o separador
                if (celdas[0].textContent.trim() !== '') {
                    reporteTexto += celdas[0].textContent + '\n';
                    // Añadir línea de separación debajo del encabezado si el texto incluye "RESUMEN" o "FONDOS" o "MOVIMIENTOS"
                    const textoEncabezado = celdas[0].textContent.trim();
                    if (textoEncabezado.includes('RESUMEN') || textoEncabezado.includes('FONDOS') || textoEncabezado.includes('MOVIMIENTOS')) {
                        reporteTexto += '-'.repeat(45) + '\n\n';
                    }
                } else {
                    // Separador
                    reporteTexto += '-'.repeat(45) + '\n';
                }
            } else if (celdas.length === 2) {
                // Es una fila normal de datos
                const etiqueta = celdas[0].textContent.trim();
                const valor = celdas[1].textContent.trim();
                
                // Calcular espacios para alinear valores como en el primer formato
                const espacios = ' '.repeat(Math.max(25 - etiqueta.length, 2));
                reporteTexto += `${etiqueta}${espacios}${valor}\n`;
            }
        });
    });
    
    return reporteTexto;
}

function mostrarReporteVentas(vendedor, ventas, horario, fechaInicio, fechaFin) {
    console.log(`Generando reporte para ${vendedor.nombre}: ${ventas.length} ventas, horario=${horario || 'todos'}`);
    
    // CORRECCIÓN: Formatear fechas para mantener el día exacto seleccionado
    const formatoFecha = (fechaStr) => {
        // Si es formato ISO (YYYY-MM-DD) del input date
        if (typeof fechaStr === 'string' && fechaStr.includes('-')) {
            const [año, mes, dia] = fechaStr.split('-');
            return `${dia}/${mes}/${año}`;
        }
        
        // Si ya está en formato DD/MM/YYYY, devolverlo tal cual
        if (typeof fechaStr === 'string' && fechaStr.includes('/')) {
            return fechaStr;
        }
        
        // En caso contrario, usar el formato estándar
        try {
            const fecha = new Date(fechaStr);
            return `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
        } catch (e) {
            console.error("Error al formatear fecha:", e);
            return fechaStr; // devolver original si falla
        }
    };
    
    // Crear el reporte HTML
    const reporteHTML = document.createElement('div');
    reporteHTML.style.cssText = `
        font-family: Arial, sans-serif;
        color: black;
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        text-align: left;
    `;
    
    // Título del reporte
    const titulo = document.createElement('h2');
    titulo.style.cssText = `text-align: center; margin-bottom: 5px;`;
    titulo.textContent = `Reporte de Ventas - ${vendedor.nombre}`;
    reporteHTML.appendChild(titulo);
    
    // CORRECCIÓN: Usar el formato de fecha correcto
    console.log("Fechas originales para el título:", fechaInicio, fechaFin);
    const fechaInicioFormateada = formatoFecha(fechaInicio);
    const fechaFinFormateada = formatoFecha(fechaFin);
    console.log("Fechas formateadas para el título:", fechaInicioFormateada, fechaFinFormateada);
    
    // Período del reporte con las fechas correctamente formateadas
    const periodo = document.createElement('p');
    periodo.style.cssText = `text-align: center; margin-bottom: 15px;`;
    periodo.textContent = `Período: ${fechaInicioFormateada} al ${fechaFinFormateada}`;
    if (horario) {
        periodo.textContent += ` - Horario: ${horario === 'dia' ? 'Día' : 'Noche'}`;
    }
    reporteHTML.appendChild(periodo);
    
    // Separador
    const separador = document.createElement('hr');
    separador.style.cssText = `border: none; border-top: 1px solid #333; margin: 10px 0;`;
    reporteHTML.appendChild(separador);
    
    // Contenido principal
    if (ventas.length === 0) {
        const noVentas = document.createElement('p');
        noVentas.style.cssText = `text-align: center; margin: 20px 0;`;
        noVentas.textContent = 'No hay ventas registradas para este período.';
        reporteHTML.appendChild(noVentas);
    } else {
        // Crear una tabla para el formato de dos columnas
        const tabla = document.createElement('table');
        tabla.style.cssText = `
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        `;
        
        // Si el horario es "todos", separar ventas por horario
        if (!horario) {
            // Filtrar ventas por horario
            const ventasDia = ventas.filter(v => v.horario.toLowerCase().replace(/\B(?=(\d{3})+(?!\d))/g, ',') === 'dia');
            const ventasNoche = ventas.filter(v => v.horario.toLowerCase().replace(/\B(?=(\d{3})+(?!\d))/g, ',') === 'noche');
            
            // Mostrar resumen general
            agregarFila(tabla, 'Total de Ventas:', ventas.length);
            agregarFila(tabla, '- Ventas Día:', ventasDia.length);
            agregarFila(tabla, '- Ventas Noche:', ventasNoche.length);
            
            // Procesamiento por horario
            procesarVentasPorHorario(tabla, vendedor, 'dia', ventasDia);
            procesarVentasPorHorario(tabla, vendedor, 'noche', ventasNoche);
            
            // Totales generales
            let totalVentaGeneral = 0;
            let totalPremiosGeneral = 0;
            
            ventas.forEach(venta => {
                totalVentaGeneral += venta.totalVenta || 0;
                totalPremiosGeneral += venta.premio || 0;
            });
            
            agregarSeparador(tabla);
            agregarEncabezado(tabla, 'TOTALES GENERALES');
            agregarFila(tabla, 'Venta Total General:', totalVentaGeneral.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
            agregarFila(tabla, 'Premio Total General:', totalPremiosGeneral.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
            
        } else {
            // Si se seleccionó un horario específico (día o noche)
            procesarVentasPorHorario(tabla, vendedor, horario, ventas);
        }
        
        reporteHTML.appendChild(tabla);
    }
    
    // Información de fondos
    mostrarInformacionFondos(reporteHTML, vendedor, horario, fechaInicio, fechaFin, ventas.length === 0);
    
    // Preparar el texto para copiar
    const reporteTexto = generarReporteTexto(reporteHTML, vendedor, fechaInicio, fechaFin, horario);
    
    // Mostrar el modal con el reporte
    mostrarModalReporte(reporteHTML, reporteTexto, horario, ventas);
}

function procesarVentasPorHorario(tabla, vendedor, horarioActual, ventasHorario) {
    // Buscar información sobre el último número ganador
    const ventasConGanador = ventasHorario
        .filter(v => v.numeroGanador !== null && v.numeroGanador !== undefined)
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        
    let numeroGanador = null;
    let fechaVenta = '';
    
    if (ventasConGanador.length > 0) {
        const ultimaVenta = ventasConGanador[0];
        numeroGanador = ultimaVenta.numeroGanador;
        
        // Formatear la fecha de la venta
        if (typeof ultimaVenta.fecha === 'string') {
            if (ultimaVenta.fecha.includes('-')) {
                // Convertir de YYYY-MM-DD a DD/MM/YYYY
                const partes = ultimaVenta.fecha.split('-');
                if (partes.length === 3) {
                    fechaVenta = `${partes[2]}/${partes[1]}/${partes[0]}`;
                }
            } else {
                fechaVenta = ultimaVenta.fecha;
            }
        } else {
            fechaVenta = obtenerFechaFormateada(ultimaVenta.fecha);
        }
    }
    
    // Encabezado con el número ganador como emoji
    agregarEncabezado(tabla, `${vendedor.nombre}  ${horarioActual === 'dia' ? 'Día' : 'Noche'}  ${numeroGanador ? numeroAEmoji(numeroGanador) : ''}`);
    
    // Agregar la fecha
    if (fechaVenta) {
        agregarFila(tabla, 'Fecha:', fechaVenta, null, true);
    }
    
    // Separador para el resumen general
    agregarSeparador(tabla);
    agregarEncabezado(tabla, 'RESUMEN GENERAL');
    
    if (ventasHorario.length > 0) {
        let totalVenta = 0;
        let totalPremios = 0;
        
        ventasHorario.forEach(venta => {
            totalVenta += venta.totalVenta || 0;
            totalPremios += venta.premio || 0;
        });
        
        const pagoPremios = Math.round(totalPremios * vendedor.precioVenta);
        const gananciaVendedor = Math.round(totalVenta * (vendedor.porcentaje / 100));
        const entrega = Math.round(totalVenta - gananciaVendedor);
        
        // Mostrar solo la información que te interesa
        agregarFila(tabla, 'Número de Ventas:', ventasHorario.length);
        agregarFila(tabla, 'Venta Total:', totalVenta.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
        agregarFila(tabla, 'Premio Total:', totalPremios.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
        agregarFila(tabla, 'Pago Total:', pagoPremios.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
        agregarFila(tabla, 'Entrega Total:', entrega.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
        
        // Agregar información sobre ganancia o pérdida
        const diferenciaEntregaPago = entrega - pagoPremios;
        if (diferenciaEntregaPago !== 0) {
            const esGanancia = diferenciaEntregaPago > 0;
            agregarFila(tabla, esGanancia ? 'Ganancia:' : 'Pérdida:', 
                Math.abs(diferenciaEntregaPago).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','), 
                esGanancia ? 'color: green; font-weight: bold;' : 'color: red; font-weight: bold;');
        }
    } else {
        const filaNoVentas = tabla.insertRow();
        const celdaNoVentas = filaNoVentas.insertCell();
        celdaNoVentas.colSpan = 2;
        celdaNoVentas.style.textAlign = 'center';
        celdaNoVentas.textContent = `No hay ventas de ${horarioActual === 'dia' ? 'día' : 'noche'} en este período.`;
    }
}

// Función para mostrar la información de fondos, buscando en el historial
function mostrarInformacionFondos(contenedor, vendedor, horario, fechaInicio, fechaFin, sinVentas) {
    const tabla = document.createElement('table');
    tabla.style.cssText = `
        width: 100%;
        border-collapse: collapse;
        margin-top: 15px;
    `;
    
    // Convertir fechas a objetos Date para comparación
    const fechaInicioObj = new Date(fechaInicio);
    const fechaFinObj = new Date(fechaFin);
    
    // Buscar los fondos relevantes para el período
    let fondosRelevantes = null;
    
    // 1. Primero intentamos obtener del historialFondos
    if (vendedor.historialFondos && Array.isArray(vendedor.historialFondos)) {
        console.log("Buscando fondos en historialFondos...");
        
        // Filtrar por registros dentro del rango de fechas
        const registrosEnRango = vendedor.historialFondos.filter(reg => {
            const fechaReg = obtenerFechaFormateada(reg.fecha);
            const partesReg = fechaReg.split('/').map(Number);
            
            const fechaRegObj = new Date(partesReg[2], partesReg[1]-1, partesReg[0]);
            
            // Verificar si está dentro del rango
            return fechaRegObj >= fechaInicioObj && fechaRegObj <= fechaFinObj;
        });
        
        console.log(`Encontrados ${registrosEnRango.length} registros de fondos en el rango de fechas`);
        
        // Si hay registros, filtrar por horario si es necesario
        if (registrosEnRango.length > 0) {
            if (horario) {
                const registrosHorario = registrosEnRango.filter(reg => reg.horario === horario);
                
                if (registrosHorario.length > 0) {
                    // Ordenar por fecha descendente
                    registrosHorario.sort((a, b) => {
                        const fechaA = obtenerFechaFormateada(a.fecha).split('/').map(Number);
                        const fechaB = obtenerFechaFormateada(b.fecha).split('/').map(Number);
                        
                        const dateA = new Date(fechaA[2], fechaA[1]-1, fechaA[0]);
                        const dateB = new Date(fechaB[2], fechaB[1]-1, fechaB[0]);
                        
                        return dateB - dateA; // Más reciente primero
                    });
                    
                    // Usar el último registro para este horario
                    fondosRelevantes = {
                        anterior: registrosHorario[0].fondoAnterior,
                        actual: registrosHorario[0].fondoActual,
                        fecha: registrosHorario[0].fecha
                    };
                    
                    console.log(`Usando fondo histórico para ${horario}:`, fondosRelevantes);
                }
            } else {
                // Si no hay horario específico, buscar el último registro para día y noche
                const registrosDia = registrosEnRango.filter(reg => reg.horario === 'dia');
                const registrosNoche = registrosEnRango.filter(reg => reg.horario === 'noche');
                
                // Ordenar ambos conjuntos por fecha (descendente)
                registrosDia.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
                registrosNoche.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
                
                fondosRelevantes = {
                    dia: registrosDia.length > 0 ? {
                        anterior: registrosDia[0].fondoAnterior,
                        actual: registrosDia[0].fondoActual,
                        fecha: registrosDia[0].fecha
                    } : null,
                    noche: registrosNoche.length > 0 ? {
                        anterior: registrosNoche[0].fondoAnterior,
                        actual: registrosNoche[0].fondoActual,
                        fecha: registrosNoche[0].fecha
                    } : null
                };
                
                console.log("Usando fondos históricos para día y noche:", fondosRelevantes);
            }
        }
    }
    
    // 2. Si no encontramos en historialFondos, usar fondosPorHorario actual
    if (!fondosRelevantes) {
        console.log("No se encontraron fondos históricos, usando fondosPorHorario actual...");
        
        if (horario) {
            fondosRelevantes = {
                anterior: vendedor.fondosPorHorario?.[horario]?.anterior || 0,
                actual: vendedor.fondosPorHorario?.[horario]?.actual || 0
            };
        } else {
            fondosRelevantes = {
                dia: {
                    anterior: vendedor.fondosPorHorario?.dia?.anterior || 0,
                    actual: vendedor.fondosPorHorario?.dia?.actual || 0
                },
                noche: {
                    anterior: vendedor.fondosPorHorario?.noche?.anterior || 0,
                    actual: vendedor.fondosPorHorario?.noche?.actual || 0
                }
            };
        }
        
        console.log("Usando fondosPorHorario actual:", fondosRelevantes);
    }
    
    // Buscar movimientos de fondos para la fecha específica (si estamos mostrando un día específico)
    let movimientosHoy = [];
    if (fechaInicio === fechaFin && vendedor.movimientos && Array.isArray(vendedor.movimientos)) {
        // Normalizar la fecha para comparación
        const fechaReporteNormalizada = fechaInicio.includes('-') 
            ? fechaInicio.split('-').reverse().join('/') 
            : fechaInicio;
        
        // Filtrar movimientos por fecha y horario
        movimientosHoy = vendedor.movimientos.filter(mov => {
            const movFechaNormalizada = obtenerFechaFormateada(mov.fecha);
            return movFechaNormalizada === fechaReporteNormalizada && 
                   (!horario || mov.horario === horario);
        });
        
        console.log("Movimientos encontrados para esta fecha/horario:", movimientosHoy);
    }
    
    // Mostrar sección de FONDOS ACTUALES
    agregarSeparador(tabla);
    agregarEncabezado(tabla, 'FONDOS ACTUALES');
    
    if (horario) {
        // Solo mostrar el fondo anterior y el actual
        agregarFila(tabla, 'Fondo Banco Anterior:', fondosRelevantes.anterior.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
        agregarFila(tabla, 'Fondo Actual:', fondosRelevantes.actual.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
    } else {
        // Para ambos horarios, mostrar de forma más concisa
        if (fondosRelevantes.dia) {
            agregarFila(tabla, 'Fondo Anterior Día:', fondosRelevantes.dia.anterior.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
            agregarFila(tabla, 'Fondo Actual Día:', fondosRelevantes.dia.actual.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
        }
        
        if (fondosRelevantes.noche) {
            agregarFila(tabla, 'Fondo Anterior Noche:', fondosRelevantes.noche.anterior.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
            agregarFila(tabla, 'Fondo Actual Noche:', fondosRelevantes.noche.actual.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
        }
    }
    
    // Mostrar movimientos de fondos SOLO si hubo movimientos ese día
    if (movimientosHoy.length > 0) {
        agregarSeparador(tabla);
        agregarEncabezado(tabla, 'MOVIMIENTOS DE FONDO HOY');
        
        let totalAgregado = 0;
        let totalQuitado = 0;
        
        // Procesar cada movimiento
        movimientosHoy.forEach(mov => {
            if (mov.tipo === 'agregar') {
                totalAgregado += parseFloat(mov.cantidad);
                agregarFila(tabla, 'Banco Entregó:', `+${Math.round(mov.cantidad).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`);
            } else if (mov.tipo === 'quitar') {
                totalQuitado += parseFloat(mov.cantidad);
                agregarFila(tabla, 'Banco Recogió:', `-${Math.round(mov.cantidad).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`);
            }
        });
        
        // Mostrar totales si hay más de un movimiento
        if (movimientosHoy.length > 1) {
            if (totalAgregado > 0) {
                agregarFila(tabla, 'Total Entregado:', `+${Math.round(totalAgregado).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`);
            }
            if (totalQuitado > 0) {
                agregarFila(tabla, 'Total Recogido:', `-${Math.round(totalQuitado).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`);
            }
        }
    }
    
    contenedor.appendChild(tabla);
}

// Función para generar el reporte en formato texto
function mostrarInformacionFondos(contenedor, vendedor, horario, fechaInicio, fechaFin, sinVentas) {
    const tabla = document.createElement('table');
    tabla.style.cssText = `
        width: 100%;
        border-collapse: collapse;
        margin-top: 15px;
    `;
    
    // Convertir fechas a objetos Date para comparación
    const fechaInicioObj = new Date(fechaInicio);
    const fechaFinObj = new Date(fechaFin);
    
    // Buscar los fondos relevantes para el período
    let fondosRelevantes = null;
    
    // 1. Primero intentamos obtener del historialFondos
    if (vendedor.historialFondos && Array.isArray(vendedor.historialFondos)) {
        console.log("Buscando fondos en historialFondos...");
        
        // Filtrar por registros dentro del rango de fechas
        const registrosEnRango = vendedor.historialFondos.filter(reg => {
            const fechaReg = obtenerFechaFormateada(reg.fecha);
            const partesReg = fechaReg.split('/').map(Number);
            
            const fechaRegObj = new Date(partesReg[2], partesReg[1]-1, partesReg[0]);
            
            // Verificar si está dentro del rango
            return fechaRegObj >= fechaInicioObj && fechaRegObj <= fechaFinObj;
        });
        
        console.log(`Encontrados ${registrosEnRango.length} registros de fondos en el rango de fechas`);
        
        // Si hay registros, filtrar por horario si es necesario
        if (registrosEnRango.length > 0) {
            if (horario) {
                const registrosHorario = registrosEnRango.filter(reg => reg.horario === horario);
                
                if (registrosHorario.length > 0) {
                    // Ordenar por fecha descendente
                    registrosHorario.sort((a, b) => {
                        const fechaA = obtenerFechaFormateada(a.fecha).split('/').map(Number);
                        const fechaB = obtenerFechaFormateada(b.fecha).split('/').map(Number);
                        
                        const dateA = new Date(fechaA[2], fechaA[1]-1, fechaA[0]);
                        const dateB = new Date(fechaB[2], fechaB[1]-1, fechaB[0]);
                        
                        return dateB - dateA; // Más reciente primero
                    });
                    
                    // Usar el último registro para este horario
                    fondosRelevantes = {
                        anterior: registrosHorario[0].fondoAnterior,
                        actual: registrosHorario[0].fondoActual,
                        fecha: registrosHorario[0].fecha
                    };
                    
                    console.log(`Usando fondo histórico para ${horario}:`, fondosRelevantes);
                }
            } else {
                // Si no hay horario específico, buscar el último registro para día y noche
                const registrosDia = registrosEnRango.filter(reg => reg.horario === 'dia');
                const registrosNoche = registrosEnRango.filter(reg => reg.horario === 'noche');
                
                // Ordenar ambos conjuntos por fecha (descendente)
                registrosDia.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
                registrosNoche.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
                
                fondosRelevantes = {
                    dia: registrosDia.length > 0 ? {
                        anterior: registrosDia[0].fondoAnterior,
                        actual: registrosDia[0].fondoActual,
                        fecha: registrosDia[0].fecha
                    } : null,
                    noche: registrosNoche.length > 0 ? {
                        anterior: registrosNoche[0].fondoAnterior,
                        actual: registrosNoche[0].fondoActual,
                        fecha: registrosNoche[0].fecha
                    } : null
                };
                
                console.log("Usando fondos históricos para día y noche:", fondosRelevantes);
            }
        }
    }
    
    // 2. Si no encontramos en historialFondos, usar fondosPorHorario actual
    if (!fondosRelevantes) {
        console.log("No se encontraron fondos históricos, usando fondosPorHorario actual...");
        
        if (horario) {
            fondosRelevantes = {
                anterior: vendedor.fondosPorHorario?.[horario]?.anterior || 0,
                actual: vendedor.fondosPorHorario?.[horario]?.actual || 0
            };
        } else {
            fondosRelevantes = {
                dia: {
                    anterior: vendedor.fondosPorHorario?.dia?.anterior || 0,
                    actual: vendedor.fondosPorHorario?.dia?.actual || 0
                },
                noche: {
                    anterior: vendedor.fondosPorHorario?.noche?.anterior || 0,
                    actual: vendedor.fondosPorHorario?.noche?.actual || 0
                }
            };
        }
        
        console.log("Usando fondosPorHorario actual:", fondosRelevantes);
    }
    
    // Buscar movimientos de fondos para la fecha específica (si estamos mostrando un día específico)
    let movimientosHoy = [];
    if (fechaInicio === fechaFin && vendedor.movimientos && Array.isArray(vendedor.movimientos)) {
        // Normalizar la fecha para comparación
        const fechaReporteNormalizada = fechaInicio.includes('-') 
            ? fechaInicio.split('-').reverse().join('/') 
            : fechaInicio;
        
        // Filtrar movimientos por fecha y horario
        movimientosHoy = vendedor.movimientos.filter(mov => {
            const movFechaNormalizada = obtenerFechaFormateada(mov.fecha);
            return movFechaNormalizada === fechaReporteNormalizada && 
                   (!horario || mov.horario === horario);
        });
        
        console.log("Movimientos encontrados para esta fecha/horario:", movimientosHoy);
    }
    
    // Mostrar sección de FONDOS ACTUALES
    agregarSeparador(tabla);
    agregarEncabezado(tabla, 'FONDOS ACTUALES');
    
    if (horario) {
        // Solo mostrar el fondo anterior y el actual
        agregarFila(tabla, 'Fondo Banco Anterior:', fondosRelevantes.anterior.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
        agregarFila(tabla, 'Fondo Actual:', fondosRelevantes.actual.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
    } else {
        // Para ambos horarios, mostrar de forma más concisa
        if (fondosRelevantes.dia) {
            agregarFila(tabla, 'Fondo Anterior Día:', fondosRelevantes.dia.anterior.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
            agregarFila(tabla, 'Fondo Actual Día:', fondosRelevantes.dia.actual.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
        }
        
        if (fondosRelevantes.noche) {
            agregarFila(tabla, 'Fondo Anterior Noche:', fondosRelevantes.noche.anterior.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
            agregarFila(tabla, 'Fondo Actual Noche:', fondosRelevantes.noche.actual.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
        }
    }
    
    // Mostrar movimientos de fondos SOLO si hubo movimientos ese día
    if (movimientosHoy.length > 0) {
        agregarSeparador(tabla);
        agregarEncabezado(tabla, 'MOVIMIENTOS DE FONDO HOY');
        
        let totalAgregado = 0;
        let totalQuitado = 0;
        
        // Procesar cada movimiento
        movimientosHoy.forEach(mov => {
            if (mov.tipo === 'agregar') {
                totalAgregado += parseFloat(mov.cantidad);
                agregarFila(tabla, 'Banco Entregó:', `+${Math.round(mov.cantidad).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`);
            } else if (mov.tipo === 'quitar') {
                totalQuitado += parseFloat(mov.cantidad);
                agregarFila(tabla, 'Banco Recogió:', `-${Math.round(mov.cantidad).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`);
            }
        });
        
        // Mostrar totales si hay más de un movimiento
        if (movimientosHoy.length > 1) {
            if (totalAgregado > 0) {
                agregarFila(tabla, 'Total Entregado:', `+${Math.round(totalAgregado).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`);
            }
            if (totalQuitado > 0) {
                agregarFila(tabla, 'Total Recogido:', `-${Math.round(totalQuitado).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`);
            }
        }
    }
    
    contenedor.appendChild(tabla);
}

function cerrarModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

// Parte 4: Funciones Principales de Procesamiento

// Función principal modificada que integra ambas funcionalidades
function esJugadaValida(linea) {
    // Si la línea está vacía o no es string, retornar falso
    if (!linea || typeof linea !== 'string') {
        return false;
    }

    // Convertir múltiples espacios en uno solo y trim
    linea = linea.trim().replace(/\s+/g, ' ');

    // Validar SMS
    if (linea.toUpperCase() === 'SMS') return true;
    if (linea.toUpperCase().startsWith('SMS-')) return true;

    // Primero limpiamos el texto para normalizar formatos
    linea = limpiarTexto(linea);

    // Verificar si la línea coincide con alguno de los patrones válidos
    return Object.values(patrones).some(patron => patron.test(linea));
}

function limpiarTexto(texto) {
    return texto
        .replace(/\s+/g, ' ')            // Múltiples espacios a uno
        .replace(/\s*,\s*/g, ',')        // Limpiar espacios alrededor de comas
        .replace(/\s+-\s+/g, '-')        // Limpiar espacios alrededor de guiones
        .replace(/\s+con\s+/g, '-con-')  // Normalizar formato "con"
        .trim();
}

function obtenerNumeroGanador() {
    const input = document.getElementById('numeroGanador');
    const valor = input.value;
    return valor === '00' ? 100 : parseInt(valor, 10);
}

// Función de pre-procesamiento de patrones
function preProcesarPatrones() {
    // Obtener el texto del campo de entrada
    let mensajeVenta = document.getElementById('mensajeVenta').value;

    // Procesar cada línea del texto
    mensajeVenta = mensajeVenta.split('\n').map(line => {
        // 1. Reemplazos básicos
        line = line
            // Reemplazar 'o' por '0' si está al lado de un número
            .replace(/o(?=\d)|(?<=\d)o/g, '0')

            // Procesar números mayores al inicio de línea
            .replace(/(?:Total|TOTAL)[-_.:,;\s=]+(\d+)\s*\n\s*\1/gi, 'Total: $1')

            // Eliminar espacios adicionales
            .replace(/\s+/g, ' ')

            // Reemplazar Pj- por P-
            .replace(/Pj-/g, 'P-')

            // Nuevos patrones de reemplazo
            .replace(/\/+\s*$/, '')          // Borrar / al final de la línea
            .replace(/^[*=#]+/, '')          // Borrar *=# al inicio
            .replace(/^(\d+)-(?![\w\d])/, '$1')  // Borrar - después de número inicial
            .replace(/:/g, "-")
            //.replace(/(\w)\s*-\s*(\w)/g, '$1-$2')

            // Reemplazar patrones SMS
            .replace(/\[.+?\]\s+\+\d+\s+\d+\s+\d+:\s/g, '\nsms\n')
            // Reemplazar líneas que empiecen con [algo]
            .replace(/^\[.*?\]\s+([^\s]+)\s+(\d+)%\s+(Grupo\s+[^:]+):\s*/gim, '\nsms\n')
            // Reemplazar patrones como "[algo] texto:"
            .replace(/\[.+?\]\s+[a-zA-Z0-9 ]*:\s/g, '\nsms\n')
            .replace(/\[.+?\]\s+[a-zA-Z0-9 ]*-\s/g, '\nsms\n')
            // Reemplazar el nuevo formato [fecha hora] Nombre porcentaje GruPo Nombre-
            .replace(/\[\d{2}\/\d{2}\/\d{4}\s+\d{2}-\d{2}\s+[AP]M\]\s+\w+\s+\d+%\s+GruPo\s+\w+(-|\s)/gi, '\nsms\n')
            .replace(/\[\d{2}\/\d{2}\/\d{4}\s+\d{2}-\d{2}\s+[AP]M\]\s+\w+\s+\d+%\s+GruPo\s+[a-zA-ZáéíóúÁÉÍÓÚñÑ]+(-|\s)/gi, '\nsms\n')

            // Cambiar '100' por '00' al inicio de una línea
            .replace(/^(100)/g, '00')
            .replace(/(sms\s*-?\s*)(.*)/gi, '$1\n$2')
            .replace(/([TLPAYtlpay\d]+)\s{1,2}-/gi, '$1-')
            .replace(/-\s{1,2}(\d+)/gi, '-$1')
            .replace(/\.{2,}/g, '.')

            // Añadir un '0' delante de números menores de 10
            .replace(/(?<!\d)(?<![a-zA-Z])(\d)(?!\d)/g, '0$1')
            .replace(/sms(\s+)(\d+.+)/g, 'sms$1\n$2')
            //.replace(/sms(\s+)(Pareja|Linea|Terminal.+)/gi, 'sms$1\n$2')
            .replace(/(Pareja[-.+=, /]+(?:con[-.,]*)*\d+.*?)(\s+sms)$/gm, '$1\n$2')
            .replace(/([a-zA-Z0-9]+)(pareja|lineas|terminal|con)/gmi, '$1 $2')
            .replace(/^(?!(?:d|p|l|t|s|c|o|no|#|\d+|Final|Finales))\w+\s*|[-=./]+\s*$/gmi, '')
            //.replace(/^(?:(\d+[=\-.\/]*)(?:\s+.*)?|(?!(?:d|p|l|t|s|c|o|no|#|\d|Final|Finales))\w+\s*)(.*)/gmi, '$1$2')
            //.replace(/^(\d+[? .,\s]+)\s+/gm, '$1') //

            // Reemplazar '$' por '/'
            .replace(/\$/g, '/')

            // Convertir 'l' en 'L'
            .replace(/l/g, 'L')

            // Convertir 't' en 'T'
            .replace(/t/g, 'T')

            // Convertir 'p' en 'P'
            .replace(/p/g, 'P');

        // 3. Separar números/letras de las palabras clave
        line = line.replace(/([a-zA-Z0-9]+)(pareja|lineas|terminal)/g, '$1 $2');

        return line;
    }).join('\n');

    // Actualizar el campo de entrada con el texto procesado
    document.getElementById('mensajeVenta').value = mensajeVenta;

    // Mostrar mensaje de éxito
    mostrarMensaje('Pre-procesamiento completado', 'success');
}


// Agregar el nuevo botón al DOM
document.addEventListener('DOMContentLoaded', function () {
    // Asegurarnos que inicie en modo oscuro
    document.body.classList.add('dark-mode');
    // Inicialización básica existente
    document.getElementById('Bienvenida').style.display = 'block';
    actualizarSelectJefes();
    updateToggleDarkModeButton();

    // Agregar el event listener para el campo de número ganador
    const numeroGanadorInput = document.getElementById('numeroGanador');
    if (numeroGanadorInput) {
        numeroGanadorInput.addEventListener('input', function (e) {
            validarNumero(this);
        });
    }

    // Agregar el nuevo botón de pre-procesamiento
    const botonesContainer = document.querySelector('.button-container');
    if (botonesContainer) {
        const reprocesarBtn = botonesContainer.querySelector('button');
        if (reprocesarBtn) {
            const preBtn = document.createElement('button');
            preBtn.textContent = '🔄 Pre-procesar';
            preBtn.onclick = preProcesarPatrones;
            preBtn.className = 'btn btn-secondary';
            preBtn.style.marginRight = '10px';

            botonesContainer.insertBefore(preBtn, reprocesarBtn);
        }
    }
});

// Función principal de procesamiento múltiple
function procesarTextoCompleto() {
    const textarea = document.getElementById('mensajeVenta');
    const indicator = document.querySelector('.validation-indicator');

    try {
        if (indicator) {
            indicator.className = 'validation-indicator processing';
        }

        let texto = textarea.value;
        texto = procesarExpresionesEspecificas(texto, 15);
        texto = procesarPatronesMultiplesVeces(texto, 5); // 3 pasadas por defecto
        textarea.value = texto;

        if (indicator) {
            indicator.className = 'validation-indicator success';
        }

        mostrarMensaje('Procesamiento completado', 'success');

    } catch (error) {
        console.error('Error durante el procesamiento:', error);
        if (indicator) {
            indicator.className = 'validation-indicator error';
        }
        mostrarMensaje('Error en el procesamiento', 'error');
    }
}

// Función para procesar múltiples veces
function procesarPatronesMultiplesVeces(texto, numeroIteraciones = 3) {
    let resultado = texto;
    let iteracionAnterior;

    for (let i = 0; i < numeroIteraciones; i++) {
        iteracionAnterior = resultado;
        resultado = procesarPatronesUnaVez(resultado);

        if (iteracionAnterior === resultado) {
            break;
        }
    }

    return resultado;
}

// Event listener único para el botón de procesar
document.addEventListener('DOMContentLoaded', function () {
    const btnProcesar = document.querySelector('.btn-procesar');
    if (btnProcesar) {
        btnProcesar.addEventListener('click', procesarTextoCompleto);
    }
});

// Función para procesar expresiones regulares específicas múltiples veces
function procesarExpresionesEspecificas(texto, numeroIteraciones = 15) {
    let resultado = texto;

    // Lista de expresiones regulares que necesitan múltiples pasadas
    const expresionesMultiples = [
        [/^(\d+:\d+)(?:\s+|\s*,\s*|\s*\.\s*)(\d+:\d+)/g, '$1\n$2'],
        //[/(\d+(?:[-.+=,]+\d+))\/([\s]*)sms/gi, '$1\nsms'],
        //[/(\d+(?:[-.+=,/ ]+\d+))[\s/]+sms/gi, '$1\nsms'],
        //[/(\d+-\d+\/),?/g, '$1\n'],
        [/^(\d+:\d+)[\s,.]?(\d+:\d+)/g, '$1\n$2'],
        [/(\d+:\d+)[^\n](\d+:\d+)/g, '$1\n$2'],
        // Esta es más agresiva y forzará el salto de línea
        [/(^\d+:\d+)([^\n]*?)(\d+:\d+)/g, '$1\n$3'],
        // Agregar aquí las expresiones que necesitas procesar múltiples veces
        // Separadores con =
        [/(\d+\=\d+)\/(\d+\=\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =/=
        [/(\d+\=\d+)\/(\d+\/\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =/=
        [/(\d+\=\d+)\/(\d+\-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =/=
        [/(\d+\=\d+)\/(\d+\.\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =/=
        [/(\d+\=\d+)\/(\d+\-aL-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =/=
        [/(\d+\=\d+)\/ (\d+\=\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =/=
        [/(\d+\-\d+)\/ (\d+\-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de -/-
        [/(\d+\=\d+) (\d+\=\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =\s=
        [/(\d+\=\d+) (\d+\-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =\s-
        [/(\d+\=\d+) (\d+\.\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =\s.
        [/(\d+\=\d+) (\d+\:\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =\s:
        [/(\d+\=\d+) (\d+\;\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =\s:
        [/(\d+\=\d+);(\d+\=\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =\s:
        [/(\d+\=\d+) (\d+\-con-)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =\s:
        [/(\d+\=\d+) (Linea-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Lineas-
        [/(\d+\=\d+)\.(Linea-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Lineas-
        [/(\d+\=\d+)\. (Linea-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Lineas-
        [/(\d+\=\d+)\ ,(Linea-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Lineas-
        [/(\d+\=\d+)\, (Linea-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Lineas-
        [/(\d+\=\d+) (TerminaL-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de TerminaL-
        [/(\d+\=\d+) (Parejas-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Parejas-
        [/(\d+\=\d+) (Parejas\-con-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Parejas-
        // Separadores con -
        [/(\d+\-\d+) (\d+\-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de -\s-
        [/(\d+\-\d+)\, (\d+\-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de -\, -
        [/(\d+\-\d+)\/\. (\d+\-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de -\, -
        [/(\d+\-\d+)\,(\d+\-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de -\, -
        [/(\d+\-\d+)\/,(\d+\-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de -\, -
        [/(\d+\-\d+)\ ,(\d+\-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de -\, -
        [/(\d+\-\d+)\, (Linea-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de -\, -
        [/(\d+\-\d+)\, (TerminaL-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de -\, -
        [/(\d+\-\d+)\. (\d+\-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de -\, -
        [/(\d+\.\d+)\. (\d+\.\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de -\, -
        [/(\d+\-\d+) (\d+\;\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de -\s;
        [/(\d+\-\d+) (deL \d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de -\s;
        [/(\d+\-\d+) (\d+\-con-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de -\s;
        [/(\d+\-\d+)\/\s*$/gm, '$1'], // Manda para Abajo los # que siguen de -/;
        [/(\d+\-\d+)\/(\d+\=\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de -/;
        [/(\d+\-\d+) (TerminaL-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de TerminaL-
        [/(\d+\-\d+)\, (Parejas-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de -\, -
        [/(\d+\-\d+) (Parejas-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Parejas-
        [/(\d+\-\d+) (Parejas-con-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Parejas-
        [/(\d+\-\d+) (Parejas-de \d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =/=
        // Separador con ,
        [/(\d+\,\d+) (Linea-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Lineas-
        [/(\d+\,\d+) (Parejas-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Parejas-
        [/(\d+\,\d+) (\d+\=\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de ,\s=
        [/(\d+\,\d+) (\d+\;\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de ,\s;
        [/(\d+\,\d+) (\d+\:\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de ,\s:
        [/(\d+\,\d+) (\d+\-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de ,\s-
        [/(\d+\,\d+)\/(\d+\-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de ,/-
        [/(\d+\,\d+) (TerminaL-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de TerminaL-
        [/(\d+\,\d+) (\d+\,\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de ,\s,
        // Separador con -aL-
        [/(\d+\-aL-\d+\=\d+)\/(\d+\=\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =/=
        [/(\d+\-aL-\d+\=\d+)\/(\d+\/\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =/=
        [/(\d+\-aL-\d+\=\d+)\/(\d+\-aL-\d+\=\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =/=
        [/(\d+\-aL-\d+\=\d+)\/(Linea-\d+\-aL-\d+\=\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =/=
        [/(\d+\-aL-\d+\=\d+)\/(Parejas=\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =/=
        [/(\d+\-aL-\d+\=\d+)\/(TerminaL=\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =/=
        [/(\d+\-aL-\d+\=\d+) (Linea-\d+\-aL-\d+\=\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =/=
        [/(\d+\-aL-\d+\=\d+) (Parejas=\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =/=
        [/(\d+\-aL-\d+\=\d+) (TerminaL=\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =/=
        [/(\d+\-aL-\d+) (Linea-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =/=
        [/(\d+\-aL-\d+) (TerminaL-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =/=
        [/(\d+\-aL-\d+) (Parejas-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =/=
        // Separadores \s
        [/(\d+\.\d+) (Linea-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Lineas-
        [/(\d+\.\d+) (TerminaL-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de TerminaL-
        [/(\d+\.\d+) (Parejas-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Parejas-
        [/(\d+\.\d+) (\d+\=\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de .\s=
        [/(\d+\.\d+) (\d+\.\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de .
        [/^(\d+\:\d+)\s(\d+\:\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de :
        [/(\d+\.\d+) (\d+\-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de .\s-
        [/(\d+\.\d+) (\d+\:\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de .\s:
        [/(\d+\.\d+) (\d+\;\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de .\s:
        [/(\d+\ \d+) (Linea-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =/=
        [/(\d+\ \d+) (TerminaL-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =/=
        [/(\d+\ c-\d+) (\d+\ c-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de -/;
        [/(\d+[-:,;=]\d+) (Linea-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Lineas-
        [/(\d+\:\d+) (Linea-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Lineas-
        [/(\d+\:\d+) (TerminaL-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de TerminaL-
        [/(\d+\:\d+) (Parejas-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Parejas-
        [/(\d+:\d+)\s+(\d+:\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de :
        [/(\d+;\d+)\, (\d+;\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de :
        [/(\d+;\d+)\ ,(\d+;\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de :
        [/(\d+\;\d+) (Linea-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Lineas-
        [/(\d+\;\d+) (TerminaL-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de TerminaL-
        [/(\d+\;\d+) (Parejas-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Parejas-
        [/(\d+\;\d+) (\d+\;\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de ;\s;
        [/(\d+\;\d+) (\d+\-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de ;\s-
        [/(\d+\;\d+) (\d+\=\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de ;\s=
        [/(\d+\;\d+) (\d+\:\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de ;\s:
        [/(\d+\;\d+)\/(\d+\:\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de ;/:
        // Separadores con Lineas- TerminaL- Parejas-
        [/(Linea-\d+\-\d+) (\d+\-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Lineas-
        [/(L-\d+\-\d+) (L-\d+\-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Lineas-
        [/(L-\d+\-\d+) (T-\d+\-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Lineas-
        [/(Linea-\d+\,\d+) (Parejas,\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Lineas-
        [/(Linea-\d+\-\d+) (\d+\.\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Lineas-
        [/(Linea-\d+\-\d+) (\d+\=\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Lineas-
        [/(Linea-\d+\-con-\d+) (\d+\-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Lineas-
        [/(Linea-\d+\-con-\d+) (\d+\-con-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Lineas-
        [/(Linea-\d+\-con-\d+) (TerminaL-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Lineas-
        [/(Linea-\d+\-con-\d+) (Parejas-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Lineas-#
        [/(TerminaL-\d+\-\d+) (\d+\-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de TerminaL-
        [/(T-\d+\-\d+) (T-\d+\-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de TerminaL-
        [/(TerminaL-\d+\=\d+) (\d+\=\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de TerminaL-
        [/(TerminaL-\d+\=\d+) (Parejas\=\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de TerminaL-
        [/(TerminaL-\d+\-\d+) (\d+\-con-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de TerminaL-
        [/(Parejas-\d+) (\d+\-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Parejas-
        [/(Parejas-de \d+) (\d+\-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Parejas-
        [/(Parejas-\d+) (Linea-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Parejas-
        [/(Parejas-de \d+) (Linea-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Parejas-
        [/(Parejas-\d+) (TerminaL-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Parejas-
        [/(Parejas-de \d+) (TerminaL-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Parejas-
        [/(Parejas=\d+) (\d+\=\d+)/mg, '$1\n$2'], // Manda para Abajo los # que siguen de Parejas-
        [/(Parejas=\d+) (Linea-\d+\=\d+)/mg, '$1\n$2'], // Manda para Abajo los # que siguen de Parejas-
        [/(Parejas=\d+) (TerminaL-\d+\=\d+)/mg, '$1\n$2'], // Manda para Abajo los # que siguen de Parejas-
        [/^(\d+\:\d+)\s+(\d+\:\d+)/mg, '$1\n$2'],
        [/^(\d+\:\d+)\s*(\d+\:\d+)/mg, '$1\n$2'],
        [/^([0-9]+\:[0-9]+)\s+([0-9]+\:[0-9]+)/g, '$1\n$2'],
        [/(sms\s*-?\s*)(.*)/gi, '$1\n$2'],
        [/sms(\s+)(\d+.+)/g, 'sms$1\n$2'],
        //[/sms(\s+)(Pareja|Linea|Terminal.+)/gi, 'sms$1\n$2'],
        //[/Pareja-\d+(\s+)sms/g, 'Pareja-\d+$1\nsms'],
        // Agrega más expresiones aquí según necesites
    ];

    // Procesar solo estas expresiones múltiples veces
    for (let i = 0; i < numeroIteraciones; i++) {
        expresionesMultiples.forEach(([regex, replacement]) => {
            resultado = resultado.replace(regex, replacement);
        });
    }

    return resultado;
}

function procesarPatronesUnaVez(texto) {
    // Asegurarse que el texto esté en trim antes de empezar
    texto = texto.trim();

    // PRIMERO: Procesar los patrones específicos que deben ir primero
    texto = texto.replace(/(\d+(?:[-.+=,]+\d+))\/([\s]*)sms/gi, '$1\nsms');
    texto = texto.replace(/(\d+(?:[-.+=,/ ]+\d+))[\s/]+sms/gi, '$1\nsms');
    texto = texto.replace(/(\d+(?:[-.+=,/ ]+\d+))[\s/]+(\w+)(?:\s+sms)/gi, '$1\n$2\nsms');
    texto = texto.replace(/^\[.*?\]\s+([^\s]+)\s+(\d+)%\s+(Grupo\s+[^:]+):\s*/gm, 'SMS:\n');
    texto = texto.replace(/\[.+?\]\s+[a-zA-Z0-9 ]*:\s/gm, 'SMS:\n');
    texto = texto.replace(/\s*([-.:,;])\s*([PaL])/g, '$1$2');
    texto = texto.replace(/([PaL])\s*([-.:,;])\s*/g, '$1$2');
    // Normalizar todos los separadores comunes
    texto = texto.replace(/\s+(?:von|com|cin|vin|con|c|de)\s+/gi, 'con');
    texto = texto.replace(/--con--/g, '-con-');
    texto = texto.replace(/-+con-+/g, '-con-');
    texto = texto.replace(/(sms\s*-?\s*)(.*)/gi, '$1\n$2');
    // Reemplazar letras con tilde por sus equivalentes sin tilde
    texto = texto.replace(/á/g, 'a');
    texto = texto.replace(/é/g, 'e');
    texto = texto.replace(/í/g, 'i');
    texto = texto.replace(/ó/g, 'o');
    texto = texto.replace(/ú/g, 'u');
    // Reemplazar letras con tilde mayúsculas por sus equivalentes sin tilde
    texto = texto.replace(/Á/g, 'A');
    texto = texto.replace(/É/g, 'E');
    texto = texto.replace(/Í/g, 'I');
    texto = texto.replace(/Ó/g, 'O');
    texto = texto.replace(/Ú/g, 'U');
    // Reemplazar la letra "ñ" por "n"
    texto = texto.replace(/ñ/g, 'n');
    // Reemplazar la letra "Ñ" por "N"
    texto = texto.replace(/Ñ/g, 'N');
    // Eliminar espacios alrededor de los símbolos (=, -, :, , ;)
    //texto = texto.replace(/(\d+)\s*([=:\-,;])\s*(\d+)/g, '$1$2$3');
    // Reemplazar * + _ ¨ ^ = con -
    texto = texto.replace(/[\*\+\_\¨\^\=\']/g, '-');
    // 1. Reducir múltiples guiones (`---`) a un solo guion (`-`)
    texto = texto.replace(/-{2,}/g, '-');
    // 2. Reducir múltiples comas (`,,,`) a una sola coma (`,`)
    texto = texto.replace(/,{2,}/g, ',');
    // 3. Reducir múltiples puntos y comas (`;;;`) a un solo punto y coma (`;`)
    texto = texto.replace(/;{2,}/g, ';');
    // 4. Reducir múltiples dos puntos (`:::`) a un solo dos puntos (`:`)
    // texto = texto.replace(/:{2,}/g, ':');
    // 5. Reducir múltiples guiones bajos (`___`) a un solo guion bajo (`_`)
    texto = texto.replace(/_{2,}/g, '_');
    // 6. Reducir múltiples símbolos de intercalación (`^^^`) a un solo símbolo (`^`)
    texto = texto.replace(/\^{2,}/g, '^');
    // 7. Reducir múltiples diéresis (`¨¨¨`) a una sola diéresis (`¨`)
    texto = texto.replace(/¨{2,}/g, '¨');
    // 8. Reducir múltiples espacios en blanco a un solo espacio
    texto = texto.replace(/\s{2,}/g, ' ');

    // Limpiar puntuación y espacios extra
    texto = texto.replace(/(\d+)[,.\s]*-*con-*[,.\s]*(\d+)/gi, '$1-con$2');
    texto = texto.replace(/^[Ll]-(\d+)/gm, 'L-$1');
    texto = texto.replace(/(?<!\d)(\d)(?!\d)/g, '0$1');
    // Resto del procesamiento...
    texto = texto.replace(/\b(?:con|c)\s*\b/gi, '-con-');
    texto = texto.replace(/[-\s]+con[-\s]+/g, '-con-');
    texto = texto.replace(/(?:\s|\W)+aL(?:\s|\W)+/g, '-aL-');
    texto = texto.replace(/(\d+)\s*aL\s*(\d+)/gi, '$1-aL-$2');
    texto = texto.replace(/\b(?:con|c)\b/gi, '-con-');

    // Procesamiento de palabras específicas
    texto = texto.replace(/(\d+)([a-zA-Z]+)/g, '$1 $2');
    texto = texto.replace(/([a-zA-Z])([0-9]+)/g, '$1-$2');
    texto = texto.replace(/Ter([a-zA-Z]*)/gi, 'TerminaL');
    texto = texto.replace(/TerminaL /gi, 'TerminaL-');
    texto = texto.replace(/Lin([a-zA-Z]*)/gi, 'Linea');
    texto = texto.replace(/Linea /gi, 'Linea-');
    texto = texto.replace(/Línea /gi, 'Linea-');
    texto = texto.replace(/Pare([a-zA-Z]*)/gi, 'Pareja');
    texto = texto.replace(/Parejas /gi, 'Pareja-');

    // Limpieza final
    texto = texto.replace(/c(?:on)?\W*(\d+)(\s*)(\W+)/g, 'con-$1\n$2');
    texto = texto.replace(/^(?!(?:d|p|l|t|s|c|o|no|#|\d))\w+\s*|[-=./]+\s*$/gim, '');
    texto = texto.replace(/(?<!\d)(?<![a-zA-Z])(\d)(?!\d)/g, '0$1');
    texto = texto.replace(/ToTaL\W\d+\$*/g, '');
    texto = texto.replace(/(\d+-(?:al|con)-\d+(?:-con-\d+)?)/g, '$1');

    // Procesar las líneas con 'de'
    texto = texto.trim().split('\n').map(line => {
        if (line.includes(' de ')) {
            return line.replace(' de ', 'con');
        }
        return line;
    }).join('\n');

    return texto.trim();
}

// Función reprocesarPatrones optimizada
function reprocesarPatrones() {
    try {
        let mensajeVenta = document.getElementById('mensajeVenta').value;
        const lineas = mensajeVenta.split('\n').filter(linea => linea.trim());
        let mensajesInvalidos = [];
        let mensajesValidos = [];
        let totalVenta = 0;
        let premioEncontrado = 0;
        const montosPorNumero = {};
        const numerosCriticos = [];
        let numeroGanador = obtenerNumeroGanador();

        // Validar número ganador
        if (!numeroGanador && !mensajeVenta.toUpperCase().startsWith('TOTAL:')) {
            mensajesInvalidos.push('Por favor ingrese el número ganador', 'error');
            numeroGanador = null;
            // return false;
        }

        // Función auxiliar para procesar montos por número
        function procesarMontoNumero(jugadas) {
            Object.keys(jugadas).forEach((numero)=> {
                if (!isNaN(numero) && !isNaN(jugadas[numero])) {
                    montosPorNumero[numero] = (montosPorNumero[numero] || 0) + jugadas[numero];
                    if (montosPorNumero[numero] > 5000 && !numerosCriticos.includes(numero)) {
                        numerosCriticos.push(numero);
                    }
                }
            })
        }

        const nuevasLineas = lineas.map(linea => {
            linea = linea.trim();
            if (!linea) return linea;

            if (linea.toUpperCase() === 'SMS') return linea;

            if (esJugadaValida(linea)) {
                let resultado;
                //linea = linea.toLowerCase(); Cambia de Mayuscula a Minuscula todo
                try {
                    // Verificar primero si es un número solitario de 3 o más dígitos
                        if (/^\d{3,}$/.test(linea)) {
                            console.log('Número solitario detectado: ' + linea);
                            mensajesInvalidos.push(linea + ' (número solitario no válido)');
                            return linea;
                    } else if (patrones.linea.test(linea)) {
                        console.log('jugada linea');
                        resultado = procesarLineaConGanador(linea, numeroGanador);
                        if (resultado) {
                            totalVenta += resultado.totalVenta;
                            procesarMontoNumero(resultado.jugadas);
                        }
                    } else if (patrones.lineaConY.test(linea)) {
                        console.log('jugada linea con Y');
                        resultado = procesarLineaConYGanador(linea, numeroGanador);
                        if (resultado) {
                            totalVenta += resultado.totalVenta;
                            procesarMontoNumero(resultado.jugadas);
                        }
                    } else if (patrones.terminal.test(linea) || patrones.terminalMultiple.test(linea) ){
                        console.log('jugada terminal');
                        resultado = procesarTerminalesConGanador(linea, numeroGanador);
                        if (resultado) {
                            totalVenta += resultado.totalVenta;
                            procesarMontoNumero(resultado.jugadas);
                        }
                    } else if (patrones.pareja.test(linea)) {
                        console.log('jugada pareja');
                        resultado = procesarParejasConGanador(linea, numeroGanador);
                        if (resultado) {
                            totalVenta += resultado.totalVenta;
                            procesarMontoNumero(resultado.jugadas);
                        }
                    } else if (patrones.terminalAl.test(linea)) {
                        console.log('jugada terminal Al');
                        resultado = procesarTerminalAl(linea, numeroGanador);
                        if (resultado) {
                            totalVenta += resultado.totalVenta;
                            procesarMontoNumero(resultado.jugadas);
                        }
                    } else if (patrones.parejasAl.test(linea)) {
                        console.log('jugada parejas al');
                        resultado = procesarParejasAlConGanador(linea, numeroGanador);
                        if (resultado) {
                            totalVenta += resultado.totalVenta;
                            procesarMontoNumero(resultado.jugadas);
                        }
                    } else if (patrones.numeroAlNumero.test(linea)) {
                        console.log('jugada numero al');
                        resultado = procesarNumeroAlNumero(linea, numeroGanador);
                        if (resultado) {
                            totalVenta += resultado.totalVenta;
                            procesarMontoNumero(resultado.jugadas);
                        }
                    } else {
                        resultado = procesarGenerica(linea, numeroGanador);
                        console.log(resultado);
                        if (resultado) {
                            totalVenta += resultado.totalVenta;
                            procesarMontoNumero(resultado.jugadas);
                            console.log('procesado');
                        }
                    }

                    if (resultado) {
                        mensajesValidos.push(linea);
                        premioEncontrado += resultado.premioEncontrado || 0;
                    } else {
                        mensajesInvalidos.push(linea);
                    }
                    return linea;
                } catch (error) {
                    mensajesInvalidos.push(linea);
                    return linea;
                }
            } else {
                mensajesInvalidos.push(linea);
                return linea;
            }
        });

        // Mostrar alerta si hay números que exceden 5000
        if (numerosCriticos.length > 0) {
            const mensaje = `¡ADVERTENCIA!\nLos siguientes números exceden el límite de 5,000:\n${
                numerosCriticos.map(num => `Número ${num}: ${montosPorNumero[num].toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`).join('\n')
            }`;
            alert(mensaje);
        }

        // Actualizar el campo de entrada
        document.getElementById('mensajeVenta').value = nuevasLineas.join('\n');

        // Manejar mensajes no procesados
        const mensajesNoProcesadosSection = document.getElementById('mensajesNoProcesadosSection');
        if (mensajesInvalidos.length > 0) {
            mensajesNoProcesadosSection.style.display = 'block';
            document.getElementById('mensajesNoProcesadosTextarea').value = mensajesInvalidos.join('\n');

            const mensajesInteractivosExistente = mensajesNoProcesadosSection.querySelector('.mensajes-interactivos');
            if (mensajesInteractivosExistente) {
                mensajesInteractivosExistente.remove();
            }

            const mensajesInteractivos = crearMensajesInteractivos(mensajesInvalidos);
            mensajesNoProcesadosSection.appendChild(mensajesInteractivos);
            mostrarMensaje('Hay mensajes inválidos. Haga clic en ellos para localizarlos.', 'error');
        } else {
            mensajesNoProcesadosSection.style.display = 'none';
            document.getElementById('mensajesNoProcesadosTextarea').value = '';
        }

        mostrarMensaje('Patrones reprocesados', 'success');
        // Mostrar resultados finales
        let mensaje;

        if (numeroGanador)
            mensaje = `Total Venta: ${totalVenta.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} - Número Ganador: ${numeroGanador} - Premio Total: ${premioEncontrado}`;
        else
            mensaje = `Total Venta: ${totalVenta.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
        document.getElementById('totalVenta').innerText = mensaje;

        return {
            mensajesValidos,
            totalVenta,
            mensajesInvalidos,
            premioEncontrado
        };

    } catch (error) {
        console.error('Error al reprocesar patrones:', error);
        mostrarMensaje('Error al reprocesar patrones', 'error');
    }

}

// Agregar después de la función mostrarMensaje()
function resaltarMensaje(mensaje) {
    const textarea = document.getElementById('mensajeVenta');
    const texto = textarea.value;
    const indice = texto.indexOf(mensaje);

    if (indice !== -1) {
        // Hacer scroll al textarea principal
        textarea.focus();

        // Seleccionar el texto específico
        textarea.setSelectionRange(indice, indice + mensaje.length);

        // Asegurar que el texto seleccionado es visible
        const lineHeight = 20; // altura aproximada de línea
        const lineas = texto.substr(0, indice).split('\n').length;
        textarea.scrollTop = (lineas - 1) * lineHeight;
    }
}

function crearMensajesInteractivos(mensajes) {
    const contenedor = document.createElement('div');
    contenedor.className = 'mensajes-interactivos';

    mensajes.forEach(mensaje => {
        const mensajeElement = document.createElement('div');
        mensajeElement.className = 'mensaje-interactivo';

        // Separar el mensaje de error del mensaje original si existe
        const [mensajeOriginal, mensajeError] = mensaje.split('\n⚠️');

        // Crear el contenido principal del mensaje
        const contenidoPrincipal = document.createElement('div');
        contenidoPrincipal.textContent = mensajeOriginal;
        mensajeElement.appendChild(contenidoPrincipal);

        // Si hay mensaje de error, agregar con estilo destacado
        if (mensajeError) {
            const errorElement = document.createElement('div');
            errorElement.className = 'error-detalle';
            errorElement.textContent = '⚠️' + mensajeError;
            errorElement.style.color = 'red';
            errorElement.style.fontSize = '0.9em';
            errorElement.style.marginTop = '5px';
            mensajeElement.appendChild(errorElement);
        }

        mensajeElement.onclick = () => resaltarMensaje(mensajeOriginal);
        contenedor.appendChild(mensajeElement);
    });

    return contenedor;
}

// Parte 5: Gestión de Fondos y Mensajes
// 1. Primero, agregar un event listener cuando se carga la página
document.addEventListener('DOMContentLoaded', function () {

    // 2. Buscar el botón y agregar el event listener
    const btnAgregarMensaje = document.querySelector('button[onclick="agregarMensaje()"]');

    if (btnAgregarMensaje) {
        // 3. Agregar un nuevo event listener además del onclick
        btnAgregarMensaje.addEventListener('click', function (e) {
            // La función original se ejecutará por el onclick
        });
    } else {
        console.error('No se encontró el botón de agregar mensaje');
    }
});

// Al cargar la página, asegurarnos de que el botón use la nueva función
document.addEventListener('DOMContentLoaded', function () {
    const btnAgregarMensaje = document.querySelector('.button-group .btn-success');
    if (btnAgregarMensaje) {
        // Remover el onclick del HTML
        btnAgregarMensaje.removeAttribute('onclick');
        // Agregar el nuevo event listener
        btnAgregarMensaje.addEventListener('click', window.agregarMensaje);
    }
});

function guardarMensajesNoProcesados() {
    const mensajesCorregidos = document.getElementById('mensajesNoProcesadosTextarea').value.trim().split('\n');

    // Limpiar los mensajes corregidos de la lista de inválidos
    mensajesInvalidos = mensajesInvalidos.filter(mensaje => !mensajesCorregidos.includes(mensaje));

    // Actualizar la visualización
    const mensajesNoProcesadosSection = document.getElementById('mensajesNoProcesadosSection');
    if (mensajesInvalidos.length > 0) {
        const mensajesFormateados = mensajesInvalidos.map(linea => {
            const numeros = linea.split(/[\s\-\/\*\+,;:._¨\^=]+/).slice(0, -1)
                .map(n => parseInt(n))
                .filter(n => !isNaN(n));

            const numerosMayores = numeros.filter(n => n > 100);

            if (numerosMayores.length > 0) {
                let mensajeError = `${linea}\n`;
                mensajeError += `⚠️ Números mayores a 100 encontrados: `;
                mensajeError += numerosMayores.map(num =>
                    `${num} (posición ${numeros.indexOf(num) + 1})`
                ).join(', ');
                return mensajeError;
            }
            return linea;
        });

        mensajesNoProcesadosSection.style.display = 'block';
        document.getElementById('mensajesNoProcesadosTextarea').value = mensajesFormateados.join('\n\n'); // Agregar línea extra entre mensajes

        // Actualizar mensajes interactivos
        const mensajesInteractivosExistente = mensajesNoProcesadosSection.querySelector('.mensajes-interactivos');
        if (mensajesInteractivosExistente) {
            mensajesInteractivosExistente.remove();
        }
        const mensajesInteractivos = crearMensajesInteractivos(mensajesFormateados);
        mensajesNoProcesadosSection.appendChild(mensajesInteractivos);
    } else {
        mensajesNoProcesadosSection.style.display = 'none';
        document.getElementById('mensajesNoProcesadosTextarea').value = '';
    }
}

// También agregar esta función de limpieza
function limpiarMensajesInvalidos() {
    mensajesInvalidos = [];
    const mensajesNoProcesadosSection = document.getElementById('mensajesNoProcesadosSection');
    mensajesNoProcesadosSection.style.display = 'none';
    document.getElementById('mensajesNoProcesadosTextarea').value = '';

    const mensajesInteractivosExistente = mensajesNoProcesadosSection.querySelector('.mensajes-interactivos');
    if (mensajesInteractivosExistente) {
        mensajesInteractivosExistente.remove();
    }
}

// Parte 6: Gestión de Jefes
function agregarJefe() {
    const nombre = document.getElementById('nombreJefe').value;
    const precioVenta = document.getElementById('precioVentaJefe').value ? parseFloat(document.getElementById('precioVentaJefe').value) : 0;
    const porcentaje = document.getElementById('porcentajeJefe').value ? parseFloat(document.getElementById('porcentajeJefe').value) : 0;

    if (!nombre) {
        alert('Por favor, ingrese al menos el nombre del jefe.');
        return;
    }

    jefes.push({
        nombre,
        precioVenta,
        porcentaje,
        ventas: []
    });

    document.getElementById('nombreJefe').value = '';
    document.getElementById('precioVentaJefe').value = '';
    document.getElementById('porcentajeJefe').value = '';

    actualizarListaJefes();
    actualizarSelectJefes();
    mostrarMensaje('Jefe agregado exitosamente', 'success');
}

function actualizarListaJefes() {
    const jefeSelect = document.getElementById('jefeSelect');
    const jefeInfo = document.getElementById('jefeInfo');

    // Limpiar completamente las listas
    if (jefeSelect) jefeSelect.innerHTML = '';
    if (jefeInfo) jefeInfo.innerHTML = '';

    // Si no hay jefes, mostrar mensaje apropiado y salir
    if (!jefes || jefes.length === 0) {
        if (jefeInfo) jefeInfo.innerHTML = '<p>No hay jefes registrados</p>';
        return;
    }

    jefes.forEach((jefe, index) => {
        // Agregar opción al select
        if (jefeSelect) {
            jefeSelect.innerHTML += `<option value="${index}">${jefe.nombre}</option>`;
        }

        jefeInfo.innerHTML += `
            <div class="jefe-item">
                <div class="jefe-header">
                    <span class="jefe-nombre"
                          onmouseover="mostrarTooltip(this, 'jefe', ${index})"
                          onmouseout="ocultarTooltip()">
                        <strong>${jefe.nombre}</strong>
                    </span>
                    <button onclick="toggleBotonesJefe(${index})" class="btn-toggle">
                        Mostrar/Ocultar
                    </button>
                </div>
                <div id="botones-jefe-${index}" class="jefe-buttons" style="display: none;">
                    <button onclick="verVentasJefe(${index}, 'dia')">Ver Ventas Día</button>
                    <button onclick="verVentasJefe(${index}, 'noche')">Ver Ventas Noche</button>
                    <button onclick="crearSelectorFechas(${index})" class="btn-primary">Ver Ventas por Fecha</button>
                    <button onclick="editarJefe(${index})">Editar</button>
                    <button onclick="eliminarJefe(${index})" class="btn-danger">Eliminar</button>
                </div>
            </div>
        `;
    });

    // Estilos para los elementos de jefe (mantenemos estos estilos)
    if (!document.getElementById('tooltip-jefe-styles')) {
        const style = document.createElement('style');
        style.id = 'tooltip-jefe-styles';
        style.textContent = `
            .jefe-nombre {
                cursor: help;
                position: relative;
            }
            
            .jefe-item {
                background-color: #f5f5f5;
                padding: 15px;
                margin-bottom: 10px;
                border-radius: 4px;
            }
            
            .dark-mode .jefe-item {
                background-color: #444;
            }
            
            .jefe-buttons {
                margin-top: 10px;
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
            }
        `;
        document.head.appendChild(style);
    }
}

function actualizarSelectJefes() {
    const jefeVendedorSelect = document.getElementById('jefeVendedorSelect');
    if (!jefeVendedorSelect) return;

    jefeVendedorSelect.innerHTML = '';
    jefes.forEach((jefe, index) => {
        jefeVendedorSelect.innerHTML += `<option value="${index}">${jefe.nombre}</option>`;
    });
}

function updateJefeInfo() {
    const jefeSelect = document.getElementById('jefeSelect');
    const jefeInfo = document.getElementById('jefeInfo');

    if (!jefeSelect || !jefeInfo || jefes.length === 0) {
        jefeInfo.innerHTML = '<p>No hay jefes registrados</p>';
        return;
    }

    const jefeIndex = jefeSelect.value;
    const jefe = jefes[jefeIndex];

    if (!jefe) return;

    // Crear el tooltip con la información del jefe
    const tooltipInfo = `
        Precio de Venta: ${jefe.precioVenta}
        Porcentaje: ${jefe.porcentaje}%
    `;

    jefeInfo.innerHTML = `
        <div class="jefe-item">
            <div class="jefe-header">
                <span class="jefe-nombre"
                      title="${tooltipInfo.replace(/\n/g, ' - ')}"
                      onmouseover="mostrarTooltipJefe(this, ${jefeIndex})"
                      onmouseout="ocultarTooltipJefe(this)">
                    <strong>${jefe.nombre}</strong>
                </span>
                <div class="jefe-tooltip" id="tooltip-jefe-${jefeIndex}">
                    <div class="tooltip-content">
                        <p><strong>Precio de Venta:</strong> ${jefe.precioVenta}</p>
                        <p><strong>Porcentaje:</strong> ${jefe.porcentaje}%</p>
                    </div>
                </div>
                <button onclick="toggleBotonesJefe(${jefeIndex})" class="btn-toggle">
                    Mostrar/Ocultar
                </button>
            </div>
            <div id="botones-jefe-${jefeIndex}" class="jefe-buttons" style="display: none;">
                <button onclick="verVentasJefe(${jefeIndex}, 'dia')">Ver Ventas Día</button>
                <button onclick="verVentasJefe(${jefeIndex}, 'noche')">Ver Ventas Noche</button>
                <button onclick="editarJefe(${jefeIndex})">Editar</button>
                <button onclick="eliminarJefe(${jefeIndex})" class="btn-danger">Eliminar</button>
            </div>
        </div>
    `;
}

function toggleBotonesJefe(index) {
    const botonesDiv = document.getElementById(`botones-jefe-${index}`);
    if (botonesDiv) {
        botonesDiv.style.display = botonesDiv.style.display === 'none' ? 'flex' : 'none';
    }
}

function eliminarJefe(jefeIndex) {
    try {
        const jefe = jefes[jefeIndex];
        if (!jefe) {
            mostrarMensaje('Error: Jefe no encontrado', 'error');
            return;
        }

        // Verificar si hay vendedores asignados
        const vendedoresAsignados = vendedores.filter(v => v.jefes.includes(jefe.nombre));
        if (vendedoresAsignados.length > 0) {
            if (!confirm(`Este jefe tiene ${vendedoresAsignados.length} vendedor(es) asignado(s). ¿Está seguro de que desea eliminarlo? Los vendedores quedarán sin este jefe asignado.`)) {
                return;
            }
            // Actualizar los vendedores que tenían este jefe
            vendedores.forEach(vendedor => {
                vendedor.jefes = vendedor.jefes.filter(j => j !== jefe.nombre);
            });
        } else {
            if (!confirm(`¿Está seguro de que desea eliminar al jefe ${jefe.nombre}?`)) {
                return;
            }
        }

        // Eliminar el jefe
        jefes.splice(jefeIndex, 1);

        // Actualizar todas las listas e interfaces
        actualizarListaJefes();
        actualizarSelectJefes();

        // Limpiar cualquier residuo en la interfaz
        const jefeInfo = document.getElementById('jefeInfo');
        if (jefeInfo && jefes.length === 0) {
            jefeInfo.innerHTML = '<p>No hay jefes registrados</p>';
        }

        mostrarMensaje('Jefe eliminado exitosamente', 'success');

        // Guardar los cambios si estás usando localStorage
        if (typeof guardarDatos === 'function') {
            guardarDatos();
        }
    } catch (error) {
        console.error('Error al eliminar jefe:', error);
        mostrarMensaje('Error al eliminar el jefe', 'error');
    }
}

function editarJefe(jefeIndex) {
    const jefe = jefes[jefeIndex];
    if (!jefe) {
        alert('Error: Jefe no encontrado');
        return;
    }

    const nuevoPrecioVenta = parseFloat(prompt(`Precio de Venta actual: ${jefe.precioVenta}\nIngrese el nuevo Precio de Venta:`));
    const nuevoPorcentaje = parseFloat(prompt(`Porcentaje actual: ${jefe.porcentaje}%\nIngrese el nuevo Porcentaje:`));

    if (!isNaN(nuevoPrecioVenta)) {
        jefe.precioVenta = nuevoPrecioVenta;
    }
    if (!isNaN(nuevoPorcentaje)) {
        jefe.porcentaje = nuevoPorcentaje;
    }

    actualizarListaJefes();
    updateJefeInfo();
    mostrarMensaje('Jefe actualizado exitosamente', 'success');
}

function numeroAEmoji(numero) {
    const numStr = numero.toString().padStart(2, '0'); // Convierte el número en string
    const emojiNumeros = {
        '0': '0️⃣',
        '1': '1️⃣',
        '2': '2️⃣',
        '3': '3️⃣',
        '4': '4️⃣',
        '5': '5️⃣',
        '6': '6️⃣',
        '7': '7️⃣',
        '8': '8️⃣',
        '9': '9️⃣'
    };
    return numStr.split('').map(digito => emojiNumeros[digito]).join('');
}

function verVentasJefe(jefeIndex, horario) {
    console.log("=== INICIO DEPURACIÓN verVentasJefe ===");
    console.log("Parámetros recibidos - jefeIndex:", jefeIndex, "horario:", horario);
    const jefe = jefes[jefeIndex];
    console.log("Jefe seleccionado:", jefe);
    const fechaString = obtenerFechaFormateada();
    console.log("Fecha actual formateada:", fechaString);
    // Declarar la variable reporte al inicio de la función
    let reporte = "";
    
    // Obtener todas las ventas recientes para este horario, sin filtrar por fecha
    const ventasRecientes = vendedores
        .flatMap(v => v.ventas)
        .filter(v => v.horario === horario && v.numeroGanador !== null)
        .sort((a, b) => {
            // Ordenar por fecha de más reciente a más antigua
            // Intentar convertir las fechas a objetos Date para una comparación correcta
            let dateA, dateB;
            
            // Primero intentar con formato DD/MM/YYYY
            if (a.fecha.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
                const [diaA, mesA, anioA] = a.fecha.split('/');
                dateA = new Date(anioA, mesA - 1, diaA);
            } 
            // Después intentar con formato YYYY-MM-DD
            else if (a.fecha.match(/^\d{4}-\d{2}-\d{2}$/)) {
                dateA = new Date(a.fecha);
            }
            
            if (b.fecha.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
                const [diaB, mesB, anioB] = b.fecha.split('/');
                dateB = new Date(anioB, mesB - 1, diaB);
            } else if (b.fecha.match(/^\d{4}-\d{2}-\d{2}$/)) {
                dateB = new Date(b.fecha);
            }
            
            // Si las fechas son válidas, compararlas
            if (dateA && dateB) {
                return dateB - dateA;
            }
            
            // Si no se pudieron convertir, comparar como strings (menos fiable)
            return b.fecha.localeCompare(a.fecha);
        });

    // Obtener el número ganador de la venta más reciente
    const numeroGanador = ventasRecientes.length > 0 ? ventasRecientes[0].numeroGanador : null;
    
    // Obtener la fecha de la venta más reciente para mostrarla en el reporte
    const fechaVentaReciente = ventasRecientes.length > 0 ? ventasRecientes[0].fecha : fechaString;
    
    // Formatear la fecha para mostrarla en DD/MM/YYYY
    let fechaMostrar = fechaVentaReciente;
    if (fechaVentaReciente.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [anio, mes, dia] = fechaVentaReciente.split('-');
        fechaMostrar = `${dia}/${mes}/${anio}`;
    }

    // Ahora construir el reporte
    reporte = `Reporte de Ventas - ${jefe.nombre}\n`;
    reporte += `Horario: ${horario === 'dia' ? 'Día' : 'Noche'}`;
    reporte += ` | Fecha: ${fechaMostrar}`;

    if (numeroGanador !== null) {
        reporte += ` | Número: ${numeroAEmoji(numeroGanador)}`;
    }

    reporte += '\n----------------------------------------\n\n';

    let totalVenta = 0;
    let totalPremios = 0;
    let totalPagoPremios = 0;
    let totalEntrega = 0;

    const vendedoresDelJefe = vendedores.filter(v => v.jefes.includes(jefe.nombre));

    if (vendedoresDelJefe.length === 0) {
        reporte += 'No hay vendedores asignados a este jefe.\n';
    } else {
        // Procesar cada vendedor individualmente
        vendedoresDelJefe.forEach(vendedor => {
            // Obtener solo las ventas de este vendedor para el horario especificado
            // y para la misma fecha que la venta más reciente encontrada
            const ventasHorario = vendedor.ventas.filter(v => 
                v.horario === horario && v.fecha === fechaVentaReciente
            );
            
            // Calcular totales para este vendedor específico
            let ventaVendedor = 0;
            let premiosVendedor = 0;
            
            ventasHorario.forEach(venta => {
                ventaVendedor += venta.totalVenta;
                premiosVendedor += venta.premio;
            });
            
            // Sumar a los totales generales
            totalVenta += ventaVendedor;
            totalPremios += premiosVendedor;
            
            // Aplicar el precio de venta del jefe o del vendedor
            const precioVentaAplicar = jefe.precioVenta || vendedor.precioVenta;
            const pagoPremios = premiosVendedor * precioVentaAplicar;
            
            // Calcular la ganancia y entrega usando el porcentaje del jefe o del vendedor
            const porcentajeAplicar = jefe.porcentaje || vendedor.porcentaje;
            const gananciaVendedor = ventaVendedor * (porcentajeAplicar / 100);
            const entregaVendedor = ventaVendedor - gananciaVendedor;
            
            // Actualizar totales
            totalPagoPremios += pagoPremios;
            totalEntrega += entregaVendedor;
        });

        if (totalVenta > 0) {
            // Usar espacios para alinear como una tabla
            const etiquetas = ['Venta Total:', 'Premio Total:', 'Pago Total:', 'Entrega Total:', 'Ganancia:'];
            const valores = [
                Math.round(totalVenta).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                Math.round(totalPremios).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                Math.round(totalPagoPremios).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                Math.round(totalEntrega).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                Math.round(totalEntrega - totalPagoPremios).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
            ];
            
            // Encontrar la etiqueta más larga para calcular el padding
            const longitudMaxima = Math.max(...etiquetas.map(e => e.length));
            
            // Crear cada línea con alineación
            etiquetas.forEach((etiqueta, index) => {
                // Padding a la derecha para alinear valores
                const espacios = ' '.repeat(longitudMaxima - etiqueta.length + 5);
                reporte += `${etiqueta}${espacios}${valores[index]}\n`;
            });
        } else {
            reporte += `No hay ventas registradas para este horario y fecha.\n`;
        }
    }

    // Crear un modal personalizado en lugar de usar alert
    const modalContainer = document.createElement('div');
    modalContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background-color: ${document.body.classList.contains('dark-mode') ? '#333' : '#fff'};
        color: ${document.body.classList.contains('dark-mode') ? '#fff' : '#000'};
        padding: 20px;
        border-radius: 8px;
        max-width: 80%;
        max-height: 80%;
        overflow-y: auto;
        position: relative;
    `;

    const preElement = document.createElement('pre');
    preElement.style.cssText = `
        margin: 0;
        white-space: pre-wrap;
        font-family: monospace;
    `;
    preElement.textContent = reporte;

    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 20px;
    `;

    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copiar';
    copyButton.style.cssText = `
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        background-color: #4CAF50;
        color: white;
        cursor: pointer;
    `;
    // Solo reemplaza la función onclick del botón existente
copyButton.onclick = async () => {
    try {
        // Copiar como Texto primero
        await navigator.clipboard.writeText(reporte);
        
        // Crear imagen en canvas con tamaño dinámico basado en el contenido
        const lines = reporte.split('\n');
        const lineHeight = 25; // Altura de cada línea en píxeles
        const padding = 40; // Padding alrededor del texto
        
        // Calcular dimensiones basadas en el contenido
        const canvasWidth = 600; // Ancho fijo más amplio
        const canvasHeight = (lines.length * lineHeight) + (padding * 2);
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        
        // Fondo blanco o gris claro según el modo
        ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#333' : '#f5f5f5';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Texto con mejor contraste
        ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#fff' : '#000';
        ctx.font = '16px monospace'; // Usar fuente monoespaciada para alineación
        
        // Dibujar cada línea del reporte
        lines.forEach((line, i) => {
            ctx.fillText(line, padding, padding + (i * lineHeight));
        });
        
        // Convertir canvas a Blob
        canvas.toBlob(async (blobImage) => {
            if (blobImage) {
                try {
                    // Intentar primero con navigator.clipboard.write
                    if (typeof ClipboardItem !== 'undefined') {
                        const clipboardItems = [
                            new ClipboardItem({
                                'text/plain': new Blob([reporte], {type: 'text/plain'}),
                                'image/png': blobImage
                            })
                        ];
                        await navigator.clipboard.write(clipboardItems);
                    } else {
                        // Alternativa: solo copiar la imagen en navegadores que no soportan ClipboardItem
                        const img = canvas.toDataURL('image/png');
                        const tempLink = document.createElement('a');
                        tempLink.href = img;
                        tempLink.download = `Reporte_${jefe.nombre}_${horario}.png`;
                        tempLink.click();
                        
                        // Ya hemos copiado el texto, así que informamos al usuario
                        alert('El texto se ha copiado al portapapeles. La imagen se descargará automáticamente.');
                    }
                } catch (clipErr) {
                    console.error('Error al copiar imagen:', clipErr);
                    // Si falla, ofrecer descargar la imagen
                    const img = canvas.toDataURL('image/png');
                    const tempLink = document.createElement('a');
                    tempLink.href = img;
                    tempLink.download = `Reporte_${jefe.nombre}_${horario}.png`;
                    tempLink.click();
                    alert('El texto se ha copiado al portapapeles. La imagen se descargará automáticamente.');
                }
            }
        }, 'image/png');
        
        copyButton.textContent = 'Copiado!';
        setTimeout(() => copyButton.textContent = 'Copiar', 2000);
    } catch (err) {
        console.error('Error al copiar:', err);
        alert('Ocurrió un error al copiar: ' + err.message);
    }
};

    const acceptButton = document.createElement('button');
    acceptButton.textContent = 'Aceptar';
    acceptButton.style.cssText = `
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        background-color: #4CAF50;
        color: white;
        cursor: pointer;
    `;
    acceptButton.onclick = () => {
        document.body.removeChild(modalContainer);
    };

    buttonContainer.appendChild(copyButton);
    buttonContainer.appendChild(acceptButton);
    modalContent.appendChild(preElement);
    modalContent.appendChild(buttonContainer);
    modalContainer.appendChild(modalContent);
    document.body.appendChild(modalContainer);
}

function verVentasJefePorFecha(jefeIndex, fechaInicio, fechaFin, horario = null) {
    const jefe = jefes[jefeIndex];
    if (!jefe) {
        alert('Error: Jefe no encontrado');
        return;
    }
    
    console.log("Diagnóstico de fechas:");
    console.log("- fechaInicio original:", fechaInicio);
    console.log("- fechaFin original:", fechaFin);
    console.log("- horario seleccionado:", horario);

    // Usar la función global obtenerFechaFormateada
    const fechaInicioNormalizada = obtenerFechaFormateada(fechaInicio);
    const fechaFinNormalizada = obtenerFechaFormateada(fechaFin);

    console.log("- fechaInicio normalizada:", fechaInicioNormalizada);
    console.log("- fechaFin normalizada:", fechaFinNormalizada);

    if (!horario) {
        alert('Por favor seleccione un horario (Día o Noche)');
        return;
    }

    // Declarar la variable reporte al inicio de la función
    let reporte = "";
    
    // Buscar todas las ventas para encontrar número ganador del período seleccionado
    const vendedoresDelJefe = vendedores.filter(v => v.jefes.includes(jefe.nombre));
    
    // Función para verificar si una fecha está en el rango
    function esFechaEnRango(fechaVenta) {
        const fechaVentaNormalizada = obtenerFechaFormateada(fechaVenta);
        
        // Si las fechas de inicio y fin son iguales, solo verificar que coincida exactamente
        if (fechaInicioNormalizada === fechaFinNormalizada) {
            return fechaVentaNormalizada === fechaInicioNormalizada;
        }
        
        // Para comparar correctamente, convertir a objetos Date
        function convertirADate(fechaStr) {
            const [dia, mes, anio] = fechaStr.split('/').map(Number);
            return new Date(anio, mes - 1, dia);
        }
        
        const dateVenta = convertirADate(fechaVentaNormalizada);
        const dateInicio = convertirADate(fechaInicioNormalizada);
        const dateFin = convertirADate(fechaFinNormalizada);
        
        // Verificar si la fecha está en el rango
        return dateVenta >= dateInicio && dateVenta <= dateFin;
    }
    
    // Añadir depuración adicional para verificar el filtrado
    console.log("Verificando filtrado por horario:");
    console.log("- Horario buscado:", horario);
    
    // Obtener todas las ventas recientes para este horario
    const ventasRecientes = vendedoresDelJefe
        .flatMap(v => v.ventas)
        .filter(v => {
            const fechaCorrecta = esFechaEnRango(v.fecha);
            
            // Depuración para ver qué horarios están en los datos
            console.log(`Venta con horario: ${v.horario}, comparando con ${horario}`);
            
            // Asegurarse de que la comparación sea exacta
            const horarioCorrecto = v.horario === horario;
            
            // Si no coincide, mostrar más información para depuración
            if (fechaCorrecta && !horarioCorrecto) {
                console.log(`Fecha correcta pero horario incorrecto. Venta horario: "${v.horario}" vs buscado: "${horario}"`);
            }
            
            return fechaCorrecta && horarioCorrecto;
        })
        .sort((a, b) => {
            // Ordenar por fecha de más reciente a más antigua
            const fechaA = obtenerFechaFormateada(a.fecha);
            const fechaB = obtenerFechaFormateada(b.fecha);
            
            function convertirADate(fechaStr) {
                const [dia, mes, anio] = fechaStr.split('/').map(Number);
                return new Date(anio, mes - 1, dia);
            }
            
            const dateA = convertirADate(fechaA);
            const dateB = convertirADate(fechaB);
            
            return dateB - dateA;
        });

    console.log(`Se encontraron ${ventasRecientes.length} ventas para horario "${horario}"`);

    // Obtener el número ganador de la venta más reciente
    const numeroGanador = ventasRecientes.length > 0 ? ventasRecientes[0].numeroGanador : null;
    
    // Obtener la fecha más reciente para mostrar
    const fechaMostrar = fechaInicioNormalizada === fechaFinNormalizada ? 
        fechaInicioNormalizada : `${fechaInicioNormalizada} al ${fechaFinNormalizada}`;
    
    // Crear el encabezado del reporte
    reporte = `Reporte de Ventas - ${jefe.nombre}\n`;
    reporte += `Horario: ${horario === 'dia' ? 'Día' : (horario === 'noche' ? 'Noche' : 'No especificado')}`;
    reporte += ` | Fecha: ${fechaMostrar}`;

    if (numeroGanador !== null) {
        // Convertir a número entero para asegurar que no haya decimales
        const numeroGanadorEntero = parseInt(numeroGanador);
        // Verificar que sea un número entre 0 y 99 (números de la lotería tradicional)
        if (!isNaN(numeroGanadorEntero) && numeroGanadorEntero >= 0 && numeroGanadorEntero <= 99) {
            reporte += ` | Número: ${numeroAEmoji(numeroGanadorEntero)}`;
        } else {
            // Si no está en el formato esperado, mostrar el valor original
            reporte += ` | Número: ${numeroGanador}`;
        }
    }

    reporte += '\n----------------------------------------\n\n';

    let totalVenta = 0;
    let totalPremios = 0;
    let totalPagoPremios = 0;
    let totalEntrega = 0;

    if (vendedoresDelJefe.length === 0) {
        reporte += 'No hay vendedores asignados a este jefe.\n';
    } else {
        // Procesar cada vendedor individualmente
        vendedoresDelJefe.forEach(vendedor => {
            // Obtener solo las ventas de este vendedor para el horario y fecha especificados
            const ventasHorario = vendedor.ventas.filter(v => {
                const fechaCorrecta = esFechaEnRango(v.fecha);
                const horarioCorrecto = v.horario === horario;
                return fechaCorrecta && horarioCorrecto;
            });
            
            console.log(`Vendedor ${vendedor.nombre}: ${ventasHorario.length} ventas encontradas con horario ${horario}`);
            
            // Calcular totales para este vendedor específico
            let ventaVendedor = 0;
            let premiosVendedor = 0;
            
            ventasHorario.forEach(venta => {
                ventaVendedor += venta.totalVenta;
                premiosVendedor += venta.premio;
            });
            
            // Sumar a los totales generales
            totalVenta += ventaVendedor;
            totalPremios += premiosVendedor;
            
            // Aplicar el precio de venta del jefe o del vendedor
            const precioVentaAplicar = jefe.precioVenta || vendedor.precioVenta;
            const pagoPremios = premiosVendedor * precioVentaAplicar;
            
            // Calcular la ganancia y entrega usando el porcentaje del jefe o del vendedor
            const porcentajeAplicar = jefe.porcentaje || vendedor.porcentaje;
            const gananciaVendedor = ventaVendedor * (porcentajeAplicar / 100);
            const entregaVendedor = ventaVendedor - gananciaVendedor;
            
            // Actualizar totales
            totalPagoPremios += pagoPremios;
            totalEntrega += entregaVendedor;
        });

        if (totalVenta > 0) {
            // Usar espacios para alinear como una tabla
            // Calcular la ganancia o pérdida
const gananciaFinal = totalEntrega - totalPagoPremios;
const esGanancia = gananciaFinal >= 0;

// Usar espacios para alinear como una tabla
const etiquetas = [
    'Venta Total:', 
    'Premio Total:', 
    'Pago Total:', 
    'Entrega Total:', 
    esGanancia ? 'Ganancia:' : 'Pérdidas:'
];

const valores = [
    Math.round(totalVenta).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    Math.round(totalPremios).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    Math.round(totalPagoPremios).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    Math.round(totalEntrega).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    Math.abs(Math.round(gananciaFinal)).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
];
            
            // Encontrar la etiqueta más larga para calcular el padding
            const longitudMaxima = Math.max(...etiquetas.map(e => e.length));
            
            /// Crear cada línea con alineación
etiquetas.forEach((etiqueta, index) => {
    // Padding a la derecha para alinear valores
    const espacios = ' '.repeat(longitudMaxima - etiqueta.length + 5);
    
    // Verificar si es la última línea (ganancia o pérdidas) y aplicar formato especial
    if (index === etiquetas.length - 1 && !esGanancia) {
        // Para pérdidas, añadir el signo negativo
        reporte += `${etiqueta}${espacios}-${valores[index]}\n`;
    } else {
        reporte += `${etiqueta}${espacios}${valores[index]}\n`;
    }
});
        } else {
            reporte += `No hay ventas registradas para este horario y fecha.\n`;
        }
    }

    // Crear un modal personalizado
    const modalContainer = document.createElement('div');
    modalContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background-color: ${document.body.classList.contains('dark-mode') ? '#333' : '#fff'};
        color: ${document.body.classList.contains('dark-mode') ? '#fff' : '#000'};
        padding: 20px;
        border-radius: 8px;
        max-width: 80%;
        max-height: 80%;
        overflow-y: auto;
        position: relative;
    `;

    const preElement = document.createElement('pre');
preElement.style.cssText = `
    margin: 0;
    white-space: pre-wrap;
    font-family: monospace;
`;

// Verificar si hay pérdidas para aplicar formato HTML
if (reporte.includes('Pérdidas:')) {
    // Convertir el reporte a HTML para poder colorear las pérdidas
    const reporteHTML = reporte.split('\n').map(line => {
        if (line.includes('Pérdidas:')) {
            return `<span style="color: red;">${line}</span>`;
        }
        return line;
    }).join('\n');
    
    preElement.innerHTML = reporteHTML;
} else {
    preElement.textContent = reporte;
}

    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 20px;
    `;

    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copiar';
    copyButton.style.cssText = `
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        background-color: #4CAF50;
        color: white;
        cursor: pointer;
    `;
    copyButton.onclick = async () => {
        try {
            // Copiar como Texto
            await navigator.clipboard.writeText(reporte);

            // Crear imagen en canvas con tamaño dinámico basado en el contenido
            const lines = reporte.split('\n');
            const lineHeight = 25; // Altura de cada línea en píxeles
            const padding = 40; // Padding alrededor del texto
            
            // Calcular dimensiones basadas en el contenido
            const canvasWidth = 600; // Ancho fijo más amplio
            const canvasHeight = (lines.length * lineHeight) + (padding * 2);
            
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            
            // Fondo apropiado según modo
            ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#333' : '#f5f5f5';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Texto con mejor contraste
            ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#fff' : '#000';
            ctx.font = '16px monospace'; // Usar fuente monoespaciada para alineación
            
            // Dibujar cada línea del reporte
lines.forEach((line, i) => {
    // Verificar si es una línea de pérdidas para aplicar color rojo
    if (line.includes('Pérdidas:')) {
        ctx.fillStyle = '#FF0000'; // Color rojo para pérdidas
        ctx.fillText(line, padding, padding + (i * lineHeight));
        // Restaurar el color normal para las siguientes líneas
        ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#fff' : '#000';
    } else {
        ctx.fillText(line, padding, padding + (i * lineHeight));
    }
});
            
            // Convertir canvas a Blob
            canvas.toBlob(async (blobImage) => {
                if (blobImage) {
                    try {
                        // Intentar primero con navigator.clipboard.write
                        if (typeof ClipboardItem !== 'undefined') {
                            const clipboardItems = [
                                new ClipboardItem({
                                    'text/plain': new Blob([reporte], {type: 'text/plain'}),
                                    'image/png': blobImage
                                })
                            ];
                            await navigator.clipboard.write(clipboardItems);
                        } else {
                            // Alternativa: descargar la imagen
                            const img = canvas.toDataURL('image/png');
                            const tempLink = document.createElement('a');
                            tempLink.href = img;
                            tempLink.download = `Reporte_${jefe.nombre}_${fechaMostrar}.png`;
                            tempLink.click();
                            
                            // Ya hemos copiado el texto, así que informamos al usuario
                            alert('El texto se ha copiado al portapapeles. La imagen se descargará automáticamente.');
                        }
                    } catch (clipErr) {
                        console.error('Error al copiar imagen:', clipErr);
                        // Si falla, ofrecer descargar la imagen
                        const img = canvas.toDataURL('image/png');
                        const tempLink = document.createElement('a');
                        tempLink.href = img;
                        tempLink.download = `Reporte_${jefe.nombre}_${fechaMostrar}.png`;
                        tempLink.click();
                        alert('El texto se ha copiado al portapapeles. La imagen se descargará automáticamente.');
                    }
                }
            }, 'image/png');
            
            copyButton.textContent = 'Copiado!';
            setTimeout(() => copyButton.textContent = 'Copiar', 2000);
        } catch (err) {
            console.error('Error al copiar:', err);
            alert('Ocurrió un error al copiar: ' + err.message);
        }
    };

    const acceptButton = document.createElement('button');
    acceptButton.textContent = 'Aceptar';
    acceptButton.style.cssText = `
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        background-color: #4CAF50;
        color: white;
        cursor: pointer;
    `;
    acceptButton.onclick = () => {
        document.body.removeChild(modalContainer);
    };

    buttonContainer.appendChild(copyButton);
    buttonContainer.appendChild(acceptButton);
    modalContent.appendChild(preElement);
    modalContent.appendChild(buttonContainer);
    modalContainer.appendChild(modalContent);
    document.body.appendChild(modalContainer);
}

function crearSelectorFechas(jefeIndex) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    // Obtener la fecha actual para el valor predeterminado
    const fechaActual = new Date();
    const fechaFormateada = fechaActual.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Seleccionar Período</h3>
            <div class="fecha-inputs">
                <div>
                    <label for="fechaSeleccionada">Fecha:</label>
                    <input type="date" id="fechaSeleccionada" value="${fechaFormateada}" required>
                </div>
                <div style="margin-top: 15px;">
                    <label>Horario:</label>
                    <div class="radio-group" style="display: flex; gap: 15px; margin-top: 8px;">
                        <label style="display: flex; align-items: center;">
                            <input type="radio" name="horarioRadio" value="todos" checked>
                            <span style="margin-left: 5px;">Todos</span>
                        </label>
                        <label style="display: flex; align-items: center;">
                            <input type="radio" name="horarioRadio" value="dia">
                            <span style="margin-left: 5px;">Día</span>
                        </label>
                        <label style="display: flex; align-items: center;">
                            <input type="radio" name="horarioRadio" value="noche">
                            <span style="margin-left: 5px;">Noche</span>
                        </label>
                    </div>
                </div>
            </div>
            <div class="modal-buttons">
                <button onclick="verReporteSimplificado(${jefeIndex})" class="btn-primary">Ver Reporte</button>
                <button onclick="cerrarModal()" class="btn-secondary">Cancelar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Estilos como antes...
    const style = document.createElement('style');
    style.textContent = `
        .fecha-inputs {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin: 20px 0;
        }
        .fecha-inputs div {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .fecha-inputs input[type="date"] {
            padding: 5px;
            border-radius: 4px;
            border: 1px solid #ccc;
            width: 60%;
        }
        .dark-mode .fecha-inputs input[type="date"] {
            background-color: #333;
            color: white;
            border-color: #666;
        }
        .fecha-inputs label {
            width: 35%;
        }
    `;
    document.head.appendChild(style);
}

// Función para procesar el reporte simplificado
function verReporteSimplificado(jefeIndex) {
    const fechaSeleccionada = document.getElementById('fechaSeleccionada').value;
    
    // Obtener el valor seleccionado de los radio buttons
    const radioButtons = document.getElementsByName('horarioRadio');
    let horarioSeleccionado = "todos"; // valor por defecto
    
    for (const radioButton of radioButtons) {
        if (radioButton.checked) {
            horarioSeleccionado = radioButton.value;
            break;
        }
    }
    
    console.log("FECHA SELECCIONADA:", fechaSeleccionada);
    console.log("HORARIO SELECCIONADO:", horarioSeleccionado);
    
    if (!fechaSeleccionada) {
        mostrarMensaje('Por favor seleccione una fecha', 'error');
        return;
    }

    // Si seleccionó "todos", mostrar resumen mensual
    if (horarioSeleccionado === "todos") {
        // Calcular el primer día del mes actual
        const fecha = new Date(fechaSeleccionada);
        const primerDiaDelMes = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
        const primerDiaFormateado = primerDiaDelMes.toISOString().split('T')[0];
        
        // Usar la fecha seleccionada como fecha final
        verVentasJefeConResumenMensual(jefeIndex, primerDiaFormateado, fechaSeleccionada, horarioSeleccionado);
    } else {
        // Si seleccionó día o noche, mostrar solo esa fecha específica
        verVentasJefePorFecha(jefeIndex, fechaSeleccionada, fechaSeleccionada, horarioSeleccionado);
    }
    
    cerrarModal();
}

// Nueva función para mostrar el resumen mensual
function verVentasJefeConResumenMensual(jefeIndex, fechaInicio, fechaFin, horario) {
    const jefe = jefes[jefeIndex];
    if (!jefe) {
        alert('Error: Jefe no encontrado');
        return;
    }
    
    console.log("Diagnóstico de fechas para resumen mensual:");
    console.log("- fechaInicio (primer día del mes):", fechaInicio);
    console.log("- fechaFin (fecha seleccionada):", fechaFin);
    console.log("- horario seleccionado:", horario);

    // Usar la función global obtenerFechaFormateada
    const fechaInicioNormalizada = obtenerFechaFormateada(fechaInicio);
    const fechaFinNormalizada = obtenerFechaFormateada(fechaFin);

    console.log("- fechaInicio normalizada:", fechaInicioNormalizada);
    console.log("- fechaFin normalizada:", fechaFinNormalizada);

    // Extraer el mes y año para mostrar en el título
    const fechaParaMostrar = new Date(fechaFin);
    const nombresMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const nombreMes = nombresMeses[fechaParaMostrar.getMonth()];
    const anio = fechaParaMostrar.getFullYear();

    // Declarar la variable reporte al inicio de la función
    let reporte = "";
    
    // Buscar todas las ventas para encontrar número ganador del período seleccionado
    const vendedoresDelJefe = vendedores.filter(v => v.jefes.includes(jefe.nombre));
    
    // Función para verificar si una fecha está en el rango
    function esFechaEnRango(fechaVenta) {
        const fechaVentaNormalizada = obtenerFechaFormateada(fechaVenta);
        
        // Para comparar correctamente, convertir a objetos Date
        function convertirADate(fechaStr) {
            const [dia, mes, anio] = fechaStr.split('/').map(Number);
            return new Date(anio, mes - 1, dia);
        }
        
        const dateVenta = convertirADate(fechaVentaNormalizada);
        const dateInicio = convertirADate(fechaInicioNormalizada);
        const dateFin = convertirADate(fechaFinNormalizada);
        
        // Verificar si la fecha está en el rango
        return dateVenta >= dateInicio && dateVenta <= dateFin;
    }
    
    // Función limpia para verificar si el horario coincide (como en verVentasJefePorFecha)
    function coincideHorario(horarioVenta, horarioBuscado) {
        // Si se seleccionó "todos", siempre devuelve true
        if (horarioBuscado === "todos") {
            return true;
        }
        
        // Normalizar ambos horarios para comparación (eliminar posibles números anexados)
        const normalizado1 = horarioVenta.replace(/\s*\d+$/, ""); // Elimina cualquier número al final
        const normalizado2 = horarioBuscado.replace(/\s*\d+$/, "");
        
        return (
            normalizado1 === normalizado2 ||
            (normalizado1 === "dia" && normalizado2 === "día") ||
            (normalizado1 === "día" && normalizado2 === "dia") ||
            (normalizado1 === "noche" && normalizado2 === "noche")
        );
    }
    
    // Variables para el resumen
    let ventasDia = 0;
    let premiosDia = 0;
    let pagoPremiosDia = 0;
    let entregaDia = 0;
    
    let ventasNoche = 0;
    let premiosNoche = 0;
    let pagoPremiosNoche = 0;
    let entregaNoche = 0;
    
    // Procesar cada vendedor individualmente
    vendedoresDelJefe.forEach(vendedor => {
        // Filtrar las ventas en el rango de fechas especificado
        const ventasEnRango = vendedor.ventas.filter(v => esFechaEnRango(v.fecha));
        
        // Separar por horario
        const ventasHorarioDia = ventasEnRango.filter(v => coincideHorario(v.horario, "dia"));
        const ventasHorarioNoche = ventasEnRango.filter(v => coincideHorario(v.horario, "noche"));
        
        // Calcular totales para día
        let ventaVendedorDia = 0;
        let premiosVendedorDia = 0;
        ventasHorarioDia.forEach(venta => {
            ventaVendedorDia += venta.totalVenta;
            premiosVendedorDia += venta.premio;
        });
        
        // Aplicar el precio de venta del jefe o del vendedor para día
        const precioVentaAplicarDia = jefe.precioVenta || vendedor.precioVenta;
        const pagoPremiosDiaVendedor = premiosVendedorDia * precioVentaAplicarDia;
        
        // Calcular la ganancia y entrega usando el porcentaje del jefe o del vendedor para día
        const porcentajeAplicarDia = jefe.porcentaje || vendedor.porcentaje;
        const gananciaVendedorDia = ventaVendedorDia * (porcentajeAplicarDia / 100);
        const entregaVendedorDia = ventaVendedorDia - gananciaVendedorDia;
        
        // Acumular totales día
        ventasDia += ventaVendedorDia;
        premiosDia += premiosVendedorDia;
        pagoPremiosDia += pagoPremiosDiaVendedor;
        entregaDia += entregaVendedorDia;
        
        // Calcular totales para noche
        let ventaVendedorNoche = 0;
        let premiosVendedorNoche = 0;
        ventasHorarioNoche.forEach(venta => {
            ventaVendedorNoche += venta.totalVenta;
            premiosVendedorNoche += venta.premio;
        });
        
        // Aplicar el precio de venta del jefe o del vendedor para noche
        const precioVentaAplicarNoche = jefe.precioVenta || vendedor.precioVenta;
        const pagoPremiosNocheVendedor = premiosVendedorNoche * precioVentaAplicarNoche;
        
        // Calcular la ganancia y entrega usando el porcentaje del jefe o del vendedor para noche
        const porcentajeAplicarNoche = jefe.porcentaje || vendedor.porcentaje;
        const gananciaVendedorNoche = ventaVendedorNoche * (porcentajeAplicarNoche / 100);
        const entregaVendedorNoche = ventaVendedorNoche - gananciaVendedorNoche;
        
        // Acumular totales noche
        ventasNoche += ventaVendedorNoche;
        premiosNoche += premiosVendedorNoche;
        pagoPremiosNoche += pagoPremiosNocheVendedor;
        entregaNoche += entregaVendedorNoche;
    });

    // Crear el encabezado del reporte
    reporte = `Resumen Mensual - ${jefe.nombre}\n`;
    reporte += `Período: ${nombreMes} ${anio}\n`;
    reporte += `Fecha: ${fechaInicioNormalizada} al ${fechaFinNormalizada}\n`;
    reporte += '----------------------------------------\n\n';

    if (vendedoresDelJefe.length === 0) {
        reporte += 'No hay vendedores asignados a este jefe.\n';
    } else {
        // Calcular totales generales
        const totalVentas = ventasDia + ventasNoche;
        const totalPremios = premiosDia + premiosNoche;
        const totalPagoPremios = pagoPremiosDia + pagoPremiosNoche;
        const totalEntrega = entregaDia + entregaNoche;
        
        // Calcular ganancias/pérdidas
        const gananciaDia = entregaDia - pagoPremiosDia;
        const gananciaNoche = entregaNoche - pagoPremiosNoche;
        const gananciaTotal = gananciaDia + gananciaNoche;
        
        const esGananciaDia = gananciaDia >= 0;
        const esGananciaNoche = gananciaNoche >= 0;
        const esGananciaTotal = gananciaTotal >= 0;

        if (totalVentas > 0) {
            // Sección del Día
            reporte += `HORARIO: DÍA\n`;
            reporte += `----------------------------------------\n`;
            const etiquetasDia = [
                'Venta Total:', 
                'Premio Total:', 
                'Pago Total:', 
                'Entrega Total:', 
                esGananciaDia ? 'Ganancia:' : 'Pérdidas:'
            ];

            const valoresDia = [
                Math.round(ventasDia).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                Math.round(premiosDia).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                Math.round(pagoPremiosDia).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                Math.round(entregaDia).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                Math.abs(Math.round(gananciaDia)).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
            ];
            
            // Encontrar la etiqueta más larga para calcular el padding
            const longitudMaximaDia = Math.max(...etiquetasDia.map(e => e.length));
            
            // Crear cada línea con alineación para día
            etiquetasDia.forEach((etiqueta, index) => {
                const espacios = ' '.repeat(longitudMaximaDia - etiqueta.length + 5);
                
                if (index === etiquetasDia.length - 1 && !esGananciaDia) {
                    reporte += `${etiqueta}${espacios}-${valoresDia[index]}\n`;
                } else {
                    reporte += `${etiqueta}${espacios}${valoresDia[index]}\n`;
                }
            });
            
            // Sección de la Noche
            reporte += `\nHORARIO: NOCHE\n`;
            reporte += `----------------------------------------\n`;
            const etiquetasNoche = [
                'Venta Total:', 
                'Premio Total:', 
                'Pago Total:', 
                'Entrega Total:', 
                esGananciaNoche ? 'Ganancia:' : 'Pérdidas:'
            ];

            const valoresNoche = [
                Math.round(ventasNoche).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                Math.round(premiosNoche).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                Math.round(pagoPremiosNoche).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                Math.round(entregaNoche).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                Math.abs(Math.round(gananciaNoche)).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
            ];
            
            // Encontrar la etiqueta más larga para calcular el padding
            const longitudMaximaNoche = Math.max(...etiquetasNoche.map(e => e.length));
            
            // Crear cada línea con alineación para noche
            etiquetasNoche.forEach((etiqueta, index) => {
                const espacios = ' '.repeat(longitudMaximaNoche - etiqueta.length + 5);
                
                if (index === etiquetasNoche.length - 1 && !esGananciaNoche) {
                    reporte += `${etiqueta}${espacios}-${valoresNoche[index]}\n`;
                } else {
                    reporte += `${etiqueta}${espacios}${valoresNoche[index]}\n`;
                }
            });
            
            // Sección del Total
            reporte += `\nRESUMEN TOTAL DEL MES\n`;
            reporte += `----------------------------------------\n`;
            const etiquetasTotal = [
                'Venta Total:', 
                'Premio Total:', 
                'Pago Total:', 
                'Entrega Total:', 
                esGananciaTotal ? 'Ganancia:' : 'Pérdidas:'
            ];

            const valoresTotal = [
                Math.round(totalVentas).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                Math.round(totalPremios).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                Math.round(totalPagoPremios).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                Math.round(totalEntrega).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                Math.abs(Math.round(gananciaTotal)).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
            ];
            
            // Encontrar la etiqueta más larga para calcular el padding
            const longitudMaximaTotal = Math.max(...etiquetasTotal.map(e => e.length));
            
            // Crear cada línea con alineación para el total
            etiquetasTotal.forEach((etiqueta, index) => {
                const espacios = ' '.repeat(longitudMaximaTotal - etiqueta.length + 5);
                
                if (index === etiquetasTotal.length - 1 && !esGananciaTotal) {
                    reporte += `${etiqueta}${espacios}-${valoresTotal[index]}\n`;
                } else {
                    reporte += `${etiqueta}${espacios}${valoresTotal[index]}\n`;
                }
            });
        } else {
            reporte += `No hay ventas registradas para este período.\n`;
        }
    }

    // Crear un modal personalizado (reutilizando código existente)
    const modalContainer = document.createElement('div');
    modalContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background-color: ${document.body.classList.contains('dark-mode') ? '#333' : '#fff'};
        color: ${document.body.classList.contains('dark-mode') ? '#fff' : '#000'};
        padding: 20px;
        border-radius: 8px;
        max-width: 80%;
        max-height: 80%;
        overflow-y: auto;
        position: relative;
    `;

    const preElement = document.createElement('pre');
    preElement.style.cssText = `
        margin: 0;
        white-space: pre-wrap;
        font-family: monospace;
    `;

    // Verificar si hay pérdidas para aplicar formato HTML
    if (reporte.includes('Pérdidas:')) {
        // Convertir el reporte a HTML para poder colorear las pérdidas
        const reporteHTML = reporte.split('\n').map(line => {
            if (line.includes('Pérdidas:')) {
                return `<span style="color: red;">${line}</span>`;
            }
            return line;
        }).join('\n');
        
        preElement.innerHTML = reporteHTML;
    } else {
        preElement.textContent = reporte;
    }

    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 20px;
    `;

    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copiar';
    copyButton.style.cssText = `
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        background-color: #4CAF50;
        color: white;
        cursor: pointer;
    `;
    
    // El manejo del botón de copiar sería el mismo que en la función original
    copyButton.onclick = async () => {
        try {
            // Código de copiar (mantener igual que en la función original)
            await navigator.clipboard.writeText(reporte);
            
            // Crear imagen en canvas...
            const lines = reporte.split('\n');
            const lineHeight = 25;
            const padding = 40;
            const canvasWidth = 600;
            const canvasHeight = (lines.length * lineHeight) + (padding * 2);
            
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            
            ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#333' : '#f5f5f5';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#fff' : '#000';
            ctx.font = '16px monospace';
            
            lines.forEach((line, i) => {
                if (line.includes('Pérdidas:')) {
                    ctx.fillStyle = '#FF0000';
                    ctx.fillText(line, padding, padding + (i * lineHeight));
                    ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#fff' : '#000';
                } else {
                    ctx.fillText(line, padding, padding + (i * lineHeight));
                }
            });
            
            // El resto del código para el manejo de la imagen (igual que en la función original)
            canvas.toBlob(async (blobImage) => {
                if (blobImage) {
                    try {
                        if (typeof ClipboardItem !== 'undefined') {
                            const clipboardItems = [
                                new ClipboardItem({
                                    'text/plain': new Blob([reporte], {type: 'text/plain'}),
                                    'image/png': blobImage
                                })
                            ];
                            await navigator.clipboard.write(clipboardItems);
                        } else {
                            const img = canvas.toDataURL('image/png');
                            const tempLink = document.createElement('a');
                            tempLink.href = img;
                            tempLink.download = `Resumen_Mensual_${jefe.nombre}_${nombreMes}_${anio}.png`;
                            tempLink.click();
                            alert('El texto se ha copiado al portapapeles. La imagen se descargará automáticamente.');
                        }
                    } catch (clipErr) {
                        console.error('Error al copiar imagen:', clipErr);
                        const img = canvas.toDataURL('image/png');
                        const tempLink = document.createElement('a');
                        tempLink.href = img;
                        tempLink.download = `Resumen_Mensual_${jefe.nombre}_${nombreMes}_${anio}.png`;
                        tempLink.click();
                        alert('El texto se ha copiado al portapapeles. La imagen se descargará automáticamente.');
                    }
                }
            }, 'image/png');
            
            copyButton.textContent = 'Copiado!';
            setTimeout(() => copyButton.textContent = 'Copiar', 2000);
        } catch (err) {
            console.error('Error al copiar:', err);
            alert('Ocurrió un error al copiar: ' + err.message);
        }
    };

    const acceptButton = document.createElement('button');
    acceptButton.textContent = 'Aceptar';
    acceptButton.style.cssText = `
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        background-color: #4CAF50;
        color: white;
        cursor: pointer;
    `;
    acceptButton.onclick = () => {
        document.body.removeChild(modalContainer);
    };

    buttonContainer.appendChild(copyButton);
    buttonContainer.appendChild(acceptButton);
    modalContent.appendChild(preElement);
    modalContent.appendChild(buttonContainer);
    modalContainer.appendChild(modalContent);
    document.body.appendChild(modalContainer);
}

function verReporteFechas(jefeIndex) {
    const fechaInicio = document.getElementById('fechaInicio').value;
    const fechaFin = document.getElementById('fechaFin').value;
    const horario = document.getElementById('horarioSelect').value;
    
    // Depuración para verificar el valor exacto seleccionado
    console.log("Valor del selector de horario:", horario);
    console.log("Tipo de dato:", typeof horario);
    
    if (!fechaInicio || !fechaFin) {
        mostrarMensaje('Por favor seleccione ambas fechas', 'error');
        return;
    }

    // Solo pasar el horario si realmente hay una selección
    const horarioSeleccionado = horario ? horario : null;
    
    verVentasJefePorFecha(jefeIndex, fechaInicio, fechaFin, horarioSeleccionado);
    cerrarModal();
}

function cerrarModal() {
    document.querySelector('.modal').remove();
}

// Función para obtener las ventas del vendedor en la fecha y horario seleccionados
function obtenerVentasVendedor(index, fecha, horario) {
    const vendedor = vendedores[index];
    
    // Verificar si hay ventas
    if (!vendedor.ventas || vendedor.ventas.length === 0) {
        alert(`No hay ventas registradas para ${vendedor.nombre}`);
        return;
    }
    
    // Normalizar el formato de fecha si es necesario
    function normalizarFecha(fecha) {
        if (!fecha) return "";
        
        // Si la fecha ya está en formato DD/MM/YYYY
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(fecha)) {
            return fecha;
        }
        
        // Si está en formato YYYY-MM-DD (desde input type="date")
        const partes = fecha.split('-');
        if (partes.length === 3) {
            return `${partes[2]}/${partes[1]}/${partes[0]}`;
        }
        
        return fecha; // Devolver como está si no coincide con ningún formato conocido
    }
    
    // Normalizar la fecha proporcionada
    const fechaNormalizada = normalizarFecha(fecha);
    
    console.log("FUNCIÓN DE REPORTE");
    console.log("Vendedor:", vendedor.nombre);
    console.log("Fecha buscada (normalizada):", fechaNormalizada);
    console.log("Horario buscado:", horario);
    console.log("Todas las ventas:", JSON.stringify(vendedor.ventas));
    
    // Filtrar ventas por fecha y horario
    const ventasFiltradas = vendedor.ventas.filter(venta => {
        // Normalizar la fecha de la venta para comparar en el mismo formato
        const fechaVentaNormalizada = normalizarFecha(venta.fecha);
        
        const fechaCoincide = fechaVentaNormalizada === fechaNormalizada;
        const horarioCoincide = venta.horario === horario;
        
        console.log(`Evaluando venta - Fecha original: ${venta.fecha}, Fecha normalizada: ${fechaVentaNormalizada} (${fechaCoincide ? 'Coincide' : 'No coincide'}), Horario: ${venta.horario} (${horarioCoincide ? 'Coincide' : 'No coincide'})`);
        
        return fechaCoincide && horarioCoincide;
    });
    
    console.log("Ventas filtradas:", JSON.stringify(ventasFiltradas));
    
    // Filtrar fondos agregados o quitados en la fecha seleccionada
    const cambiosFondo = vendedor.historialFondos ?
        vendedor.historialFondos.filter(fondo => normalizarFecha(fondo.fecha) === fechaNormalizada) : [];
    
    let reporte = `Ventas de ${vendedor.nombre} (${horario.toUpperCase()})\n`;
    reporte += `Fecha: ${fechaNormalizada}\n\n`;
    
    if (ventasFiltradas.length === 0) {
        reporte += 'No hay ventas registradas en este período.\n';
    } else {
        let totalVentas = 0;
        let totalPremios = 0;
        
        ventasFiltradas.forEach((venta, index) => {
            reporte += `VENTA #${index + 1}\n`;
            // Verificar si el objeto de venta tiene la propiedad totalVenta
            const ventaValor = Number(venta.totalVenta) || 0;
            const premioValor = Number(venta.premio) || 0;
            
            reporte += `Total Venta: ${ventaValor.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}\n`;
            reporte += `Premio: ${premioValor.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}\n`;
            reporte += '------------------------\n';
            
            totalVentas += ventaValor;
            totalPremios += premioValor;
        });
        
        const pago = totalPremios * vendedor.precioVenta;
        const entrega = totalVentas * (vendedor.porcentaje / 100);
        const diferencia = entrega - pago;
        
        reporte += `\nRESUMEN DEL DÍA\n`;
        reporte += `Total Ventas: ${totalVentas.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}\n`;
        reporte += `Total Premios: ${totalPremios.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}\n`;
        reporte += `Pago: ${pago.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}\n`;
        reporte += `Entrega: ${entrega.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}\n`;
        reporte += `${diferencia >= 0 ? 'Ganancia' : 'Pérdida'}: ${Math.abs(diferencia).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}\n`;
    }
    
    // Agregar información de cambios de fondo
    let fondoActual = vendedor.fondo;  // Fondo actual del vendedor
    
    if (cambiosFondo.length > 0) {
        reporte += `\nCAMBIOS DE FONDO (${fechaNormalizada})\n`;
        cambiosFondo.forEach(fondo => {
            const cantidad = fondo.cantidad || 0;
            const motivo = fondo.motivo || 'No especificado';
            const fondoAnterior = fondo.fondoAnterior || 0;
            const fondoNuevo = fondo.fondoNuevo || 0;
            
            reporte += `${fondo.tipo === 'agregar' ? '➕ Agregado' : '➖ Quitado'}: ${cantidad.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}\n`;
            reporte += `Motivo: ${motivo}\n`;
            reporte += `Fondo Anterior: ${fondoAnterior.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}\n`;
            reporte += `Fondo Nuevo: ${fondoNuevo.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}\n`;
            reporte += '------------------------\n';
        });
    }
    
    // Mostrar el fondo actual al final
    reporte += `\nFondo Actual: ${fondoActual.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}\n`;
    
    alert(reporte);
}

// Parte 7: Funciones de Utilidad
function updateVendedorInfo() {
    const vendedorIndex = document.getElementById('vendedorSelect').value;
    if (vendedorIndex === null || vendedorIndex === undefined) return;

    const vendedor = vendedores[vendedorIndex];
    if (!vendedor) return;

    document.getElementById('precioVenta').value = vendedor.precioVenta;
    document.getElementById('porcentaje').value = vendedor.porcentaje;
    document.getElementById('fondo').value = vendedor.fondo;
}

// Inicialización de elementos DOM
document.addEventListener('DOMContentLoaded', function () {
    const mensajesNoProcesadosSection = document.getElementById('mensajesNoProcesadosSection');
    if (mensajesNoProcesadosSection) {
        mensajesNoProcesadosSection.style.display = 'none';
    }
    agregarEstilosMensajes();
});

// Función para exportar ventas específicas
function exportarVentasSelectivas() {
    // Crear modal para seleccionar fecha y horario
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Exportar Ventas</h3>
            <div class="form-group">
                <label for="exportFecha">Fecha:</label>
                <input type="date" id="exportFecha" required>
            </div>
            <div class="form-group">
                <label for="exportHorario">Horario:</label>
                <select id="exportHorario">
                    <option value="todos">Todos</option>
                    <option value="dia">Día</option>
                    <option value="noche">Noche</option>
                </select>
            </div>
            <div class="modal-buttons">
                <button onclick="realizarExportacionSelectiva()" class="btn-primary">Exportar</button>
                <button onclick="cerrarModal()" class="btn-secondary">Cancelar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Función para importar ventas selectivas
function importarVentasSelectivas(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const datosImportados = JSON.parse(e.target.result);

            // Verificar el formato del archivo
            if (!datosImportados.fecha || !datosImportados.ventas) {
                throw new Error('Formato de archivo inválido');
            }

            // Crear modal de confirmación
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <h3>Confirmar Importación</h3>
                    <p>Fecha: ${datosImportados.fecha}</p>
                    <p>Horario: ${datosImportados.horario === 'todos' ? 'Todos' :
                datosImportados.horario === 'dia' ? 'Día' : 'Noche'}</p>
                    <p>Vendedores: ${Object.keys(datosImportados.ventas).length}</p>
                    <div class="modal-buttons">
                        <button onclick="confirmarImportacion(${JSON.stringify(datosImportados)})" 
                                class="btn-primary">Importar</button>
                        <button onclick="cerrarModal()" 
                                class="btn-secondary">Cancelar</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

        } catch (error) {
            mostrarMensaje('Error al leer el archivo: ' + error.message, 'error');
        }
    };
    reader.readAsText(file);
}

// Agregar botones al DOM
document.addEventListener('DOMContentLoaded', function () {
    const botonesContainer = document.querySelector('.actions');
    if (botonesContainer) {
        // Botón de exportación selectiva
        const btnExportSelectivo = document.createElement('button');
        btnExportSelectivo.textContent = 'Exportar por Fecha';
        btnExportSelectivo.className = 'export-button';
        btnExportSelectivo.onclick = exportarVentasSelectivas;
        botonesContainer.appendChild(btnExportSelectivo);

        // Input para importación selectiva (oculto)
        const inputImportSelectivo = document.createElement('input');
        inputImportSelectivo.type = 'file';
        inputImportSelectivo.id = 'importSelectiveFile';
        inputImportSelectivo.style.display = 'none';
        inputImportSelectivo.accept = '.json';
        inputImportSelectivo.onchange = importarVentasSelectivas;
        botonesContainer.appendChild(inputImportSelectivo);

        // Botón para activar la importación selectiva
        const btnImportSelectivo = document.createElement('button');
        btnImportSelectivo.textContent = 'Importar por Fecha';
        btnImportSelectivo.className = 'btn-secondary';
        btnImportSelectivo.onclick = () => document.getElementById('importSelectiveFile').click();
        botonesContainer.appendChild(btnImportSelectivo);
    }
});

// Parte 9: Estadísticas y Reportes Adicionales

// Inicializar CONFIG como variable global si no existe
if (!window.CONFIG) {
    window.CONFIG = {
        VERSION: '1.0.1',
        MAX_VENDEDORES: 100,
        MAX_JEFES: 20,
        HORARIOS: ['dia', 'noche'],
        BACKUP_INTERVAL: 60000, // 1 minuto en milisegundos
        MIN_NUMERO: 0,
        MAX_NUMERO: 99,
        DIAS_HISTORICO: 15 // Días de histórico a mantener
    };
}

// Inicializar historialDatos como variable global si no existe
if (!window.historialDatos) {
    window.historialDatos = {
        fechas: {},
        ultimaActualizacion: null
    };
} else {
    // Reiniciar sus propiedades si ya existe
    window.historialDatos.fechas = {};
    window.historialDatos.ultimaActualizacion = null;
}

// Agregar el event listener para el botón de generar reporte
document.addEventListener('DOMContentLoaded', function () {
    const btnGenerarReporte = document.querySelector('.btn-generar-reporte');
    if (btnGenerarReporte) {
        btnGenerarReporte.addEventListener('click', generarReportePorFecha);
    }
});

// Usar un event listener DOMContentLoaded para asegurarnos de que CONFIG está definido
document.addEventListener('DOMContentLoaded', function () {
    // Configurar el backup automático después de que CONFIG esté disponible
    setInterval(() => {
        guardarDatos();
    }, window.CONFIG.BACKUP_INTERVAL);
});

// Iniciar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializarAplicacion);

// Parte 10: Configuración y Utilidades Adicionales
// Estructura para el historial
let historialDatos = {
    fechas: {},
    ultimaActualizacion: null
};

// Parte 11 Mostrar Juagadas
document.addEventListener('DOMContentLoaded', function () {
    const btnMostrarAnalisis = document.getElementById('btnMostrarAnalisis');
    const mensajeVenta = document.getElementById('mensajeVenta');
    const analisisContainer = document.createElement('div');
    const filtroJugadas = document.createElement('input');
    analisisContainer.style.display = 'none';
    let analisisVisible = false;
    let contadorSMS = 1;  // Contador para numerar los SMS
    let todasLasJugadas = []; // Array para guardar todas las jugadas

    // Crear y configurar el input de filtro
    filtroJugadas.setAttribute('type', 'text');
    filtroJugadas.setAttribute('placeholder', 'Filtrar jugadas...');
    filtroJugadas.style.marginBottom = '10px';
    filtroJugadas.style.width = '100%';
    filtroJugadas.style.padding = '5px';

    // Función de filtrado
    function filtrarJugadas() {
        const filtro = filtroJugadas.value.trim().toLowerCase();
        
        // Si no hay filtro, mostrar todas las jugadas
        if (!filtro) {
            analisisContainer.innerHTML = todasLasJugadas.join('');
            return;
        }

        // Filtrar jugadas que contengan el texto del filtro
        const jugadaFiltrada = todasLasJugadas.filter(jugada => 
            jugada.toLowerCase().includes(filtro)
        );

        // Renderizar jugadas filtradas
        analisisContainer.innerHTML = jugadaFiltrada.length > 0 
            ? jugadaFiltrada.join('')
            : '<div class="mensaje-error">No se encontraron jugadas que coincidan con el filtro</div>';
    }

    // Agregar evento de filtrado
    filtroJugadas.addEventListener('input', filtrarJugadas);

    function formatearJugadas(tipo, linea, jugadas, totalVenta, premioTotal, index) {
        let premio = premioTotal > 0 ? `<strong style="color: red">Premio: ${premioTotal}</strong>`: "";
        return `
            <div class="jugada-container" id="jugada-${index}">
                <div class="jugada-original">
                    <span class="jugada-texto">${linea} =></span>
                    <span class="jugada-resultados">${
                        Object.keys(jugadas).map((jugada) => ` ${jugada} con ${jugadas[jugada]}`)
                    }</span>
                </div>
                <div class="jugada-tipo">${tipo}</div>
                <div class="jugada-detalles">
                    <div class="venta-total">Venta: ${totalVenta} ${premio}</div>
                </div>
            </div>
        `
    }

    // Función principal para analizar una jugada
    function analizarJugada(linea, index) {
        if (!linea || typeof linea !== 'string') {
            return {
                tipo: 'Error',
                html: '<div class="mensaje-error">Jugada inválida</div>',
                venta: 0,
                premio: 0
            };
        }

        const numeroGanador = obtenerNumeroGanador();
        linea = linea.trim();
        if (linea === '') {
            return {
                tipo: 'Error',
                html: '<div class="mensaje-error">Jugada vacía</div>',
                venta: 0,
                premio: 0
            };
        }

        try {
            // Verificar si la línea contiene SOLO "sms" al inicio y no dar error en este caso
            if (/^sms\s*$/i.test(linea)) {
                const numeroSMS = contadorSMS++;  // Incrementar el contador de SMS
                return {
                    tipo: 'SMS',
                    html: `
                        <div class="jugada-container" id="jugada-${index}">
                            <div class="jugada-original">SMS ${numeroSMS}: ${linea}</div>
                        </div>
                    `,
                    venta: 0,
                    premio: 0
                };
            } 
            // Si tiene "sms" al inicio pero con contenido adicional, mostrar error
            else if (/^sms\s+.+/i.test(linea)) {
                return {
                    tipo: 'Error',
                    html: `
                        <div class="jugada-container jugada-invalida" id="jugada-${index}">
                            <div class="jugada-original">${linea}</div>
                            <div class="mensaje-error">Formato SMS inválido</div>
                        </div>
                    `,
                    venta: 0,
                    premio: 0
                };
            }
            // Verificar si es una jugada de "Línea"
            if (patrones.linea.test(linea)) {
                const resultado = procesarLineaConGanador(linea, numeroGanador);
                if (resultado) {
                    return {
                        tipo: 'Línea',
                        html: formatearJugadas('linea', linea, resultado.jugadas, resultado.totalVenta, resultado.premioEncontrado, index),
                        venta: resultado.totalVenta,
                        premio: resultado.premioEncontrado
                    };
                }
            } else if (patrones.lineaConY.test(linea)) {
                const resultado = procesarLineaConYGanador(linea, numeroGanador);
                if (resultado) {
                    return {
                        tipo: 'LíneaConY',
                        html: formatearJugadas('lineaConY', linea, resultado.jugadas, resultado.totalVenta, resultado.premioEncontrado, index),
                        venta: resultado.totalVenta,
                        premio: resultado.premioEncontrado
                    };
                }
            } else if (patrones.terminal.test(linea) || patrones.terminalMultiple.test(linea) ) {
                const resultado = procesarTerminalesConGanador(linea, numeroGanador);
                if (resultado) {
                    return {
                        tipo: 'Terminal',
                        html: formatearJugadas('Terminal', linea, resultado.jugadas, resultado.totalVenta, resultado.premioEncontrado, index),
                        venta: resultado.totalVenta,
                        premio: resultado.premioEncontrado
                    };
                }
            } else if (patrones.terminalAl.test(linea)) {
                const resultado = procesarTerminalAl(linea, numeroGanador);
                if (resultado) {
                    return {
                        tipo: 'Terminal Al',
                        html: formatearJugadas('Terminal Al', linea, resultado.jugadas, resultado.totalVenta, resultado.premioEncontrado, index),
                        venta: resultado.totalVenta,
                        premio: resultado.premioEncontrado
                    };
                }
            } else if (patrones.pareja.test(linea)) {
                const resultado = procesarParejasConGanador(linea, numeroGanador);
                if (resultado) {
                    return {
                        tipo: 'Pareja',
                        html: formatearJugadas('Pareja', linea, resultado.jugadas, resultado.totalVenta, resultado.premioEncontrado, index),
                        venta: resultado.totalVenta,
                        premio: resultado.premioEncontrado
                    };
                }
            } else if (patrones.parejasAl.test(linea)) {
                const resultado = procesarParejasAlConGanador(linea, numeroGanador);
                if (resultado) {
                    return {
                        tipo: 'Pareja Al',
                        html: formatearJugadas('Pareja Al', linea, resultado.jugadas, resultado.totalVenta, resultado.premioEncontrado, index),
                        venta: resultado.totalVenta,
                        premio: resultado.premioEncontrado
                    };
                }
            } else if (patrones.numeroAlNumero.test(linea)) {
                const resultado = procesarNumeroAlNumero(linea, numeroGanador);
                if (resultado) {
                    return {
                        tipo: 'Numero Al',
                        html: formatearJugadas('Numero Al', linea, resultado.jugadas, resultado.totalVenta, resultado.premioEncontrado, index),
                        venta: resultado.totalVenta,
                        premio: resultado.premioEncontrado
                    };
                }
            } else {
                const resultado = procesarGenerica(linea, numeroGanador);
                if (resultado) {
                    return {
                        tipo: 'Generica',
                        html: formatearJugadas('Generica', linea, resultado.jugadas, resultado.totalVenta, resultado.premioEncontrado, index),
                        venta: resultado.totalVenta,
                        premio: resultado.premioEncontrado
                    };
                }
            }

            // Si no coincide con ningún patrón conocido
            return {
                tipo: 'Error',
                html: `<div class="mensaje-error">Formato de jugada no reconocido: ${linea}</div>`,
                venta: 0,
                premio: 0
            };

        } catch (error) {
            console.error('Error procesando jugada:', error);
            return {
                tipo: 'Error',
                html: `<div class="mensaje-error">Error procesando jugada: ${linea}</div>`,
                venta: 0,
                premio: 0
            };
        }
    }

    // Event listener para el botón
    btnMostrarAnalisis.addEventListener('click', function () {
        const mensaje = mensajeVenta.value.trim();
    
        if (mensaje) {
            let resultadoHTML = '';
            if (!analisisVisible) {
                // Limpiar el contenedor de análisis y reiniciar el array de jugadas
                todasLasJugadas = [];
                analisisContainer.classList.add('analisis-container');
                
                // Agregar el input de filtro
                analisisContainer.innerHTML = '';
                analisisContainer.appendChild(filtroJugadas);

                const lineas = mensaje.split('\n').filter(linea => linea.trim());
    
                // Reiniciar contador de SMS y totales
                contadorSMS = 1;
                let ventaTotal = 0;
                let premioTotal = 0;
                let subtotalVenta = 0;
                let subtotalPremio = 0;
    
                lineas.forEach((linea, index) => {
                    // Si se detecta un SMS (y no es la primera línea), mostrar el subtotal del bloque actual
                    if (/^sms\s*$/i.test(linea) && index !== 0) {
                        const subtotalHTML = `
                            <div class="jugada-container subtotal">
                                <div class="jugada-original">
                                    <strong>Subtotal: Venta ${subtotalVenta}, Premio ${subtotalPremio}</strong>
                                </div>
                            </div>
                        `;
                        resultadoHTML += subtotalHTML;
                        todasLasJugadas.push(subtotalHTML);
                        
                        // Reiniciar los subtotales sin afectar el total general
                        subtotalVenta = 0;
                        subtotalPremio = 0;
                    }
    
                    // Procesar la jugada
                    const analisis = analizarJugada(linea, index);
                    resultadoHTML += analisis.html;
                    todasLasJugadas.push(analisis.html);
    
                    // Sumar ventas y premios devueltos por analizarJugada
                    subtotalVenta += analisis.venta || 0;
                    subtotalPremio += analisis.premio || 0;
                    
                    // Acumular en el total general (solo una vez)
                    ventaTotal += analisis.venta || 0;
                    premioTotal += analisis.premio || 0;
                });
    
                // Mostrar el último subtotal si el mensaje no termina con "sms"
                if (subtotalVenta > 0 || subtotalPremio > 0) {
                    const subtotalHTML = `
                        <div class="jugada-container subtotal">
                            <div class="jugada-original">
                                <strong>Subtotal: Venta ${subtotalVenta}, Premio ${subtotalPremio}</strong>
                            </div>
                        </div>
                    `;
                    resultadoHTML += subtotalHTML;
                    todasLasJugadas.push(subtotalHTML);
                }
    
                // Mostrar el total final
                const totalHTML = `
                    <div class="jugada-container">
                        <div class="jugada-original">
                            <strong>Venta total: ${ventaTotal}, Premio total: ${premioTotal}</strong>
                        </div>
                    </div>
                `;
                resultadoHTML += totalHTML;
                todasLasJugadas.push(totalHTML);
    
                // Imprimir todo el contenido, incluyendo el input de filtro
                analisisContainer.innerHTML += resultadoHTML;
                btnMostrarAnalisis.parentNode.insertBefore(analisisContainer, btnMostrarAnalisis.nextSibling);
                analisisContainer.style.display = 'block';
            } else {
                analisisContainer.style.display = 'none';
            }
    
            analisisVisible = !analisisVisible;
            btnMostrarAnalisis.textContent = analisisVisible ? 'Ocultar Análisis' : 'Mostrar Análisis';
        } else {
            alert("Por favor ingrese un mensaje para analizar.");
        }
    });
    
    // Desplazar hacia la jugada correspondiente al hacer clic
    analisisContainer.addEventListener('click', function (event) {
        // Ignorar clics en el input de filtro
        if (event.target === filtroJugadas) return;

        if (event.target.closest('.jugada-container')) {
            const id = event.target.closest('.jugada-container').id;
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});

// Parte 12 Excel nuevo

// Constantes para mensajes y configuración
const CONFIG = {
    MENSAJE_DURACION: 2000,
    MENSAJES: {
        FILA_ELIMINADA: 'Fila eliminada',
        NO_ELIMINAR_UNICA: 'No se puede eliminar la única fila',
        FILA_NO_VACIA: 'Para borrar, la fila debe estar vacía',
        SELECCIONAR_VENDEDOR: 'Debe seleccionar un vendedor',
        SELECCIONAR_HORARIO: 'Debe seleccionar un horario',
        INGRESAR_NUMERO: 'Debe ingresar un número ganador',
        VENTA_REGISTRADA: 'Venta registrada para'
    }
};

/**
 * Clase para manejar las funcionalidades de la calculadora
 */
class Calculadora {
    constructor() {
        this.modal = null;
        this.excelRows = null;
        this.totalSpan = null;
        this.premioTotalSpan = null;
        this.premioCountSpan = null;
        this.addRowBtn = null;
        this.messageDiv = null;
        this.activeRow = null;
        this.escapeHandler = null;
    }

    /**
     * Inicializa la calculadora
     */
    init() {
        this.modal = document.getElementById('calculadora-template');
        this.renderModal();
        this.setupEventListeners();
        this.actualizarInfoVendedor();
        this.agregarPrimeraFila();
        this.setupEscapeHandler();
        this.setupTouchSupport();
    }
    
    /**
     * Configura soporte mejorado para dispositivos táctiles
     */
    setupTouchSupport() {
        // Asegurarse de que los botones sean lo suficientemente grandes para táctil
        const addRowBtn = document.getElementById('calc-addRowBtn');
        const closeBtn = document.getElementById('calc-close-btn');
        
        if (addRowBtn) {
            addRowBtn.style.minHeight = '44px'; // Tamaño mínimo recomendado para táctil
            addRowBtn.style.fontSize = '16px';   // Texto legible
        }
        
        if (closeBtn) {
            closeBtn.style.minHeight = '44px';
            closeBtn.style.fontSize = '16px';
        }
        
        // Agregar botón flotante para dispositivos móviles que siempre permita agregar filas
        const mobileContainer = document.querySelector('.calc-main-container');
        if (mobileContainer && window.innerWidth <= 768) {
            const floatingBtn = document.createElement('button');
            floatingBtn.id = 'calc-floating-add';
            floatingBtn.innerHTML = '+';
            floatingBtn.style.position = 'fixed';
            floatingBtn.style.bottom = '80px';
            floatingBtn.style.right = '20px';
            floatingBtn.style.width = '50px';
            floatingBtn.style.height = '50px';
            floatingBtn.style.borderRadius = '50%';
            floatingBtn.style.backgroundColor = '#4CAF50';
            floatingBtn.style.color = 'white';
            floatingBtn.style.fontSize = '24px';
            floatingBtn.style.border = 'none';
            floatingBtn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
            floatingBtn.style.zIndex = '1000';
            floatingBtn.style.display = 'flex';
            floatingBtn.style.justifyContent = 'center';
            floatingBtn.style.alignItems = 'center';
            
            floatingBtn.addEventListener('click', () => {
                this.agregarNuevaFila();
            });
            
            mobileContainer.appendChild(floatingBtn);
        }
    }

    /**
     * Renderiza el contenido del modal
     */
    renderModal() {
        const calculadoraHTML = `
            <div class="calculadora-content">
                <h3>Calculadora de Números</h3>
                
                <div id="calc-info-vendedor" class="calc-info-vendedor">
                    <span id="calc-vendedor-nombre">-- Seleccione un vendedor --</span>
                    <span id="calc-numero-ganador">Número Ganador: </span>
                </div>
                
                <div id="calc-message" class="calc-message"></div>
                
                <!-- Contenedor principal con desplazamiento controlado -->
                <div class="calc-main-container">
                    <!-- Sección de tabla con desplazamiento -->
                    <div class="calc-scroll-container">
                        <div class="calc-excel-container">
                            <div class="calc-excel-header">
                                <div class="calc-excel-cell">Valor</div>
                                <div class="calc-excel-cell calc-premio">Premio</div>
                            </div>
                            <div id="calc-excelRows">
                                <!-- Las filas se agregarán aquí dinámicamente -->
                            </div>
                        </div>
                    </div>
                    
                    <!-- Sección fija inferior -->
                    <div class="calc-fixed-footer">
                        <div class="calc-excel-footer">
                            <div class="calc-excel-cell">Total: <span id="calc-total">0</span></div>
                            <div class="calc-excel-cell calc-premio">
                                Premio Total: <span id="calc-premioTotal">0</span>
                                (Cantidad: <span id="calc-premioCount">0</span>)
                            </div>
                        </div>
                        
                        <div class="calc-actions">
                            <button id="calc-addRowBtn" class="calc-primary-btn">Transferir Venta</button>
                            <button id="calc-close-btn" class="calc-secondary-btn">Cerrar Calculadora</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.modal.innerHTML = calculadoraHTML;
        this.modal.style.display = 'flex';
        
        // Obtener referencias a elementos DOM
        this.excelRows = document.getElementById('calc-excelRows');
        this.totalSpan = document.getElementById('calc-total');
        this.premioTotalSpan = document.getElementById('calc-premioTotal');
        this.premioCountSpan = document.getElementById('calc-premioCount');
        this.addRowBtn = document.getElementById('calc-addRowBtn');
        this.messageDiv = document.getElementById('calc-message');
        this.closeBtn = document.getElementById('calc-close-btn');
    }

    /**
     * Configura los event listeners principales
     */
    setupEventListeners() {
        // Event listener para el botón de cerrar
        this.closeBtn.addEventListener('click', () => this.cerrar());
        
        // Event listener para el botón de agregar fila (transferir venta)
        this.addRowBtn.addEventListener('click', () => this.transferirVenta());
        
        // Event listener para teclas Delete/Backspace
        document.addEventListener('keydown', (event) => this.handleKeyDown(event));
    }

    /**
     * Configura el manejador de la tecla Escape
     */
    setupEscapeHandler() {
        // Eliminar cualquier handler de Escape existente
        if (window.escapeHandler) {
            document.removeEventListener('keydown', window.escapeHandler);
        }
        
        // Crear nuevo handler para Escape
        window.escapeHandler = (event) => {
            if (event.key === 'Escape') {
                this.cerrar();
            }
        };
        
        // Agregar nuevo event listener
        document.addEventListener('keydown', window.escapeHandler);
    }

    /**
     * Actualiza la información del vendedor y número ganador
     */
    actualizarInfoVendedor() {
        const vendedorSelect = document.getElementById('vendedorSelect');
        const numeroGanadorInput = document.getElementById('numeroGanador');
        const calcVendedorNombre = document.getElementById('calc-vendedor-nombre');
        const calcNumeroGanador = document.getElementById('calc-numero-ganador');
        
        if (vendedorSelect && numeroGanadorInput && calcVendedorNombre && calcNumeroGanador) {
            const vendedorText = vendedorSelect.options[vendedorSelect.selectedIndex]?.text || '-- Seleccione un vendedor --';
            calcVendedorNombre.textContent = vendedorText;
            
            const numeroGanador = numeroGanadorInput.value;
            calcNumeroGanador.textContent = `Número Ganador: ${numeroAEmoji ? numeroAEmoji(numeroGanador) : numeroGanador}`;
        }
    }

    /**
     * Agrega la primera fila al inicializar
     */
    agregarPrimeraFila() {
        this.agregarNuevaFila();
    }

    /**
     * Maneja eventos de teclado
     * @param {KeyboardEvent} event - Evento de teclado
     */
    handleKeyDown(event) {
        // Manejar teclas Delete/Backspace para eliminar filas
        if ((event.key === 'Delete' || event.key === 'Backspace') && this.activeRow) {
            this.intentarEliminarFila();
        }
    }

    /**
     * Intenta eliminar la fila activa si está vacía
     */
    intentarEliminarFila() {
        // Solo borrar si la fila está vacía
        const valorInput = this.activeRow.querySelector('.calc-excel-input.valor-input');
        const premioInput = this.activeRow.querySelector('.calc-excel-input.premio-input');
        
        if (!valorInput.value && !premioInput.value) {
            // No borrar si solo hay una fila
            const allRows = document.querySelectorAll('.calc-excel-row');
            if (allRows.length > 1) {
                // Determinar qué fila enfocar después de borrar
                const nextRow = this.activeRow.nextElementSibling;
                const prevRow = this.activeRow.previousElementSibling;
                
                // Eliminar la fila activa
                this.activeRow.remove();
                
                // Enfocar la siguiente fila o la anterior si no hay siguiente
                if (nextRow && nextRow.classList.contains('calc-excel-row')) {
                    nextRow.querySelector('.valor-input').focus();
                    this.setActiveRow(nextRow);
                } else if (prevRow && prevRow.classList.contains('calc-excel-row')) {
                    prevRow.querySelector('.valor-input').focus();
                    this.setActiveRow(prevRow);
                }
                
                this.calcularTotal();
                this.mostrarMensaje(CONFIG.MENSAJES.FILA_ELIMINADA);
            } else {
                this.mostrarMensaje(CONFIG.MENSAJES.NO_ELIMINAR_UNICA);
            }
        } else {
            this.mostrarMensaje(CONFIG.MENSAJES.FILA_NO_VACIA);
        }
    }

    /**
     * Establece la fila activa
     * @param {HTMLElement} row - Elemento DOM de la fila
     */
    setActiveRow(row) {
        // Quitar clase active-row de todas las filas
        document.querySelectorAll('.calc-excel-row').forEach(r => {
            r.classList.remove('calc-active-row');
        });
        
        // Agregar clase active-row a la fila actual
        row.classList.add('calc-active-row');
        
        // Actualizar referencia a la fila activa
        this.activeRow = row;
    }

    /**
     * Agrega una nueva fila a la calculadora
     * @returns {HTMLElement} - El elemento DOM de la nueva fila
     */
    agregarNuevaFila() {
        const newRow = document.createElement('div');
        newRow.className = 'calc-excel-row';
        newRow.innerHTML = `
            <div class="calc-excel-cell">
                <input type="number" class="calc-excel-input valor-input" placeholder="Ingresa un número...">
            </div>
            <div class="calc-excel-cell calc-premio">
                <input type="number" class="calc-excel-input premio-input calc-premio-input" placeholder="Premio...">
            </div>
        `;
        this.excelRows.appendChild(newRow);
        
        // Obtener los inputs de la nueva fila
        const valorInput = newRow.querySelector('.valor-input');
        const premioInput = newRow.querySelector('.premio-input');
        
        // Configurar event listeners para la fila
        this.setupRowEventListeners(newRow, valorInput, premioInput);
        
        // Enfocar automáticamente el input de valor
        valorInput.focus();
        this.setActiveRow(newRow);
        
        // Desplazar la vista para asegurar que la nueva fila sea visible
        // Especialmente importante para dispositivos móviles
        setTimeout(() => {
            const scrollContainer = document.querySelector('.calc-scroll-container');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }, 100);
        
        return newRow;
    }

    /**
     * Configura los event listeners para una fila
     * @param {HTMLElement} row - Elemento DOM de la fila
     * @param {HTMLElement} valorInput - Input de valor
     * @param {HTMLElement} premioInput - Input de premio
     */
    setupRowEventListeners(row, valorInput, premioInput) {
        // Marcar fila como activa al hacer clic en ella
        row.addEventListener('click', () => this.setActiveRow(row));
        
        // Marcar fila como activa al enfocar un input
        valorInput.addEventListener('focus', () => this.setActiveRow(row));
        premioInput.addEventListener('focus', () => this.setActiveRow(row));
        
        // Event listener para teclas en valor-input
        valorInput.addEventListener('keydown', (event) => {
            this.handleValorInputKeyDown(event, row);
        });
        
        // Event listener para teclas en premio-input
        premioInput.addEventListener('keydown', (event) => {
            this.handlePremioInputKeyDown(event, row);
        });
        
        // Event listeners para cambios en los valores
        valorInput.addEventListener('input', () => this.calcularTotal());
        premioInput.addEventListener('input', () => this.calcularTotal());
    }

    /**
     * Maneja eventos de teclado en el input de valor
     * @param {KeyboardEvent} event - Evento de teclado
     * @param {HTMLElement} row - Elemento DOM de la fila actual
     */
    handleValorInputKeyDown(event, row) {
        if (event.key === 'Enter') {
            event.preventDefault();
            // Crear nueva fila y enfocar su valor-input
            const newRowElement = this.agregarNuevaFila();
            newRowElement.querySelector('.valor-input').focus();
            this.calcularTotal();
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            // Navegar a la fila anterior
            const prevRow = row.previousElementSibling;
            if (prevRow && prevRow.classList.contains('calc-excel-row')) {
                prevRow.querySelector('.valor-input').focus();
            }
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            // Navegar a la fila siguiente
            const nextRow = row.nextElementSibling;
            if (nextRow) {
                nextRow.querySelector('.valor-input').focus();
            }
        } else if (event.key === 'Tab' && !event.shiftKey) {
            // Permitir la navegación natural con Tab hacia el campo de premio
        }
    }

    /**
     * Maneja eventos de teclado en el input de premio
     * @param {KeyboardEvent} event - Evento de teclado
     * @param {HTMLElement} row - Elemento DOM de la fila actual
     */
    handlePremioInputKeyDown(event, row) {
        if (event.key === 'ArrowUp') {
            event.preventDefault();
            const prevRow = row.previousElementSibling;
            if (prevRow && prevRow.classList.contains('calc-excel-row')) {
                prevRow.querySelector('.premio-input').focus();
            }
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            const nextRow = row.nextElementSibling;
            if (nextRow) {
                nextRow.querySelector('.premio-input').focus();
            }
        } else if (event.key === 'Enter') {
            event.preventDefault();
            // Crear nueva fila y enfocar su valor-input (comportamiento consistente)
            const newRowElement = this.agregarNuevaFila();
            newRowElement.querySelector('.valor-input').focus();
            this.calcularTotal();
        }
    }

    /**
     * Transfiere la venta al registro
     */
    transferirVenta() {
        // Validar campos necesarios
        if (!this.validarCampos()) return;
        
        // Obtener datos para la venta
        const totalVenta = parseFloat(this.totalSpan.textContent);
        const totalPremio = parseFloat(this.premioTotalSpan.textContent);
        const cantidadPremios = parseInt(this.premioCountSpan.textContent);
        
        const vendedorSelect = document.getElementById('vendedorSelect');
        const horarioSelect = document.getElementById('horarioSelect');
        const numeroGanadorInput = document.getElementById('numeroGanador');
        
        // Obtener vendedor seleccionado
        const vendedorId = vendedorSelect.value;
        const vendedor = window.vendedores ? window.vendedores[vendedorId] : null;
        
        if (!vendedor) {
            this.mostrarMensajeExterno(CONFIG.MENSAJES.SELECCIONAR_VENDEDOR, 'error');
            return;
        }
        
        // Obtener horario y número ganador
        const horario = horarioSelect.value;
        const numeroGanador = parseInt(numeroGanadorInput.value);
        
        // Registrar la venta
        // En la función transferirVenta()
        // Registrar la venta
        const fechaVentaInput = document.getElementById('fechaVenta');
        const fechaActual = window.obtenerFechaFormateada ? window.obtenerFechaFormateada() : new Date().toISOString();
        const fechaVenta = fechaVentaInput?.value || fechaActual; // Usar fecha seleccionada o actual como respaldo

        // Y luego usar fechaVenta en lugar de fechaActual al crear el objeto de venta
        const venta = {
            fecha: fechaVenta,
            horario: horario,
            totalVenta: totalVenta,
            premio: totalPremio,
            numeroGanador: numeroGanador,
            cantidadPremios: cantidadPremios
        };
        
        // Agregar venta al vendedor
        if (!vendedor.ventas) vendedor.ventas = [];
        vendedor.ventas.push(venta);
        
        // Mostrar mensaje de éxito
        this.mostrarMensajeExterno(`${CONFIG.MENSAJES.VENTA_REGISTRADA} ${vendedor.nombre}`, 'success');
        
        // Cerrar calculadora
        this.cerrar();
        
        // Actualizar lista de vendedores si existe la función
        if (window.actualizarListaVendedores) {
            window.actualizarListaVendedores();
        }
    }

    /**
     * Valida que los campos necesarios estén completos
     * @returns {boolean} - true si todos los campos son válidos, false en caso contrario
     */
    validarCampos() {
        const vendedorSelect = document.getElementById('vendedorSelect');
        const horarioSelect = document.getElementById('horarioSelect');
        const numeroGanadorInput = document.getElementById('numeroGanador');
        
        // Verificar vendedor
        if (!vendedorSelect || !vendedorSelect.value) {
            this.mostrarMensajeExterno(CONFIG.MENSAJES.SELECCIONAR_VENDEDOR, 'error');
            return false;
        }
        
        // Verificar horario
        if (!horarioSelect || !horarioSelect.value) {
            this.mostrarMensajeExterno(CONFIG.MENSAJES.SELECCIONAR_HORARIO, 'error');
            return false;
        }
        
        // Verificar número ganador
        if (!numeroGanadorInput || !numeroGanadorInput.value) {
            this.mostrarMensajeExterno(CONFIG.MENSAJES.INGRESAR_NUMERO, 'error');
            return false;
        }
        
        return true;
    }

    /**
     * Calcula el total de valores y premios
     */
    calcularTotal() {
        try {
            const valores = document.querySelectorAll('.calc-excel-row .valor-input');
            const premios = document.querySelectorAll('.calc-excel-row .premio-input');
            
            let total = 0;
            let premioTotal = 0;
            let cantidadPremios = 0;
            
            // Sumar valores
            valores.forEach((input) => {
                if (input.value) {
                    const valor = parseFloat(input.value);
                    if (!isNaN(valor)) {
                        total += valor;
                    }
                }
            });
            
            // Sumar premios
            premios.forEach((input) => {
                if (input.value) {
                    const premio = parseFloat(input.value);
                    if (!isNaN(premio)) {
                        premioTotal += premio;
                        cantidadPremios++;
                    }
                }
            });
            
            // Actualizar los totales en la interfaz
            this.totalSpan.textContent = total.toFixed(2);
            this.premioTotalSpan.textContent = premioTotal.toFixed(2);
            this.premioCountSpan.textContent = cantidadPremios;
        } catch (error) {
            console.error('Error al calcular totales:', error);
        }
    }

    /**
     * Muestra un mensaje temporal en la calculadora
     * @param {string} text - Texto del mensaje
     * @param {number} duration - Duración en milisegundos
     */
    mostrarMensaje(text, duration = CONFIG.MENSAJE_DURACION) {
        if (this.messageDiv) {
            this.messageDiv.textContent = text;
            this.messageDiv.style.display = 'block';
            setTimeout(() => {
                this.messageDiv.style.display = 'none';
            }, duration);
        }
    }

    /**
     * Muestra un mensaje en el sistema principal (fuera de la calculadora)
     * @param {string} texto - Texto del mensaje
     * @param {string} tipo - Tipo de mensaje ('success', 'error', etc.)
     */
    mostrarMensajeExterno(texto, tipo) {
        if (window.mostrarMensaje) {
            window.mostrarMensaje(texto, tipo);
        } else {
            console.log(`${tipo}: ${texto}`);
        }
    }

    /**
     * Cierra la calculadora
     */
    cerrar() {
        if (this.modal) {
            this.modal.style.display = 'none';
        }
    }
}

/**
 * Función para abrir la calculadora
 * Point of entry principal
 */
function abrirCalculadora() {
    const calculadora = new Calculadora();
    calculadora.init();
}

/**
 * Función para cerrar la calculadora (mantiene compatibilidad con código existente)
 */
function cerrarCalculadora() {
    const calculadoraModal = document.getElementById('calculadora-template');
    if (calculadoraModal) {
        calculadoraModal.style.display = 'none';
    }
}

// Exportar funciones y clases (para compatibilidad con módulos si se necesita)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        abrirCalculadora,
        cerrarCalculadora,
        Calculadora
    };
}

//Parte  13 Eliminar una venta del dia que me aga falta
/**
 * Elimina una venta específica de un vendedor según la fecha y horario
 * @param {number} vendedorIndex - Índice del vendedor en el array vendedores
 * @param {string} fecha - Fecha de la venta en formato DD/MM/YYYY o YYYY-MM-DD
 * @param {string} horario - Horario de la venta ('dia' o 'noche')
 * @returns {boolean} - true si se eliminó alguna venta, false si no se encontró ninguna
 */
function eliminarVentaVendedor(vendedorIndex, fecha, horario) {
    // Obtener el vendedor
    const vendedor = vendedores[vendedorIndex];
    if (!vendedor) {
        mostrarMensaje('Error: Vendedor no encontrado', 'error');
        return false;
    }
    
    // Normalizar la fecha para comparación
    const fechaNormalizada = obtenerFechaFormateada(fecha);
    
    // Comprobar si el vendedor tiene ventas
    if (!vendedor.ventas || vendedor.ventas.length === 0) {
        mostrarMensaje(`${vendedor.nombre} no tiene ventas registradas`, 'error');
        return false;
    }
    
    // Encontrar índices de las ventas que coinciden con la fecha y horario
    const indicesAEliminar = [];
    vendedor.ventas.forEach((venta, index) => {
        const ventaFechaNormalizada = obtenerFechaFormateada(venta.fecha);
        if (ventaFechaNormalizada === fechaNormalizada && venta.horario === horario) {
            indicesAEliminar.push(index);
        }
    });
    
    // Si no se encontraron ventas que coincidan
    if (indicesAEliminar.length === 0) {
        mostrarMensaje(`No se encontraron ventas para ${vendedor.nombre} en la fecha ${fechaNormalizada} y horario ${horario === 'dia' ? 'Día' : 'Noche'}`, 'error');
        return false;
    }
    
    // Mostrar confirmación con detalles de las ventas a eliminar
    let mensajeConfirmacion = `¿Está seguro de eliminar ${indicesAEliminar.length} venta(s) de ${vendedor.nombre} para la fecha ${fechaNormalizada} (${horario === 'dia' ? 'Día' : 'Noche'})?\n\n`;
    
    indicesAEliminar.forEach(index => {
        const venta = vendedor.ventas[index];
        mensajeConfirmacion += `- Venta: ${venta.totalVenta.toLocaleString()}, Premio: ${venta.premio.toLocaleString()}\n`;
    });
    
    // Pedir confirmación al usuario
    if (!confirm(mensajeConfirmacion)) {
        mostrarMensaje('Operación cancelada por el usuario', 'info');
        return false;
    }
    
    // Eliminar las ventas (empezando desde el índice más alto para no afectar los índices anteriores)
    indicesAEliminar.sort((a, b) => b - a).forEach(index => {
        vendedor.ventas.splice(index, 1);
    });
    
    // Si el vendedor tiene jefes, también eliminar las ventas correspondientes de los jefes
    if (vendedor.jefes && vendedor.jefes.length > 0) {
        vendedor.jefes.forEach(jefeNombre => {
            const jefe = jefes.find(j => j.nombre === jefeNombre);
            if (jefe && jefe.ventas && jefe.ventas.length > 0) {
                // Encontrar y eliminar las ventas del jefe para la misma fecha/horario
                const indicesJefe = [];
                jefe.ventas.forEach((venta, index) => {
                    const ventaFechaNormalizada = obtenerFechaFormateada(venta.fecha);
                    if (ventaFechaNormalizada === fechaNormalizada && venta.horario === horario) {
                        indicesJefe.push(index);
                    }
                });
                
                // Eliminar las ventas encontradas
                indicesJefe.sort((a, b) => b - a).forEach(index => {
                    jefe.ventas.splice(index, 1);
                });
            }
        });
    }
    
    // Guardar los cambios
    guardarDatos();
    
    // Mostrar mensaje de éxito
    mostrarMensaje(`Se eliminaron ${indicesAEliminar.length} venta(s) de ${vendedor.nombre} para la fecha ${fechaNormalizada} (${horario === 'dia' ? 'Día' : 'Noche'})`, 'success');
    
    // Actualizar la interfaz
    actualizarListaVendedores();
    
    return true;
}

/**
 * Abre un modal para seleccionar fecha y horario a eliminar
 * @param {number} vendedorIndex - Índice del vendedor en el array vendedores
 */
function abrirModalEliminarVenta(vendedorIndex) {
    const vendedor = vendedores[vendedorIndex];
    if (!vendedor) {
        mostrarMensaje('Error: Vendedor no encontrado', 'error');
        return;
    }
    
    // Crear modal para seleccionar fecha y horario
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';
    
    // Obtener la fecha actual para el valor predeterminado
    const fechaActual = new Date();
    const fechaFormateada = fechaActual.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    
    // Contenido del modal
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.style.backgroundColor = document.body.classList.contains('dark-mode') ? '#333' : '#fff';
    modalContent.style.color = document.body.classList.contains('dark-mode') ? '#fff' : '#000';
    modalContent.style.padding = '20px';
    modalContent.style.borderRadius = '8px';
    modalContent.style.width = '350px';
    modalContent.style.maxWidth = '90%';
    
    modalContent.innerHTML = `
        <h3 style="margin-top: 0; text-align: center;">Eliminar Venta de ${vendedor.nombre}</h3>
        <p style="color: red; text-align: center; font-weight: bold;">ADVERTENCIA: Esta acción no se puede deshacer.</p>
        
        <div style="margin: 20px 0;">
            <div style="margin-bottom: 15px;">
                <label for="fechaEliminar" style="display: block; margin-bottom: 5px;">Fecha:</label>
                <input type="date" id="fechaEliminar" value="${fechaFormateada}" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc; ${document.body.classList.contains('dark-mode') ? 'background-color: #444; color: white;' : ''}">
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px;">Horario:</label>
                <div style="display: flex; gap: 15px;">
                    <label style="display: flex; align-items: center; cursor: pointer;">
                        <input type="radio" name="horarioEliminar" value="dia" checked>
                        <span style="margin-left: 5px;">Día</span>
                    </label>
                    <label style="display: flex; align-items: center; cursor: pointer;">
                        <input type="radio" name="horarioEliminar" value="noche">
                        <span style="margin-left: 5px;">Noche</span>
                    </label>
                </div>
            </div>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-top: 20px;">
            <button id="btnCancelarEliminar" style="padding: 8px 16px; border: none; border-radius: 4px; background-color: #ccc; cursor: pointer;">Cancelar</button>
            <button id="btnConfirmarEliminar" style="padding: 8px 16px; border: none; border-radius: 4px; background-color: #d9534f; color: white; cursor: pointer;">Eliminar Venta</button>
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Evento para cancelar
    document.getElementById('btnCancelarEliminar').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Evento para confirmar eliminación
    document.getElementById('btnConfirmarEliminar').addEventListener('click', () => {
        const fechaSeleccionada = document.getElementById('fechaEliminar').value;
        const horarioSeleccionado = document.querySelector('input[name="horarioEliminar"]:checked').value;
        
        // Llamar a la función para eliminar la venta
        const resultado = eliminarVentaVendedor(vendedorIndex, fechaSeleccionada, horarioSeleccionado);
        
        // Si se eliminó correctamente, actualizar vista
        if (resultado) {
            // Mostrar la vista actualizada con las ventas del mismo horario
            verVentasVendedorPorHorario(vendedorIndex, horarioSeleccionado);
        }
        
        // Cerrar el modal
        document.body.removeChild(modal);
    });
}