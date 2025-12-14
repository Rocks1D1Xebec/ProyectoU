import { Carta } from "./Carta";
import { PilaDescarte } from "./Pila_Descarte";

export class Tablero {
  casillas: (Carta | null)[][];

  constructor() {
    this.casillas = [
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ];
  }

  colocarCarta(carta: Carta, fila: number, columna: number): boolean {
    if (this.casillas[fila]![columna]! !== null) {
      return false;
    }
    this.casillas[fila]![columna]! = carta;
    return true;
  }

  eliminarCartasPorRango(rango: number, pilaDescarte: PilaDescarte): void {
    var f = 0;
    while (f < 3) {
      var c = 0;
      while (c < 3) {
        var carta = this.casillas[f]![c]!;
        if (carta !== null && carta.getRango() === rango) {
          pilaDescarte.insertarFin(carta);
          this.casillas[f]![c] = null;
        }
        c = c + 1;
      }
      f = f + 1;
    }
  }
  calcularPuntuacionColumna(columna: number): number {
    var suma = 0;
    var f = 0;
    while (f < 3) {
      var carta = this.casillas[f]![columna];
      if (carta !== null) {
        suma = suma + carta!.getValor();
      }
      f = f + 1;
    }
    var c0 = this.casillas[0]![columna];
    var c1 = this.casillas[1]![columna];
    var c2 = this.casillas[2]![columna];
    var bonus = 0;
    if (c0 !== null && c1 !== null && c0!.getRango() === c1!.getRango()) {
      bonus = bonus + 1;
    }
    if (c0 !== null && c2 !== null && c0!.getRango() === c2!.getRango()) {
      bonus = bonus + 1;
    }
    if (c1 !== null && c2 !== null && c1!.getRango() === c2!.getRango()) {
      bonus = bonus + 1;
    }
    if (bonus === 1) {
      suma = suma + 5;
    } else if (bonus === 3) {
      suma = suma + 15;
    }
    return suma;
  }

  calcularPuntuacion(): number {
    var total = 0;
    var col = 0;
    while (col < 3) {
      total = total + this.calcularPuntuacionColumna(col);
      col = col + 1;
    }
    return total;
  }

  estaLleno(): boolean {
    var f = 0;
    while (f < 3) {
      var c = 0;
      while (c < 3) {
        if (this.casillas[f]![c] === null) {
          return false;
        }
        c = c + 1;
      }
      f = f + 1;
    }
    return true;
  }
}