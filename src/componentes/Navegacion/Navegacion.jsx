import './Navegacion.css'

function Navegacion({ seccionActiva, cambiarSeccion }) {
  const elementosNavegacion = [
    { id: 'tablero', etiqueta: 'Tablero', icono: '📊' },
    { id: 'habitaciones', etiqueta: 'Habitaciones', icono: '🏠' },
    { id: 'inventario', etiqueta: 'Inventario', icono: '�' },
    { id: 'reportes', etiqueta: 'Reportes', icono: '📋' }
  ]

  return (
    <nav className="navegacion">
      <div className="navegacion-contenido">
        {elementosNavegacion.map(elemento => (
          <button
            key={elemento.id}
            className={`elemento-navegacion ${seccionActiva === elemento.id ? 'activo' : ''}`}
            onClick={() => cambiarSeccion(elemento.id)}
          >
            <span className="icono-navegacion">{elemento.icono}</span>
            <span className="etiqueta-navegacion">{elemento.etiqueta}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}

export default Navegacion
