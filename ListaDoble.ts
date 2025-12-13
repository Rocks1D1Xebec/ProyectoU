export class NodoDoble{
    dato : any;
    siguiente : NodoDoble | null = null;
    anterior : NodoDoble | null = null;
    constructor(dato : any){
        this.dato = dato;
    }
}
export class ListaDoble {
    cabeza : NodoDoble | null = null;
    agregar(dato : any){
        const nuevo = new NodoDoble(dato);
        if(this.cabeza === null){
            this.cabeza = nuevo;
        }else{
            let actual = this.cabeza;
            while(actual.siguiente !== null){
                actual = actual.siguiente;
            }
            actual.siguiente = nuevo;
            nuevo.anterior = actual;
        }
    }
    imprimir() : void{
        let actual = this.cabeza;
        while(actual !== null){
            console.log(actual.dato);
            actual = actual.siguiente;
        }
    }
}