// Archivo para probar la conexión con Firebase
import { crearHabitacionesIniciales, obtenerHabitaciones, actualizarHabitacion } from './database.js';

// Función para corregir precios de habitaciones existentes
export const corregirPreciosHabitaciones = async () => {
  try {
    console.log('🔧 Corrigiendo precios de habitaciones...');
    
    const preciosCorrectos = {
      1: { precio5Horas: 40000 }, 2: { precio5Horas: 40000 }, 3: { precio5Horas: 40000 }, 4: { precio5Horas: 40000 },
      7: { precio5Horas: 40000 }, 8: { precio5Horas: 40000 }, 9: { precio5Horas: 40000 }, 10: { precio5Horas: 40000 },
      5: { precio5Horas: 45000 }, 6: { precio5Horas: 45000 },
      11: { precio5Horas: 65000 }
    };
    
    for (const [numero, datos] of Object.entries(preciosCorrectos)) {
      await actualizarHabitacion(`habitacion-${numero}`, datos);
    }
    
    console.log('✅ Precios corregidos correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error al corregir precios:', error);
    return false;
  }
};

// Función para inicializar la base de datos por primera vez
export const inicializarBaseDatos = async () => {
  try {
    console.log('🚀 Inicializando base de datos...');
    
    // Crear habitaciones iniciales
    const habitacionesCreadas = await crearHabitacionesIniciales();
    if (habitacionesCreadas) {
      console.log('✅ Habitaciones creadas correctamente');
    }
    
    // Ya no creamos productos iniciales - el inventario debe empezar vacío
    console.log('📦 Inventario iniciado vacío - listo para crear productos reales');
    
    // Corregir precios si es necesario
    await corregirPreciosHabitaciones();
    
    // Probar obtener habitaciones
    const habitaciones = await obtenerHabitaciones();
    console.log('✅ Habitaciones obtenidas:', habitaciones.length);
    
    return true;
  } catch (error) {
    console.error('❌ Error al inicializar base de datos:', error);
    return false;
  }
};

// Función de prueba simple
export const probarConexion = async () => {
  try {
    const habitaciones = await obtenerHabitaciones();
    console.log('✅ Conexión exitosa. Habitaciones encontradas:', habitaciones.length);
    return true;
  } catch (error) {
    console.error('❌ Error de conexión:', error);
    return false;
  }
};
