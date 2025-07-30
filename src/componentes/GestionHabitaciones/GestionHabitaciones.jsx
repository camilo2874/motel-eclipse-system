import { useState, useEffect } from 'react'
import './GestionHabitaciones.css'
import { obtenerHabitaciones, actualizarHabitacion, guardarVenta, obtenerProductos, actualizarProducto } from '../../firebase/database'
import { db } from '../../firebase/config'
import { onSnapshot, collection } from 'firebase/firestore'

function GestionHabitaciones() {
  // Estado dinámico de las habitaciones (ahora desde Firebase)
  const [habitaciones, setHabitaciones] = useState([])
  const [cargandoHabitaciones, setCargandoHabitaciones] = useState(true)
  const [firebaseConectado, setFirebaseConectado] = useState(false)
  
  // Estado para productos del inventario
  const [productosInventario, setProductosInventario] = useState([])
  const [cargandoProductos, setCargandoProductos] = useState(true)

  // Configuración inicial de habitaciones
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

  // Cargar habitaciones desde Firebase
  useEffect(() => {
    const cargarHabitacionesFirebase = async () => {
      try {
        console.log('🔥 Cargando habitaciones desde Firebase...')
        const habitacionesFirebase = await obtenerHabitaciones()
        
        if (habitacionesFirebase && habitacionesFirebase.length > 0) {
          setHabitaciones(habitacionesFirebase.map(habitacion => ({
            ...habitacion,
            ventas: habitacion.ventas || []
          })))
          setFirebaseConectado(true)
          console.log('✅ Habitaciones cargadas desde Firebase')
        } else {
          console.log('📱 Cargando desde localStorage como respaldo')
          cargarDatosLocales()
        }
      } catch (error) {
        console.error('❌ Error cargando desde Firebase:', error)
        cargarDatosLocales()
      } finally {
        setCargandoHabitaciones(false)
      }
    }

    cargarHabitacionesFirebase()
  }, [])

  // Cargar productos del inventario
  useEffect(() => {
    const cargarProductosInventario = async () => {
      try {
        console.log('📦 Cargando productos del inventario...')
        const productos = await obtenerProductos()
        if (productos && productos.length > 0) {
          setProductosInventario(productos.filter(p => p.disponible !== false))
          console.log('✅ Productos del inventario cargados:', productos.length)
        } else {
          // Empezar completamente vacío - sin productos predeterminados
          console.log('📦 No hay productos en el inventario')
          setProductosInventario([])
        }
      } catch (error) {
        console.error('❌ Error cargando productos:', error)
        // Empezar vacío en caso de error
        setProductosInventario([])
      } finally {
        setCargandoProductos(false)
      }
    }

    cargarProductosInventario()
  }, [])

  // Escuchar cambios en tiempo real desde Firebase
  useEffect(() => {
    if (!firebaseConectado) return
    
    console.log('📡 Configurando escucha en tiempo real de Firebase')
    const unsubscribe = onSnapshot(collection(db, 'habitaciones'), (snapshot) => {
      const habitacionesActualizadas = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      if (habitacionesActualizadas.length > 0) {
        setHabitaciones(habitacionesActualizadas)
        console.log('🔄 Habitaciones actualizadas desde Firebase en tiempo real')
      }
    })
    
    return () => unsubscribe()
  }, [firebaseConectado])

  // Función de respaldo para cargar datos locales
  const cargarDatosLocales = () => {
    const habitacionesGuardadas = localStorage.getItem('habitaciones-motel-eclipse')
    if (habitacionesGuardadas) {
      const habitacionesParsed = JSON.parse(habitacionesGuardadas)
      const habitacionesConVentas = habitacionesParsed.map(habitacion => ({
        ...habitacion,
        ventas: habitacion.ventas || []
      }))
      setHabitaciones(habitacionesConVentas)
      console.log('📱 Habitaciones cargadas desde localStorage')
    } else {
      setHabitaciones(habitacionesIniciales)
      console.log('🏗️ Usando configuración inicial de habitaciones')
    }
  }

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

  // Función para guardar cambios en Firebase
  const guardarCambiosHabitacion = async (habitacion) => {
    try {
      if (firebaseConectado) {
        // Usar el formato correcto de ID para Firestore
        const habitacionId = `habitacion-${habitacion.numero}`;
        await actualizarHabitacion(habitacionId, habitacion)
        console.log(`✅ Habitación ${habitacion.numero} actualizada en Firebase`)
      }
      
      // También guardar en localStorage como respaldo
      const habitacionesActuales = habitaciones.map(h => 
        h.numero === habitacion.numero ? habitacion : h
      )
      localStorage.setItem('habitaciones-motel-eclipse', JSON.stringify(habitacionesActuales))
    } catch (error) {
      console.error('❌ Error guardando habitación:', error)
    }
  }

  // Función para hacer check-in
  const hacerCheckIn = async (numeroHabitacion) => {
    try {
      const ahora = new Date()
      const horaIngreso = ahora.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
      
      const habitacionActualizada = {
        numero: numeroHabitacion,
        estado: 'ocupada',
        horaIngreso: horaIngreso,
        ventas: []
      }
      
      setHabitaciones(prevHabitaciones =>
        prevHabitaciones.map(habitacion =>
          habitacion.numero === numeroHabitacion
            ? { ...habitacion, estado: 'ocupada', horaIngreso: horaIngreso }
            : habitacion
        )
      )
      
      // Guardar en Firebase
      await guardarCambiosHabitacion(habitacionActualizada)
      
    } catch (error) {
      console.error('Error en check-in:', error)
    }
  }

  const abrirModalSalida = (numeroHabitacion) => {
    const habitacion = habitaciones.find(h => h.numero === numeroHabitacion)
    setHabitacionSalida(habitacion)
    setModalSalidaAbierto(true)
  }

  const cerrarModalSalida = () => {
    setModalSalidaAbierto(false)
    setHabitacionSalida(null)
  }

  const confirmarSalida = async () => {
    if (!habitacionSalida) return

    try {
      // Calcular el costo total
      const costoHabitacion = calcularCostoHabitacion(habitacionSalida)
      const costoConsumo = calcularTotalConsumo(habitacionSalida.ventas)
      const costoTotal = costoHabitacion + costoConsumo

      // Generar recibo
      const ahora = new Date()
      const recibo = {
        habitacion: habitacionSalida.numero,
        tipo: habitacionSalida.tipo,
        horaIngreso: habitacionSalida.horaIngreso,
        horaSalida: ahora.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
        fecha: ahora.toLocaleDateString('es-CO'),
        costoHabitacion: costoHabitacion,
        costoConsumo: costoConsumo,
        costoTotal: costoTotal,
        ventas: habitacionSalida.ventas || []
      }

      console.log('💰 Recibo generado:', recibo)

      // Actualizar estado de la habitación
      const habitacionLimpieza = {
        numero: habitacionSalida.numero,
        estado: 'limpieza',
        horaIngreso: null,
        ventas: []
      }
      
      setHabitaciones(prevHabitaciones =>
        prevHabitaciones.map(habitacion =>
          habitacion.numero === habitacionSalida.numero
            ? { ...habitacion, estado: 'limpieza', horaIngreso: null }
            : habitacion
        )
      )
      
      // Guardar en Firebase
      await guardarCambiosHabitacion(habitacionLimpieza)
      
      cerrarModalSalida()
    } catch (error) {
      console.error('Error en check-out:', error)
    }
  }

  const marcarLimpiezaCompleta = async (numeroHabitacion) => {
    const habitacionActualizada = {
      numero: numeroHabitacion,
      estado: 'disponible',
      horaIngreso: null,
      ventas: []
    }
    
    setHabitaciones(prevHabitaciones =>
      prevHabitaciones.map(habitacion =>
        habitacion.numero === numeroHabitacion
          ? { ...habitacion, estado: 'disponible', horaIngreso: null }
          : habitacion
      )
    )
    
    // Guardar en Firebase
    await guardarCambiosHabitacion(habitacionActualizada)
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

  const manejarCambioProducto = (nombreProducto) => {
    const producto = productosInventario.find(p => p.nombre === nombreProducto)
    if (producto) {
      setNuevaVenta(prev => ({
        ...prev,
        producto: nombreProducto,
        // Solo actualizar el precio si está en 0, permitir edición manual
        precio: prev.precio === 0 ? producto.precio : prev.precio
      }))
    }
  }

  const agregarVenta = async () => {
    if (!nuevaVenta.producto || nuevaVenta.cantidad <= 0) {
      alert('Por favor completa todos los campos')
      return
    }

    // Verificar disponibilidad en stock
    const producto = productosInventario.find(p => p.nombre === nuevaVenta.producto)
    if (!producto) {
      alert('Producto no encontrado en el inventario')
      return
    }

    if (producto.stock < nuevaVenta.cantidad) {
      alert(`Stock insuficiente. Solo quedan ${producto.stock} unidades de ${producto.nombre}`)
      return
    }

    const totalVenta = nuevaVenta.precio * nuevaVenta.cantidad
    const ventaCompleta = {
      id: Date.now(),
      producto: nuevaVenta.producto,
      cantidad: nuevaVenta.cantidad,
      precioUnitario: nuevaVenta.precio,
      total: totalVenta,
      hora: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
    }

    try {
      // Actualizar stock del producto en el inventario
      const nuevoStock = producto.stock - nuevaVenta.cantidad
      await actualizarProducto(producto.id, { ...producto, stock: nuevoStock })
      
      // Actualizar la lista local de productos
      setProductosInventario(productos => 
        productos.map(p => 
          p.id === producto.id 
            ? { ...p, stock: nuevoStock }
            : p
        )
      )

      // Agregar venta a la habitación
      let habitacionActualizada;
      setHabitaciones(prevHabitaciones =>
        prevHabitaciones.map(habitacion => {
          if (habitacion.numero === habitacionSeleccionada) {
            habitacionActualizada = { ...habitacion, ventas: [...(habitacion.ventas || []), ventaCompleta] }
            return habitacionActualizada
          }
          return habitacion
        })
      )
      
      // Guardar en Firebase
      if (habitacionActualizada) {
        await guardarCambiosHabitacion(habitacionActualizada)
      }
      
      console.log(`✅ Venta agregada: ${nuevaVenta.cantidad}x ${nuevaVenta.producto}. Stock restante: ${nuevoStock}`)
      cerrarModalVenta()
      
    } catch (error) {
      console.error('❌ Error procesando venta:', error)
      alert('Error al procesar la venta')
    }
  }

  // Función para calcular el total de consumo de una habitación
  const calcularTotalConsumo = (ventas) => {
    if (!ventas || !Array.isArray(ventas) || ventas.length === 0) return 0
    return ventas.reduce((total, venta) => total + venta.total, 0)
  }

  // Función para calcular el costo total de la habitación incluyendo horas adicionales
  const calcularCostoHabitacion = (habitacion, horaSalida = new Date()) => {
    if (!habitacion.horaIngreso) return habitacion.precio5Horas

    const [horas, minutos] = habitacion.horaIngreso.split(':')
    const ingreso = new Date()
    ingreso.setHours(parseInt(horas), parseInt(minutos), 0, 0)
    
    const tiempoTranscurrido = horaSalida - ingreso
    const horasTranscurridas = tiempoTranscurrido / (1000 * 60 * 60)
    
    if (horasTranscurridas <= 5) {
      return habitacion.precio5Horas
    }
    
    const horasAdicionales = Math.ceil(horasTranscurridas - 5)
    const precioPorHoraAdicional = habitacion.tipo === 'Suite' ? 10000 : 5000
    const costoAdicional = horasAdicionales * precioPorHoraAdicional
    
    return habitacion.precio5Horas + costoAdicional
  }

  const obtenerInfoFacturacion = (habitacion) => {
    if (!habitacion.horaIngreso) return null
    
    const [horas, minutos] = habitacion.horaIngreso.split(':')
    const ingreso = new Date()
    ingreso.setHours(parseInt(horas), parseInt(minutos), 0, 0)
    
    const ahora = new Date()
    const tiempoTranscurrido = ahora - ingreso
    const horasTranscurridas = tiempoTranscurrido / (1000 * 60 * 60)
    
    const costoBase = habitacion.precio5Horas
    const horasAdicionales = Math.max(0, Math.ceil(horasTranscurridas - 5))
    const precioPorHoraAdicional = habitacion.tipo === 'Suite' ? 10000 : 5000
    const costoAdicional = horasAdicionales * precioPorHoraAdicional
    
    return {
      horasTranscurridas: horasTranscurridas.toFixed(1),
      costoBase,
      horasAdicionales,
      costoAdicional,
      costoTotal: costoBase + costoAdicional,
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

  if (cargandoHabitaciones || cargandoProductos) {
    return (
      <div className="gestion-habitaciones">
        <div className="cargando">
          <h2>🔥 Cargando datos...</h2>
          <p>Conectando con Firebase...</p>
          {cargandoHabitaciones && <p>📊 Cargando habitaciones...</p>}
          {cargandoProductos && <p>📦 Cargando inventario...</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="gestion-habitaciones">
      <div className="encabezado-habitaciones">
        <h2>
          Gestión de Habitaciones
          <span className={`estado-firebase ${firebaseConectado ? 'conectado' : 'desconectado'}`}>
            {firebaseConectado ? '🟢 Firebase' : '🔴 Local'}
          </span>
        </h2>
      </div>

      <div className="cuadricula-habitaciones">
        {habitaciones
          .sort((a, b) => a.numero - b.numero) // Ordenar por número de habitación
          .map(habitacion => {
          const estado = obtenerInsigniaEstado(habitacion.estado)
          return (
            <div 
              key={habitacion.numero} 
              className={`tarjeta-habitacion ${estado.clase}`}
            >
              <div className="encabezado-tarjeta">
                <h3>
                  {obtenerIconoTipo(habitacion.tipo)} Habitación {habitacion.numero}
                </h3>
                <span className="insignia-estado">
                  {estado.icono} {estado.texto}
                </span>
              </div>

              <div className="detalles-habitacion">
                <p><strong>Tipo:</strong> {habitacion.tipo}</p>
                <p><strong>Precio 5h:</strong> ${habitacion.precio5Horas?.toLocaleString()}</p>
                
                {habitacion.estado === 'ocupada' && habitacion.horaIngreso && (
                  <>
                    <p><strong>Ingreso:</strong> {habitacion.horaIngreso}</p>
                    <p><strong>Tiempo:</strong> {calcularTiempoTranscurrido(habitacion.horaIngreso)}</p>
                    {habitacion.ventas && habitacion.ventas.length > 0 && (
                      <p><strong>Consumo:</strong> ${calcularTotalConsumo(habitacion.ventas).toLocaleString()}</p>
                    )}
                  </>
                )}
              </div>

              <div className="acciones-habitacion">
                {habitacion.estado === 'disponible' && (
                  <button 
                    className="boton-checkin"
                    onClick={() => hacerCheckIn(habitacion.numero)}
                  >
                    Check-in
                  </button>
                )}

                {habitacion.estado === 'ocupada' && (
                  <>
                    <button 
                      className="boton-agregar-venta"
                      onClick={() => abrirModalVenta(habitacion.numero)}
                    >
                      + Venta
                    </button>
                    <button 
                      className="boton-checkout"
                      onClick={() => abrirModalSalida(habitacion.numero)}
                    >
                      Check-out
                    </button>
                  </>
                )}

                {habitacion.estado === 'limpieza' && (
                  <button 
                    className="boton-limpieza"
                    onClick={() => marcarLimpiezaCompleta(habitacion.numero)}
                  >
                    ✅ Limpio
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {modalVentaAbierto && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Agregar Venta - Habitación {habitacionSeleccionada}</h3>
            
            <div className="form-group">
              <label>Producto:</label>
              <select 
                value={nuevaVenta.producto} 
                onChange={(e) => manejarCambioProducto(e.target.value)}
              >
                <option value="">Seleccionar producto</option>
                {productosInventario
                  .filter(producto => producto.stock > 0) // Solo mostrar productos con stock
                  .map(producto => (
                  <option key={producto.id} value={producto.nombre}>
                    {producto.nombre} - ${producto.precio.toLocaleString()} (Stock: {producto.stock})
                  </option>
                ))}
              </select>
              {productosInventario.filter(p => p.stock === 0).length > 0 && (
                <small style={{color: '#e74c3c', fontSize: '0.8rem'}}>
                  ⚠️ Algunos productos sin stock no se muestran
                </small>
              )}
            </div>

            <div className="form-group">
              <label>Cantidad:</label>
              <input 
                type="number" 
                min="1" 
                value={nuevaVenta.cantidad}
                onChange={(e) => setNuevaVenta(prev => ({
                  ...prev, 
                  cantidad: parseInt(e.target.value) || 1
                }))}
              />
            </div>

            <div className="form-group">
              <label>Precio Unitario:</label>
              <div className="input-group">
                <input 
                  type="number" 
                  value={nuevaVenta.precio}
                  onChange={(e) => setNuevaVenta(prev => ({
                    ...prev, 
                    precio: parseFloat(e.target.value) || 0
                  }))}
                  placeholder="0"
                />
                {nuevaVenta.producto && (
                  <button 
                    type="button"
                    className="btn-restore-price"
                    onClick={() => {
                      const producto = productosInventario.find(p => p.nombre === nuevaVenta.producto)
                      if (producto) {
                        setNuevaVenta(prev => ({...prev, precio: producto.precio}))
                      }
                    }}
                    title="Restaurar precio original"
                  >
                    ↻
                  </button>
                )}
              </div>
            </div>

            <div className="total-venta">
              <strong>Total: ${(nuevaVenta.precio * nuevaVenta.cantidad).toLocaleString()}</strong>
            </div>

            <div className="modal-buttons">
              <button className="modal-button btn-cancelar" onClick={cerrarModalVenta}>
                Cancelar
              </button>
              <button className="modal-button btn-confirmar" onClick={agregarVenta}>
                Agregar Venta
              </button>
            </div>
          </div>
        </div>
      )}

      {modalSalidaAbierto && habitacionSalida && (
        <div className="modal-overlay">
          <div className="modal-content modal-salida">
            <h3>Check-out - Habitación {habitacionSalida.numero}</h3>
            
            <div className="resumen-salida">
              <h4>Resumen de Estadía</h4>
              <div className="detalle-salida">
                <div className="detalle-item">
                  <span>Tipo:</span>
                  <span>{habitacionSalida.tipo}</span>
                </div>
                <div className="detalle-item">
                  <span>Ingreso:</span>
                  <span>{habitacionSalida.horaIngreso}</span>
                </div>
                <div className="detalle-item">
                  <span>Salida:</span>
                  <span>{new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="detalle-item">
                  <span>Tiempo Total:</span>
                  <span>{calcularTiempoTranscurrido(habitacionSalida.horaIngreso)}</span>
                </div>
              </div>
            </div>

            <div className="resumen-salida">
              <h4>Detalle de Costos</h4>
              <div className="detalle-salida">
                <div className="detalle-item">
                  <span>Habitación (5 horas):</span>
                  <span>${habitacionSalida.precio5Horas?.toLocaleString()}</span>
                </div>
              
              {(() => {
                const info = obtenerInfoFacturacion(habitacionSalida)
                if (info && info.horasAdicionales > 0) {
                  return (
                    <div className="detalle-item">
                      <span>Horas adicionales ({info.horasAdicionales}):</span>
                      <span>${info.costoAdicional.toLocaleString()}</span>
                    </div>
                  )
                }
                return null
              })()}
              
              {habitacionSalida.ventas && habitacionSalida.ventas.length > 0 && (
                habitacionSalida.ventas.map(venta => (
                  <div key={venta.id} className="detalle-item">
                    <span>{venta.producto} x{venta.cantidad}:</span>
                    <span>${venta.total.toLocaleString()}</span>
                  </div>
                ))
              )}
              
              <div className="detalle-item">
                <span><strong>TOTAL A PAGAR:</strong></span>
                <span><strong>${(calcularCostoHabitacion(habitacionSalida) + calcularTotalConsumo(habitacionSalida.ventas)).toLocaleString()}</strong></span>
              </div>
              </div>
            </div>

            <div className="modal-buttons">
              <button className="modal-button btn-cancelar" onClick={cerrarModalSalida}>
                Cancelar
              </button>
              <button className="modal-button btn-salida" onClick={confirmarSalida}>
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
