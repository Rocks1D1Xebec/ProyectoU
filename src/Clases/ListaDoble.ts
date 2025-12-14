export class NodoHistorial {
  turno: number;
  jugador: string;
  carta: string;
  fila: number;
  columna: number;
  eliminadas: string[];
  siguiente: NodoHistorial | null = null;
  anterior: NodoHistorial | null = null;

  constructor(turno: number, jugador: string, carta: string, fila: number,columna: number, eliminadas: string[]){
    this.turno = turno;
    this.jugador = jugador;
    this.carta = carta;
    this.fila = fila;
    this.columna = columna;
    this.eliminadas = eliminadas;
  }
}
export class ListaHistorial {
  cabeza: NodoHistorial | null = null;
  cola: NodoHistorial | null = null;
  agregar(turno: number, jugador: string, carta: string, fila: number, columna: number, eliminadas: string[]){
    const nuevo = new NodoHistorial(turno, jugador, carta, fila, columna, eliminadas);
    if (this.cabeza === null) {
      this.cabeza = nuevo;
      this.cola = nuevo;
    } else {
      this.cola!.siguiente = nuevo;
      nuevo.anterior = this.cola;
      this.cola = nuevo;
    }
  }
  mostrar(): void {
    let actual = this.cabeza;
    while (actual !== null) {
      console.log(
        `Turno ${actual.turno} - ${actual.jugador} colocó ${actual.carta} en (${actual.fila},${actual.columna})`
      );
      if (actual.eliminadas.length > 0) {
        console.log(`   Eliminadas: ${actual.eliminadas.join(', ')}`);
      }
      actual = actual.siguiente;
    }
  }
}
