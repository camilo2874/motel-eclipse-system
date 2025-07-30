import './Header.css'

function Header() {
  const currentDate = new Date().toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1>🏨 MOTEL ECLIPSE</h1>
          <p className="subtitle">Sistema de Gestión</p>
        </div>
        <div className="header-right">
          <div className="date-info">
            <p className="current-date">{currentDate}</p>
            <p className="current-time" id="currentTime"></p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
