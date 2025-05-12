import { useState } from 'react'
import axios from 'axios'

export default function Calculadora() {
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const [operacion, setOperacion] = useState('sumar')
  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const canCalculate = a !== '' && b !== ''

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResultado(null)
    setError(null)
    try {
      const res = await axios.post('http://localhost:5000/calcular', {
        operacion,
        a: parseFloat(a),
        b: parseFloat(b)
      })
      setResultado(res.data.resultado)
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error)
      } else {
        setError('Error de conexión con el servidor')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded shadow space-y-4"
    >
      <h2 className="text-xl font-semibold">Calculadora</h2>
      <div className="flex flex-col">
        <label>Número 1</label>
        <input
          type="number"
          value={a}
          onChange={e => setA(e.target.value)}
          className="border rounded p-2"
        />
      </div>
      <div className="flex flex-col">
        <label>Número 2</label>
        <input
          type="number"
          value={b}
          onChange={e => setB(e.target.value)}
          className="border rounded p-2"
        />
      </div>
      <div className="flex flex-col">
        <label>Operación</label>
        <select
          value={operacion}
          onChange={e => setOperacion(e.target.value)}
          className="border rounded p-2"
        >
          <option value="sumar">Sumar</option>
          <option value="restar">Restar</option>
          <option value="multiplicar">Multiplicar</option>
          <option value="dividir">Dividir</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={!canCalculate || loading}
        className="w-full bg-blue-500 text-white py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Calculando…' : 'Calcular'}
      </button>
      {resultado !== null && (
        <div className="mt-2 bg-green-100 text-green-800 p-2 rounded">
          Resultado: {resultado}
        </div>
      )}
      {error && (
        <div className="mt-2 bg-red-100 text-red-800 p-2 rounded">
          {error}
        </div>
      )}
    </form>
  )
}
