import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Historial() {
  const [historial, setHistorial] = useState([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchHistorial = async () => {
    setLoading(true)
    setError(null)
    try {
      const url = filter
        ? `http://localhost:5000/historial?operacion=${filter}`
        : 'http://localhost:5000/historial'
      const res = await axios.get(url)
      setHistorial(res.data)
    } catch {
      setError('No se pudo cargar el historial')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistorial()
  }, [])

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Historial</h2>
      <div className="flex items-center gap-2 mb-4">
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="border rounded p-2"
        >
          <option value="">Todas</option>
          <option value="sumar">Sumar</option>
          <option value="restar">Restar</option>
          <option value="multiplicar">Multiplicar</option>
          <option value="dividir">Dividir</option>
        </select>
        <button
          onClick={fetchHistorial}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Recargar
        </button>
      </div>

      {loading && <p>Cargando…</p>}
      {error && (
        <div className="bg-red-100 text-red-800 p-2 rounded">{error}</div>
      )}
      {!loading && !error && (
        <div className="overflow-auto">
          <table className="w-full table-auto text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Fecha</th>
                <th className="p-2">Operación</th>
                <th className="p-2">Parámetros</th>
                <th className="p-2">Resultado</th>
              </tr>
            </thead>
            <tbody>
              {historial.map(e => (
                <tr key={e.id} className="border-t">
                  <td className="p-2">
                    {new Date(e.timestamp).toLocaleString()}
                  </td>
                  <td className="p-2">{e.operacion}</td>
                  <td className="p-2">
                    a={e.parametros.a}, b={e.parametros.b}
                  </td>
                  <td className="p-2">{e.resultado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
