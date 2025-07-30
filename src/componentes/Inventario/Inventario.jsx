import { useState, useEffect } from 'react'
import './Inventario.css'
import { obtenerProductos, actualizarProducto, crearProducto, eliminarProducto, limpiarTodosLosProductos } from '../../firebase/database'

function Inventario() {
  const [productos, setProductos] = useState([])
  const [modalAbierto, setModalAbierto] = useState(false)
  const [modoEdicion, setModoEdicion] = useState(false)
  const [productoEditando, setProductoEditando] = useState(null)
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    precio: 0,
    stock: 0,
    stockMinimo: 5,
    categoria: 'Bebidas'
  })
  const [filtroCategoria, setFiltroCategoria] = useState('Todas')
  const [busqueda, setBusqueda] = useState('')

  // Productos iniciales - VACÍO para empezar limpio
  const productosIniciales = []

  const categorias = ['Todas', 'Bebidas', 'Comida', 'Cuidado Personal', 'Otros']

  // Cargar productos al iniciar
  useEffect(() => {
    cargarProductos()
  }, [])

  const cargarProductos = async () => {
    try {
      console.log('📦 Cargando productos desde Firebase...')
      const productosFirebase = await obtenerProductos()
      
      if (productosFirebase && productosFirebase.length > 0) {
        // Filtrar solo productos disponibles
        const productosDisponibles = productosFirebase.filter(p => p.disponible !== false)
        setProductos(productosDisponibles)
        console.log('✅ Productos cargados desde Firebase:', productosDisponibles.length)
      } else {
        // Empezar completamente vacío - sin productos predeterminados
        console.log('� Inventario vacío - listo para crear productos')
        setProductos([])
      }
    } catch (error) {
      console.error('❌ Error cargando productos:', error)
      // Empezar vacío incluso en caso de error
      setProductos([])
    }
  }

  const abrirModal = (producto = null) => {
    if (producto) {
      setModoEdicion(true)
      setProductoEditando(producto)
      setNuevoProducto(producto)
    } else {
      setModoEdicion(false)
      setProductoEditando(null)
      setNuevoProducto({
        nombre: '',
        precio: 0,
        stock: 0,
        stockMinimo: 5,
        categoria: 'Bebidas'
      })
    }
    setModalAbierto(true)
  }

  const cerrarModal = () => {
    setModalAbierto(false)
    setModoEdicion(false)
    setProductoEditando(null)
    setNuevoProducto({
      nombre: '',
      precio: 0,
      stock: 0,
      stockMinimo: 5,
      categoria: 'Bebidas'
    })
  }

  const guardarProducto = async () => {
    if (!nuevoProducto.nombre.trim()) {
      alert('El nombre del producto es obligatorio')
      return
    }

    if (nuevoProducto.precio <= 0) {
      alert('El precio debe ser mayor a 0')
      return
    }

    try {
      if (modoEdicion) {
        // Actualizar producto existente
        await actualizarProducto(productoEditando.id, nuevoProducto)
        setProductos(productos.map(p => p.id === productoEditando.id ? { ...nuevoProducto, id: productoEditando.id } : p))
        console.log('✅ Producto actualizado')
      } else {
        // Crear nuevo producto
        const id = Date.now()
        const productoConId = { ...nuevoProducto, id }
        await crearProducto(productoConId)
        setProductos([...productos, productoConId])
        console.log('✅ Producto creado')
      }

      // Actualizar localStorage como respaldo
      const productosActualizados = modoEdicion 
        ? productos.map(p => p.id === productoEditando.id ? { ...nuevoProducto, id: productoEditando.id } : p)
        : [...productos, { ...nuevoProducto, id: Date.now() }]
      
      localStorage.setItem('productos-motel-eclipse', JSON.stringify(productosActualizados))
      
      cerrarModal()
    } catch (error) {
      console.error('❌ Error guardando producto:', error)
      alert('Error al guardar el producto')
    }
  }

  const eliminarProductoConfirmar = async (producto) => {
    if (window.confirm(`¿Estás seguro de eliminar "${producto.nombre}"?`)) {
      try {
        await eliminarProducto(producto.id)
        const productosActualizados = productos.filter(p => p.id !== producto.id)
        setProductos(productosActualizados)
        localStorage.setItem('productos-motel-eclipse', JSON.stringify(productosActualizados))
        console.log('✅ Producto eliminado')
      } catch (error) {
        console.error('❌ Error eliminando producto:', error)
        alert('Error al eliminar el producto')
      }
    }
  }

  const ajustarStock = async (producto, cantidad) => {
    const nuevoStock = Math.max(0, producto.stock + cantidad)
    const productoActualizado = { ...producto, stock: nuevoStock }
    
    try {
      await actualizarProducto(producto.id, productoActualizado)
      setProductos(productos.map(p => p.id === producto.id ? productoActualizado : p))
      
      // Actualizar localStorage
      const productosActualizados = productos.map(p => p.id === producto.id ? productoActualizado : p)
      localStorage.setItem('productos-motel-eclipse', JSON.stringify(productosActualizados))
      
      console.log(`✅ Stock de ${producto.nombre} ajustado a ${nuevoStock}`)
    } catch (error) {
      console.error('❌ Error ajustando stock:', error)
    }
  }

  const limpiarInventarioCompleto = async () => {
    if (window.confirm('⚠️ ¿Estás seguro de eliminar TODOS los productos del inventario? Esta acción no se puede deshacer.')) {
      try {
        await limpiarTodosLosProductos()
        setProductos([])
        localStorage.removeItem('productos-motel-eclipse')
        console.log('✅ Inventario limpiado completamente')
        alert('✅ Inventario limpiado. Ahora puedes crear tus productos reales.')
      } catch (error) {
        console.error('❌ Error limpiando inventario:', error)
        alert('❌ Error al limpiar el inventario')
      }
    }
  }

  // Filtrar productos
  const productosFiltrados = productos.filter(producto => {
    const cumpleFiltroCategoria = filtroCategoria === 'Todas' || producto.categoria === filtroCategoria
    const cumpleBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
    return cumpleFiltroCategoria && cumpleBusqueda
  })

  // Productos con stock bajo
  const productosStockBajo = productos.filter(p => p.stock <= p.stockMinimo)

  const obtenerEstadoStock = (producto) => {
    if (producto.stock === 0) return { clase: 'sin-stock', texto: 'Sin Stock' }
    if (producto.stock <= producto.stockMinimo) return { clase: 'stock-bajo', texto: 'Stock Bajo' }
    return { clase: 'stock-ok', texto: 'Stock OK' }
  }

  const obtenerIconoCategoria = (categoria) => {
    const iconos = {
      'Bebidas': '🥤',
      'Comida': '🍿',
      'Cuidado Personal': '🧴',
      'Otros': '📦'
    }
    return iconos[categoria] || '📦'
  }

  return (
    <div className="inventario">
      <div className="encabezado-inventario">
        <div className="titulo-inventario">
          <h2>Gestión de Inventario</h2>
          {productosStockBajo.length > 0 && (
            <div className="alerta-stock">
              ⚠️ {productosStockBajo.length} producto(s) con stock bajo
            </div>
          )}
        </div>
        <div className="botones-encabezado">
          <button 
            className="boton-limpiar-inventario" 
            onClick={limpiarInventarioCompleto}
            title="Eliminar todos los productos para empezar desde cero"
          >
            <span>🗑️</span>
            Limpiar Todo
          </button>
          <button className="boton-nuevo-producto" onClick={() => abrirModal()}>
            <span>📦</span>
            Nuevo Producto
          </button>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="controles-inventario">
        <div className="busqueda-productos">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="input-busqueda"
          />
        </div>
        
        <div className="filtro-categoria">
          <select 
            value={filtroCategoria} 
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="select-categoria"
          >
            {categorias.map(categoria => (
              <option key={categoria} value={categoria}>{categoria}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de productos */}
      <div className="grid-productos">
        {productosFiltrados.map(producto => {
          const estadoStock = obtenerEstadoStock(producto)
          return (
            <div key={producto.id} className={`tarjeta-producto ${estadoStock.clase}`}>
              <div className="encabezado-producto">
                <div className="info-basica">
                  <h3>
                    {obtenerIconoCategoria(producto.categoria)} {producto.nombre}
                  </h3>
                  <span className="categoria-badge">{producto.categoria}</span>
                </div>
                <div className="acciones-producto">
                  <button 
                    className="btn-editar"
                    onClick={() => abrirModal(producto)}
                    title="Editar producto"
                  >
                    ✏️
                  </button>
                  <button 
                    className="btn-eliminar"
                    onClick={() => eliminarProductoConfirmar(producto)}
                    title="Eliminar producto"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <div className="detalles-producto">
                <div className="precio-producto">
                  <span className="label">Precio:</span>
                  <span className="valor">${producto.precio.toLocaleString()}</span>
                </div>

                <div className="stock-producto">
                  <div className="stock-info">
                    <span className="label">Stock:</span>
                    <span className={`valor-stock ${estadoStock.clase}`}>
                      {producto.stock} unidades
                    </span>
                  </div>
                  <div className="estado-stock">
                    <span className={`badge-estado ${estadoStock.clase}`}>
                      {estadoStock.texto}
                    </span>
                  </div>
                </div>

                <div className="stock-minimo">
                  <span className="label">Stock mínimo:</span>
                  <span className="valor">{producto.stockMinimo} unidades</span>
                </div>
              </div>

              <div className="controles-stock">
                <button 
                  className="btn-stock btn-restar"
                  onClick={() => ajustarStock(producto, -1)}
                  disabled={producto.stock === 0}
                >
                  -1
                </button>
                <button 
                  className="btn-stock btn-restar-5"
                  onClick={() => ajustarStock(producto, -5)}
                  disabled={producto.stock < 5}
                >
                  -5
                </button>
                <button 
                  className="btn-stock btn-sumar"
                  onClick={() => ajustarStock(producto, 1)}
                >
                  +1
                </button>
                <button 
                  className="btn-stock btn-sumar-10"
                  onClick={() => ajustarStock(producto, 10)}
                >
                  +10
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {productosFiltrados.length === 0 && (
        <div className="sin-productos">
          <h3>No se encontraron productos</h3>
          <p>Intenta cambiar los filtros de búsqueda o crear un nuevo producto.</p>
        </div>
      )}

      {/* Modal para crear/editar producto */}
      {modalAbierto && (
        <div className="modal-overlay">
          <div className="modal-content modal-producto">
            <h3>{modoEdicion ? 'Editar Producto' : 'Nuevo Producto'}</h3>
            
            <div className="form-grupo">
              <label>Nombre del Producto:</label>
              <input
                type="text"
                value={nuevoProducto.nombre}
                onChange={(e) => setNuevoProducto({...nuevoProducto, nombre: e.target.value})}
                placeholder="Ej: Cerveza Corona"
              />
            </div>

            <div className="form-grupo">
              <label>Categoría:</label>
              <select
                value={nuevoProducto.categoria}
                onChange={(e) => setNuevoProducto({...nuevoProducto, categoria: e.target.value})}
              >
                {categorias.filter(c => c !== 'Todas').map(categoria => (
                  <option key={categoria} value={categoria}>{categoria}</option>
                ))}
              </select>
            </div>

            <div className="form-fila">
              <div className="form-grupo">
                <label>Precio:</label>
                <input
                  type="number"
                  min="0"
                  value={nuevoProducto.precio}
                  onChange={(e) => setNuevoProducto({...nuevoProducto, precio: parseFloat(e.target.value) || 0})}
                  placeholder="3000"
                />
              </div>

              <div className="form-grupo">
                <label>Stock Inicial:</label>
                <input
                  type="number"
                  min="0"
                  value={nuevoProducto.stock}
                  onChange={(e) => setNuevoProducto({...nuevoProducto, stock: parseInt(e.target.value) || 0})}
                  placeholder="50"
                />
              </div>
            </div>

            <div className="form-grupo">
              <label>Stock Mínimo (para alertas):</label>
              <input
                type="number"
                min="1"
                value={nuevoProducto.stockMinimo}
                onChange={(e) => setNuevoProducto({...nuevoProducto, stockMinimo: parseInt(e.target.value) || 5})}
                placeholder="5"
              />
            </div>

            <div className="modal-buttons">
              <button className="btn-cancelar" onClick={cerrarModal}>
                Cancelar
              </button>
              <button className="btn-guardar" onClick={guardarProducto}>
                {modoEdicion ? 'Actualizar' : 'Crear'} Producto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Inventario
