import { useState } from 'react'
import './App.css'
import MenuLateral from './componentes/MenuLateral'
import HeaderPrincipal from './componentes/HeaderPrincipal'
import Tablero from './componentes/Tablero'
import GestionHabitaciones from './componentes/GestionHabitaciones'
import GestionHuespedes from './componentes/GestionHuespedes'
import Reportes from './componentes/Reportes'

function App() {
  const [seccionActiva, setSeccionActiva] = useState('tablero')

  const renderizarSeccionActiva = () => {
    switch (seccionActiva) {
      case 'tablero':
        return <Tablero />
      case 'habitaciones':
        return <GestionHabitaciones />
      case 'huespedes':
        return <GestionHuespedes />
      case 'reportes':
        return <Reportes />
      default:
        return <Tablero />
    }
  }

  return (
    <div className="app">
      <MenuLateral seccionActiva={seccionActiva} cambiarSeccion={setSeccionActiva} />
      <HeaderPrincipal />
      <main className="main-content">
        {renderizarSeccionActiva()}
      </main>
    </div>
  )
}

export default App
