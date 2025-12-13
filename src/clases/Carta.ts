export class Carta {
  rango: number;
  palo: string;

  constructor(rango: number, palo: string) {
    this.rango = rango;
    this.palo = palo;
  }

  getValor(): number {
    return this.rango;
  }

  getRango(): number {
    return this.rango;
  }

  getPalo(): string {
    return this.palo;
  }

  getColor(): string {
    if (this.palo === 'Corazones' || this.palo === 'Diamantes') {
      return 'Rojo';
    } else {
      return 'Negro';
    }
  }

  toString(): string {
    return this.rango + ' de ' + this.palo;
  }
}
