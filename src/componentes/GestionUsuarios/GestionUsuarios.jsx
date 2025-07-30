import { useState, useEffect } from 'react'
import './GestionUsuarios.css'
import { 
  crearUsuarioGestion, 
  obtenerUsuarios, 
  actualizarPerfilUsuario, 
  eliminarUsuario,
  verificarUsuarioExiste 
} from '../../firebase/auth-alternativa'

function GestionUsuarios({ usuarioActual }) {
  const [usuarios, setUsuarios] = useState([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [usuarioEditando, setUsuarioEditando] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [filtroRol, setFiltroRol] = useState('todos')
  const [busqueda, setBusqueda] = useState('')

  const [formularioUsuario, setFormularioUsuario] = useState({
    usuario: '',
    contrasena: '',
    nombre: '',
    apellido: '',
    telefono: '',
    rol: 'receptionist'
  })

  // Cargar usuarios al inicializar
  useEffect(() => {
    cargarUsuarios()
  }, [])

  const cargarUsuarios = async () => {
    try {
      setCargando(true)
      const listaUsuarios = await obtenerUsuarios()
      if (listaUsuarios.success) {
        setUsuarios(listaUsuarios.usuarios)
      } else {
        setError('Error al cargar usuarios')
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error)
      setError('Error de conexión al cargar usuarios')
    } finally {
      setCargando(false)
    }
  }

  const manejarCambioFormulario = (e) => {
    const { name, value } = e.target
    setFormularioUsuario(prev => ({
      ...prev,
      [name]: value
    }))
    if (error) setError('')
    if (mensaje) setMensaje('')
  }

  const limpiarFormulario = () => {
    setFormularioUsuario({
      usuario: '',
      contrasena: '',
      nombre: '',
      apellido: '',
      telefono: '',
      rol: 'receptionist'
    })
    setUsuarioEditando(null)
    setMostrarFormulario(false)
  }

  const validarFormulario = () => {
    if (!formularioUsuario.usuario.trim()) {
      setError('El nombre de usuario es obligatorio')
      return false
    }
    if (!usuarioEditando && !formularioUsuario.contrasena.trim()) {
      setError('La contraseña es obligatoria')
      return false
    }
    if (formularioUsuario.contrasena && formularioUsuario.contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return false
    }
    if (!formularioUsuario.nombre.trim() || !formularioUsuario.apellido.trim()) {
      setError('Nombre y apellido son obligatorios')
      return false
    }
    return true
  }

  const guardarUsuario = async (e) => {
    e.preventDefault()
    
    if (!validarFormulario()) return

    setCargando(true)
    setError('')
    setMensaje('')

    try {
      if (usuarioEditando) {
        // Actualizar usuario existente
        const datosActualizacion = {
          nombre: formularioUsuario.nombre.trim(),
          apellido: formularioUsuario.apellido.trim(),
          telefono: formularioUsuario.telefono.trim(),
          rol: formularioUsuario.rol
        }

        const resultado = await actualizarPerfilUsuario(usuarioEditando.usuario, datosActualizacion)
        
        if (resultado.success) {
          setMensaje('✅ Usuario actualizado correctamente')
          cargarUsuarios()
          limpiarFormulario()
        } else {
          setError('❌ Error al actualizar usuario: ' + (resultado.error || 'Error desconocido'))
        }
      } else {
        // Crear nuevo usuario
        const usuarioExiste = await verificarUsuarioExiste(formularioUsuario.usuario)
        if (usuarioExiste) {
          setError('❌ El nombre de usuario ya está en uso')
          return
        }

        const resultado = await crearUsuarioGestion(
          formularioUsuario.usuario,
          formularioUsuario.contrasena,
          {
            nombre: formularioUsuario.nombre.trim(),
            apellido: formularioUsuario.apellido.trim(),
            telefono: formularioUsuario.telefono.trim(),
            rol: formularioUsuario.rol
          }
        )

        if (resultado.success) {
          setMensaje('✅ Usuario creado correctamente')
          cargarUsuarios()
          limpiarFormulario()
        } else {
          setError('❌ Error al crear usuario: ' + (resultado.error || 'Error desconocido'))
        }
      }
    } catch (error) {
      console.error('Error al guardar usuario:', error)
      setError('❌ Error de conexión al guardar usuario')
    } finally {
      setCargando(false)
    }
  }

  const editarUsuario = (usuario) => {
    setFormularioUsuario({
      usuario: usuario.usuario,
      contrasena: '',
      nombre: usuario.nombre || '',
      apellido: usuario.apellido || '',
      telefono: usuario.telefono || '',
      rol: usuario.rol || 'receptionist'
    })
    setUsuarioEditando(usuario)
    setMostrarFormulario(true)
  }

  const confirmarEliminar = async (usuario) => {
    if (usuario.usuario === usuarioActual.usuario) {
      setError('❌ No puedes eliminar tu propia cuenta')
      return
    }

    const confirmar = window.confirm(
      `¿Estás seguro de que deseas eliminar al usuario "${usuario.nombre} ${usuario.apellido}" (${usuario.usuario})?\n\nEsta acción no se puede deshacer.`
    )

    if (confirmar) {
      try {
        setCargando(true)
        const resultado = await eliminarUsuario(usuario.usuario)
        
        if (resultado.success) {
          setMensaje('✅ Usuario eliminado correctamente')
          cargarUsuarios()
        } else {
          setError('❌ Error al eliminar usuario: ' + (resultado.error || 'Error desconocido'))
        }
      } catch (error) {
        console.error('Error al eliminar usuario:', error)
        setError('❌ Error de conexión al eliminar usuario')
      } finally {
        setCargando(false)
      }
    }
  }

  // Filtrar usuarios
  const usuariosFiltrados = usuarios.filter(usuario => {
    const cumpleFiltroRol = filtroRol === 'todos' || usuario.rol === filtroRol
    const cumpleBusqueda = busqueda === '' || 
      usuario.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.apellido?.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.usuario?.toLowerCase().includes(busqueda.toLowerCase())
    
    return cumpleFiltroRol && cumpleBusqueda
  })

  const formatearRol = (rol) => {
    const roles = {
      'admin': { texto: 'Administrador', icono: '👑', color: '#dc3545' },
      'administrador': { texto: 'Administrador', icono: '👑', color: '#dc3545' },
      'receptionist': { texto: 'Recepcionista', icono: '👥', color: '#28a745' },
      'recepcionista': { texto: 'Recepcionista', icono: '👥', color: '#28a745' }
    }
    return roles[rol?.toLowerCase()] || { texto: 'Usuario', icono: '👤', color: '#6c757d' }
  }

  return (
    <div className="gestion-usuarios">
      <div className="usuarios-header">
        <div className="titulo-seccion">
          <h2>👥 Gestión de Usuarios</h2>
          <p>Administra los usuarios del sistema</p>
        </div>
        
        <button 
          className="btn-nuevo-usuario"
          onClick={() => setMostrarFormulario(true)}
          disabled={cargando}
        >
          <span>➕</span>
          Nuevo Usuario
        </button>
      </div>

      {/* Filtros y búsqueda */}
      <div className="usuarios-filtros">
        <div className="filtro-grupo">
          <label htmlFor="filtroRol">🎭 Filtrar por rol:</label>
          <select 
            id="filtroRol"
            value={filtroRol} 
            onChange={(e) => setFiltroRol(e.target.value)}
          >
            <option value="todos">Todos los roles</option>
            <option value="admin">Administradores</option>
            <option value="receptionist">Recepcionistas</option>
          </select>
        </div>

        <div className="filtro-grupo">
          <label htmlFor="busqueda">🔍 Buscar usuario:</label>
          <input
            id="busqueda"
            type="text"
            placeholder="Nombre, apellido o usuario..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      {/* Mensajes */}
      {error && (
        <div className="mensaje error">
          <span>⚠️</span>
          <span>{error}</span>
          <button onClick={() => setError('')}>✕</button>
        </div>
      )}
      
      {mensaje && (
        <div className="mensaje exito">
          <span>✅</span>
          <span>{mensaje}</span>
          <button onClick={() => setMensaje('')}>✕</button>
        </div>
      )}

      {/* Lista de usuarios */}
      <div className="usuarios-lista">
        {cargando ? (
          <div className="cargando">
            <div className="spinner"></div>
            <p>Cargando usuarios...</p>
          </div>
        ) : usuariosFiltrados.length === 0 ? (
          <div className="sin-usuarios">
            <span className="icono-vacio">👥</span>
            <h3>No hay usuarios</h3>
            <p>No se encontraron usuarios con los filtros aplicados</p>
          </div>
        ) : (
          <div className="usuarios-grid">
            {usuariosFiltrados.map(usuario => {
              const rolInfo = formatearRol(usuario.rol)
              return (
                <div key={usuario.usuario} className="usuario-card">
                  <div className="usuario-avatar">
                    <span>{usuario.nombre?.[0]?.toUpperCase() || '👤'}{usuario.apellido?.[0]?.toUpperCase() || ''}</span>
                  </div>
                  
                  <div className="usuario-info">
                    <h3>{usuario.nombre} {usuario.apellido}</h3>
                    <p className="usuario-username">@{usuario.usuario}</p>
                    <div className="usuario-rol" style={{ color: rolInfo.color }}>
                      <span>{rolInfo.icono}</span>
                      <span>{rolInfo.texto}</span>
                    </div>
                    {usuario.telefono && (
                      <p className="usuario-telefono">📞 {usuario.telefono}</p>
                    )}
                  </div>

                  <div className="usuario-acciones">
                    <button 
                      className="btn-editar"
                      onClick={() => editarUsuario(usuario)}
                      disabled={cargando}
                      title="Editar usuario"
                    >
                      ✏️
                    </button>
                    
                    {usuario.usuario !== usuarioActual.usuario && (
                      <button 
                        className="btn-eliminar"
                        onClick={() => confirmarEliminar(usuario)}
                        disabled={cargando}
                        title="Eliminar usuario"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal de formulario */}
      {mostrarFormulario && (
        <div className="modal-overlay">
          <div className="modal-formulario">
            <div className="modal-header">
              <h3>
                {usuarioEditando ? '✏️ Editar Usuario' : '➕ Nuevo Usuario'}
              </h3>
              <button 
                className="cerrar-modal"
                onClick={limpiarFormulario}
              >
                ✕
              </button>
            </div>

            <form onSubmit={guardarUsuario} className="usuario-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="usuario">
                    <span className="icono">👤</span>
                    Usuario *
                  </label>
                  <input
                    id="usuario"
                    name="usuario"
                    type="text"
                    value={formularioUsuario.usuario}
                    onChange={manejarCambioFormulario}
                    placeholder="nombre_usuario"
                    disabled={cargando || usuarioEditando}
                    required
                  />
                  {usuarioEditando && (
                    <small>El nombre de usuario no se puede cambiar</small>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="rol">
                    <span className="icono">🎭</span>
                    Rol *
                  </label>
                  <select
                    id="rol"
                    name="rol"
                    value={formularioUsuario.rol}
                    onChange={manejarCambioFormulario}
                    disabled={cargando}
                    required
                  >
                    <option value="receptionist">Recepcionista</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>

                {!usuarioEditando && (
                  <div className="form-group span-2">
                    <label htmlFor="contrasena">
                      <span className="icono">🔒</span>
                      Contraseña *
                    </label>
                    <input
                      id="contrasena"
                      name="contrasena"
                      type="password"
                      value={formularioUsuario.contrasena}
                      onChange={manejarCambioFormulario}
                      placeholder="Mínimo 6 caracteres"
                      disabled={cargando}
                      required={!usuarioEditando}
                      minLength="6"
                    />
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="nombre">
                    <span className="icono">📝</span>
                    Nombre *
                  </label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    value={formularioUsuario.nombre}
                    onChange={manejarCambioFormulario}
                    placeholder="Nombre"
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
                    value={formularioUsuario.apellido}
                    onChange={manejarCambioFormulario}
                    placeholder="Apellido"
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
                    value={formularioUsuario.telefono}
                    onChange={manejarCambioFormulario}
                    placeholder="3001234567"
                    disabled={cargando}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="button"
                  className="btn-cancelar"
                  onClick={limpiarFormulario}
                  disabled={cargando}
                >
                  ❌ Cancelar
                </button>
                
                <button 
                  type="submit"
                  className="btn-guardar"
                  disabled={cargando}
                >
                  {cargando ? (
                    <>
                      <span className="spinner-small"></span>
                      {usuarioEditando ? 'Actualizando...' : 'Creando...'}
                    </>
                  ) : (
                    <>
                      {usuarioEditando ? '💾 Actualizar' : '➕ Crear Usuario'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default GestionUsuarios
