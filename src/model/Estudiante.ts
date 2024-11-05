
class Estudiante {
    private _carne: string;
    private _nombre: string;
    private _primerApellido: string;
    private _segundoApellido: string;
    private _correo: string;
    private _celular: string;
    private _sede: string;

    constructor(carne: string, nombre: string, primerApellido: string, segundoApellido: string, correo: string, celular: string, sede: string) {
        this._carne = carne;
        this._nombre = nombre;
        this._primerApellido = primerApellido;
        this._segundoApellido = segundoApellido;
        this._correo = correo;
        this._celular = celular;
        this._sede = sede;
    }
     // Getters

    get carne() {
        return this._carne;
    }

    get nombre() {
        return this._nombre;
    }

    get primerApellido() {
        return this._primerApellido;
    }

    get segundoApellido() {
        return this._segundoApellido;
    }
     get correo() {
        return this._correo;
    }

    get celular() {
        return this._celular;
    }

    get sede() {
        return this._sede;
    }
}
export default Estudiante;