import { useState, useEffect } from 'react'
import './Reportes.css'

function Reportes() {
  const [habitaciones, setHabitaciones] = useState([])
  const [reporteSeleccionado, setReporteSeleccionado] = useState('diario')
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0])

  // Cargar datos de habitaciones del localStorage
  useEffect(() => {
    const habitacionesGuardadas = localStorage.getItem('habitaciones-motel-eclipse')
    if (habitacionesGuardadas) {
      setHabitaciones(JSON.parse(habitacionesGuardadas))
    }
  }, [])

  // Función para calcular el costo total de la habitación incluyendo horas adicionales
  const calcularCostoHabitacion = (habitacion, horaSalida = new Date()) => {
    if (!habitacion.horaIngreso) return habitacion.precio5Horas

    const [horas, minutos] = habitacion.horaIngreso.split(':')
    const ingreso = new Date()
    ingreso.setHours(parseInt(horas), parseInt(minutos), 0, 0)
    
    const diferencia = horaSalida - ingreso
    const horasTranscurridas = diferencia / (1000 * 60 * 60)
    
    if (horasTranscurridas <= 5) {
      return habitacion.precio5Horas
    }
    
    const horasAdicionales = Math.ceil(horasTranscurridas - 5)
    const precioPorHoraAdicional = habitacion.tipo === 'Suite' ? 10000 : 5000
    const costoAdicional = horasAdicionales * precioPorHoraAdicional
    
    return habitacion.precio5Horas + costoAdicional
  }

  // Función para calcular el total de consumo de una habitación
  const calcularTotalConsumo = (ventas) => {
    if (!ventas || !Array.isArray(ventas) || ventas.length === 0) return 0
    return ventas.reduce((total, venta) => total + venta.total, 0)
  }

  // Calcular estadísticas del día actual
  const obtenerEstadisticasDiarias = () => {
    const habitacionesOcupadas = habitaciones.filter(h => h.estado === 'ocupada')
    const habitacionesEnLimpieza = habitaciones.filter(h => h.estado === 'limpieza')
    const habitacionesDisponibles = habitaciones.filter(h => h.estado === 'disponible')

    // Ingresos estimados (habitaciones ocupadas actualmente)
    const ingresosHabitaciones = habitacionesOcupadas.reduce((total, hab) => {
      return total + calcularCostoHabitacion(hab)
    }, 0)

    // Ingresos por consumos
    const ingresosConsumos = habitacionesOcupadas.reduce((total, hab) => {
      return total + calcularTotalConsumo(hab.ventas)
    }, 0)

    const ingresosTotales = ingresosHabitaciones + ingresosConsumos

    // Estadísticas por tipo de habitación
    const estadisticasPorTipo = {
      'Estándar': {
        total: habitaciones.filter(h => h.tipo === 'Estándar').length,
        ocupadas: habitacionesOcupadas.filter(h => h.tipo === 'Estándar').length,
        ingresos: habitacionesOcupadas
          .filter(h => h.tipo === 'Estándar')
          .reduce((total, hab) => total + calcularCostoHabitacion(hab) + calcularTotalConsumo(hab.ventas), 0)
      },
      'Con Máquina del Amor': {
        total: habitaciones.filter(h => h.tipo === 'Con Máquina del Amor').length,
        ocupadas: habitacionesOcupadas.filter(h => h.tipo === 'Con Máquina del Amor').length,
        ingresos: habitacionesOcupadas
          .filter(h => h.tipo === 'Con Máquina del Amor')
          .reduce((total, hab) => total + calcularCostoHabitacion(hab) + calcularTotalConsumo(hab.ventas), 0)
      },
      'Suite': {
        total: habitaciones.filter(h => h.tipo === 'Suite').length,
        ocupadas: habitacionesOcupadas.filter(h => h.tipo === 'Suite').length,
        ingresos: habitacionesOcupadas
          .filter(h => h.tipo === 'Suite')
          .reduce((total, hab) => total + calcularCostoHabitacion(hab) + calcularTotalConsumo(hab.ventas), 0)
      }
    }

    return {
      totalHabitaciones: habitaciones.length,
      ocupadas: habitacionesOcupadas.length,
      disponibles: habitacionesDisponibles.length,
      enLimpieza: habitacionesEnLimpieza.length,
      porcentajeOcupacion: habitaciones.length > 0 ? ((habitacionesOcupadas.length / habitaciones.length) * 100).toFixed(1) : 0,
      ingresosHabitaciones,
      ingresosConsumos,
      ingresosTotales,
      estadisticasPorTipo
    }
  }

  const estadisticas = obtenerEstadisticasDiarias()

  return (
    <div className="reportes">
      <div className="encabezado-reportes">
        <h2>Reportes y Planillas</h2>
        <div className="controles-reporte">
          <select 
            value={reporteSeleccionado} 
            onChange={(e) => setReporteSeleccionado(e.target.value)}
            className="selector-reporte"
          >
            <option value="diario">Reporte Diario</option>
            <option value="ocupacion">Ocupación Actual</option>
            <option value="ingresos">Ingresos</option>
          </select>
          <input 
            type="date" 
            value={fechaSeleccionada}
            onChange={(e) => setFechaSeleccionada(e.target.value)}
            className="selector-fecha"
          />
          <button className="boton-generar-reporte">
            <span>📊</span>
            Exportar PDF
          </button>
        </div>
      </div>

      {reporteSeleccionado === 'diario' && (
        <div className="reporte-diario">
          <div className="encabezado-planilla">
            <h3>Planilla Diaria - {new Date(fechaSeleccionada).toLocaleDateString('es-CO', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</h3>
            <div className="info-turno">
              <span><strong>Administrador:</strong> Camilo Velasquez</span>
              <span><strong>Turno:</strong> {new Date().getHours() < 12 ? 'Mañana' : new Date().getHours() < 18 ? 'Tarde' : 'Noche'}</span>
            </div>
          </div>

          <div className="resumen-diario">
            <div className="tarjeta-estadistica">
              <div className="icono-estadistica">🏨</div>
              <div className="datos-estadistica">
                <h4>Ocupación</h4>
                <p className="numero-principal">{estadisticas.ocupadas}/{estadisticas.totalHabitaciones}</p>
                <p className="porcentaje">{estadisticas.porcentajeOcupacion}%</p>
              </div>
            </div>

            <div className="tarjeta-estadistica">
              <div className="icono-estadistica">💰</div>
              <div className="datos-estadistica">
                <h4>Ingresos Totales</h4>
                <p className="numero-principal">${estadisticas.ingresosTotales.toLocaleString('es-CO')}</p>
                <p className="subtotal">Habitaciones: ${estadisticas.ingresosHabitaciones.toLocaleString('es-CO')}</p>
                <p className="subtotal">Consumos: ${estadisticas.ingresosConsumos.toLocaleString('es-CO')}</p>
              </div>
            </div>

            <div className="tarjeta-estadistica">
              <div className="icono-estadistica">🧹</div>
              <div className="datos-estadistica">
                <h4>Estado General</h4>
                <p className="estado-item">✅ Disponibles: {estadisticas.disponibles}</p>
                <p className="estado-item">🔴 Ocupadas: {estadisticas.ocupadas}</p>
                <p className="estado-item">🧹 Limpieza: {estadisticas.enLimpieza}</p>
              </div>
            </div>
          </div>

          <div className="detalle-habitaciones">
            <h4>Detalle por Tipo de Habitación</h4>
            <div className="tabla-tipos">
              {Object.entries(estadisticas.estadisticasPorTipo).map(([tipo, datos]) => (
                <div key={tipo} className="fila-tipo">
                  <div className="nombre-tipo">
                    {tipo === 'Estándar' && '🏠'} 
                    {tipo === 'Con Máquina del Amor' && '💕'} 
                    {tipo === 'Suite' && '👑'} 
                    {tipo}
                  </div>
                  <div className="ocupacion-tipo">{datos.ocupadas}/{datos.total}</div>
                  <div className="ingresos-tipo">${datos.ingresos.toLocaleString('es-CO')}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {reporteSeleccionado === 'ocupacion' && (
        <div className="reporte-ocupacion">
          <h3>Estado Actual de Habitaciones</h3>
          <div className="grid-habitaciones-reporte">
            {habitaciones.map(habitacion => (
              <div key={habitacion.numero} className={`habitacion-reporte ${habitacion.estado}`}>
                <div className="numero-habitacion">#{habitacion.numero}</div>
                <div className="tipo-habitacion">{habitacion.tipo}</div>
                <div className="estado-habitacion">
                  {habitacion.estado === 'ocupada' && '� Ocupada'}
                  {habitacion.estado === 'disponible' && '🟢 Disponible'}
                  {habitacion.estado === 'limpieza' && '🧹 Limpieza'}
                </div>
                {habitacion.estado === 'ocupada' && (
                  <div className="info-ocupacion">
                    <p>Ingreso: {habitacion.horaIngreso}</p>
                    <p>Consumos: ${calcularTotalConsumo(habitacion.ventas).toLocaleString('es-CO')}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {reporteSeleccionado === 'ingresos' && (
        <div className="reporte-ingresos">
          <h3>Resumen de Ingresos</h3>
          <div className="desglose-ingresos">
            <div className="seccion-ingresos">
              <h4>Ingresos por Habitaciones</h4>
              <div className="lista-ingresos">
                {Object.entries(estadisticas.estadisticasPorTipo).map(([tipo, datos]) => (
                  <div key={tipo} className="item-ingreso">
                    <span>{tipo}</span>
                    <span>${datos.ingresos.toLocaleString('es-CO')}</span>
                  </div>
                ))}
              </div>
              <div className="total-seccion">
                <strong>Total Habitaciones: ${estadisticas.ingresosHabitaciones.toLocaleString('es-CO')}</strong>
              </div>
            </div>

            <div className="seccion-ingresos">
              <h4>Ingresos por Consumos</h4>
              <div className="total-seccion">
                <strong>Total Consumos: ${estadisticas.ingresosConsumos.toLocaleString('es-CO')}</strong>
              </div>
            </div>

            <div className="total-general">
              <h3>Ingresos Totales del Día: ${estadisticas.ingresosTotales.toLocaleString('es-CO')}</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Reportes
