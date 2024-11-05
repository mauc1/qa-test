import { Timestamp } from "firebase/firestore";
import Profesor from "./Profesor";

class Respuesta {
    private _redaccion: string;
    private _fechaYHora: Timestamp;
    private _redactor: string;
  
    constructor(
      redaccion: string,
      fechaYHora: Timestamp,
      redactor: string
    ) {
      this._redaccion = redaccion;
      this._fechaYHora = fechaYHora;
      this._redactor = redactor;
    }
    // Getters
    get redaccion() {
      return this._redaccion;
    }
    get fechaYHora() {
      return this._fechaYHora;
    }
    get redactor() {
      return this._redactor;
    }
  }
export default Respuesta;