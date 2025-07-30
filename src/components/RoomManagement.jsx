import './RoomManagement.css'

function RoomManagement() {
  // Datos de ejemplo basados en la planilla
  const rooms = [
    { number: 1, type: 'Estándar', status: 'occupied', checkIn: '14:30', guest: 'Juan Pérez', price: 25000 },
    { number: 2, type: 'Suite', status: 'available', checkIn: null, guest: null, price: 35000 },
    { number: 3, type: 'Estándar', status: 'cleaning', checkIn: null, guest: null, price: 25000 },
    { number: 4, type: 'Deluxe', status: 'occupied', checkIn: '16:15', guest: 'María García', price: 30000 },
    { number: 5, type: 'Estándar', status: 'available', checkIn: null, guest: null, price: 25000 },
  ]

  const getStatusBadge = (status) => {
    const statusConfig = {
      occupied: { text: 'Ocupada', class: 'status-occupied', icon: '🔴' },
      available: { text: 'Disponible', class: 'status-available', icon: '🟢' },
      cleaning: { text: 'Limpieza', class: 'status-cleaning', icon: '🧹' }
    }
    return statusConfig[status] || statusConfig.available
  }

  return (
    <div className="room-management">
      <div className="room-header">
        <h2>Gestión de Habitaciones</h2>
        <button className="add-room-btn">
          <span>➕</span>
          Agregar Habitación
        </button>
      </div>

      <div className="room-grid">
        {rooms.map(room => {
          const status = getStatusBadge(room.status)
          return (
            <div key={room.number} className={`room-card ${status.class}`}>
              <div className="room-header-card">
                <h3>Habitación {room.number}</h3>
                <span className="room-status">
                  {status.icon} {status.text}
                </span>
              </div>
              
              <div className="room-details">
                <p><strong>Tipo:</strong> {room.type}</p>
                <p><strong>Precio/Hora:</strong> ${room.price.toLocaleString('es-CO')}</p>
                
                {room.status === 'occupied' && (
                  <>
                    <p><strong>Huésped:</strong> {room.guest}</p>
                    <p><strong>Check-in:</strong> {room.checkIn}</p>
                  </>
                )}
              </div>

              <div className="room-actions">
                {room.status === 'available' && (
                  <button className="action-btn primary">Check-in</button>
                )}
                {room.status === 'occupied' && (
                  <>
                    <button className="action-btn secondary">Ver Detalle</button>
                    <button className="action-btn danger">Check-out</button>
                  </>
                )}
                {room.status === 'cleaning' && (
                  <button className="action-btn success">Limpieza Lista</button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="room-summary">
        <div className="summary-card">
          <h3>Resumen de Habitaciones</h3>
          <div className="summary-stats">
            <div className="summary-item">
              <span className="summary-number">{rooms.filter(r => r.status === 'available').length}</span>
              <span className="summary-label">Disponibles</span>
            </div>
            <div className="summary-item">
              <span className="summary-number">{rooms.filter(r => r.status === 'occupied').length}</span>
              <span className="summary-label">Ocupadas</span>
            </div>
            <div className="summary-item">
              <span className="summary-number">{rooms.filter(r => r.status === 'cleaning').length}</span>
              <span className="summary-label">En Limpieza</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomManagement
