# Cardlebones (Huesos de Carta)

[cite_start]Cardlebones es un juego de estrategia de dos jugadores, donde el objetivo es llenar tu tablero de 3x3 con cartas de tu mano y acumular la mayor cantidad de puntos posible[cite: 9]. [cite_start]La clave reside en la gestión de las cartas, la formación de combinaciones y la eliminación de las cartas del oponente[cite: 10].

---

## 1. Componentes del Juego

* [cite_start]Mazo Estándar de Cartas de Póker: 1 mazo de 52 cartas (sin Jokers)[cite: 5].
* [cite_start]Tableros de Jugador: 2 tableros individuales con una cuadrícula de 3x3 espacios cada uno[cite: 6].
* [cite_start]Fichas de Puntuación: O un método para llevar la cuenta de los puntos (papel y lápiz, marcador digital, etc.)[cite: 7].

---

## 2. Reglas del Juego

### 2.1. Preparación

1.  [cite_start]Cada jugador recibe un tablero de 3x3 vacío[cite: 13].
2.  [cite_start]El mazo de 52 cartas se baraja y se coloca boca abajo en el centro como la pila de robo[cite: 14].
3.  [cite_start]Se decide qué jugador comienza (por ejemplo, tirando una moneda o la carta más alta)[cite: 15].

### 2.2. Turnos de Juego

[cite_start]Los jugadores se alternan turnos[cite: 17]. En su turno, un jugador realiza los siguientes pasos:

1.  [cite_start]**Robar Carta:** Roba la carta superior del mazo[cite: 18].
2.  [cite_start]**Colocar Carta:** Debe colocar la carta robada en cualquier espacio vacío de su propio tablero de 3x3[cite: 19]. [cite_start]No se pueden reemplazar cartas ya colocadas[cite: 20].
3.  [cite_start]**Ataque (Eliminación por Rango):** Cuando una carta es colocada, se activa el efecto de "ataque"[cite: 21].
    * [cite_start]Si la carta colocada coincide en **rango** con alguna(s) carta(s) en el tablero **del oponente**, el oponente debe **descartar inmediatamente todas las cartas de ese rango** de su tablero[cite: 22].
    * [cite_start]El palo de la carta es irrelevante para el ataque, solo el rango[cite: 23].

> [cite_start]**Ejemplo de Ataque:** Si el Jugador A coloca un 8 de Corazones, y el Jugador B tiene un 8 de Picas y un 8 de Tréboles en su tablero, el Jugador B debe descartar ambas cartas 8 de su tablero[cite: 24].

### 2.3. Fin del Juego

[cite_start]El juego termina inmediatamente cuando el tablero de **cualquiera de los dos jugadores está completamente lleno** (las 9 casillas están ocupadas)[cite: 26].

### 2.4. Valor de las Cartas (para Puntuación)

| Carta | Valor en Puntos | Fuente |
| :---: | :---: | :---: |
| 2-10 | [cite_start]Su valor nominal (2 = 2 puntos, 10 = 10 puntos) | [cite: 28] |
| J (Jack) | [cite_start]11 puntos | [cite: 29] |
| Q (Queen) | [cite_start]12 puntos | [cite: 30] |
| K (King) | [cite_start]13 puntos | [cite: 31] |
| A (As) | [cite_start]14 puntos (La carta más alta para puntuación) | [cite: 32, 33] |

### 2.5. Puntuación Final

[cite_start]Una vez que el juego termina, ambos jugadores calculan su puntuación [cite: 35][cite_start], basándose en las columnas[cite: 36, 53].

#### A. Puntuación Base por Columna

[cite_start]Se suman los valores de todas las cartas en cada columna individualmente[cite: 37].

#### B. Multiplicador por Rango (dentro de la misma columna)

[cite_start]Si hay cartas del **mismo rango** en la **misma columna**, se aplica un multiplicador a la suma de **esas cartas repetidas** en esa columna[cite: 38]:

* [cite_start]**2 Cartas del Mismo Rango:** La suma de esas dos cartas se multiplica por 2[cite: 40].
* [cite_start]**3 Cartas del Mismo Rango:** La suma de esas tres cartas se multiplica por 3[cite: 41].

#### C. Bonus por Palo y Secuencia (dentro de la misma columna, si hay 3 cartas)

[cite_start]Si una columna contiene **tres cartas**, se aplican bonificaciones adicionales (solo aplica la de mayor valor)[cite: 43, 48]:

| Condición (3 Cartas en Columna) | Bonus | Fuente |
| :--- | :---: | :---: |
| **Escalera Real:** Secuencia numérica Y del mismo palo (e.g., K, Q, J de Corazones) | [cite_start]**+25 puntos** | [cite: 47] |
| **Escalera de Color Imperfecta:** Secuencia numérica Y del mismo color (pero no necesariamente el mismo palo) | [cite_start]**+15 puntos** | [cite: 46] |
| **Mismo Palo:** Las tres cartas son del mismo palo (todas Picas, todas Corazones, etc.) | [cite_start]**+10 puntos** | [cite: 45] |
| **Mismo Color:** Las tres cartas son todas negras (Picas/Tréboles) o todas rojas (Corazones/Diamantes) | [cite_start]**+5 puntos** | [cite: 44] |

[cite_start]El jugador con la puntuación total más alta gana la partida[cite: 49].

---

## [cite_start]3. Programación y Estructura de Datos (Identificación OO) [cite: 193]

[cite_start]Para implementar Cardlebones en un entorno de programación orientado a objetos, se identifican las siguientes estructuras[cite: 194]:

### [cite_start]Clases [cite: 195]

* [cite_start]`Carta` [cite: 196]
* [cite_start]`Mazo` [cite: 197]
* [cite_start]`Tablero` [cite: 198]
* [cite_start]`Jugador` [cite: 199]
* [cite_start]`JuegoCardlebones` (Clase principal que coordina todo) [cite: 200]

### [cite_start]Atributos Clave [cite: 201]

| Clase | Atributos | Fuente |
| :--- | :--- | :--- |
| `Carta` | [cite_start]`rango` (int/enum), `palo` (enum), `color` (enum) | [cite: 202, 203, 204, 205] |
| `Mazo` | [cite_start]`cartas` (List<Carta>) | [cite: 206, 207] |
| `Tablero` | [cite_start]`cuadricula` (Carta[][]), `casillas_ocupadas` (int) | [cite: 208, 209, 210] |
| `Jugador` | [cite_start]`nombre` (String), `tablero` (Tablero), `puntuacion` (int) | [cite: 211, 212, 213, 214] |
| `JuegoCardlebones` | [cite_start]`jugador1` (Jugador), `jugador2` (Jugador), `mazo` (Mazo), `turno_actual` (int), `juego_terminado` (boolean) | [cite: 215, 216, 217, 218, 219, 220] |

### [cite_start]Métodos Clave [cite: 221]

| Clase | Métodos | Fuente |
| :--- | :--- | :--- |
| `Carta` | [cite_start]`getValor()`, `getRango()`, `getPalo()`, `getColor()`, `toString()` | [cite: 222, 223, 224, 225, 226, 227] |
| `Mazo` | [cite_start]`barajar()`, `robarCarta()`, `estaVacio()` | [cite: 228, 229, 230, 231] |
| `Tablero` | [cite_start]`colocarCarta(carta, fila, columna)`, `obtenerCarta(fila, columna)`, `eliminarCartasPorRango(rango)`, `estaLleno()`, `calcularPuntuacion()`, `calcularPuntuacionColumna(columna_index)` | [cite: 232, 233, 234, 235, 236, 237, 238] |
| `Jugador` | [cite_start]`jugarTurno(mazo)`, `mostrarTablero()`, `actualizarPuntuacion()` | [cite: 239, 240, 241, 242] |
| `JuegoCardlebones` | [cite_start]`iniciarJuego()`, `ejecutarJuego()`, `procesarTurno(jugador, oponente)`, `comprobarFinJuego()`, `determinarGanador()` | [cite: 243, 244, 245, 246, 247, 248] |

---

¿Hay alguna otra sección del documento que te gustaría incluir o algún otro formato que necesites?