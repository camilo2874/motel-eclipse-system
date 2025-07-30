import { useState, useEffect } from 'react'
import './App.css'
import MenuLateral from './componentes/MenuLateral'
import HeaderPrincipal from './componentes/HeaderPrincipal'
import Tablero from './componentes/Tablero'
import GestionHabitaciones from './componentes/GestionHabitaciones'
import Inventario from './componentes/Inventario'
import GestionUsuarios from './componentes/GestionUsuarios'
import Reportes from './componentes/Reportes'
import Login from './componentes/Login'
import { inicializarBaseDatos, probarConexion, crearAdministradorInicial } from './firebase/test'
import { auth } from './firebase/config'
import { onAuthStateChanged } from 'firebase/auth'
import { verificarSesion, cerrarSesionFirestore } from './firebase/auth-alternativa'

function App() {
  const [seccionActiva, setSeccionActiva] = useState('tablero')
  const [firebaseEstado, setFirebaseEstado] = useState('conectando...')
  const [usuario, setUsuario] = useState(null)
  const [cargandoAuth, setCargandoAuth] = useState(true)

  // Monitorear estado de autenticación
  useEffect(() => {
    // Verificar primero si hay sesión alternativa
    const sesionAlternativa = verificarSesion()
    if (sesionAlternativa) {
      setUsuario(sesionAlternativa)
      setCargandoAuth(false)
      return
    }

    // Si no hay sesión alternativa, verificar Firebase Auth
    const unsubscribe = onAuthStateChanged(auth, (usuarioActual) => {
      setUsuario(usuarioActual)
      setCargandoAuth(false)
    })

    return () => unsubscribe()
  }, [])

  // Probar Firebase al cargar la aplicación
  useEffect(() => {
    const probarFirebase = async () => {
      try {
        setFirebaseEstado('Probando conexión...')
        
        // Primero probar si ya hay datos
        const conexionExitosa = await probarConexion()
        
        if (conexionExitosa) {
          setFirebaseEstado('✅ Conectado - Creando datos...')
          
          // Crear datos iniciales (habitaciones y productos)
          const datosCreados = await inicializarBaseDatos()
          
          if (datosCreados) {
            setFirebaseEstado('✅ Firebase listo con datos')
          } else {
            setFirebaseEstado('✅ Firebase conectado')
          }
          
        } else {
          setFirebaseEstado('❌ Error de conexión')
        }
      } catch (error) {
        console.error('Error al probar Firebase:', error)
        setFirebaseEstado('❌ Error de conexión')
      }
    }

    probarFirebase()
  }, [])

  const manejarLogin = (userData) => {
    setUsuario(userData)
  }

  const renderizarSeccionActiva = () => {
    switch (seccionActiva) {
      case 'tablero':
        return <Tablero />
      case 'habitaciones':
        return <GestionHabitaciones />
      case 'inventario':
        // Solo administradores pueden acceder al inventario
        if (usuario?.rol === 'admin' || usuario?.rol === 'administrador') {
          return <Inventario />
        } else {
          // Redirigir a tablero si no es admin
          setSeccionActiva('tablero')
          return <Tablero />
        }
      case 'usuarios':
        // Solo administradores pueden acceder a gestión de usuarios
        if (usuario?.rol === 'admin' || usuario?.rol === 'administrador') {
          return <GestionUsuarios usuarioActual={usuario} />
        } else {
          // Redirigir a tablero si no es admin
          setSeccionActiva('tablero')
          return <Tablero />
        }
      case 'reportes':
        return <Reportes />
      default:
        return <Tablero />
    }
  }

  return (
    <div className="app">
      {/* Mostrar pantalla de carga mientras se verifica autenticación */}
      {cargandoAuth ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontSize: '1.2rem',
          fontWeight: '600'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '50px', 
              height: '50px', 
              border: '3px solid rgba(255,255,255,0.3)', 
              borderTop: '3px solid white', 
              borderRadius: '50%', 
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }}></div>
            <p>Cargando Motel Eclipse...</p>
          </div>
        </div>
      ) : !usuario ? (
        /* Mostrar login si no hay usuario autenticado */
        <Login onLogin={manejarLogin} />
      ) : (
        /* Mostrar aplicación principal si hay usuario autenticado */
        <>
          <MenuLateral seccionActiva={seccionActiva} cambiarSeccion={setSeccionActiva} usuario={usuario} />
          <HeaderPrincipal usuario={usuario} />
          <main className="main-content">
            {renderizarSeccionActiva()}
          </main>
        </>
      )}
    </div>
  )
}

export default App
