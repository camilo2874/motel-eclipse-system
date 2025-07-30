import { useState, useEffect } from 'react'
import './HeaderPrincipal.css'
import { cerrarSesion, obtenerPerfilUsuario } from '../../firebase/database'
import { cerrarSesionFirestore } from '../../firebase/auth-alternativa'
import PerfilUsuario from '../PerfilUsuario'

function HeaderPrincipal({ usuario }) {
  const [horaActual, setHoraActual] = useState(new Date())
  const [perfilUsuario, setPerfilUsuario] = useState(null)
  const [mostrandoMenu, setMostrandoMenu] = useState(false)
  const [mostrandoPerfil, setMostrandoPerfil] = useState(false)

  useEffect(() => {
    const temporizador = setInterval(() => {
      setHoraActual(new Date())
    }, 1000)

    return () => clearInterval(temporizador)
  }, [])

  // Cargar perfil del usuario
  useEffect(() => {
    if (usuario) {
      // Si el usuario tiene uid, viene de Firebase Auth
      if (usuario.uid) {
        obtenerPerfilUsuario(usuario.uid)
          .then(perfil => setPerfilUsuario(perfil))
          .catch(error => console.error('Error al cargar perfil:', error))
      } else {
        // Si no tiene uid, viene de la autenticación alternativa
        setPerfilUsuario(usuario)
      }
    }
  }, [usuario])

  const fechaFormateada = horaActual.toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const horaFormateada = horaActual.toLocaleTimeString('es-CO')

  const manejarCerrarSesion = async () => {
    try {
      // Si el usuario tiene uid, usar Firebase Auth logout
      if (usuario.uid) {
        await cerrarSesion()
      } else {
        // Si no, usar logout alternativo
        cerrarSesionFirestore()
        window.location.reload() // Recargar para actualizar el estado
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  const abrirPerfil = () => {
    setMostrandoMenu(false)
    setMostrandoPerfil(true)
  }

  const cerrarPerfil = () => {
    setMostrandoPerfil(false)
  }

  const actualizarUsuario = (datosActualizados) => {
    setPerfilUsuario(datosActualizados)
  }

  return (
    <>
      <header className="header-principal">
        <div className="titulo-sistema">
          <h1>MOTEL ECLIPSE</h1>
          <p>Sistema de Gestión - Panel de Control</p>
        </div>
        
        <div className="info-tiempo">
          <div className="fecha-hora">
            <div className="fecha">{fechaFormateada}</div>
            <div className="hora">{horaFormateada}</div>
          </div>
          
          {/* Información del usuario */}
          <div className="info-usuario">
            <div 
              className="usuario-boton"
              onClick={() => setMostrandoMenu(!mostrandoMenu)}
            >
              <span className="usuario-icono">👤</span>
              <div className="usuario-info">
                <span className="usuario-nombre">{perfilUsuario?.nombre || 'Usuario'}</span>
                <span className="usuario-rol">{perfilUsuario?.rol || 'N/A'}</span>
              </div>
              <span className="usuario-flecha">▼</span>
            </div>
            
            {mostrandoMenu && (
              <div className="usuario-menu">
                <button 
                  className="menu-item perfil-item" 
                  onClick={abrirPerfil}
                >
                  <span>⚙️</span>
                  <span>Mi Perfil</span>
                </button>
                <div className="menu-item">
                  <span>👤</span>
                  <span>{usuario.usuario || usuario.email || 'Usuario'}</span>
                </div>
                <div className="menu-separador"></div>
                <button 
                  className="menu-item cerrar-sesion" 
                  onClick={manejarCerrarSesion}
                >
                  <span>🚪</span>
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      
      {/* Modal de Perfil */}
      {mostrandoPerfil && (
        <PerfilUsuario 
          usuario={perfilUsuario || usuario} 
          onCerrar={cerrarPerfil}
          onActualizar={actualizarUsuario}
        />
      )}
    </>
  )
}

export default HeaderPrincipal
