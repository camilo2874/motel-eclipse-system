import { useState, useEffect } from 'react'
import './Tablero.css'

function Tablero() {
  const [estadisticas, setEstadisticas] = useState({
    totalHabitaciones: 11,
    habitacionesOcupadas: 4,
    habitacionesDisponibles: 5,
    habitacionesLimpieza: 2,
    ingresosDiarios: 285000,
    habitacionesActivas: 4
  })

  const tasaOcupacion = ((estadisticas.habitacionesOcupadas / estadisticas.totalHabitaciones) * 100).toFixed(1)

  return (
    <div className="tablero">
      <div className="titulo-panel">
        <h2>PANEL DE CONTROL</h2>
        <p>Sistema de Gestión MOTEL ECLIPSE</p>
      </div>

      <div className="cuadricula-estadisticas">
        <div className="tarjeta-estadistica disponibles">
          <div className="icono-estadistica">🏠</div>
          <div className="contenido-estadistica">
            <h3>Habitaciones Disponibles</h3>
            <div className="numero-estadistica">{estadisticas.habitacionesDisponibles}</div>
          </div>
        </div>

        <div className="tarjeta-estadistica ocupadas">
          <div className="icono-estadistica">🔴</div>
          <div className="contenido-estadistica">
            <h3>Habitaciones Ocupadas</h3>
            <div className="numero-estadistica">{estadisticas.habitacionesOcupadas}</div>
          </div>
        </div>

        <div className="tarjeta-estadistica limpieza">
          <div className="icono-estadistica">🧹</div>
          <div className="contenido-estadistica">
            <h3>En Limpieza</h3>
            <div className="numero-estadistica">{estadisticas.habitacionesLimpieza}</div>
          </div>
        </div>

        <div className="tarjeta-estadistica ingresos">
          <div className="icono-estadistica">💰</div>
          <div className="contenido-estadistica">
            <h3>Ingresos del Día</h3>
            <div className="numero-estadistica">
              ${estadisticas.ingresosDiarios.toLocaleString('es-CO')}
            </div>
          </div>
        </div>

        <div className="tarjeta-estadistica huespedes">
          <div className="icono-estadistica">🕒</div>
          <div className="contenido-estadistica">
            <h3>Habitaciones Activas</h3>
            <div className="numero-estadistica">{estadisticas.habitacionesActivas}</div>
          </div>
        </div>

        <div className="tarjeta-estadistica total">
          <div className="icono-estadistica">📊</div>
          <div className="contenido-estadistica">
            <h3>Total de Habitaciones</h3>
            <div className="numero-estadistica">{estadisticas.totalHabitaciones}</div>
          </div>
        </div>
      </div>

      <div className="seccion-ocupacion">
        <h3>Tasa de Ocupación</h3>
        <div className="barra-ocupacion">
          <div 
            className="relleno-ocupacion" 
            style={{ width: `${tasaOcupacion}%` }}
          ></div>
        </div>
        <p>{tasaOcupacion}% de ocupación</p>
      </div>
    </div>
  )
}

export default Tablero
