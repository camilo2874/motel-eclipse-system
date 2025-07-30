import { useState, useEffect } from 'react'
import './PerfilUsuario.css'
import { actualizarPerfilUsuario, cambiarContrasenaUsuario } from '../../firebase/auth-alternativa'

function PerfilUsuario({ usuario, onCerrar, onActualizar }) {
  const [datosUsuario, setDatosUsuario] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    usuario: ''
  })
  
  const [cambioContrasena, setCambioContrasena] = useState({
    contrasenaActual: '',
    nuevaContrasena: '',
    confirmarContrasena: ''
  })
  
  const [pestanaActiva, setPestanaActiva] = useState('datos')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  // Cargar datos del usuario al abrir
  useEffect(() => {
    if (usuario) {
      setDatosUsuario({
        nombre: usuario.nombre || '',
        apellido: usuario.apellido || '',
        telefono: usuario.telefono || '',
        usuario: usuario.usuario || ''
      })
    }
  }, [usuario])

  const manejarCambioDatos = (e) => {
    const { name, value } = e.target
    setDatosUsuario(prev => ({
      ...prev,
      [name]: value
    }))
    if (error) setError('')
    if (mensaje) setMensaje('')
  }

  const manejarCambioContrasena = (e) => {
    const { name, value } = e.target
    setCambioContrasena(prev => ({
      ...prev,
      [name]: value
    }))
    if (error) setError('')
    if (mensaje) setMensaje('')
  }

  const guardarDatos = async (e) => {
    e.preventDefault()
    console.log('🔥 guardarDatos ejecutándose...')
    console.log('📊 Datos a guardar:', datosUsuario)
    console.log('👤 Usuario:', usuario)
    
    if (!datosUsuario.nombre.trim() || !datosUsuario.apellido.trim()) {
      setError('Nombre y apellido son obligatorios')
      return
    }

    setCargando(true)
    setError('')
    setMensaje('')

    try {
      console.log('📤 Enviando actualización...')
      const resultado = await actualizarPerfilUsuario(usuario.usuario, {
        nombre: datosUsuario.nombre.trim(),
        apellido: datosUsuario.apellido.trim(),
        telefono: datosUsuario.telefono.trim()
      })

      console.log('📥 Resultado:', resultado)

      if (resultado.success) {
        setMensaje('✅ Datos actualizados correctamente')
        // Actualizar datos en el componente padre
        const datosActualizados = {
          ...usuario,
          nombre: datosUsuario.nombre.trim(),
          apellido: datosUsuario.apellido.trim(),
          telefono: datosUsuario.telefono.trim()
        }
        console.log('🔄 Llamando onActualizar con:', datosActualizados)
        onActualizar(datosActualizados)
        
        // Cerrar modal después de un momento
        setTimeout(() => {
          console.log('🚪 Cerrando modal...')
          onCerrar()
        }, 1500)
      } else {
        setError(resultado.error || 'Error al actualizar datos')
      }
    } catch (error) {
      console.error('💥 Error en guardarDatos:', error)
      setError('Error de conexión al actualizar datos')
    } finally {
      setCargando(false)
    }
  }

  const cambiarContrasena = async (e) => {
    e.preventDefault()

    if (!cambioContrasena.contrasenaActual || !cambioContrasena.nuevaContrasena) {
      setError('Completa todos los campos de contraseña')
      return
    }

    if (cambioContrasena.nuevaContrasena !== cambioContrasena.confirmarContrasena) {
      setError('Las contraseñas nuevas no coinciden')
      return
    }

    if (cambioContrasena.nuevaContrasena.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres')
      return
    }

    setCargando(true)
    setError('')
    setMensaje('')

    try {
      const resultado = await cambiarContrasenaUsuario(
        usuario.usuario,
        cambioContrasena.contrasenaActual,
        cambioContrasena.nuevaContrasena
      )

      if (resultado.success) {
        setMensaje('✅ Contraseña cambiada correctamente')
        setCambioContrasena({
          contrasenaActual: '',
          nuevaContrasena: '',
          confirmarContrasena: ''
        })
      } else {
        setError(resultado.error || 'Error al cambiar contraseña')
      }
    } catch (error) {
      setError('Error de conexión al cambiar contraseña')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="perfil-overlay">
      <div className="perfil-modal">
        <div className="perfil-header">
          <h2>👤 Mi Perfil</h2>
          <button 
            className="cerrar-modal"
            onClick={onCerrar}
          >
            ✕
          </button>
        </div>

        <div className="perfil-pestanas">
          <button 
            className={`pestana ${pestanaActiva === 'datos' ? 'activa' : ''}`}
            onClick={() => setPestanaActiva('datos')}
          >
            📝 Datos Personales
          </button>
          <button 
            className={`pestana ${pestanaActiva === 'contrasena' ? 'activa' : ''}`}
            onClick={() => setPestanaActiva('contrasena')}
          >
            🔒 Cambiar Contraseña
          </button>
        </div>

        <div className="perfil-contenido">
          {/* Mensajes */}
          {error && (
            <div className="mensaje error">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}
          
          {mensaje && (
            <div className="mensaje exito">
              <span>✅</span>
              <span>{mensaje}</span>
            </div>
          )}

          {/* Pestaña de Datos Personales */}
          {pestanaActiva === 'datos' && (
            <form onSubmit={guardarDatos} className="perfil-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="usuario">
                    <span className="icono">👤</span>
                    Usuario
                  </label>
                  <input
                    id="usuario"
                    name="usuario"
                    type="text"
                    value={datosUsuario.usuario}
                    disabled
                    className="input-deshabilitado"
                  />
                  <small>El nombre de usuario no se puede cambiar</small>
                </div>

                <div className="form-group">
                  <label htmlFor="rol">
                    <span className="icono">🎭</span>
                    Rol
                  </label>
                  <input
                    id="rol"
                    type="text"
                    value={usuario.rol}
                    disabled
                    className="input-deshabilitado"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="nombre">
                    <span className="icono">📝</span>
                    Nombre *
                  </label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    value={datosUsuario.nombre}
                    onChange={manejarCambioDatos}
                    placeholder="Tu nombre"
                    disabled={cargando}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="apellido">
                    <span className="icono">📝</span>
                    Apellido *
                  </label>
                  <input
                    id="apellido"
                    name="apellido"
                    type="text"
                    value={datosUsuario.apellido}
                    onChange={manejarCambioDatos}
                    placeholder="Tu apellido"
                    disabled={cargando}
                    required
                  />
                </div>

                <div className="form-group span-2">
                  <label htmlFor="telefono">
                    <span className="icono">📞</span>
                    Teléfono
                  </label>
                  <input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    value={datosUsuario.telefono}
                    onChange={manejarCambioDatos}
                    placeholder="3001234567"
                    disabled={cargando}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn-guardar"
                  disabled={cargando}
                >
                  {cargando ? '💾 Guardando...' : '💾 Guardar Cambios'}
                </button>
              </div>
            </form>
          )}

          {/* Pestaña de Cambiar Contraseña */}
          {pestanaActiva === 'contrasena' && (
            <form onSubmit={cambiarContrasena} className="perfil-form">
              <div className="form-group">
                <label htmlFor="contrasenaActual">
                  <span className="icono">🔒</span>
                  Contraseña Actual *
                </label>
                <input
                  id="contrasenaActual"
                  name="contrasenaActual"
                  type="password"
                  value={cambioContrasena.contrasenaActual}
                  onChange={manejarCambioContrasena}
                  placeholder="Tu contraseña actual"
                  disabled={cargando}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="nuevaContrasena">
                  <span className="icono">🆕</span>
                  Nueva Contraseña *
                </label>
                <input
                  id="nuevaContrasena"
                  name="nuevaContrasena"
                  type="password"
                  value={cambioContrasena.nuevaContrasena}
                  onChange={manejarCambioContrasena}
                  placeholder="Nueva contraseña (mín. 6 caracteres)"
                  disabled={cargando}
                  required
                  minLength="6"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmarContrasena">
                  <span className="icono">✅</span>
                  Confirmar Nueva Contraseña *
                </label>
                <input
                  id="confirmarContrasena"
                  name="confirmarContrasena"
                  type="password"
                  value={cambioContrasena.confirmarContrasena}
                  onChange={manejarCambioContrasena}
                  placeholder="Repite la nueva contraseña"
                  disabled={cargando}
                  required
                />
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn-cambiar-contrasena"
                  disabled={cargando}
                >
                  {cargando ? '🔐 Cambiando...' : '🔐 Cambiar Contraseña'}
                </button>
              </div>

              <div className="contrasena-tips">
                <h4>💡 Consejos para una contraseña segura:</h4>
                <ul>
                  <li>• Usa al menos 6 caracteres</li>
                  <li>• Combina letras, números y símbolos</li>
                  <li>• No uses información personal</li>
                  <li>• Cámbiala periódicamente</li>
                </ul>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default PerfilUsuario
