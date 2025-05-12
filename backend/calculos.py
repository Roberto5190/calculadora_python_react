"""
calculos.py
Funciones puras de la calculadora y registro de historial.
"""

import uuid
import json
import threading
from datetime import datetime

lock = threading.Lock()
HISTORIAL_FILE = 'historial.json'

class ErrorCalculo(Exception):
    """Error en cálculos (p. ej. división por cero)."""

def _cargar_historial():
    with lock, open(HISTORIAL_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def _guardar_historial(hist):
    with lock, open(HISTORIAL_FILE, 'w', encoding='utf-8') as f:
        json.dump(hist, f, indent=2)

def _registra(operacion, a, b, resultado):
    entry = {
        "id": str(uuid.uuid4()),
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "operacion": operacion,
        "parametros": {"a": a, "b": b},
        "resultado": resultado
    }
    hist = _cargar_historial()
    hist.append(entry)
    _guardar_historial(hist)
    return entry

def sumar(a, b):
    """Retorna la suma de a y b."""
    res = a + b
    _registra('sumar', a, b, res)
    return res

def restar(a, b):
    """Retorna la resta de a y b."""
    res = a - b
    _registra('restar', a, b, res)
    return res

def multiplicar(a, b):
    """Retorna la multiplicación de a y b."""
    res = a * b
    _registra('multiplicar', a, b, res)
    return res

def dividir(a, b):
    """Retorna la división de a entre b. Lanza ErrorCalculo si b == 0."""
    if b == 0:
        _registra('dividir', a, b, None)
        raise ErrorCalculo("División por cero no permitida")
    res = a / b
    _registra('dividir', a, b, res)
    return res
