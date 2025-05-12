from flask import Flask, jsonify, request
from calculos import sumar, restar, multiplicar, dividir, ErrorCalculo, _cargar_historial
from usuarios import registrar_usuario

app = Flask(__name__)

# —————— Health check ——————
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "message": "Servidor activo"}), 200

# —————— Manejo de errores ——————
@app.errorhandler(ErrorCalculo)
def handle_error_calculo(e):
    return jsonify({"error": str(e)}), 400

@app.errorhandler(422)
def handle_unprocessable(e):
    return jsonify({"error": "Datos inválidos"}), 422

# —————— Endpoint de cálculo ——————
@app.route('/calcular', methods=['POST'])
def api_calcular():
    data = request.get_json() or {}
    op = data.get('operacion')
    a = data.get('a')
    b = data.get('b')

    # Validar que a y b sean números
    if not isinstance(a, (int, float)) or not isinstance(b, (int, float)):
        return jsonify({"error": "Parámetros deben ser números"}), 422

    # Selección de función
    operaciones = {
        'sumar': sumar,
        'restar': restar,
        'multiplicar': multiplicar,
        'dividir': dividir
    }
    func = operaciones.get(op)
    if func is None:
        return jsonify({"error": "Operación no soportada"}), 422

    # Ejecutar y manejar posible ErrorCalculo
    try:
        resultado = func(a, b)
    except ErrorCalculo:
        raise  # será capturado por el errorhandler
    return jsonify({"resultado": resultado})

# —————— Endpoint de historial ——————
@app.route('/historial', methods=['GET'])
def api_historial():
    hist = _cargar_historial()
    oper = request.args.get('operacion')
    if oper:
        hist = [e for e in hist if e['operacion'] == oper]
    # Ordenar descendente y devolver máximo 10
    salida = sorted(hist, key=lambda x: x['timestamp'], reverse=True)[:10]
    return jsonify(salida)

# —————— Endpoint de registro de usuarios ——————
@app.route('/usuarios/registro', methods=['POST'])
def api_registrar_usuario():
    data = request.get_json() or {}
    try:
        nuevo = registrar_usuario(
            data.get('nombre'),
            data.get('email'),
            data.get('saldo')
        )
    except ValueError as e:
        return jsonify({"error": str(e)}), 422
    return jsonify({"id": nuevo['id'], "mensaje": "Usuario registrado"})

if __name__ == '__main__':
    app.run(debug=True)
