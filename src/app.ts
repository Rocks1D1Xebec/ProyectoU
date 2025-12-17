import { JuegoRangoYPalo } from "./Clases/Juego.js";
import { Carta } from "./Clases/Carta.js";

// Declare global functions for HTML onclick handlers
declare global {
  interface Window {
    openModal: (id: string) => void;
    closeModal: (id: string) => void;
    reiniciarJuego: () => void;
  }
}

// Initialize Game
let game = new JuegoRangoYPalo("Jugador 1", "Jugador 2");
game.iniciarJuego();

// State
let currentCard: Carta | null = null;
let currentPlayerIndex = 0; // 0 or 1
let lastPlacedCard: { playerIdx: number; col: number; row: number } | null = null;

// ============================================================
// DEBUG: Console log para mostrar estructuras de datos (objetos)
// ============================================================
function debugDataStructures(action: string) {
  console.group(`[${action}] Estado del Juego`);
  
  // 1. MAZO (PILA / STACK - LIFO)
  console.group("MAZO DE ROBO - Pila (Stack LIFO)");
  console.log("Estructura: Top -> Siguiente -> ... -> null");
  console.log("game.mazo =", game.mazo);
  console.log("game.mazo.Top (primer nodo) =", game.mazo.Top);
  if (game.mazo.Top) {
    console.log("  .carta =", game.mazo.Top.carta);
    console.log("  .siguiente =", game.mazo.Top.siguiente);
  }
  console.groupEnd();
  
  // 2. TABLEROS (LISTAS DOBLEMENTE ENLAZADAS por columna)
  [game.jugador1, game.jugador2].forEach((jugador) => {
    console.group(`TABLERO ${jugador.nombre} - 3 Columnas (Lista Doblemente Enlazada)`);
    console.log("jugador.tablero =", jugador.tablero);
    console.log("jugador.tablero.columnas =", jugador.tablero.columnas);
    
    for (let col = 0; col < 3; col++) {
      const columna = jugador.tablero.columnas[col]!;
      console.group(`Columna ${col}:`);
      console.log("columna =", columna);
      console.log("columna.top (primer nodo) =", columna.top);
      if (columna.top) {
        console.log("  .carta =", columna.top.carta);
        console.log("  .siguiente =", columna.top.siguiente);
        console.log("  .anterior =", columna.top.anterior);
      }
      console.groupEnd();
    }
    console.log("Puntuacion:", jugador.calcularPuntuacion());
    console.log("barajadasRestantes:", jugador.barajadasRestantes);
    console.groupEnd();
  });
  
  // 3. HISTORIAL (LISTA ENLAZADA SIMPLE)
  console.group("HISTORIAL - Lista Enlazada Simple");
  console.log("Estructura: cabeza -> siguiente -> ... -> cola -> null");
  console.log("game.historial =", game.historial);
  console.log("game.historial.cabeza =", game.historial.cabeza);
  console.log("game.historial.cola =", game.historial.cola);
  if (game.historial.cabeza) {
    console.log("Primer nodo completo:", game.historial.cabeza);
  }
  console.groupEnd();
  
  // 4. GESTOR DE TURNOS (LISTA CIRCULAR SIMPLE)
  console.group("GESTOR TURNOS - Lista Circular Simple");
  console.log("game.gestorTurnos =", game.gestorTurnos);
  console.log("Jugador actual:", currentPlayerIndex === 0 ? game.jugador1.nombre : game.jugador2.nombre);
  console.groupEnd();
  
  // 5. PILA DE DESCARTE
  console.group("PILA DESCARTE - Pila (Stack LIFO)");
  console.log("game.pilaDescarte =", game.pilaDescarte);
  console.log("game.pilaDescarte.Top =", game.pilaDescarte.Top);
  console.groupEnd();
  
  console.groupEnd();
}

// Log inicial
console.log("%cCARDLEBONES - Debug Mode", "font-size: 14px; font-weight: bold; color: #cba163;");
debugDataStructures("INICIO");

// DOM Elements
const board0 = document.getElementById("board-0") as HTMLElement;
const board1 = document.getElementById("board-1") as HTMLElement;
const score0 = document.getElementById("score-0") as HTMLElement;
const score1 = document.getElementById("score-1") as HTMLElement;
const p0UI = document.getElementById("p0-ui") as HTMLElement;
const p1UI = document.getElementById("p1-ui") as HTMLElement;
const btnDeck = document.getElementById("btn-deck") as HTMLElement;
// btnDraw removido - se usa click en mazo
const btnShuffle = document.getElementById("btn-shuffle") as HTMLButtonElement;
const shuffleCount = document.getElementById("shuffle-count") as HTMLElement;
const drawPreview = document.getElementById("draw-preview") as HTMLElement;
const statusMsg = document.getElementById("status-msg") as HTMLElement;
const recycleIndicator = document.getElementById("recycle-indicator") as HTMLElement;
const logScrollModal = document.getElementById("log-scroll-modal") as HTMLElement;
const modalEnd = document.getElementById("modal-end") as HTMLElement;
const finalSummary = document.getElementById("final-summary") as HTMLElement;

// Helper: Create card element with optional animation
function createCardElement(carta: Carta, animate: boolean = false): HTMLElement {
  const cardDiv = document.createElement("div");
  cardDiv.className = "card-entity";
  
  // Use our own CSS animation classes
  if (animate) {
    cardDiv.classList.add("card-placed");
    cardDiv.addEventListener("animationend", () => {
      cardDiv.classList.remove("card-placed");
    }, { once: true });
  }
  
  const isRed = carta.getPalo() === "Corazones" || carta.getPalo() === "Diamantes";
  if (isRed) cardDiv.classList.add("red");
  
  const rankSpan = document.createElement("span");
  rankSpan.className = "rank";
  const fullString = carta.toString();
  rankSpan.textContent = fullString.substring(0, fullString.length - 1);
  
  const suitSpan = document.createElement("span");
  suitSpan.className = "suit";
  suitSpan.textContent = fullString.charAt(fullString.length - 1);
  
  cardDiv.appendChild(rankSpan);
  cardDiv.appendChild(suitSpan);
  
  return cardDiv;
}

// Animate card destruction
function animateCardDestruction(cardElement: HTMLElement, onComplete?: () => void) {
  cardElement.classList.add("card-destroying");
  
  setTimeout(() => {
    cardElement.remove();
    if (onComplete) onComplete();
  }, 500);
}

// Helper: Animate score change
function animateScore(element: HTMLElement, from: number, to: number) {
  const diff = to - from;
  if (diff === 0) return;
  
  const step = diff > 0 ? 1 : -1;
  let current = from;
  
  const interval = setInterval(() => {
    current += step;
    element.textContent = current.toString();
    if (current === to) {
      clearInterval(interval);
    }
  }, 50);
}

// Render board for a player
// CSS grid fills left-to-right, top-to-bottom
// So we iterate row first, then col to match visual layout
function renderBoard(playerIdx: number) {
  const board = playerIdx === 0 ? board0 : board1;
  const jugador = playerIdx === 0 ? game.jugador1 : game.jugador2;
  
  board.innerHTML = "";
  
  // Grid visual:
  //   Col0  Col1  Col2
  // Row0 [0]  [1]   [2]
  // Row1 [3]  [4]   [5]
  // Row2 [6]  [7]   [8]
  
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const slot = document.createElement("div");
      slot.className = "card-slot";
      
      // Get cards in this column (Lista Doblemente Enlazada)
      const cartas = jugador.tablero.columnas[col]!.recorrerAdelante();
      const carta = cartas[row] ?? null;
      
      if (carta) {
        // Check if this is the last placed card - animate it
        const shouldAnimate = lastPlacedCard && 
          lastPlacedCard.playerIdx === playerIdx && 
          lastPlacedCard.col === col && 
          lastPlacedCard.row === row;
        
        slot.appendChild(createCardElement(carta, shouldAnimate ?? false));
      } else {
        // Empty slot - clickable if it's this player's turn and has card
        // Only the NEXT empty slot in each column is available (Lista inserción al final)
        if (playerIdx === currentPlayerIndex && currentCard && cartas.length === row) {
          slot.classList.add("available");
          slot.onclick = () => placeCard(playerIdx, col);
        }
      }
      
      board.appendChild(slot);
    }
  }
}

// Render all
function render() {
  renderBoard(0);
  renderBoard(1);
  
  // Scores with animation
  const oldScore0 = parseInt(score0.textContent || "0");
  const oldScore1 = parseInt(score1.textContent || "0");
  const newScore0 = game.jugador1.calcularPuntuacion();
  const newScore1 = game.jugador2.calcularPuntuacion();
  
  animateScore(score0, oldScore0, newScore0);
  animateScore(score1, oldScore1, newScore1);
  
  // Active player highlight
  p0UI.classList.toggle("active", currentPlayerIndex === 0);
  p1UI.classList.toggle("active", currentPlayerIndex === 1);
  
  // Draw preview
  if (currentCard) {
    drawPreview.innerHTML = "";
    drawPreview.appendChild(createCardElement(currentCard));
  } else {
    drawPreview.innerHTML = "";
  }
  
  // Shuffle counter
  const jugadorActual = currentPlayerIndex === 0 ? game.jugador1 : game.jugador2;
  shuffleCount.textContent = `Barajadas restantes: ${jugadorActual.barajadasRestantes}/3`;
  // Shuffle habilitado: si tiene usos Y (no hay carta O hay carta para devolver)
  btnShuffle.disabled = jugadorActual.barajadasRestantes <= 0;
  
  // Status message
  statusMsg.textContent = `Turno: ${currentPlayerIndex === 0 ? game.jugador1.nombre : game.jugador2.nombre}`;
  
  // Render log in modal
  renderLog();
}

// Render log in modal
function renderLog() {
  logScrollModal.innerHTML = "";
  let actual = game.historial.cabeza;
  while (actual) {
    const entry = document.createElement("div");
    entry.className = "log-entry";
    entry.innerHTML = `<b>T${actual.turno}</b> ${actual.jugador}: ${actual.carta} → Col ${actual.columna + 1}`;
    if (actual.eliminadas.length > 0) {
      entry.innerHTML += `<br><span style="color:#ff5555">Eliminó: ${actual.eliminadas.join(", ")}</span>`;
    }
    logScrollModal.appendChild(entry);
    actual = actual.siguiente;
  }
}

// Draw card with flip animation
function drawCard() {
  if (currentCard || game.mazo.estaVacio()) return;
  
  console.group("ROBAR CARTA - Mazo.pop()");
  console.log("game.mazo.Top ANTES =", game.mazo.Top);
  
  currentCard = game.mazo.pop();
  
  console.log("Carta robada =", currentCard);
  console.log("game.mazo.Top DESPUES =", game.mazo.Top);
  console.groupEnd();
  
  render();
  
  // Agregar animación de flip a la carta robada
  const cardEl = drawPreview.querySelector(".card-entity");
  if (cardEl) {
    cardEl.classList.add("card-draw-flip");
    cardEl.addEventListener("animationend", () => {
      cardEl.classList.remove("card-draw-flip");
    }, { once: true });
  }
}

let isProcessingTurn = false;

// Place card
async function placeCard(playerIdx: number, colIdx: number) {
  if (isProcessingTurn || !currentCard || playerIdx !== currentPlayerIndex) return;
  
  const jugadorActual = playerIdx === 0 ? game.jugador1 : game.jugador2;
  const oponente = playerIdx === 0 ? game.jugador2 : game.jugador1;
  
  if (jugadorActual.tablero.columnas[colIdx]!.estaLlena()) {
    console.warn("Columna llena - no se puede colocar");
    return;
  }

  isProcessingTurn = true; // Bloquear interacciones
  
  console.group(`COLOCAR CARTA en Columna ${colIdx}`);
  
  // Place card
  jugadorActual.tablero.colocarCarta(currentCard, colIdx);
  render(); // Mostrar carta colocada
  
  // Guardar referencia localmente pues currentCard cambiará
  const cartaColocada = currentCard;
  const cartasEliminadas: string[] = [];
  const nodosAEliminar: typeof columnaOponente.top[] = [];
  const columnaOponente = oponente.tablero.columnas[colIdx]!;
  let actual = columnaOponente.top;
  
  // Buscar cartas para ataque
  while (actual) {
    if (actual.carta.getRango() === cartaColocada.getRango()) {
      cartasEliminadas.push(actual.carta.toString());
      nodosAEliminar.push(actual);
    }
    actual = actual.siguiente;
  }
  
  // Animación de ataque (Rojo -> Hinge -> Eliminar)
  if (cartasEliminadas.length > 0) {
    const oponenteBoard = playerIdx === 0 ? board1 : board0;
    const slots = oponenteBoard.querySelectorAll(".card-slot");
    const visualCards: Element[] = [];

    // FASE 1: Iluminar Rojo (Búsqueda)
    const oponenteCartas = columnaOponente.recorrerAdelante();
    oponenteCartas.forEach((carta, rowIdx) => {
      if (carta.getRango() === cartaColocada.getRango()) {
        const slotIdx = rowIdx * 3 + colIdx;
        const cardEl = slots[slotIdx]?.querySelector(".card-entity");
        if (cardEl) {
           cardEl.classList.add("destroy-highlight");
           visualCards.push(cardEl);
        }
      }
    });

    if (visualCards.length > 0) {
        await delay(600); // 600ms de brillo rojo
        // Quitar highlight rojo
        visualCards.forEach(el => el.classList.remove("destroy-highlight"));
    }

    // FASE 2: Animación de destrucción (Hinge)
    visualCards.forEach(cardEl => {
      cardEl.classList.add("animate__animated", "animate__hinge");
    });
    
    recycleIndicator.style.display = "block";
    await delay(1500); // Esperar a que caigan
    
    // FASE 3: Eliminar de datos y reciclar
    nodosAEliminar.forEach(nodo => {
      if (nodo) {
        game.mazo.push(nodo.carta);
        columnaOponente.eliminarNodo(nodo);
      }
    });
    
    animateShuffle();
    game.mazo.barajar();
    console.log("Eliminadas y recicladas:", cartasEliminadas.join(", "));
    
    recycleIndicator.style.display = "none";
    render(); // Re-renderizar tablero sin cartas
  }
  
  console.groupEnd();
  
  // Historial
  game.historial.agregar(
    game.historial.obtenerNumeroTurno() + 1,
    jugadorActual.nombre,
    cartaColocada.toString(),
    colIdx,
    cartasEliminadas
  );
  
  debugDataStructures(`TURNO ${game.historial.obtenerNumeroTurno()}`);
  
  // Cambio de turno
  currentCard = null;
  currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
  
  // Limpieza final
  setTimeout(() => { lastPlacedCard = null; }, 100);
  isProcessingTurn = false; // Desbloquear
  
  if (game.jugador1.tablero.estaLleno() || game.jugador2.tablero.estaLleno() || game.mazo.estaVacio()) {
    endGame();
  }
}


// Shuffle deck - can return drawn card and shuffle
function shuffleDeck() {
  const jugadorActual = currentPlayerIndex === 0 ? game.jugador1 : game.jugador2;
  
  if (jugadorActual.barajadasRestantes <= 0) {
    console.log("Sin barajadas restantes");
    return;
  }
  
  // Si hay carta robada, devolverla al mazo primero
  if (currentCard) {
    console.group("DEVOLVER CARTA Y BARAJAR");
    console.log("Devolviendo carta al mazo:", currentCard);
    game.mazo.push(currentCard);
    currentCard = null;
    
    // Animación de carta entrando al mazo
    const preview = document.getElementById("draw-preview");
    if (preview?.firstChild) {
      (preview.firstChild as HTMLElement).classList.add("card-fly-to-deck");
    }
    console.groupEnd();
  }
  
  // Animación de shuffle en el mazo visual
  const deckBox = document.getElementById("btn-deck");
  deckBox?.classList.add("shuffle-animation");
  setTimeout(() => deckBox?.classList.remove("shuffle-animation"), 500);
  
  game.mazo.barajar();
  jugadorActual.barajadasRestantes--;
  
  console.log("Mazo barajado. Barajadas restantes:", jugadorActual.barajadasRestantes);
  render();
}

// Animación de shuffle compartida
function animateShuffle() {
  const deckBox = document.getElementById("btn-deck");
  deckBox?.classList.add("shuffle-animation");
  setTimeout(() => deckBox?.classList.remove("shuffle-animation"), 500);
}

// Helper: delay function
// Helper: delay function
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

interface BonusResult {
  puntosExtra: number;
  multiplicador: number;
  tipo: 'par' | 'trio' | 'secuencia' | 'nada';
}

// Calcular bonus de columna (Pares, Trios, Secuencias)
function calcularBonusColumna(cartas: { carta: { getRango(): number } }[]): BonusResult {
  if (cartas.length === 0) return { puntosExtra: 0, multiplicador: 1, tipo: 'nada' };
  
  const rangos = cartas.map(c => c.carta.getRango()).sort((a,b) => a - b);
  
  // Check secuencia (solo si hay 3 cartas)
  if (rangos.length === 3) {
      // Normal check (ej: 4,5,6)
      const consecutivo = (rangos[0]! + 1 === rangos[1]) && (rangos[1]! + 1 === rangos[2]);
      // A check special (2, 3, 14 -> asume A=1 para hacer 1,2,3)
      const aSequence = (rangos[0] === 2 && rangos[1] === 3 && rangos[2] === 14);
      
      if (consecutivo || aSequence) {
          return { puntosExtra: 0, multiplicador: 1.5, tipo: 'secuencia' };
      }
  }
  
  // Check pares/trios
  let matches = 0;
  if (rangos.length >= 2) {
      if (rangos[0] === rangos[1]) matches++;
  }
  if (rangos.length === 3) {
       if (rangos[1] === rangos[2]) matches++;
       if (rangos[0] === rangos[2]) matches++; 
  }
  
  if (matches === 3) return { puntosExtra: 0, multiplicador: 3, tipo: 'trio' }; // 3 iguales x3
  if (matches === 1) return { puntosExtra: 0, multiplicador: 2, tipo: 'par' };   // 2 iguales x2
  
  return { puntosExtra: 0, multiplicador: 1, tipo: 'nada' };
}

// End game with counting animation
async function endGame() {
  console.group("FIN DE PARTIDA - Animación de conteo");
  
  // Scores animados
  const scores = [0, 0];
  const scoreElements = [score0, score1];
  const boards = [board0, board1];
  const jugadores = [game.jugador1, game.jugador2];
  
  let breakdownHTML = '<div class="breakdown-container">';

  // Para cada jugador
  for (let playerIdx = 0; playerIdx < 2; playerIdx++) {
    const jugador = jugadores[playerIdx]!;
    const board = boards[playerIdx]!;
    const scoreEl = scoreElements[playerIdx]!;
    const slots = board.querySelectorAll(".card-slot");
    
    breakdownHTML += `<div class="player-breakdown"><h4>${jugador.nombre}</h4><ul>`;
    
    console.group(`Contando ${jugador.nombre}`);
    
    // Para cada columna
    for (let col = 0; col < 3; col++) {
      const columna = jugador.tablero.columnas[col]!;
      let actual = columna.top;
      let row = 0;
      const nodosColumna: typeof actual[] = [];
      let columnaSumaBase = 0;
      
      // Recorrer con actual = actual.siguiente
      console.log(`  Columna ${col}:`);
      while (actual) {
        const slotIdx = row * 3 + col;
        const cardEl = slots[slotIdx]?.querySelector(".card-entity");
        
        if (cardEl) {
          // Animación de conteo
          cardEl.classList.add("counting-card");
          const valor = actual.carta.getValor();
          columnaSumaBase += valor;
          scores[playerIdx]! += valor;
          
          scoreEl.textContent = scores[playerIdx]!.toString();
          console.log(`    actual.carta = ${actual.carta.toString()}, puntos = ${valor}`);
          
          await delay(400);
          cardEl.classList.remove("counting-card");
        }
        
        nodosColumna.push(actual);
        actual = actual.siguiente; // Recorrido de lista enlazada
        row++;
      }
      
      // Calcular Bonus
      const stats = calcularBonusColumna(nodosColumna.filter(n => n !== null) as { carta: { getRango(): number } }[]);
      let columnaTotal = columnaSumaBase;
      let bonusTag = "";
      
      if (stats.tipo !== 'nada') {
        const msg = `x${stats.multiplicador}`;
        console.log(`    BONUS ${stats.tipo}: ${msg}`);
        
        const cssClass = stats.tipo === 'secuencia' ? "sequence-highlight" : "bonus-highlight";
        
        // Iluminar columna
        for (let r = 0; r < nodosColumna.length; r++) {
          const slotIdx = r * 3 + col;
          const cardEl = slots[slotIdx]?.querySelector(".card-entity");
          cardEl?.classList.add(cssClass);
        }
        
        // Aplicar bonus (Multiplicador)
        let puntosAgregados = 0;
        if (stats.multiplicador > 1) {
             const nuevoTotal = Math.floor(columnaSumaBase * stats.multiplicador);
             puntosAgregados = nuevoTotal - columnaSumaBase;
             columnaTotal = nuevoTotal;
             bonusTag = `<span class="breakdown-bonus ${stats.tipo}">x${stats.multiplicador} ${stats.tipo.toUpperCase()}</span>`;
        } else {
             puntosAgregados = stats.puntosExtra;
             columnaTotal += puntosAgregados;
             bonusTag = `<span class="breakdown-bonus ${stats.tipo}">+${stats.puntosExtra}</span>`;
        }
        
        scores[playerIdx]! += puntosAgregados;
        scoreEl.textContent = scores[playerIdx]!.toString();
        
        await delay(800);
        
        // Quitar highlight
        for (let r = 0; r < nodosColumna.length; r++) {
          const slotIdx = r * 3 + col;
          const cardEl = slots[slotIdx]?.querySelector(".card-entity");
          cardEl?.classList.remove(cssClass);
        }
      }
      
      // Add row to breakdown
      breakdownHTML += `<li><span>Col ${col+1} (${columnaSumaBase})</span> <span>${bonusTag} <strong>${columnaTotal}</strong></span></li>`;
    }
    
    breakdownHTML += `</ul><div class="total-score">${scores[playerIdx]}</div></div>`;
    
    console.groupEnd();
    await delay(500);
  }
  
  breakdownHTML += '</div>';
  console.groupEnd();
  
  // Determinar ganador
  const p1Score = scores[0]!;
  const p2Score = scores[1]!;
  
  let winner = "Empate";
  if (p1Score > p2Score) winner = game.jugador1.nombre;
  else if (p2Score > p1Score) winner = game.jugador2.nombre;
  
  finalSummary.innerHTML = `
    <h3>${winner === "Empate" ? "¡Empate!" : `Ganador: ${winner}`}</h3>
    ${breakdownHTML}
  `;
  
  window.openModal("modal-end");
}

// Restart game
window.reiniciarJuego = () => {
  game = new JuegoRangoYPalo("Jugador 1", "Jugador 2");
  game.iniciarJuego();
  currentCard = null;
  currentPlayerIndex = 0;
  window.closeModal("modal-end");
  render();
};

// Event listeners
btnDeck.onclick = drawCard;
btnShuffle.onclick = shuffleDeck;

// Initial render
render();