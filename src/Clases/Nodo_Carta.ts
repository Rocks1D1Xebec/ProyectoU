import { Carta } from "./Carta.js";

export class Nodo_Carta{
    public Carta: Carta;
    public Siguiente: Nodo_Carta |null=null;
    constructor(carta: Carta){
        this.Carta = carta;
    }
}