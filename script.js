// Elementos
const pageTitle = document.getElementById('page-title');
const tituloHeader = document.getElementById('tituloHeader');
const tituloInput = document.getElementById('tituloInput');
const nombreInput = document.getElementById('nombreInput');
const nombreSpan = document.getElementById('nombreSpan');
const mensajeEl = document.getElementById('mensaje');
const diasEl = document.getElementById('dias');
const horasEl = document.getElementById('horas');
const minutosEl = document.getElementById('minutos');
const segundosEl = document.getElementById('segundos');
const fechaInput = document.getElementById('fechaInput');
const body = document.body;
const contenidoPrincipal = document.getElementById('contenidoPrincipal');

// Valores por defecto
const TITULO_DEFAULT = "AYUDA ALQUILER";
const NOMBRE_DEFAULT = "Clara";
const FECHA_DEFAULT = new Date(2025, 10, 30, 23, 59, 0); // 30 Nov 2025 23:59

// Guardar y cargar config desde localStorage
function guardarDatoLocal(nombre, valor) {
  localStorage.setItem(nombre, valor);
}
function cargarDatoLocal(nombre, porDefecto) {
  return localStorage.getItem(nombre) || porDefecto;
}
function guardarFecha(fecha) {
  localStorage.setItem('fechaLimite', fecha.toISOString());
}
function cargarFechaGuardada() {
  const val = localStorage.getItem('fechaLimite');
  if (!val) return null;
  const f = new Date(val);
  if (isNaN(f)) return null;
  return f;
}

// Inicializar valores de nombre, título y fecha
let tituloUsuario = cargarDatoLocal('tituloUsuario', TITULO_DEFAULT);
let nombreUsuario = cargarDatoLocal('nombreUsuario', NOMBRE_DEFAULT);
let fechaLimite = cargarFechaGuardada() || FECHA_DEFAULT;

// Actualizar UI con valores almacenados o por defecto
tituloHeader.textContent = tituloUsuario;
pageTitle.textContent = tituloUsuario;
tituloInput.value = tituloUsuario;

nombreSpan.textContent = nombreUsuario;
nombreInput.value = nombreUsuario;

function formatearParaInput(fecha) {
  const pad = n => n.toString().padStart(2, '0');
  const yyyy = fecha.getFullYear();
  const mm = pad(fecha.getMonth() + 1);
  const dd = pad(fecha.getDate());
  const hh = pad(fecha.getHours());
  const min = pad(fecha.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}
fechaInput.value = formatearParaInput(fechaLimite);

// Listeners para inputs
tituloInput.addEventListener('input', () => {
  let val = tituloInput.value.trim() || TITULO_DEFAULT;
  tituloHeader.textContent = val;
  pageTitle.textContent = val;
  guardarDatoLocal('tituloUsuario', val);
});
nombreInput.addEventListener('input', () => {
  let val = nombreInput.value.trim() || NOMBRE_DEFAULT;
  nombreSpan.textContent = val;
  guardarDatoLocal('nombreUsuario', val);
});
fechaInput.addEventListener('change', () => {
  const nuevaFecha = new Date(fechaInput.value);
  if (isNaN(nuevaFecha) || nuevaFecha <= new Date()) {
    alert('Por favor, selecciona una fecha válida en el futuro.');
    fechaInput.value = formatearParaInput(fechaLimite);
    return;
  }
  fechaLimite = nuevaFecha;
  guardarFecha(fechaLimite);
  notificado = false;
});

// Animación numérica
function animarValor(element, nuevoValor) {
  if (element.textContent !== nuevoValor) {
    element.classList.add('animar');
    element.textContent = nuevoValor;
    setTimeout(() => {
      element.classList.remove('animar');
    }, 300);
  }
}

let notificado = false;

function actualizarContador() {
  const ahora = new Date();
  let diff = fechaLimite - ahora;

  if (diff < 0) {
    mensajeEl.innerHTML = `<span id="nombreSpan">${nombreInput.value.trim() || NOMBRE_DEFAULT}</span>, el tiempo ha terminado!`;
    animarValor(diasEl, '00');
    animarValor(horasEl, '00');
    animarValor(minutosEl, '00');
    animarValor(segundosEl, '00');
    body.className = '';
    body.classList.add('rojo');
    contenidoPrincipal.style.color = getComputedStyle(document.documentElement).getPropertyValue('--color-rojo');
    return;
  }

  const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -= dias * (1000 * 60 * 60 * 24);
  const horas = Math.floor(diff / (1000 * 60 * 60));
  diff -= horas * (1000 * 60 * 60);
  const minutos = Math.floor(diff / (1000 * 60));
  diff -= minutos * (1000 * 60);
  const segundos = Math.floor(diff / 1000);

  const formato = n => n.toString().padStart(2, '0');
  animarValor(diasEl, formato(dias));
  animarValor(horasEl, formato(horas));
  animarValor(minutosEl, formato(minutos));
  animarValor(segundosEl, formato(segundos));

  // Cambiar clases y mensaje según días restantes
  body.classList.remove('verde', 'amarillo', 'rojo');
  const nombreActual = nombreInput.value.trim() || NOMBRE_DEFAULT;
  if (dias > 15) {
    body.classList.add('verde');
    mensajeEl.innerHTML = `<span id="nombreSpan">${nombreActual}</span>, te queda:`;
    contenidoPrincipal.style.color = getComputedStyle(document.documentElement).getPropertyValue('--color-verde');
  } else if (dias > 5) {
    body.classList.add('amarillo');
    mensajeEl.innerHTML = `<span id="nombreSpan">${nombreActual}</span>, te queda:`;
    contenidoPrincipal.style.color = getComputedStyle(document.documentElement).getPropertyValue('--color-amarillo');
  } else {
    body.classList.add('rojo');
    mensajeEl.innerHTML = `¡¡${nombreActual.toUpperCase()}!! Te queda solamente:`;
    contenidoPrincipal.style.color = getComputedStyle(document.documentElement).getPropertyValue('--color-rojo');
    if (!notificado) {
      alert('¡Quedan menos de 5 días!');
      notificado = true;
    }
  }
}

setInterval(actualizarContador, 1000);
actualizarContador();
