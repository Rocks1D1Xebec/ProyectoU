export class Carta{
    public Palo: string
    public Valor: number;
    public Rango: string;
    constructor(palo: string, valor: number , rango: string ){
        this.Palo = palo;
        this.Valor = valor;
        this.Rango = rango
    }
}