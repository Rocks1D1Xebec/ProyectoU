const mazo = document.getElementById("mazo");
const tablero = document.getElementById("tablero");

// Cartas simuladas (solo rangos de ejemplo)
const cartasDisponibles = ["A♠","2♠","3♠","4♠","5♠","6♠","7♠","8♠","9♠"];
let cartasEnTablero = [];

// Función para robar carta
function robarCarta() {
  if (cartasDisponibles.length === 0) return alert("Mazo vacío!");
  const cartaValor = cartasDisponibles[Math.floor(Math.random() * cartasDisponibles.length)];
  const carta = document.createElement("div");
  carta.classList.add("carta", "animate__animated", "animate__slideInUp");
  carta.textContent = cartaValor;
  
  // Agregar al tablero
  tablero.appendChild(carta);

  // Verificar si ya existe en tablero (simula ataque/eliminación)
  if (cartasEnTablero.includes(cartaValor)) {
    setTimeout(() => {
      animarEliminarCarta(carta);
    }, 500); // pequeño delay para ver la carta
  } else {
    cartasEnTablero.push(cartaValor);
  }

  // Evento click para eliminar manual (opcional)
  carta.addEventListener("click", () => animarEliminarCarta(carta));

  // Limpiar animaciones de entrada
  carta.addEventListener("animationend", () => {
    carta.classList.remove("animate__animated", "animate__slideInUp");
  });
}

// Animación de eliminación tipo "quebrado"
function animarEliminarCarta(carta) {
  carta.classList.add("animate__animated", "animate__hinge", "carta-rotar");

  setTimeout(() => {
    carta.remove();
  }, 2000);

  carta.addEventListener("animationend", () => {
    carta.classList.remove("animate__animated", "animate__hinge", "carta-rotar");
  });
}

// Evento del botón robar
document.getElementById("robar").addEventListener("click", robarCarta);
