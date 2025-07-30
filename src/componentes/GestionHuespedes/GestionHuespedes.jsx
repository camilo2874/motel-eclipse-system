import './GestionHuespedes.css'

function GestionHuespedes() {
  return (
    <div className="gestion-huespedes">
      <div className="encabezado-seccion">
        <h2>Gestión de Huéspedes</h2>
        <button className="boton-nuevo-huesped">
          <span>👤</span>
          Nuevo Huésped
        </button>
      </div>
      
      <div className="contenido-desarrollo">
        <div className="tarjeta-desarrollo">
          <div className="icono-desarrollo">🚧</div>
          <h3>Módulo en Desarrollo</h3>
          <p>Esta sección incluirá:</p>
          <ul>
            <li>📝 Registro completo de huéspedes</li>
            <li>🏠 Check-in y asignación de habitaciones</li>
            <li>🚪 Proceso de check-out</li>
            <li>📋 Historial de estadías</li>
            <li>🆔 Gestión de documentos</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default GestionHuespedes
