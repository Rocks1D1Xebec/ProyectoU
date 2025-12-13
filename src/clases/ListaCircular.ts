import { Carta } from "./Carta";
import { NodoCarta } from "./NodoCarta";

export class Mazo {
  cabeza: NodoCarta | null
  cola: NodoCarta | null

  constructor() {
    this.cabeza = null
    this.cola = null
    this.crearMazoInicial()
  }
  crearMazoInicial(): void {
    var palos = ['Corazones', 'Diamantes', 'Picas', 'Tréboles']
    var i = 0
    while (i < 4) {
      var palo = palos[i]!
      var rango = 2
      while (rango <= 14) {
        var carta = new Carta(rango, palo)
        var nodo = new NodoCarta(carta)
        if (this.cabeza === null) {
          this.cabeza = nodo
          this.cola = nodo
          nodo.siguiente = nodo
        } else {
          nodo.siguiente = this.cabeza
          this.cola!.siguiente = nodo
          this.cola = nodo
        }
        rango = rango + 1
      }
      i = i + 1
    }
  }
  numeroAleatorio(): number {
    return (new Date().getTime() % 1000) / 1000
  }
  barajar(): void {
    var arreglo: Carta[] = []
    var actual = this.cabeza
    if (actual === null) return
    do {
      arreglo.push(actual.carta)
      actual = actual.siguiente!
    } while (actual !== this.cabeza)
    var n = arreglo.length
    var i = 0
    while (i < n) {
      var j = i + Math.floor((n - i) * this.numeroAleatorio())
      var temp = arreglo[i]!
      arreglo[i] = arreglo[j]!
      arreglo[j] = temp
      i = i + 1
    }
    this.cabeza = null
    this.cola = null
    var k = 0
    while (k < n) {
      var carta = arreglo[k]
      var nodo = new NodoCarta(carta!)
      if (this.cabeza === null) {
        this.cabeza = nodo
        this.cola = nodo
        nodo.siguiente = nodo
      } else {
        nodo.siguiente = this.cabeza
        this.cola!.siguiente = nodo
        this.cola = nodo
      }
      k = k + 1
    }
  }
  robarCarta(): Carta | null {
    if (this.cabeza === null) return null

    var carta = this.cabeza.carta

    if (this.cabeza === this.cola) {
      this.cabeza = null
      this.cola = null
    } else {
      this.cabeza = this.cabeza.siguiente
      this.cola!.siguiente = this.cabeza
    }
    return carta
  }
}