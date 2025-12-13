import { Carta } from "./Carta.js";
import { Nodo_Carta } from "./Nodo_Carta.js";

export class Pila_Descarte{
    public Top: Nodo_Carta | null=null;
    constructor(){
        this.Top = null;
    }

    esta_Vacia(){
        if(this.Top == null) return true;
        else  return false; 
    }

    insertar_Inicio(carta: Carta){
        const cartaNueva = new Nodo_Carta(carta);
        if(this.Top == null){
            this.Top = cartaNueva;
            return;
        }
        cartaNueva.Siguiente= this.Top;
        this.Top = cartaNueva;
    }

    insertar_Final(carta: Carta){
        const cartaNueva = new Nodo_Carta(carta);
        if(this.Top == null){
            this.Top = cartaNueva;
            return;
        }
        let actual = this.Top;
        while(actual.Siguiente !== null){
            actual = actual.Siguiente!;
        }
        actual.Siguiente = cartaNueva;
    }

    obtener_Cartas(){
        let cartas = [];
        let actual = this.Top;
        while(actual !== null){
            cartas.push(actual.Carta);
            actual = actual.Siguiente!;
        }
        return cartas;
    }

    limpiar(){
        this.Top = null;
    }
}   