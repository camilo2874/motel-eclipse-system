import { useState, useEffect } from 'react'
import './Dashboard.css'

function Dashboard() {
  const [stats, setStats] = useState({
    totalRooms: 20,
    occupiedRooms: 8,
    availableRooms: 10,
    cleaningRooms: 2,
    dailyRevenue: 450000,
    currentGuests: 12
  })

  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const occupancyRate = ((stats.occupiedRooms / stats.totalRooms) * 100).toFixed(1)

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Dashboard - Resumen del Día</h2>
        <div className="current-time">
          {currentTime.toLocaleTimeString('es-CO')}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🏠</div>
          <div className="stat-content">
            <h3>Habitaciones Totales</h3>
            <div className="stat-number">{stats.totalRooms}</div>
          </div>
        </div>

        <div className="stat-card occupied">
          <div className="stat-icon">🔴</div>
          <div className="stat-content">
            <h3>Ocupadas</h3>
            <div className="stat-number">{stats.occupiedRooms}</div>
          </div>
        </div>

        <div className="stat-card available">
          <div className="stat-icon">🟢</div>
          <div className="stat-content">
            <h3>Disponibles</h3>
            <div className="stat-number">{stats.availableRooms}</div>
          </div>
        </div>

        <div className="stat-card cleaning">
          <div className="stat-icon">🧹</div>
          <div className="stat-content">
            <h3>En Limpieza</h3>
            <div className="stat-number">{stats.cleaningRooms}</div>
          </div>
        </div>

        <div className="stat-card revenue">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Ingresos del Día</h3>
            <div className="stat-number">
              ${stats.dailyRevenue.toLocaleString('es-CO')}
            </div>
          </div>
        </div>

        <div className="stat-card guests">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Productos Disponibles</h3>
            <div className="stat-number">{stats.currentGuests}</div>
          </div>
        </div>
      </div>

      <div className="occupancy-section">
        <h3>Tasa de Ocupación</h3>
        <div className="occupancy-bar">
          <div 
            className="occupancy-fill" 
            style={{ width: `${occupancyRate}%` }}
          ></div>
        </div>
        <p>{occupancyRate}% de ocupación</p>
      </div>

      <div className="quick-actions">
        <h3>Acciones Rápidas</h3>
        <div className="actions-grid">
          <button className="action-btn">
            <span>📝</span>
            Nuevo Check-in
          </button>
          <button className="action-btn">
            <span>🚪</span>
            Check-out
          </button>
          <button className="action-btn">
            <span>🧹</span>
            Marcar Limpieza
          </button>
          <button className="action-btn">
            <span>📊</span>
            Ver Reporte
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
