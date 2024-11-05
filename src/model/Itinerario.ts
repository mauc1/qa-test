import Profesor from './Profesor';

class Itinerario {
    private nombre: string;
    private autor: Profesor;

    constructor(
        nombre: string,
        autor: Profesor
    ) {
        this.nombre = nombre;
        this.autor = autor;
    }
    getNombre(): string {
        return this.nombre;
    }
    setNombre(nombre: string): void {
        this.nombre = nombre;
    }
    getAutor(): Profesor {
        return this.autor;
    }
    setAutor(autor: Profesor): void {
        this.autor = autor;
    }
}

export default Itinerario;