// Funciones para manejar datos en Firebase - Motel Eclipse
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  addDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './config.js';

// ===== FUNCIONES PARA HABITACIONES =====

// Obtener todas las habitaciones
export const obtenerHabitaciones = async () => {
  try {
    const habitacionesRef = collection(db, 'habitaciones');
    const snapshot = await getDocs(habitacionesRef);
    const habitaciones = [];
    
    snapshot.forEach((doc) => {
      habitaciones.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return habitaciones;
  } catch (error) {
    console.error('Error al obtener habitaciones:', error);
    return [];
  }
};

// Actualizar estado de una habitación
export const actualizarHabitacion = async (habitacionId, datosActualizados) => {
  try {
    // Convertir habitacionId a string para asegurar compatibilidad con Firestore
    const habitacionIdString = String(habitacionId);
    const habitacionRef = doc(db, 'habitaciones', habitacionIdString);
    await updateDoc(habitacionRef, {
      ...datosActualizados,
      fechaActualizacion: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error al actualizar habitación:', error);
    return false;
  }
};

// Crear habitaciones iniciales (solo se ejecuta una vez)
export const crearHabitacionesIniciales = async () => {
  try {
    const habitacionesIniciales = [
      // Habitaciones estándar
      { numero: 1, tipo: 'Estándar', estado: 'disponible', precio5Horas: 40000, horaIngreso: null, ventasActuales: [] },
      { numero: 2, tipo: 'Estándar', estado: 'disponible', precio5Horas: 40000, horaIngreso: null, ventasActuales: [] },
      { numero: 3, tipo: 'Estándar', estado: 'disponible', precio5Horas: 40000, horaIngreso: null, ventasActuales: [] },
      { numero: 4, tipo: 'Estándar', estado: 'disponible', precio5Horas: 40000, horaIngreso: null, ventasActuales: [] },
      { numero: 7, tipo: 'Estándar', estado: 'disponible', precio5Horas: 40000, horaIngreso: null, ventasActuales: [] },
      { numero: 8, tipo: 'Estándar', estado: 'disponible', precio5Horas: 40000, horaIngreso: null, ventasActuales: [] },
      { numero: 9, tipo: 'Estándar', estado: 'disponible', precio5Horas: 40000, horaIngreso: null, ventasActuales: [] },
      { numero: 10, tipo: 'Estándar', estado: 'disponible', precio5Horas: 40000, horaIngreso: null, ventasActuales: [] },
      
      // Habitaciones con máquina del amor
      { numero: 5, tipo: 'Con Máquina del Amor', estado: 'disponible', precio5Horas: 45000, horaIngreso: null, ventasActuales: [] },
      { numero: 6, tipo: 'Con Máquina del Amor', estado: 'disponible', precio5Horas: 45000, horaIngreso: null, ventasActuales: [] },
      
      // Suite
      { numero: 11, tipo: 'Suite', estado: 'disponible', precio5Horas: 65000, horaIngreso: null, ventasActuales: [] }
    ];

    for (const habitacion of habitacionesIniciales) {
      const habitacionRef = doc(db, 'habitaciones', `habitacion-${habitacion.numero}`);
      await setDoc(habitacionRef, {
        ...habitacion,
        fechaCreacion: serverTimestamp()
      });
    }
    
    console.log('Habitaciones iniciales creadas correctamente');
    return true;
  } catch (error) {
    console.error('Error al crear habitaciones iniciales:', error);
    return false;
  }
};

// ===== FUNCIONES PARA VENTAS =====

// Guardar una venta
export const guardarVenta = async (ventaData) => {
  try {
    const ventasRef = collection(db, 'ventas');
    const docRef = await addDoc(ventasRef, {
      ...ventaData,
      fechaRegistro: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error al guardar venta:', error);
    return null;
  }
};

// Obtener ventas por fecha
export const obtenerVentasPorFecha = async (fecha) => {
  try {
    const ventasRef = collection(db, 'ventas');
    const q = query(
      ventasRef,
      where('fecha', '==', fecha),
      orderBy('fechaRegistro', 'desc')
    );
    
    const snapshot = await getDocs(q);
    const ventas = [];
    
    snapshot.forEach((doc) => {
      ventas.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return ventas;
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    return [];
  }
};

// ===== FUNCIONES PARA PRODUCTOS =====

// Obtener catálogo de productos
export const obtenerProductos = async () => {
  try {
    const productosRef = collection(db, 'productos');
    const snapshot = await getDocs(productosRef);
    const productos = [];
    
    snapshot.forEach((doc) => {
      productos.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return productos;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return [];
  }
};

// Crear un nuevo producto
export const crearProducto = async (producto) => {
  try {
    const productoId = `producto-${producto.id}`;
    const productoRef = doc(db, 'productos', productoId);
    await setDoc(productoRef, {
      ...producto,
      fechaCreacion: serverTimestamp(),
      fechaActualizacion: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error al crear producto:', error);
    return false;
  }
};

// Actualizar un producto existente
export const actualizarProducto = async (productoId, datosActualizados) => {
  try {
    const productoIdString = `producto-${productoId}`;
    const productoRef = doc(db, 'productos', productoIdString);
    await updateDoc(productoRef, {
      ...datosActualizados,
      fechaActualizacion: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    return false;
  }
};

// Eliminar un producto
export const eliminarProducto = async (productoId) => {
  try {
    const productoIdString = `producto-${productoId}`;
    const productoRef = doc(db, 'productos', productoIdString);
    await updateDoc(productoRef, {
      disponible: false,
      fechaEliminacion: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    return false;
  }
};

// Actualizar stock de un producto
export const actualizarStockProducto = async (productoId, nuevoStock) => {
  try {
    const productoIdString = `producto-${productoId}`;
    const productoRef = doc(db, 'productos', productoIdString);
    await updateDoc(productoRef, {
      stock: nuevoStock,
      fechaActualizacion: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error al actualizar stock:', error);
    return false;
  }
};

// Función para limpiar todos los productos (para empezar limpio)
export const limpiarTodosLosProductos = async () => {
  try {
    console.log('🗑️ Limpiando todos los productos...');
    const productosRef = collection(db, 'productos');
    const snapshot = await getDocs(productosRef);
    
    if (snapshot.empty) {
      console.log('✅ No hay productos para limpiar');
      return true;
    }
    
    const deletePromises = [];
    snapshot.forEach((documento) => {
      deletePromises.push(updateDoc(doc(db, 'productos', documento.id), {
        disponible: false,
        fechaEliminacion: serverTimestamp()
      }));
    });
    
    await Promise.all(deletePromises);
    console.log('✅ Productos limpiados correctamente');
    console.log('Total limpiados:', snapshot.size);
    return true;
  } catch (error) {
    console.error('❌ Error limpiando productos:', error);
    return false;
  }
};
