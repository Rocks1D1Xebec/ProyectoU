export class NodoSimple<T> {
    siguiente: NodoSimple<T> | null = null;
    constructor(public dato: T) {}
}