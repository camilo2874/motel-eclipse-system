// Funciones alternativas para autenticación
import { db } from './config'
import { doc, setDoc, getDoc, updateDoc, deleteDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore'
import CryptoJS from 'crypto-js'

// Función para crear hash de contraseña
const hashPassword = (password) => {
  return CryptoJS.SHA256(password).toString()
}

// Crear usuario usando solo Firestore (sin Firebase Auth)
export const crearUsuarioFirestore = async (userData) => {
  try {
    const { usuario, password, nombre, apellido, rol, telefono, activo = true } = userData
    
    // Verificar si el usuario ya existe
    const userDoc = await getDoc(doc(db, 'usuarios', usuario))
    if (userDoc.exists()) {
      return { success: false, error: 'El usuario ya existe' }
    }
    
    // Crear usuario en Firestore con contraseña hasheada
    await setDoc(doc(db, 'usuarios', usuario), {
      usuario,
      password: hashPassword(password),
      nombre,
      apellido,
      rol,
      telefono,
      activo,
      fechaCreacion: serverTimestamp(),
      fechaActualizacion: serverTimestamp()
    })
    
    console.log('✅ Usuario creado en Firestore:', nombre, apellido)
    return { success: true, usuario }
    
  } catch (error) {
    console.error('❌ Error al crear usuario en Firestore:', error)
    return { success: false, error: error.message }
  }
}

// Iniciar sesión usando solo Firestore
export const iniciarSesionFirestore = async (usuario, password) => {
  try {
    const userDoc = await getDoc(doc(db, 'usuarios', usuario))
    
    if (!userDoc.exists()) {
      return { success: false, error: 'Usuario no encontrado' }
    }
    
    const userData = userDoc.data()
    
    if (!userData.activo) {
      return { success: false, error: 'Usuario desactivado' }
    }
    
    const hashedPassword = hashPassword(password)
    if (userData.password !== hashedPassword) {
      return { success: false, error: 'Contraseña incorrecta' }
    }
    
    // Simulamos la sesión guardando en localStorage
    const sessionData = {
      usuario: userData.usuario,
      nombre: userData.nombre,
      apellido: userData.apellido,
      rol: userData.rol,
      loginTime: Date.now()
    }
    
    localStorage.setItem('motelEclipseSession', JSON.stringify(sessionData))
    
    return { success: true, user: sessionData }
    
  } catch (error) {
    console.error('❌ Error al iniciar sesión:', error)
    return { success: false, error: error.message }
  }
}

// Verificar sesión actual
export const verificarSesion = () => {
  try {
    const sessionData = localStorage.getItem('motelEclipseSession')
    if (!sessionData) return null
    
    const session = JSON.parse(sessionData)
    
    // Verificar que la sesión no sea muy antigua (24 horas)
    const horasTranscurridas = (Date.now() - session.loginTime) / (1000 * 60 * 60)
    if (horasTranscurridas > 24) {
      localStorage.removeItem('motelEclipseSession')
      return null
    }
    
    return session
  } catch (error) {
    console.error('Error al verificar sesión:', error)
    localStorage.removeItem('motelEclipseSession')
    return null
  }
}

// Cerrar sesión
export const cerrarSesionFirestore = () => {
  localStorage.removeItem('motelEclipseSession')
  return { success: true }
}

// Actualizar perfil de usuario
export const actualizarPerfilUsuario = async (usuario, datosActualizados) => {
  try {
    const userRef = doc(db, 'usuarios', usuario)
    await updateDoc(userRef, {
      ...datosActualizados,
      fechaActualizacion: serverTimestamp()
    })
    
    // Actualizar también la sesión local
    const sessionData = localStorage.getItem('motelEclipseSession')
    if (sessionData) {
      const session = JSON.parse(sessionData)
      const sessionActualizada = {
        ...session,
        ...datosActualizados
      }
      localStorage.setItem('motelEclipseSession', JSON.stringify(sessionActualizada))
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error al actualizar perfil:', error)
    return { success: false, error: error.message }
  }
}

// Cambiar contraseña de usuario
export const cambiarContrasenaUsuario = async (usuario, contrasenaActual, nuevaContrasena) => {
  try {
    // Primero verificar la contraseña actual
    const userDoc = await getDoc(doc(db, 'usuarios', usuario))
    
    if (!userDoc.exists()) {
      return { success: false, error: 'Usuario no encontrado' }
    }
    
    const userData = userDoc.data()
    const hashedCurrentPassword = hashPassword(contrasenaActual)
    
    if (userData.password !== hashedCurrentPassword) {
      return { success: false, error: 'Contraseña actual incorrecta' }
    }
    
    // Si la contraseña actual es correcta, actualizar con la nueva
    const hashedNewPassword = hashPassword(nuevaContrasena)
    const userRef = doc(db, 'usuarios', usuario)
    
    await updateDoc(userRef, {
      password: hashedNewPassword,
      fechaActualizacion: serverTimestamp()
    })
    
    return { success: true }
  } catch (error) {
    console.error('Error al cambiar contraseña:', error)
    return { success: false, error: error.message }
  }
}

// Obtener lista de usuarios
export const obtenerUsuarios = async () => {
  try {
    const usuariosRef = collection(db, 'usuarios')
    const snapshot = await getDocs(usuariosRef)
    
    const usuarios = []
    snapshot.forEach(doc => {
      usuarios.push({
        usuario: doc.id,
        ...doc.data()
      })
    })
    
    return { success: true, usuarios }
  } catch (error) {
    console.error('Error al obtener usuarios:', error)
    return { success: false, error: error.message }
  }
}

// Verificar si un usuario existe
export const verificarUsuarioExiste = async (usuario) => {
  try {
    const userRef = doc(db, 'usuarios', usuario)
    const docSnap = await getDoc(userRef)
    return docSnap.exists()
  } catch (error) {
    console.error('Error al verificar usuario:', error)
    return false
  }
}

// Eliminar usuario
export const eliminarUsuario = async (usuario) => {
  try {
    const userRef = doc(db, 'usuarios', usuario)
    await deleteDoc(userRef)
    return { success: true }
  } catch (error) {
    console.error('Error al eliminar usuario:', error)
    return { success: false, error: error.message }
  }
}

// Crear usuario para gestión de usuarios (sobrecarga de función)
export const crearUsuarioGestion = async (usuario, password, datosAdicionales = {}) => {
  try {
    // Verificar si el usuario ya existe
    const userDoc = await getDoc(doc(db, 'usuarios', usuario))
    if (userDoc.exists()) {
      return { success: false, error: 'El usuario ya existe' }
    }
    
    // Crear usuario en Firestore con contraseña hasheada
    await setDoc(doc(db, 'usuarios', usuario), {
      usuario,
      password: hashPassword(password),
      ...datosAdicionales,
      activo: true,
      fechaCreacion: serverTimestamp(),
      fechaActualizacion: serverTimestamp()
    })
    
    return { success: true, usuario }
  } catch (error) {
    console.error('Error al crear usuario:', error)
    return { success: false, error: error.message }
  }
}
