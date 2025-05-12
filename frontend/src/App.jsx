import React, { useState} from 'react'
import Calculadora from './components/Calculadora'
import Historial from './components/Historial'
import RegistroUsuario from './components/RegistroUsuario'


export default function App() {
  const [historial, setHistorial] = useState([])

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">Calculadora Avanzada</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Calculadora historial={historial} setHistorial={setHistorial}/>
        <Historial historial={historial} setHistorial={setHistorial}/>
        <RegistroUsuario />
      </div>
    </div>
  )
}
