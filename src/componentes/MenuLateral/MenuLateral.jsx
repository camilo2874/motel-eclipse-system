import './MenuLateral.css'

function MenuLateral({ seccionActiva, cambiarSeccion }) {
  const opcionesMenu = [
    { id: 'tablero', etiqueta: 'Panel', icono: '📊' },
    { id: 'habitaciones', etiqueta: 'Habitaciones', icono: '🏠' },
    { id: 'huespedes', etiqueta: 'Huéspedes', icono: '👥' },
    { id: 'reportes', etiqueta: 'Reportes', icono: '📋' }
  ]

  return (
    <div className="sidebar">
      {/* Logo y perfil del usuario */}
      <div className="perfil-usuario">
        <div className="avatar-usuario">
          <span>👤</span>
        </div>
        <div className="info-usuario">
          <h3>CAMILO</h3>
          <h3>VELASQUEZ</h3>
          <span className="rol-usuario">Administrador</span>
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
