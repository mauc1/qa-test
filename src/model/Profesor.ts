class Profesor {
    nombre: string;
    apellidos: string;
    telefono: string;
    correo: string;
    celular: string;
    centroAcademico: string;
    contraseña: string;
    codigo: string;
    fotoPerfil: string;
    rol: string;
    estado: string;

    constructor(
        nombre: string,
        apellidos: string,
        telefono: string,
        correo: string,
        celular: string,
        centroAcademico: string,
        contraseña: string,
        codigo: string,
        fotoPerfil: string,
        rol: string,
        estado: string,
    ) {
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.telefono = telefono;
        this.correo = correo;
        this.celular = celular;
        this.centroAcademico = centroAcademico;
        this.contraseña = contraseña;
        this.codigo = codigo;
        this.fotoPerfil = fotoPerfil;
        this.rol = rol;
        this.estado = estado;
    }
}

export default Profesor;
