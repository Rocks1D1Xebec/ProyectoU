import { PilaDescarte } from "./Clases/Pila_Descarte.js";
import { Carta } from "./Clases/Carta.js";

function pruebaMetodosPilaDescarte() {
//Crear Barajas
    const pila1 = new PilaDescarte();
    const pila2 = new PilaDescarte();

    pila1.insertarFin(new Carta(1, "Corazones"));
    pila1.insertarFin(new Carta(13, "Picas"));
    pila1.insertarFin(new Carta(10, "Diamantes"));

    pila2.insertarFin(new Carta(7, "Tréboles"));
    pila2.insertarFin(new Carta(11, "Corazones"));
    pila2.insertarFin(new Carta(5, "Picas"));

//Imprimir
    console.log("Pila 1 Contenido");
    pila1.imprimir();

    console.log("Pila 2 Contenido");
    pila2.imprimir();

//Barajear
    pila1.barajar();
    pila2.barajar();

    console.log("Pila 1 después de barajar 2 cartas");
    pila1.imprimir();
    console.log("Pila 2 después de barajar 2 cartas");
    pila2.imprimir();

//Vaciar y devolver
    const cartasSacadas = pila1.vaciarYDevolver();
    console.log("Cartas devueltas de Pila 1");
    for (const carta of cartasSacadas) {
        console.log(carta.toString());
    }

    console.log("Pila 1 después de vaciar");
    pila1.imprimir();

//Limpiar
    pila2.limpiar();
    console.log("Pila 2 después de limpiar");
    pila2.imprimir();

    console.log("FIN");
}

pruebaMetodosPilaDescarte();