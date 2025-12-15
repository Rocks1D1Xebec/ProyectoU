import { JuegoRangoYPalo } from "./Clases/Juego.js";
import { Carta } from "./Clases/Carta.js";
import { Jugador } from "./Clases/Jugador.js";

// Initialize Game
const game = new JuegoRangoYPalo("Jugador 1", "Jugador 2");
game.iniciarJuego();

// State
let currentCard: Carta | null = null;
let currentPlayerIndex = 1; // 1 or 2

// DOM Elements
const p1Area = document.getElementById("player1-area");
const p2Area = document.getElementById("player2-area");
const p1Columns = document.getElementById("p1-columns") as HTMLElement;
const p2Columns = document.getElementById("p2-columns") as HTMLElement;
const drawBtn = document.getElementById("draw-btn") as HTMLButtonElement;
const drawPile = document.getElementById("draw-pile") as HTMLElement;
const currentPlayerNameSpan = document.getElementById("current-player-name") as HTMLElement;
const p1ScoreSpan = document.getElementById("p1-score") as HTMLElement;
const gameLog = document.getElementById("game-log") as HTMLElement;

// Helper to Create Card Element
function createCardElement(carta: Carta | null): HTMLElement {
    const el = document.createElement("div");
    el.className = "card-slot";
    
    if (carta) {
        el.style.backgroundColor = "#fff";
        el.style.color = carta.getColor() === "Rojo" ? "#d40000" : "#000";
        el.style.display = "flex";
        el.style.flexDirection = "column";
        el.style.justifyContent = "center";
        el.style.alignItems = "center";
        el.style.border = "1px solid #aaa";
        
        const rank = document.createElement("div");
        rank.style.fontSize = "1.5rem";
        rank.style.fontWeight = "bold";
        rank.textContent = carta.toString().slice(0, -1); // Hacky way to get rank, but carta.toString() is rank+suit
        if(carta.getRango() === 10) rank.textContent = "10"; // Fix for 10 being 2 chars

        const suit = document.createElement("div");
        suit.style.fontSize = "2rem";
        // suit.textContent = carta.toString().slice(-1); 
        // Better to use converting method if public, but toString uses private methods.
        // We can parse the string output of toString()
        const fullString = carta.toString();
        const suitChar = fullString.charAt(fullString.length - 1);
        const rankStr = fullString.substring(0, fullString.length - 1);
        
        rank.textContent = rankStr;
        suit.textContent = suitChar;

        el.appendChild(rank);
        el.appendChild(suit);
    }

    return el;
}

// Render Function
function render() {
    // Render Player 1 Columns
    p1Columns.innerHTML = "";
    // Note: Tablero.casillas is [rows][cols]. We want to render columns.
    // So we iterate cols 0..2, then inside rows 0..2
    for (let c = 0; c < 3; c++) {
        const colDiv = document.createElement("div");
        colDiv.className = "game-column";
        // Click to place card
        colDiv.onclick = () => handleColumnClick(1, c);
        
        for (let r = 0; r < 3; r++) {
            const carta = game.jugador1.tablero.casillas[r]?.[c] ?? null;
            colDiv.appendChild(createCardElement(carta));
        }
        p1Columns.appendChild(colDiv);
    }

    // Render Player 2 Columns
    p2Columns.innerHTML = "";
    for (let c = 0; c < 3; c++) {
        const colDiv = document.createElement("div");
        colDiv.className = "game-column";
        colDiv.onclick = () => handleColumnClick(2, c);
        
        for (let r = 0; r < 3; r++) {
            const carta = game.jugador2.tablero.casillas[r]?.[c] ?? null;
            colDiv.appendChild(createCardElement(carta));
        }
        p2Columns.appendChild(colDiv);
    }

    // Update Score
    p1ScoreSpan.innerText = game.jugador1.calcularPuntuacion().toString();
    
    // Update Draw Pile Visual
    if (game.mazo.estaVacio()) {
        drawPile.innerHTML = "<div class='pile-empty'>Vacia</div>";
        drawPile.onclick = null;
    } else {
        // Only show card back if no current card drawn, or distinct pile
        if (currentCard) {
            // Show the drawn card floating or in a "Hand" area? 
            // For now, let's just use the pile area to show the current card if drawn
            drawPile.innerHTML = "";
            const cardEl = createCardElement(currentCard);
            cardEl.className = "pile-card-face"; // Custom style needed?
            cardEl.style.width = "90px";
            cardEl.style.height = "126px";
            drawPile.appendChild(cardEl);
        } else {
            drawPile.innerHTML = `<img src="./assets/card_back.png" class="pile-card" alt="Deck">`;
        }
    }

    // Turn Indicator
    currentPlayerNameSpan.innerText = currentPlayerIndex === 1 ? game.jugador1.nombre : game.jugador2.nombre;
    
    // Highlight Active Player
    if (currentPlayerIndex === 1) {
        p1Area?.classList.add("active-turn");
        p2Area?.classList.remove("active-turn");
    } else {
        p1Area?.classList.remove("active-turn");
        p2Area?.classList.add("active-turn");
    }

    // Render Log
    renderLog();
}

function renderLog() {
    gameLog.innerHTML = "";
    let actual = game.historial.cabeza;
    while (actual !== null) {
         const entry = document.createElement("div");
         entry.className = "log-entry";
         entry.innerHTML = `<span style="color: #4a2c18; font-weight:bold;">T${actual.turno}</span> ${actual.jugador}: ${actual.carta} -> (${actual.fila}, ${actual.columna})`;
         gameLog.appendChild(entry);
         
         const arrow = document.createElement("div");
         arrow.className = "log-arrow";
         arrow.textContent = "↓";
         gameLog.appendChild(arrow);

         actual = actual.siguiente;
    }
}

// Interactions
drawBtn.onclick = () => {
    if (currentCard) return; // Already drawn
    // Logic extraction from Jugador.jugarTurno... wait, jugarTurno does both draw and place.
    // We need to split it manually since we are doing UI steps.
    
    // 1. Robar
    const carta = game.mazo.robarCarta();
    if (!carta) {
        alert("Mazo vacio! Fin del juego.");
        return;
    }
    currentCard = carta;
    render();
};

function handleColumnClick(playerIdx: number, colIdx: number) {
    if (!currentCard) {
        alert("Primero debes robar una carta (POP)!");
        return;
    }
    if (playerIdx !== currentPlayerIndex) {
        alert("No es tu turno o tablero equivocado!");
        return;
    }

    const jugadorActual = playerIdx === 1 ? game.jugador1 : game.jugador2;
    const oponente = playerIdx === 1 ? game.jugador2 : game.jugador1;

    // Find first empty row in this column (from top 0 to bottom 2?) 
    // Usually Connect 4 style is bottom-up, but grid usually fills 0 first?
    // The previous logic was "First available slot" iterating f=0..2
    // Let's assume we fill from 0 (Top) to 2 (Bottom) or check logic.
    // Tablero logic: casillas[fila][columna] === null.
    
    let fila = -1;
    for (let r = 0; r < 3; r++) {
        if (jugadorActual.tablero.casillas[r]?.[colIdx] === null) {
            fila = r;
            break;
        }
    }

    if (fila === -1) {
        alert("Esa columna está llena!");
        return;
    }

    // 2. Colocar
    const colocado = jugadorActual.tablero.colocarCarta(currentCard, fila, colIdx);
    
    if (colocado) {
        // 3. Eliminar Cartas Oponente
        oponente.tablero.eliminarCartasPorRango(currentCard.getRango(), game.pilaDescarte);
        
        // 4. Update History
        game.historial.agregar(
             game.historial.obtenerNumeroTurno() + 1,
             jugadorActual.nombre,
             currentCard.toString(),
             fila,
             colIdx,
             []
        );

        // Reset and Switch Turn
        currentCard = null;
        currentPlayerIndex = currentPlayerIndex === 1 ? 2 : 1;
        game.turno++;
        
        render();

        // Check Win Condition
        if (game.jugador1.tablero.estaLleno() || game.jugador2.tablero.estaLleno()) {
             setTimeout(() => {
                 game.determinarGanador();
                 alert("Juego Terminado! Ver consola para ganador.");
             }, 100);
        }

        // AI Turn Trigger?
        if (currentPlayerIndex === 2) {
             setTimeout(aiTurn, 1000);
        }
    }
}

function aiTurn() {
    // Simple AI: Draw, then pick random valid column
    if (currentPlayerIndex !== 2) return;
    
    // Draw
    const carta = game.mazo.robarCarta();
    if (!carta) return;
    currentCard = carta;
    render();

    setTimeout(() => {
        // Pick Column
        // Try col 0, 1, 2
        let placed = false;
        // Naive: Try random col until placed
        let attempts = 0;
        while (!placed && attempts < 10) {
            const c = Math.floor(Math.random() * 3);
            
            // Handle placement logic duplication...
            // Refactor needed but for now direct call
             let fila = -1;
            for (let r = 0; r < 3; r++) {
                if (game.jugador2.tablero.casillas[r]?.[c] === null) {
                    fila = r;
                    break;
                }
            }

            if (fila !== -1) {
                game.jugador2.tablero.colocarCarta(currentCard!, fila, c);
                game.jugador1.tablero.eliminarCartasPorRango(currentCard!.getRango(), game.pilaDescarte);
                 game.historial.agregar(
                    game.historial.obtenerNumeroTurno() + 1,
                    game.jugador2.nombre,
                    currentCard!.toString(),
                    fila,
                    c,
                    []
                );
                currentCard = null;
                currentPlayerIndex = 1;
                game.turno++;
                placed = true;
            }
            attempts++;
        }
        render();
    }, 1000);
}

// Initial Render
render();