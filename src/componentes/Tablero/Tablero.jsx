import { useState, useEffect } from 'react'
import './Tablero.css'

function Tablero() {
  // Obtener datos dinámicos de habitaciones desde localStorage
  const obtenerHabitaciones = () => {
    const habitacionesGuardadas = localStorage.getItem('habitaciones-motel-eclipse')
    if (habitacionesGuardadas) {
      return JSON.parse(habitacionesGuardadas)
    }
    
    // Datos iniciales del Motel Eclipse si no hay nada guardado
    return [
      { numero: 1, tipo: 'Estándar', estado: 'disponible', horaIngreso: null, precio5Horas: 40000 },
      { numero: 2, tipo: 'Estándar', estado: 'disponible', horaIngreso: null, precio5Horas: 40000 },
      { numero: 3, tipo: 'Estándar', estado: 'disponible', horaIngreso: null, precio5Horas: 40000 },
      { numero: 4, tipo: 'Estándar', estado: 'disponible', horaIngreso: null, precio5Horas: 40000 },
      { numero: 5, tipo: 'Con Máquina del Amor', estado: 'disponible', horaIngreso: null, precio5Horas: 45000 },
      { numero: 6, tipo: 'Con Máquina del Amor', estado: 'disponible', horaIngreso: null, precio5Horas: 45000 },
      { numero: 7, tipo: 'Estándar', estado: 'disponible', horaIngreso: null, precio5Horas: 40000 },
      { numero: 8, tipo: 'Estándar', estado: 'disponible', horaIngreso: null, precio5Horas: 40000 },
      { numero: 9, tipo: 'Estándar', estado: 'disponible', horaIngreso: null, precio5Horas: 40000 },
      { numero: 10, tipo: 'Estándar', estado: 'disponible', horaIngreso: null, precio5Horas: 40000 },
      { numero: 11, tipo: 'Suite', estado: 'disponible', horaIngreso: null, precio5Horas: 65000 },
    ]
  }

  const [habitaciones, setHabitaciones] = useState(obtenerHabitaciones())

  // Calcular estadísticas dinámicamente
  const calcularEstadisticas = (habitacionesData = habitaciones) => {
    const totalHabitaciones = habitacionesData.length
    const habitacionesOcupadas = habitacionesData.filter(h => h.estado === 'ocupada').length
    const habitacionesDisponibles = habitacionesData.filter(h => h.estado === 'disponible').length
    const habitacionesLimpieza = habitacionesData.filter(h => h.estado === 'limpieza').length
    
    // Calcular ingresos estimados del día
    const habitacionesConIngreso = habitacionesData.filter(h => h.estado === 'ocupada')
    const ingresosDiarios = habitacionesConIngreso.reduce((total, h) => total + h.precio5Horas, 0)

    return {
      totalHabitaciones,
      habitacionesOcupadas,
      habitacionesDisponibles,
      habitacionesLimpieza,
      ingresosDiarios,
      habitacionesActivas: habitacionesOcupadas
    }
  }

  const [estadisticas, setEstadisticas] = useState(() => calcularEstadisticas())

  // Actualizar estadísticas cada minuto y cuando cambien los datos en localStorage
  useEffect(() => {
    const actualizarDatos = () => {
      const habitacionesActualizadas = obtenerHabitaciones()
      setHabitaciones(habitacionesActualizadas)
      setEstadisticas(calcularEstadisticas(habitacionesActualizadas))
    }

    const intervalo = setInterval(actualizarDatos, 60000) // Actualizar cada minuto

    // Escuchar cambios en localStorage
    const manejarCambioStorage = (e) => {
      if (e.key === 'habitaciones-motel-eclipse') {
        actualizarDatos()
      }
    }

    window.addEventListener('storage', manejarCambioStorage)

    return () => {
      clearInterval(intervalo)
      window.removeEventListener('storage', manejarCambioStorage)
    }
  }, [])

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

        <div className="tarjeta-estadistica habitaciones-activas">
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

      <div className="seccion-detalle">
        <h3>Detalle por Tipo de Habitación</h3>
        <div className="lista-tipos">
          <div className="tipo-habitacion">
            <span className="icono-tipo">🏠</span>
            <span className="nombre-tipo">Estándar</span>
            <span className="cantidad-tipo">
              {habitaciones.filter(h => h.tipo === 'Estándar').length} habitaciones
            </span>
            <span className="precio-tipo">$40,000</span>
          </div>
          <div className="tipo-habitacion">
            <span className="icono-tipo">💕</span>
            <span className="nombre-tipo">Con Máquina del Amor</span>
            <span className="cantidad-tipo">
              {habitaciones.filter(h => h.tipo === 'Con Máquina del Amor').length} habitaciones
            </span>
            <span className="precio-tipo">$45,000</span>
          </div>
          <div className="tipo-habitacion">
            <span className="icono-tipo">👑</span>
            <span className="nombre-tipo">Suite</span>
            <span className="cantidad-tipo">
              {habitaciones.filter(h => h.tipo === 'Suite').length} habitación
            </span>
            <span className="precio-tipo">$65,000</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Tablero
