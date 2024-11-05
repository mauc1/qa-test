import { TipoActividad } from './TipoActividad';
import Profesor from './Profesor';
import Comentario from './Comentario';
import Prueba from './Prueba';

class Actividad {
    private _id: string;
    private _nombre: string;
    private _estado: string;
    private _semanaRealizacion: number;
    private _tipo: TipoActividad;
    private _modalidad: string;
    private _fecha: Date;
    private _hora: string; // Suponiendo que Time es una cadena de texto en formato de hora
    private _iniciarRecordatorio: Date;
    private _enlace: string;
    private _afiche: string;
    private _encargado: Profesor[];
    private _responsable: Profesor;
    private _comentarios: Comentario[];
    private _pruebas: Prueba[];

    constructor(
        id: string,
        nombre: string,
        estado: string,
        semanaRealizacion: number,
        tipo: TipoActividad,
        modalidad: string,
        fecha: Date,
        hora: string,
        iniciarRecordatorio: Date,
        enlace: string,
        afiche: string,
        encargado: Profesor[],
        responsable: Profesor,
        comentarios: Comentario[],
        pruebas: Prueba[]
    ) {
        this._id = id;
        this._nombre = nombre;
        this._estado = estado;
        this._semanaRealizacion = semanaRealizacion;
        this._tipo = tipo;
        this._modalidad = modalidad;
        this._fecha = fecha;
        this._hora = hora;
        this._iniciarRecordatorio = iniciarRecordatorio;
        this._enlace = enlace;
        this._afiche = afiche;
        this._encargado = encargado;
        this._responsable = responsable;
        this._comentarios = comentarios;
        this._pruebas = pruebas;
    }
    // Getters
    get id() {
        return this._id;
    }
    get nombre() {
        return this._nombre;
    }
    get estado() {
        return this._estado;
    }
    get semanaRealizacion() {
        return this._semanaRealizacion;
    }
    get tipo() {
        return this._tipo;
    }
    get modalidad() {
        return this._modalidad;
    }
    get fecha() {
        return this._fecha;
    }
    get hora() {
        return this._hora;
    }
    get iniciarRecordatorio() {
        return this._iniciarRecordatorio;
    }
    get enlace() {
        return this._enlace;
    }
    get afiche() {
        return this._afiche;
    }
    get encargado() {
        return this._encargado;
    }
    get responsable() {
        return this._responsable;
    }
    get comentarios() {
        return this._comentarios;
    }
    get pruebas() {
        return this._pruebas;
    }
    // Setters
    set id(id: string) {
        this._id = id;
    }
}

export default Actividad;
