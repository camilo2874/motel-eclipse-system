import { useState } from 'react'
import './Login.css'
import { iniciarSesionFirestore } from '../../firebase/auth-alternativa'

function Login({ onLogin }) {
  const [credenciales, setCredenciales] = useState({
    usuario: '',
    password: ''
  })
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [mostrarPassword, setMostrarPassword] = useState(false)

  const manejarCambio = (e) => {
    setCredenciales({
      ...credenciales,
      [e.target.name]: e.target.value
    })
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('')
  }

  const manejarEnvio = async (e) => {
    e.preventDefault()
    if (!credenciales.usuario || !credenciales.password) {
      setError('Por favor completa todos los campos')
      return
    }

    setCargando(true)
    setError('')

    try {
      // Usar directamente la autenticación con Firestore
      const resultado = await iniciarSesionFirestore(credenciales.usuario, credenciales.password)

      if (resultado.success) {
        onLogin(resultado.user)
      } else {
        setError(obtenerMensajeError(resultado.error || 'Error al iniciar sesión'))
      }
    } catch (error) {
      console.error('Error en login:', error)
      setError('Error de conexión. Intenta nuevamente.')
    } finally {
      setCargando(false)
    }
  }

  const obtenerMensajeError = (error) => {
    const errores = {
      'Usuario no encontrado': 'Usuario no encontrado',
      'Contraseña incorrecta': 'Contraseña incorrecta',
      'Usuario desactivado': 'Usuario desactivado'
    }
    
    return errores[error] || error
  }

  const toggleMostrarPassword = () => {
    setMostrarPassword(!mostrarPassword)
  }

  return (
    <div className="login-container">
      <div className="login-fondo">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <span className="emoji-logo">🏨</span>
            </div>
            <h1 className="login-titulo">Motel Eclipse</h1>
            <p className="login-subtitulo">Sistema de Gestión</p>
          </div>

          <form onSubmit={manejarEnvio} className="login-form">
            <div className="form-group">
              <label htmlFor="usuario" className="form-label">
                <span className="icono-label">👤</span>
                Usuario
              </label>
              <input
                type="text"
                id="usuario"
                name="usuario"
                value={credenciales.usuario}
                onChange={manejarCambio}
                className="form-input usuario-input"
                placeholder="Escribe tu usuario aquí"
                disabled={cargando}
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <span className="icono-label">🔐</span>
                Contraseña
              </label>
              <div className="password-input-container">
                <input
                  type={mostrarPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={credenciales.password}
                  onChange={manejarCambio}
                  className="form-input password-input"
                  placeholder="Escribe tu contraseña aquí"
                  disabled={cargando}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={toggleMostrarPassword}
                  disabled={cargando}
                  tabIndex={-1}
                >
                  {mostrarPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {error && (
              <div className="error-message">
                <span className="icono-error">⚠️</span>
                {obtenerMensajeError(error)}
              </div>
            )}

            <button 
              type="submit" 
              className={`login-button ${cargando ? 'loading' : ''}`}
              disabled={cargando}
            >
              {cargando ? (
                <>
                  <span className="loading-spinner"></span>
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <span className="icono-boton">🚀</span>
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>🔐 Acceso seguro con Firebase</p>
            <small>Motel Eclipse © 2025</small>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
