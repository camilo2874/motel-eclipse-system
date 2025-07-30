// Funciones para manejar datos en Firebase - Motel Eclipse
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  addDoc,
  deleteDoc,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { db, auth } from './config.js';

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
    const productosRef = collection(db, 'productos');
    const snapshot = await getDocs(productosRef);
    
    if (snapshot.empty) {
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
    return true;
  } catch (error) {
    console.error('❌ Error limpiando productos:', error);
    return false;
  }
};

// ===== FUNCIONES DE AUTENTICACIÓN =====

// Iniciar sesión
export const iniciarSesion = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Obtener datos del usuario desde Firestore
    const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          ...userData
        }
      };
    } else {
      throw new Error('Usuario no encontrado en la base de datos');
    }
  } catch (error) {
    console.error('❌ Error al iniciar sesión:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Cerrar sesión
export const cerrarSesion = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('❌ Error al cerrar sesión:', error);
    return { success: false, error: error.message };
  }
};

// Crear nuevo usuario (solo administradores)
export const crearUsuario = async (userData) => {
  try {
    const { email, password, nombre, apellido, rol, telefono, activo = true } = userData;
    
    // Crear usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Guardar datos adicionales en Firestore
    await setDoc(doc(db, 'usuarios', user.uid), {
      nombre,
      apellido,
      email,
      rol, // 'administrador' o 'recepcionista'
      telefono,
      activo,
      fechaCreacion: serverTimestamp(),
      fechaActualizacion: serverTimestamp()
    });
    
    return { success: true, uid: user.uid };
    
  } catch (error) {
    console.error('❌ Error al crear usuario:', error);
    return { success: false, error: error.message };
  }
};

// Obtener todos los usuarios (solo administradores)
export const obtenerUsuarios = async () => {
  try {
    const usuariosRef = collection(db, 'usuarios');
    const snapshot = await getDocs(usuariosRef);
    const usuarios = [];
    
    snapshot.forEach((doc) => {
      usuarios.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return usuarios;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return [];
  }
};

// Actualizar usuario
export const actualizarUsuario = async (userId, datosActualizados) => {
  try {
    const userRef = doc(db, 'usuarios', userId);
    await updateDoc(userRef, {
      ...datosActualizados,
      fechaActualizacion: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    return { success: false, error: error.message };
  }
};

// Desactivar usuario (en lugar de eliminar)
export const desactivarUsuario = async (userId) => {
  try {
    const userRef = doc(db, 'usuarios', userId);
    await updateDoc(userRef, {
      activo: false,
      fechaDesactivacion: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error al desactivar usuario:', error);
    return { success: false, error: error.message };
  }
};

// Verificar rol del usuario actual
export const verificarRolUsuario = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'usuarios', userId));
    if (userDoc.exists()) {
      return userDoc.data().rol;
    }
    return null;
  } catch (error) {
    console.error('Error al verificar rol:', error);
    return null;
  }
};

// Obtener perfil completo del usuario
export const obtenerPerfilUsuario = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'usuarios', userId));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error('Error al obtener perfil del usuario:', error);
    return null;
  }
};

// Listener para cambios en el estado de autenticación
export const escucharEstadoAuth = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Usuario logueado - obtener datos de Firestore
      try {
        const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          callback({
            logueado: true,
            user: {
              uid: user.uid,
              email: user.email,
              ...userData
            }
          });
        } else {
          callback({ logueado: false, user: null });
        }
      } catch (error) {
        console.error('Error obteniendo datos del usuario:', error);
        callback({ logueado: false, user: null });
      }
    } else {
      // Usuario no logueado
      callback({ logueado: false, user: null });
    }
  });
};

// Crear administrador inicial (ejecutar solo una vez)
export const crearAdministradorInicial = async () => {
  try {
    const adminData = {
      email: 'admin@moteleclipse.com',
      password: 'Admin123!',
      nombre: 'Administrador',
      apellido: 'Principal',
      rol: 'administrador',
      telefono: '3001234567',
      activo: true
    };
    
    const resultado = await crearUsuario(adminData);
    return resultado;
  } catch (error) {
    console.error('❌ Error creando administrador inicial:', error);
    return { success: false, error: error.message };
  }
};
