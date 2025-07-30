// Archivo para probar la conexión con Firebase
import { crearHabitacionesIniciales, obtenerHabitaciones, actualizarHabitacion, crearUsuario } from './database.js';
import { crearUsuarioFirestore } from './auth-alternativa.js';

// Función para corregir precios de habitaciones existentes
export const corregirPreciosHabitaciones = async () => {
  try {
    const preciosCorrectos = {
      1: { precio5Horas: 40000 }, 2: { precio5Horas: 40000 }, 3: { precio5Horas: 40000 }, 4: { precio5Horas: 40000 },
      7: { precio5Horas: 40000 }, 8: { precio5Horas: 40000 }, 9: { precio5Horas: 40000 }, 10: { precio5Horas: 40000 },
      5: { precio5Horas: 45000 }, 6: { precio5Horas: 45000 },
      11: { precio5Horas: 65000 }
    };
    
    for (const [numero, datos] of Object.entries(preciosCorrectos)) {
      await actualizarHabitacion(`habitacion-${numero}`, datos);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error al corregir precios:', error);
    return false;
  }
};

// Función para inicializar la base de datos por primera vez
export const inicializarBaseDatos = async () => {
  try {
    // Crear habitaciones iniciales
    const habitacionesCreadas = await crearHabitacionesIniciales();
    
    // Corregir precios si es necesario
    await corregirPreciosHabitaciones();
    
    // Probar obtener habitaciones
    const habitaciones = await obtenerHabitaciones();
    
    return true;
  } catch (error) {
    console.error('❌ Error al inicializar base de datos:', error);
    return false;
  }
};

// Función para crear el usuario administrador inicial
export const crearAdministradorInicial = async () => {
  try {
    console.log('👤 Creando administrador inicial...');
    
    const datosAdmin = {
      usuario: 'admin',
      password: 'eclipse2024',
      nombre: 'Administrador',
      apellido: 'Principal',
      rol: 'administrador',
      telefono: '3001234567',
      activo: true
    };
    
    // Usar directamente Firestore (sin intentar Firebase Auth)
    const adminCreado = await crearUsuarioFirestore(datosAdmin);
    
    if (adminCreado.success) {
      console.log('✅ Administrador inicial creado:');
      console.log('� Usuario:', datosAdmin.usuario);
      console.log('🔑 Contraseña:', datosAdmin.password);
      console.log('⚠️ IMPORTANTE: Cambie la contraseña después del primer login');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('❌ Error al crear administrador inicial:', error);
    return false;
  }
};

// Función de prueba simple
export const probarConexion = async () => {
  try {
    const habitaciones = await obtenerHabitaciones();
    return true;
  } catch (error) {
    console.error('❌ Error de conexión:', error);
    return false;
  }
};
