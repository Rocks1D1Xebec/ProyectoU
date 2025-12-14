export class Carta {
  rango: number;
  palo: string;
  valor: number;

  constructor(rango: number, palo: string) {
    this.rango = rango;
    this.palo = palo;
    this.valor = rango;
  }

  getValor(): number {
    return this.valor;
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

  private convertirRango(): string {
    if (this.rango === 11) return 'J';
    if (this.rango === 12) return 'Q';
    if (this.rango === 13) return 'K';
    if (this.rango === 14) return 'A';
    return this.rango.toString();
  }

  private convertirPalo(): string {
    if (this.palo === 'Corazones') return '♥';
    if (this.palo === 'Diamantes') return '♦';
    if (this.palo === 'Picas') return '♠';
    if (this.palo === 'Tréboles') return '♣';
    return this.palo;
  }

  toString(): string {
    return this.convertirRango() + this.convertirPalo();
  }
}
