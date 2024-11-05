
class Usuario {
    private _nombre: string;
    private _correo: string;
    private _contrasenia: string;
    private _rol: string;
    private _celular: string;

    constructor(nombre: string, correo: string, contrasenia: string, rol: string, celular: string) {
        this._nombre = nombre;
        this._correo = correo;
        this._contrasenia = contrasenia;
        this._rol = rol;
        this._celular = celular;
    }
    get nombre() {
        return this._nombre;
    }
     // Getters
     get correo() {
        return this._correo;
    }

    get contrasenia() {
        return this._contrasenia;
    }

    get rol() {
        return this._rol;
    }

    get celular() {
        return this._celular;
    }
}
export default Usuario;