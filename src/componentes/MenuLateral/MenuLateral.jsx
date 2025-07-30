import './MenuLateral.css'

function MenuLateral({ seccionActiva, cambiarSeccion, usuario }) {
  const opcionesMenu = [
    { id: 'tablero', etiqueta: 'Panel', icono: '📊' },
    { id: 'habitaciones', etiqueta: 'Habitaciones', icono: '🏠' },
    ...(usuario?.rol === 'admin' || usuario?.rol === 'administrador' ? 
      [{ id: 'inventario', etiqueta: 'Inventario', icono: '📦' }] : []
    ),
    ...(usuario?.rol === 'admin' || usuario?.rol === 'administrador' ? 
      [{ id: 'usuarios', etiqueta: 'Usuarios', icono: '👥' }] : []
    ),
    { id: 'reportes', etiqueta: 'Reportes', icono: '📋' }
  ]

  // Función para obtener las iniciales del nombre
  const obtenerIniciales = (nombre, apellido) => {
    const inicial1 = nombre ? nombre.charAt(0).toUpperCase() : ''
    const inicial2 = apellido ? apellido.charAt(0).toUpperCase() : ''
    return inicial1 + inicial2 || '👤'
  }

  // Función para formatear el rol
  const formatearRol = (rol) => {
    const roles = {
      'admin': 'Administrador',
      'administrador': 'Administrador', 
      'receptionist': 'Recepcionista',
      'recepcionista': 'Recepcionista'
    }
    return roles[rol?.toLowerCase()] || 'Usuario'
  }

  return (
    <div className="sidebar">
      {/* Logo y perfil del usuario */}
      <div className="perfil-usuario">
        <div className="avatar-usuario">
          <span>{obtenerIniciales(usuario?.nombre, usuario?.apellido)}</span>
        </div>
        <div className="info-usuario">
          <h3>{usuario?.nombre?.toUpperCase() || 'USUARIO'}</h3>
          <h3>{usuario?.apellido?.toUpperCase() || 'SISTEMA'}</h3>
          <span className="rol-usuario">{formatearRol(usuario?.rol)}</span>
        </div>
      </div>

      {/* Menú de navegación */}
      <nav className="menu-navegacion">
        {opcionesMenu.map(opcion => (
          <button
            key={opcion.id}
            className={`opcion-menu ${seccionActiva === opcion.id ? 'activa' : ''}`}
            onClick={() => cambiarSeccion(opcion.id)}
          >
            <span className="icono-menu">{opcion.icono}</span>
            <span className="etiqueta-menu">{opcion.etiqueta}</span>
          </button>
        ))}
      </nav>

      {/* Footer del sidebar */}
      <div className="footer-sidebar">
        <p>© 2025 MOTEL ECLIPSE</p>
      </div>
    </div>
  )
}

export default MenuLateral
