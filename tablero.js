function crearTabla() {
    const tablero = [];

    for (let fila = 0; fila < 10; fila++) {
        const nuevaFila = [];

        for (let columna = 0; columna < 10; columna++) {
            nuevaFila.push(".");
        }

        tablero.push(nuevaFila);
    }
    
    return tablero;
}

function mostrarTablero(tablero) {
    for (const fila of tablero) {
        console.log(fila.join(" "));
    }
}

//JUGADORES
const JUGADOR_1 = "1";
const JUGADOR_2 = "2";

const tablero = crearTabla();

tablero[0][0] = JUGADOR_1;   //Jugador 1
tablero[9][9] = JUGADOR_2;   //Jugador 2


//GENERADOR DE CASAS
function crearGenerador(semilla) {
    let estado = semilla;

    return function() {

        estado = (estado * 1664525 + 1013904223) % 4294967296;
        return estado;
    }
}

function numeroACoordenada(numero) {
    return (numero % 10) + 1;
}

function posicionValida(tablero, fila, columna) {
    return tablero[fila - 1][columna - 1] === ".";
}

function distanciaToroidal(a, b) {
    const diferencia = Math.abs(a - b);
    return Math.min(diferencia, 10 - diferencia);
}

function distancia(fila1, columna1, fila2, columna2) {
    const diferenciaFilas = distanciaToroidal(fila1, fila2);
    const diferenciaColumnas = distanciaToroidal(columna1, columna2);

    return diferenciaFilas + diferenciaColumnas;
}

function moverCoordenada(coordenada, cambio) {
    let nuevaCoordenada = coordenada + cambio;

    if (nuevaCoordenada > 10) {
        nuevaCoordenada = nuevaCoordenada - 10;
    }

    if (nuevaCoordenada < 1) {
        nuevaCoordenada = nuevaCoordenada + 10;
    }

    return nuevaCoordenada;
}

function calcularDestino(fila, columna, direccion, pasos) {
    let nuevaFila = fila;
    let nuevaColumna = columna;

    if (direccion === "arriba") {
        nuevaFila = moverCoordenada(fila, -pasos);
    }

    if (direccion === "abajo") {
        nuevaFila = moverCoordenada(fila, pasos);
    }

    if (direccion === "izquierda") {
        nuevaColumna = moverCoordenada(columna, -pasos);
    }

    if (direccion === "derecha") {
        nuevaColumna = moverCoordenada(columna, pasos);
    }

    return [nuevaFila, nuevaColumna];
}

function destinoEstaLibre(tablero, fila, columna) {
    const casilla = tablero[fila - 1][columna - 1];

    return casilla === "." || casilla === "H";
}

function movimientosValidos(tablero, fila, columna, pasos) {
    const movimientos = [];

    const direcciones = ["arriba", "abajo", "izquierda", "derecha"];

    for (const direccion of direcciones) {
        const destino = calcularDestino(
            fila,
            columna,
            direccion,
            pasos
        );

        const filaDestino = destino[0];
        const columnaDestino = destino[1];

        if (destinoEstaLibre(tablero, filaDestino, columnaDestino)) {
            movimientos.push({
                direccion: direccion,
                fila: filaDestino,
                columna: columnaDestino
            });
        }
    }

    return movimientos;
}

function casasEstanSeparadas(casas, fila, columna) {
    for (const casa of casas) {
        const distanciaCasa = distancia(
            fila,
            columna,
            casa[0],
            casa[1]
        );

        if (distanciaCasa < 3) {
            return false;
        }
    }

    return true;
}

function generarCasa(tablero, generador, casas) {
    const numeroFila = generador();
    const numeroColumna = generador();

    const fila = numeroACoordenada(numeroFila);
    const columna = numeroACoordenada(numeroColumna);

    if (
    posicionValida(tablero, fila, columna) &&
    casasEstanSeparadas(casas, fila, columna)
) {
        tablero[fila - 1][columna - 1] = "H";
        return [fila, columna];
    }
}

function generarCasas(tablero, generador) {
    const casas = [];

    while (casas.length < 5) {
        const casa = generarCasa(tablero, generador, casas);
       
        if (casa) {
            casas.push(casa);
        }
  }

  return casas;
 }

const generador = crearGenerador(123);

const casas = generarCasas(tablero, generador);

//PRUEBA 1
console.log("Casas:", casas);
mostrarTablero(tablero);

//PRUEBA 2
console.log(
    "Movimientos válidos:",
    movimientosValidos(tablero, 5, 5, 3)
);

//PRUEBA 3
console.log(
    "Movimientos hacia casa:",
    movimientosValidos(tablero, 3, 5, 3)
);