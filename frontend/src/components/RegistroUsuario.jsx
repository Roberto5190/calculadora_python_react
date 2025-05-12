import { useState } from 'react'
import axios from 'axios'

export default function RegistroUsuario() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [saldo, setSaldo] = useState('')
  const [errors, setErrors] = useState({})
  const [mensaje, setMensaje] = useState(null)
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const errs = {}
    if (!nombre) errs.nombre = 'Requerido'
    if (!email.match(/^[^@]+@[^@]+\.[^@]+$/))
      errs.email = 'Email inválido'
    if (saldo === '' || parseFloat(saldo) < 0)
      errs.saldo = 'Saldo debe ser ≥ 0'
    return errs
  }

  const canSubmit = () => {
    const errs = validate()
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length) return

    setLoading(true)
    setMensaje(null)
    try {
      const res = await axios.post('http://localhost:5000/usuarios/registro', {
        nombre,
        email,
        saldo: parseFloat(saldo)
      })
      setMensaje(res.data.mensaje)
      setNombre('')
      setEmail('')
      setSaldo('')
    } catch (err) {
      setMensaje(
        err.response?.data?.error || 'Error de conexión con el servidor'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded shadow space-y-4"
    >
      <h2 className="text-xl font-semibold">Registro de Usuario</h2>

      <div>
        <label>Nombre</label>
        <input
          type="text"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          className="w-full border rounded p-2"
        />
        {errors.nombre && (
          <p className="text-red-600 text-sm">{errors.nombre}</p>
        )}
      </div>

      <div>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border rounded p-2"
        />
        {errors.email && (
          <p className="text-red-600 text-sm">{errors.email}</p>
        )}
      </div>

      <div>
        <label>Saldo</label>
        <input
          type="number"
          value={saldo}
          onChange={e => setSaldo(e.target.value)}
          className="w-full border rounded p-2"
        />
        {errors.saldo && (
          <p className="text-red-600 text-sm">{errors.saldo}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={!canSubmit() || loading}
        className="w-full bg-green-500 text-white py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Registrando…' : 'Registrar'}
      </button>

      {mensaje && (
        <div
          className={`mt-2 p-2 rounded ${
            mensaje.includes('Error')
              ? 'bg-red-100 text-red-800'
              : 'bg-green-100 text-green-800'
          }`}
        >
          {mensaje}
        </div>
      )}
    </form>
  )
}
