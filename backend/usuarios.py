"""
usuarios.py
Registro de usuarios, actualización de saldo y aplicación de descuentos.
"""

import uuid, json, re
import threading

lock = threading.Lock()
USUARIOS_FILE = 'usuarios.json'

def _cargar_usuarios():
    with lock, open(USUARIOS_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def _guardar_usuarios(users):
    with lock, open(USUARIOS_FILE, 'w', encoding='utf-8') as f:
        json.dump(users, f, indent=2)

def registrar_usuario(nombre, email, saldo):
    """Registra un nuevo usuario, valida email único y formato."""
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        raise ValueError("Formato de email incorrecto")
    users = _cargar_usuarios()
    if any(u["email"] == email for u in users):
        raise ValueError("Email ya registrado")
    nuevo = {
        "id": str(uuid.uuid4()),
        "nombre": nombre,
        "email": email,
        "saldo": float(saldo)
    }
    users.append(nuevo)
    _guardar_usuarios(users)
    return nuevo

def actualizar_saldo(usuario_id, nuevo_saldo):
    """Actualiza el saldo de un usuario identificado por usuario_id."""
    users = _cargar_usuarios()
    updated = []
    for u in users:
        if u["id"] == usuario_id:
            u["saldo"] = float(nuevo_saldo)
        updated.append(u)
    _guardar_usuarios(updated)
    return next(u for u in updated if u["id"] == usuario_id)

def aplicar_descuento_general(porcentaje):
    """Aplica un descuento porcentual al saldo de todos los usuarios."""
    users = _cargar_usuarios()
    factor = (100 - porcentaje) / 100
    users = list(map(lambda u: {**u, "saldo": round(u["saldo"] * factor, 2)}, users))
    _guardar_usuarios(users)
    return users
