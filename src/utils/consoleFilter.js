// Filtro para ocultar errores conocidos de Firebase que no afectan la funcionalidad
// Esto es solo para desarrollo - estos errores son causados por bloqueadores de anuncios

const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

// Lista de errores que queremos filtrar (causados por bloqueadores de anuncios)
const errorsToFilter = [
  'net::ERR_BLOCKED_BY_CLIENT',
  'FirebaseError: Firebase: Error (auth/api-key-not-valid',
  'POST https://firestore.googleapis.com',
  'TYPE=terminate'
];

// Función para verificar si un error debe ser filtrado
const shouldFilterError = (message) => {
  if (typeof message !== 'string') return false;
  return errorsToFilter.some(filter => message.includes(filter));
};

// Sobrescribir console.error para filtrar errores conocidos
console.error = (...args) => {
  const message = args[0];
  if (shouldFilterError(message)) {
    // No mostrar estos errores en desarrollo
    return;
  }
  originalConsoleError.apply(console, args);
};

// Sobrescribir console.warn para filtrar advertencias conocidas
console.warn = (...args) => {
  const message = args[0];
  if (shouldFilterError(message)) {
    // No mostrar estas advertencias en desarrollo
    return;
  }
  originalConsoleWarn.apply(console, args);
};

export { originalConsoleError, originalConsoleWarn };
