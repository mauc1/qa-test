import Profesor from "@/model/Profesor";
import { getNextActivity, addActivity, uploadFilePoster, deleteAct, getActivitiesIt, editActivity } from "../app/DAO/daoActividad";
import Comentario from "@/model/Comentario";
import Prueba from "@/model/Prueba";
import { TipoActividad } from "@/model/TipoActividad";
import { act } from "react-dom/test-utils";

interface activityData {
    nombre: string;
    estado: string;
    tipo: string;
    modalidad: string;
    semana: number;
    fecha: Date;
    hora: string;
    activadorRecordatorio: number;
    link: string;
    afiche: string;
    encargado: Profesor[];
    comentarios: Comentario[];
    pruebas: Prueba[];
}

interface activityDataPrueba {
    nombre: string;
    semanaRealizacion: number;
    tipo: string;
    modalidad: string;
    fecha: string;
    hora: string;
    iniciarRecordatorio: string;
    enlace: string;
    afiche: string;
    encargados: Profesor[];

}

interface activitiesItData {
    id: string;
    semanaRealizacion: number;
    nombre: string;
    estado: string;
}


export const handlerNextActivity = async () => {
    try {
        const data = await getNextActivity();
        if (!data || data.length === 0) {
            console.log("No hay actividades");
            return null;
        } 
        // Ordenar
        data.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
        const now = new Date();
        // Encuentra próxima actividad
        const nextActivity = data.find(activity => 
            new Date(activity.fecha).getTime() > now.getTime() && 
            (activity.estado == "Planeada" || activity.estado == "Notificada")
        );
        return nextActivity || null;
    } catch (error) {
        console.error("Error al cargar proxima actividad:", error);
        return null;
    }
}

export const handlerActivitiesIt = async (idIt: string) => {
    let data = await getActivitiesIt(idIt);
    data = JSON.parse(JSON.stringify(data));

    //descomponer data 
    let actividades:activitiesItData[] = [];
    data.forEach((actividad: any) => {
        if (actividad.isDeleted != 1) {
            const actividadData: activitiesItData = {
                id: actividad.id,
                semanaRealizacion: actividad.semanaRealizacion,
                nombre: actividad.nombre,
                estado: actividad.estado
            };
            actividades.push(actividadData);
        }
    });
    setActsInLS(actividades);
}
export const handlerActivityDetails = async (idIt: string, idAct: string) => {
    let data = await getActivitiesIt(idIt);
    data = JSON.parse(JSON.stringify(data));
    let actividad = data.find((actividad: any) => actividad.id === idAct);
    return actividad;
}

export const handlerDeleteActivity = async (itID: string, actID: string) => {
    try{
        await deleteAct(itID, actID);
        return true;
    } catch (error) {
        console.error("Error deleting activity:", error);
        return false;
    }
} 


export const handlerAddActivity = async (actividad: activityDataPrueba, idItinerario: string, file : File, nameFile: string, router : any, openDialog:any) => {
    let dataFile = await uploadFilePoster(file, nameFile);
    let data = await addActivity(idItinerario, actividad);
    if (data && dataFile) {
        console.log("Actividad agregada correctamente");
        openDialog();
    } else {
        console.log("Error al agregar la actividad");
    }
}

export const handlerEditFilePoster = async (file : File, nameFile: string, idItinerario: string, idActividad: string) => {
    let editedFile = await uploadFilePoster(file, nameFile);
    if (editedFile) {
        console.log("Afiche editado correctamente");
    } else {
        console.log("Error al editar el afiche");
    }
}


//order by semana
export const sortByWeek = async (id: string) => {
    let data = await getActivitiesIt(id);
    data = JSON.parse(JSON.stringify(data));

    let actividades: activitiesItData[] = [];
    data.forEach((actividad: any) => {
        if (actividad.isDeleted != 1) {
            const actividadData: activitiesItData = {
                id: actividad.id,
                semanaRealizacion: actividad.semanaRealizacion,
                nombre: actividad.nombre,
                estado: actividad.estado
            };
            actividades.push(actividadData);
        }
    });
    actividades.sort((a, b) => {
        return a.semanaRealizacion - b.semanaRealizacion;
    });
    setActsInLS(actividades);
}

//order by name
export const sortByName = async (id: string) => {
    let data = await getActivitiesIt(id);
    data = JSON.parse(JSON.stringify(data));

    let actividades: activitiesItData[] = [];
    data.forEach((actividad: any) => {
        if (actividad.isDeleted != 1) {
            const actividadData: activitiesItData = {
                id: actividad.id,
                semanaRealizacion: actividad.semanaRealizacion,
                nombre: actividad.nombre,
                estado: actividad.estado
            };
            actividades.push(actividadData);
        }
    });
    actividades.sort((a, b) => {
        return a.nombre.localeCompare(b.nombre);
    });
    setActsInLS(actividades);
}

//order by estado
export const sortByState = async (id: string) => {
    let data = await getActivitiesIt(id);
    data = JSON.parse(JSON.stringify(data));

    let actividades: activitiesItData[] = [];
    data.forEach((actividad: any) => {
        if (actividad.isDeleted != 1) {
            const actividadData: activitiesItData = {
                id: actividad.id,
                semanaRealizacion: actividad.semanaRealizacion,
                nombre: actividad.nombre,
                estado: actividad.estado
            };
            actividades.push(actividadData);
        }
    });
    actividades.sort((a, b) => {
        return a.estado.localeCompare(b.estado);
    });
    setActsInLS(actividades);
}

//buscar actividad por nombre
export const searchActivityByName = async (name: string, id: string) => {
    let data = await getActivitiesIt(id);
    data = JSON.parse(JSON.stringify(data));

    let actividades: activitiesItData[] = [];
    data.forEach((actividad: any) => {
        if (actividad.isDeleted != 1) {
            const actividadData: activitiesItData = {
                id: actividad.id,
                semanaRealizacion: actividad.ssemanaRealizacionemana,
                nombre: actividad.nombre,
                estado: actividad.estado
            };
            actividades.push(actividadData);
        }
    });
    actividades = actividades.filter((actividad) => {
        return actividad.nombre.toLowerCase().includes(name.toLowerCase());
    });
    setActsInLS(actividades);
}

//editar actividad
export const handlerEditActivity = async (idIt: string, idAct: string, actividad: activityDataPrueba) => {
    try {
        await editActivity(idIt, idAct, actividad);
        return true;
    } catch (error) {
        console.error("Error editing activity:", error);
        return false;
    }
}

const setActsInLS = (actividades: activitiesItData[]) => {
    localStorage.setItem("actividades", JSON.stringify(actividades));
}
