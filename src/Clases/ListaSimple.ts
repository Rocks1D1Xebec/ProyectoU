export class NodoSimple{
    dato : any;
    siguiente : NodoSimple | null=null;

    constructor(dato : any){
        this.dato = dato;
    }
}
export class ListaSimple{
    cabeza : NodoSimple | null = null;

    agregar(dato : any):void{
        const nuevo = new NodoSimple(dato);
        if(this.cabeza === null){
            this.cabeza = nuevo;
        }else{
            let actual = this.cabeza;
            while(actual.siguiente !== null){
                actual = actual.siguiente;
            }
            actual.siguiente = nuevo;
        }
    }
    imprimir (): void{
        let actual = this.cabeza;
        while(actual !== null){
            console.log(actual.dato);
            actual = actual.siguiente;
        }
    }
}