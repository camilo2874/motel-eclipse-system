import './Navigation.css'

function Navigation({ activeSection, setActiveSection }) {
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'rooms', label: 'Habitaciones', icon: '🏠' },
    { id: 'guests', label: 'Inventario', icon: '�' },
    { id: 'reports', label: 'Reportes', icon: '📋' }
  ]

  return (
    <nav className="navigation">
      <div className="nav-content">
        {navigationItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => setActiveSection(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}

export default Navigation
