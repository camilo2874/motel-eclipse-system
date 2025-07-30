import { useState, useEffect } from 'react'
import './App.css'
import MenuLateral from './componentes/MenuLateral'
import HeaderPrincipal from './componentes/HeaderPrincipal'
import Tablero from './componentes/Tablero'
import GestionHabitaciones from './componentes/GestionHabitaciones'
import Inventario from './componentes/Inventario'
import Reportes from './componentes/Reportes'
import { inicializarBaseDatos, probarConexion } from './firebase/test'

function App() {
  const [seccionActiva, setSeccionActiva] = useState('tablero')
  const [firebaseEstado, setFirebaseEstado] = useState('conectando...')

  // Probar Firebase al cargar la aplicación
  useEffect(() => {
    const probarFirebase = async () => {
      try {
        console.log('🚀 Probando conexión con Firebase...')
        setFirebaseEstado('Probando conexión...')
        
        // Primero probar si ya hay datos
        const conexionExitosa = await probarConexion()
        
        if (conexionExitosa) {
          setFirebaseEstado('✅ Conectado - Creando datos...')
          
          // Crear datos iniciales (habitaciones y productos)
          console.log('🔄 Creando datos iniciales del motel...')
          const datosCreados = await inicializarBaseDatos()
          
          if (datosCreados) {
            setFirebaseEstado('✅ Firebase listo con datos')
            console.log('🎉 ¡Motel Eclipse configurado en Firebase!')
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

  const renderizarSeccionActiva = () => {
    switch (seccionActiva) {
      case 'tablero':
        return <Tablero />
      case 'habitaciones':
        return <GestionHabitaciones />
      case 'inventario':
        return <Inventario />
      case 'reportes':
        return <Reportes />
      default:
        return <Tablero />
    }
  }

  return (
    <div className="app">
      <MenuLateral seccionActiva={seccionActiva} cambiarSeccion={setSeccionActiva} />
      <HeaderPrincipal />
      <main className="main-content">
        {/* Indicador de estado de Firebase */}
        <div style={{ 
          position: 'fixed', 
          top: '10px', 
          right: '10px', 
          background: firebaseEstado.includes('✅') ? '#27ae60' : firebaseEstado.includes('❌') ? '#e74c3c' : '#f39c12',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '12px',
          zIndex: 1000,
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}>
          🔥 Firebase: {firebaseEstado}
        </div>
        {renderizarSeccionActiva()}
      </main>
    </div>
  )
}

export default App
