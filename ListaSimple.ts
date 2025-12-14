import { NodoSimple } from "./NodoSimple";

export class ListaSimple<T> {
    head: NodoSimple<T> | null = null;

    agregar(dato: T): void {
        const nuevo = new NodoSimple(dato);
        if (!this.head) {
            this.head = nuevo;
        } else {
            let actual = this.head;
            while (actual.siguiente) {
                actual = actual.siguiente;
            }
            actual.siguiente = nuevo;
        }
    }

    buscar(valor: T): boolean {
        let actual = this.head;
        while (actual) {
            if (actual.dato === valor) return true;
            actual = actual.siguiente;
        }
        return false;
    }
}
