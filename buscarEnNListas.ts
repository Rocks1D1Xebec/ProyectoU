import { ListaSimple } from "./ListaSimple";

export function buscarEnNListas<T>(
    listas: ListaSimple<T>[],
    valor: T
): boolean {
    for (let lista of listas) {
        if (lista.buscar(valor)) {
            return true;
        }
    }
    return false;
}
