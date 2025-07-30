import { useState, useEffect } from 'react'
import './HeaderPrincipal.css'

function HeaderPrincipal() {
  const [horaActual, setHoraActual] = useState(new Date())

  useEffect(() => {
    const temporizador = setInterval(() => {
      setHoraActual(new Date())
    }, 1000)

    return () => clearInterval(temporizador)
  }, [])

  const fechaFormateada = horaActual.toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const horaFormateada = horaActual.toLocaleTimeString('es-CO')

  return (
    <header className="header-principal">
      <div className="titulo-sistema">
        <h1>MOTEL ECLIPSE</h1>
        <p>Sistema de Gestión - Panel de Control</p>
      </div>
      
      <div className="info-tiempo">
        <div className="fecha-hora">
          <div className="fecha">{fechaFormateada}</div>
          <div className="hora">{horaFormateada}</div>
        </div>
        <div className="indicadores">
          <span className="indicador online">●</span>
          <span className="texto-estado">En línea</span>
        </div>
      </div>
    </header>
  )
}

export default HeaderPrincipal
