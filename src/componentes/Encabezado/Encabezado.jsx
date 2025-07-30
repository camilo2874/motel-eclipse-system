import './Encabezado.css'

function Encabezado() {
  const fechaActual = new Date().toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <header className="encabezado">
      <div className="encabezado-contenido">
        <div className="encabezado-izquierda">
          <h1>🏨 MOTEL ECLIPSE</h1>
          <p className="subtitulo">Sistema de Gestión</p>
        </div>
        <div className="encabezado-derecha">
          <div className="info-fecha">
            <p className="fecha-actual">{fechaActual}</p>
            <p className="hora-actual" id="horaActual"></p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Encabezado
