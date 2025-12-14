import { ListaSimple } from "./ListaSimple";
import { buscarEnNListas } from "./buscarEnNListas";

// ===== INSTANCIA 1 =====
const lista1 = new ListaSimple<number>();
lista1.agregar(1);
lista1.agregar(2);
lista1.agregar(3);

// ===== INSTANCIA 2 =====
const lista2 = new ListaSimple<number>();
lista2.agregar(10);
lista2.agregar(20);
lista2.agregar(30);

// ===== PRUEBAS INDIVIDUALES =====
console.log("Buscar 2 en lista1:", lista1.buscar(2)); // true
console.log("Buscar 5 en lista1:", lista1.buscar(5)); // false

console.log("Buscar 20 en lista2:", lista2.buscar(20)); // true
console.log("Buscar 99 en lista2:", lista2.buscar(99)); // false

// ===== PRUEBA CON N LISTAS =====
const listas = [lista1, lista2];

console.log(
    "Buscar 3 en N listas:",
    buscarEnNListas(listas, 3)
); // true

console.log(
    "Buscar 30 en N listas:",
    buscarEnNListas(listas, 30)
); // true

console.log(
    "Buscar 100 en N listas:",
    buscarEnNListas(listas, 100)
); // false
