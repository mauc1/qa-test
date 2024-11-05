import { collection, query, where, getDocs, orderBy, addDoc, updateDoc, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { db } from "../../constants/connection";

import Profesor from "@/model/Profesor";

import Actividad from "@/model/Actividad";


export const dynamic = 'force-dynamic'; // Force dynamic route behavior


export async function getActivitiesIt(itID: string) {
    try {
        const database = db;
        const activityRef = collection(database, `itinerarios/${itID}/actividades`);
        const activity = query(activityRef);  //luego meto el orderBy("semana"));
        const querySnapshot = await getDocs(activity);
        var activities:Actividad[] = [];
        querySnapshot.forEach((doc) => {
            let actividad = doc.data() as Actividad;
            actividad.id = doc.id; // Add this line
            activities.push(actividad);
        });
        console.log(activities)
        return activities;
    } catch (error) {
        console.error("Error getting activities:", error);
        return [];
    }
}


export const uploadFilePoster = async (file: File, fileName : string) => {
    // Create a root reference
    const storage = getStorage();
    const storageRef = ref(storage, 'poster/' + fileName);
    const snapshot = await uploadBytes(storageRef, file);
    if(snapshot){
        console.log("Archivo subido correctamente");
        return true;
    }
    return false;
}

interface activityData {
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

export async function getNextActivity() {
    const database = db;
    const itinerarioRef = collection(database, 'itinerarios');
    const itinerarioSnapshot = await getDocs(itinerarioRef);
    let actividades: Actividad[] = [];
    for (const itinerarioDoc of itinerarioSnapshot.docs) {
        const actividadRef = collection(itinerarioDoc.ref, 'actividades');
        const actividadSnapshot = await getDocs(actividadRef);
        actividadSnapshot.forEach((doc) => {
            const actividad = doc.data() as Actividad;
            actividades.push(actividad);
        });
    }
    return actividades;
}

//borrar actividad
export async function deleteAct(itID: string, nombreAct: string): Promise<boolean> {
    //anadimos un espacio isDeleted 
    const database = db;
    //encontrar id de la actividad con ese nombre
    const actID = query(collection(database, `itinerarios/${itID}/actividades`), where("nombre", "==", nombreAct));
    const querySnapshot = await getDocs(actID);
    var actIDDoc = "";
    querySnapshot.forEach((doc) => {
        actIDDoc = doc.id;
    });
    const docRef = doc(database, `itinerarios/${itID}/actividades/${actIDDoc}`);
    await updateDoc(docRef, {
        isDeleted: 1
    });
    return true;
}

//agregar actividad
export async function addActivity(itID: string, actividad: activityData): Promise<boolean> {
    try {
        const database = db;
        const activityRef = collection(database, `itinerarios/${itID}/actividades`);
        await addDoc(activityRef, actividad); 
        return true;
    } catch (error) {
        console.error("Error adding activity:", error);
        return false;
    }
}

//editar actividad
export async function editActivity(itID: string, actID: string, actividad: activityData): Promise<boolean> {
    try {
        const database = db;
        const docRef = doc(database, `itinerarios/${itID}/actividades/${actID}`);
        await updateDoc(docRef, actividad as { [x: string]: any });
        return true;
    } catch (error) {
        console.error("Error editing activity:", error);
        return false;
    }
}