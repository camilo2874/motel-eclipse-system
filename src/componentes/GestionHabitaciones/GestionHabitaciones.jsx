import { useState, useEffect } from 'react'
import './GestionHabitaciones.css'

function GestionHabitaciones() {
  // Configuración inicial de habitaciones del Motel Eclipse
  const habitacionesIniciales = [
    { numero: 1, tipo: 'Estándar', estado: 'disponible', horaIngreso: null, precio5Horas: 40000, ventas: [] },
    { numero: 2, tipo: 'Estándar', estado: 'disponible', horaIngreso: null, precio5Horas: 40000, ventas: [] },
    { numero: 3, tipo: 'Estándar', estado: 'disponible', horaIngreso: null, precio5Horas: 40000, ventas: [] },
    { numero: 4, tipo: 'Estándar', estado: 'disponible', horaIngreso: null, precio5Horas: 40000, ventas: [] },
    { numero: 5, tipo: 'Con Máquina del Amor', estado: 'disponible', horaIngreso: null, precio5Horas: 45000, ventas: [] },
    { numero: 6, tipo: 'Con Máquina del Amor', estado: 'disponible', horaIngreso: null, precio5Horas: 45000, ventas: [] },
    { numero: 7, tipo: 'Estándar', estado: 'disponible', horaIngreso: null, precio5Horas: 40000, ventas: [] },
    { numero: 8, tipo: 'Estándar', estado: 'disponible', horaIngreso: null, precio5Horas: 40000, ventas: [] },
    { numero: 9, tipo: 'Estándar', estado: 'disponible', horaIngreso: null, precio5Horas: 40000, ventas: [] },
    { numero: 10, tipo: 'Estándar', estado: 'disponible', horaIngreso: null, precio5Horas: 40000, ventas: [] },
    { numero: 11, tipo: 'Suite', estado: 'disponible', horaIngreso: null, precio5Horas: 65000, ventas: [] },
  ]

  // Estado dinámico de las habitaciones
  const [habitaciones, setHabitaciones] = useState(() => {
    const habitacionesGuardadas = localStorage.getItem('habitaciones-motel-eclipse')
    if (habitacionesGuardadas) {
      const habitacionesParsed = JSON.parse(habitacionesGuardadas)
      // Asegurar que todas las habitaciones tengan el array de ventas
      return habitacionesParsed.map(habitacion => ({
        ...habitacion,
        ventas: habitacion.ventas || []
      }))
    }
    return habitacionesIniciales
  })

  // Estado para el modal de ventas
  const [modalVentaAbierto, setModalVentaAbierto] = useState(false)
  const [habitacionSeleccionada, setHabitacionSeleccionada] = useState(null)
  const [nuevaVenta, setNuevaVenta] = useState({
    producto: '',
    cantidad: 1,
    precio: 0
  })

  // Estado para el modal de salida
  const [modalSalidaAbierto, setModalSalidaAbierto] = useState(false)
  const [habitacionSalida, setHabitacionSalida] = useState(null)

  // Productos disponibles para venta
  const productosDisponibles = [
    { nombre: 'Bebida Gaseosa', precio: 3000 },
    { nombre: 'Agua', precio: 2000 },
    { nombre: 'Cerveza', precio: 5000 },
    { nombre: 'Snacks', precio: 4000 },
    { nombre: 'Preservativos', precio: 3500 },
    { nombre: 'Toallas Extra', precio: 8000 },
    { nombre: 'Champú', precio: 6000 },
    { nombre: 'Otros', precio: 0 }
  ]

  // Guardar en localStorage cuando cambien las habitaciones
  useEffect(() => {
    localStorage.setItem('habitaciones-motel-eclipse', JSON.stringify(habitaciones))
  }, [habitaciones])

  // Recalcular total cuando cambie cantidad o precio
  useEffect(() => {
    if (nuevaVenta.precio > 0 && nuevaVenta.cantidad > 0) {
      // Forzar re-render del componente para mostrar el nuevo total
      setNuevaVenta(prev => ({ ...prev }))
    }
  }, [nuevaVenta.cantidad, nuevaVenta.precio])

  // Funciones para manejar cambios de estado
  const hacerCheckIn = (numeroHabitacion) => {
    const ahora = new Date()
    const horaActual = `${ahora.getHours()}:${ahora.getMinutes().toString().padStart(2, '0')}`
    
    setHabitaciones(prevHabitaciones =>
      prevHabitaciones.map(habitacion =>
        habitacion.numero === numeroHabitacion
          ? { ...habitacion, estado: 'ocupada', horaIngreso: horaActual, ventas: habitacion.ventas || [] }
          : habitacion
      )
    )
  }

  const hacerCheckOut = (numeroHabitacion) => {
    const habitacion = habitaciones.find(h => h.numero === numeroHabitacion)
    setHabitacionSalida(habitacion)
    setModalSalidaAbierto(true)
  }

  const confirmarSalida = () => {
    if (!habitacionSalida) return
    
    setHabitaciones(prevHabitaciones =>
      prevHabitaciones.map(habitacion =>
        habitacion.numero === habitacionSalida.numero
          ? { ...habitacion, estado: 'limpieza', horaIngreso: null, ventas: [] }
          : habitacion
      )
    )
    
    cerrarModalSalida()
  }

  const cerrarModalSalida = () => {
    setModalSalidaAbierto(false)
    setHabitacionSalida(null)
  }

  const marcarLimpiezaCompleta = (numeroHabitacion) => {
    setHabitaciones(prevHabitaciones =>
      prevHabitaciones.map(habitacion =>
        habitacion.numero === numeroHabitacion
          ? { ...habitacion, estado: 'disponible', horaIngreso: null }
          : habitacion
      )
    )
  }

  const reiniciarHabitaciones = () => {
    if (confirm('¿Estás seguro de que quieres reiniciar todas las habitaciones a disponible?')) {
      setHabitaciones(habitacionesIniciales)
      localStorage.removeItem('habitaciones-motel-eclipse')
    }
  }

  // Funciones para manejar ventas
  const abrirModalVenta = (numeroHabitacion) => {
    setHabitacionSeleccionada(numeroHabitacion)
    setModalVentaAbierto(true)
    setNuevaVenta({ producto: '', cantidad: 1, precio: 0 })
  }

  const cerrarModalVenta = () => {
    setModalVentaAbierto(false)
    setHabitacionSeleccionada(null)
    setNuevaVenta({ producto: '', cantidad: 1, precio: 0 })
  }

  const manejarCambioProducto = (e) => {
    const productoSeleccionado = e.target.value
    const producto = productosDisponibles.find(p => p.nombre === productoSeleccionado)
    
    setNuevaVenta(prev => ({
      ...prev,
      producto: productoSeleccionado,
      precio: producto ? producto.precio : 0
    }))
  }

  const agregarVenta = () => {
    if (!nuevaVenta.producto || nuevaVenta.cantidad <= 0) {
      alert('Por favor completa todos los campos')
      return
    }

    const totalVenta = nuevaVenta.precio * nuevaVenta.cantidad
    const ventaCompleta = {
      id: Date.now(), // ID único para la venta
      producto: nuevaVenta.producto,
      cantidad: nuevaVenta.cantidad,
      precioUnitario: nuevaVenta.precio,
      total: totalVenta,
      hora: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
    }

    // Agregar la venta al array de ventas de la habitación
    setHabitaciones(prevHabitaciones =>
      prevHabitaciones.map(habitacion =>
        habitacion.numero === habitacionSeleccionada
          ? { ...habitacion, ventas: [...(habitacion.ventas || []), ventaCompleta] }
          : habitacion
      )
    )
    
    cerrarModalVenta()
  }

  // Función para calcular el total de consumo de una habitación
  const calcularTotalConsumo = (ventas) => {
    if (!ventas || !Array.isArray(ventas) || ventas.length === 0) return 0
    return ventas.reduce((total, venta) => total + venta.total, 0)
  }

  // Función para calcular el costo total de la habitación incluyendo horas adicionales
  const calcularCostoHabitacion = (habitacion, horaSalida = new Date()) => {
    if (!habitacion.horaIngreso) return habitacion.precio5Horas

    // Calcular tiempo transcurrido en horas
    const [horas, minutos] = habitacion.horaIngreso.split(':')
    const ingreso = new Date()
    ingreso.setHours(parseInt(horas), parseInt(minutos), 0, 0)
    
    const diferencia = horaSalida - ingreso
    const horasTranscurridas = diferencia / (1000 * 60 * 60) // Convertir a horas decimales
    
    // Si es 5 horas o menos, cobrar precio base
    if (horasTranscurridas <= 5) {
      return habitacion.precio5Horas
    }
    
    // Calcular horas adicionales
    const horasAdicionales = Math.ceil(horasTranscurridas - 5) // Redondear hacia arriba
    
    // Determinar precio por hora adicional según tipo de habitación
    let precioPorHoraAdicional
    if (habitacion.tipo === 'Suite') {
      precioPorHoraAdicional = 10000
    } else {
      precioPorHoraAdicional = 5000 // Estándar y Con Máquina del Amor
    }
    
    const costoAdicional = horasAdicionales * precioPorHoraAdicional
    
    return habitacion.precio5Horas + costoAdicional
  }

  // Función para obtener detalles del cálculo de tiempo y costo
  const obtenerDetallesTiempo = (habitacion, horaSalida = new Date()) => {
    if (!habitacion.horaIngreso) return null

    const [horas, minutos] = habitacion.horaIngreso.split(':')
    const ingreso = new Date()
    ingreso.setHours(parseInt(horas), parseInt(minutos), 0, 0)
    
    const diferencia = horaSalida - ingreso
    const horasTranscurridas = diferencia / (1000 * 60 * 60)
    
    const horasEnteras = Math.floor(horasTranscurridas)
    const minutosRestantes = Math.floor((horasTranscurridas - horasEnteras) * 60)
    
    let horasAdicionales = 0
    let costoAdicional = 0
    
    if (horasTranscurridas > 5) {
      horasAdicionales = Math.ceil(horasTranscurridas - 5)
      const precioPorHoraAdicional = habitacion.tipo === 'Suite' ? 10000 : 5000
      costoAdicional = horasAdicionales * precioPorHoraAdicional
    }
    
    return {
      horasEnteras,
      minutosRestantes,
      horasTranscurridas,
      horasAdicionales,
      costoAdicional,
      precioPorHoraAdicional: habitacion.tipo === 'Suite' ? 10000 : 5000
    }
  }

  const calcularTiempoTranscurrido = (horaIngreso) => {
    if (!horaIngreso) return null
    
    const ahora = new Date()
    const [horas, minutos] = horaIngreso.split(':')
    const ingreso = new Date()
    ingreso.setHours(parseInt(horas), parseInt(minutos), 0, 0)
    
    const diferencia = ahora - ingreso
    const horasTranscurridas = Math.floor(diferencia / (1000 * 60 * 60))
    const minutosTranscurridos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60))
    
    return `${horasTranscurridas}h ${minutosTranscurridos}m`
  }

  const obtenerIconoTipo = (tipo) => {
    const iconosPorTipo = {
      'Estándar': '🏠',
      'Con Máquina del Amor': '💕',
      'Suite': '👑'
    }
    return iconosPorTipo[tipo] || '🏠'
  }

  const obtenerInsigniaEstado = (estado) => {
    const configuracionEstado = {
      ocupada: { texto: 'Ocupada', clase: 'estado-ocupada', icono: '🔴' },
      disponible: { texto: 'Disponible', clase: 'estado-disponible', icono: '🟢' },
      limpieza: { texto: 'Limpieza', clase: 'estado-limpieza', icono: '🧹' }
    }
    return configuracionEstado[estado] || configuracionEstado.disponible
  }

  return (
    <div className="gestion-habitaciones">
      <div className="encabezado-habitaciones">
        <h2>Gestión de Habitaciones</h2>
        <div className="botones-encabezado">
          <button className="boton-reiniciar" onClick={reiniciarHabitaciones}>
            <span>🔄</span>
            Reiniciar Todo
          </button>
          <button className="boton-agregar-habitacion">
            <span>➕</span>
            Agregar Habitación
          </button>
        </div>
      </div>

      <div className="cuadricula-habitaciones">
        {habitaciones.map(habitacion => {
          const estado = obtenerInsigniaEstado(habitacion.estado)
          return (
            <div 
              key={habitacion.numero} 
              className={`tarjeta-habitacion ${estado.clase}`}
              data-tipo={habitacion.tipo}
            >
              <div className="encabezado-tarjeta-habitacion">
                <h3>Habitación {habitacion.numero}</h3>
                <span className="estado-habitacion">
                  {estado.icono} {estado.texto}
                </span>
              </div>
              
              <div className="detalles-habitacion">
                <p><strong>Tipo:</strong> {obtenerIconoTipo(habitacion.tipo)} {habitacion.tipo}</p>
                <p><strong>Precio 5 Horas:</strong> ${habitacion.precio5Horas.toLocaleString('es-CO')}</p>
                
                {habitacion.estado === 'ocupada' && (
                  <>
                    <p><strong>Hora Ingreso:</strong> {habitacion.horaIngreso}</p>
                    <p 
                      className="campo-consumo-clickeable"
                      onClick={() => abrirModalVenta(habitacion.numero)}
                      title="Click para agregar venta"
                    >
                      <strong>Consumo:</strong> ${calcularTotalConsumo(habitacion.ventas || []).toLocaleString('es-CO')}
                      {habitacion.ventas && Array.isArray(habitacion.ventas) && habitacion.ventas.length > 0 && (
                        <span className="contador-ventas"> ({habitacion.ventas.length} items)</span>
                      )}
                    </p>
                    <p><strong>Tiempo:</strong> {calcularTiempoTranscurrido(habitacion.horaIngreso)}</p>
                  </>
                )}
              </div>

              <div className="acciones-habitacion">
                {habitacion.estado === 'disponible' && (
                  <button 
                    className="boton-accion primario"
                    onClick={() => hacerCheckIn(habitacion.numero)}
                  >
                    Ocupar
                  </button>
                )}
                {habitacion.estado === 'ocupada' && (
                  <>
                    <button 
                      className="boton-accion secundario"
                      onClick={() => abrirModalVenta(habitacion.numero)}
                    >
                      Venta
                    </button>
                    <button 
                      className="boton-accion peligro"
                      onClick={() => hacerCheckOut(habitacion.numero)}
                    >
                      Salida
                    </button>
                  </>
                )}
                {habitacion.estado === 'limpieza' && (
                  <button 
                    className="boton-accion exito"
                    onClick={() => marcarLimpiezaCompleta(habitacion.numero)}
                  >
                    Limpieza Lista
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="resumen-habitaciones">
        <div className="tarjeta-resumen">
          <h3>Resumen de Habitaciones</h3>
          <div className="estadisticas-resumen">
            <div className="elemento-resumen">
              <span className="numero-resumen">{habitaciones.filter(h => h.estado === 'disponible').length}</span>
              <span className="etiqueta-resumen">Disponibles</span>
            </div>
            <div className="elemento-resumen">
              <span className="numero-resumen">{habitaciones.filter(h => h.estado === 'ocupada').length}</span>
              <span className="etiqueta-resumen">Ocupadas</span>
            </div>
            <div className="elemento-resumen">
              <span className="numero-resumen">{habitaciones.filter(h => h.estado === 'limpieza').length}</span>
              <span className="etiqueta-resumen">En Limpieza</span>
            </div>
          </div>
        </div>

        <div className="tarjeta-tipos">
          <h3>Tipos de Habitaciones</h3>
          <div className="tipos-info">
            <div className="tipo-item">
              <span className="tipo-icono">🏠</span>
              <div className="tipo-detalles">
                <h4>Estándar</h4>
                <p>8 habitaciones - $40.000 (5 horas)</p>
              </div>
            </div>
            <div className="tipo-item">
              <span className="tipo-icono">💕</span>
              <div className="tipo-detalles">
                <h4>Con Máquina del Amor</h4>
                <p>2 habitaciones (#5, #6) - $45.000 (5 horas)</p>
              </div>
            </div>
            <div className="tipo-item">
              <span className="tipo-icono">👑</span>
              <div className="tipo-detalles">
                <h4>Suite</h4>
                <p>1 habitación (#11) - $65.000 (5 horas)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Ventas */}
      {modalVentaAbierto && (
        <div className="modal-overlay" onClick={cerrarModalVenta}>
          <div className="modal-venta" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Agregar Venta - Habitación {habitacionSeleccionada}</h3>
              <button className="boton-cerrar" onClick={cerrarModalVenta}>
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              {/* Mostrar historial de ventas si existen */}
              {(() => {
                const habitacion = habitaciones.find(h => h.numero === habitacionSeleccionada)
                const ventas = habitacion?.ventas || []
                return ventas.length > 0 ? (
                  <div className="historial-ventas">
                    <h4>Ventas Realizadas:</h4>
                    <div className="lista-ventas">
                      {ventas.map(venta => (
                        <div key={venta.id} className="item-venta">
                          <span className="producto-venta">{venta.producto}</span>
                          <span className="cantidad-venta">x{venta.cantidad}</span>
                          <span className="total-venta">${venta.total.toLocaleString('es-CO')}</span>
                          <span className="hora-venta">{venta.hora}</span>
                        </div>
                      ))}
                    </div>
                    <div className="total-consumo">
                      <strong>Total Consumo: ${calcularTotalConsumo(ventas).toLocaleString('es-CO')}</strong>
                    </div>
                    <hr style={{margin: '1rem 0'}} />
                  </div>
                ) : null
              })()}

              <h4>Agregar Nueva Venta:</h4>
              
              <div className="campo-venta">
                <label>Producto:</label>
                <select 
                  value={nuevaVenta.producto} 
                  onChange={manejarCambioProducto}
                  className="select-producto"
                >
                  <option value="">Seleccionar producto...</option>
                  {productosDisponibles.map(producto => (
                    <option key={producto.nombre} value={producto.nombre}>
                      {producto.nombre} - ${producto.precio.toLocaleString('es-CO')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="campo-venta">
                <label>Cantidad:</label>
                <input 
                  type="number" 
                  min="1" 
                  value={nuevaVenta.cantidad}
                  onChange={(e) => {
                    const cantidad = parseInt(e.target.value) || 1
                    setNuevaVenta(prev => ({...prev, cantidad}))
                  }}
                  className="input-cantidad"
                />
              </div>

              {nuevaVenta.producto === 'Otros' && (
                <div className="campo-venta">
                  <label>Precio unitario:</label>
                  <input 
                    type="number" 
                    min="0" 
                    value={nuevaVenta.precio}
                    onChange={(e) => {
                      const precio = parseInt(e.target.value) || 0
                      setNuevaVenta(prev => ({...prev, precio}))
                    }}
                    className="input-precio"
                    placeholder="Ingresa el precio"
                  />
                </div>
              )}

              {nuevaVenta.producto && nuevaVenta.cantidad > 0 && nuevaVenta.precio > 0 && (
                <div className="resumen-venta">
                  <p><strong>Total: ${(nuevaVenta.precio * nuevaVenta.cantidad).toLocaleString('es-CO')}</strong></p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="boton-cancelar" onClick={cerrarModalVenta}>
                Cancelar
              </button>
              <button className="boton-agregar-venta" onClick={agregarVenta}>
                Agregar Venta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de salida */}
      {modalSalidaAbierto && habitacionSalida && (
        <div className="modal-overlay" onClick={cerrarModalSalida}>
          <div className="modal-salida" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirmar Salida</h3>
              <button className="btn-cerrar-modal" onClick={cerrarModalSalida}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="confirmacion-salida">
                <h4>Habitación {habitacionSalida.numero}</h4>
                <div className="detalle-pago">
                  <div className="item-pago">
                    <span>Tipo de habitación:</span>
                    <span>{habitacionSalida.tipo}</span>
                  </div>
                  <div className="item-pago">
                    <span>Hora de ingreso:</span>
                    <span>{habitacionSalida.horaIngreso}</span>
                  </div>
                  <div className="item-pago">
                    <span>Hora de salida:</span>
                    <span>{new Date().toLocaleTimeString()}</span>
                  </div>
                  
                  {(() => {
                    const detalles = obtenerDetallesTiempo(habitacionSalida)
                    if (!detalles) return null
                    
                    return (
                      <>
                        <div className="item-pago">
                          <span>Tiempo total:</span>
                          <span>{detalles.horasEnteras}h {detalles.minutosRestantes}m</span>
                        </div>
                        
                        <div className="tiempo-detalle">
                          <div className="item-pago">
                            <span>Precio base (5 horas):</span>
                            <span>${habitacionSalida.precio5Horas.toLocaleString()}</span>
                          </div>
                          
                          {detalles.horasAdicionales > 0 && (
                            <>
                              <div className="item-pago">
                                <span>Horas adicionales:</span>
                                <span>{detalles.horasAdicionales}h × ${detalles.precioPorHoraAdicional.toLocaleString()}</span>
                              </div>
                              <div className="item-pago">
                                <span>Costo adicional:</span>
                                <span>${detalles.costoAdicional.toLocaleString()}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </>
                    )
                  })()}
                  
                  {habitacionSalida.ventas && habitacionSalida.ventas.length > 0 && (
                    <div className="consumos-detalle">
                      <h5>Consumos:</h5>
                      {habitacionSalida.ventas.map((venta, index) => (
                        <div key={index} className="item-consumo">
                          <span>{venta.producto} x{venta.cantidad}</span>
                          <span>${(venta.precioUnitario * venta.cantidad).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="total-pago">
                    <div className="subtotal">
                      <span>Costo habitación:</span>
                      <span>${calcularCostoHabitacion(habitacionSalida).toLocaleString()}</span>
                    </div>
                    <div className="subtotal">
                      <span>Consumos:</span>
                      <span>${(habitacionSalida.ventas || []).reduce((total, venta) => total + (venta.precioUnitario * venta.cantidad), 0).toLocaleString()}</span>
                    </div>
                    <div className="total-final">
                      <span>Total a pagar:</span>
                      <span>${(calcularCostoHabitacion(habitacionSalida) + (habitacionSalida.ventas || []).reduce((total, venta) => total + (venta.precioUnitario * venta.cantidad), 0)).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="boton-cancelar" onClick={cerrarModalSalida}>
                Cancelar
              </button>
              <button className="boton-confirmar" onClick={confirmarSalida}>
                Confirmar Salida
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GestionHabitaciones
