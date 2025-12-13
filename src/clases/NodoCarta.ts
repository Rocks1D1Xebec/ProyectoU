import { Carta } from "./Carta.js";

export class NodoCarta {
  carta: Carta;
  siguiente: NodoCarta | null=null;

  constructor(carta: Carta) {
    this.carta = carta;
  }
}