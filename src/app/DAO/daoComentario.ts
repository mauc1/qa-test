import { collection, query, where, getDocs, orderBy, DocumentData, doc, addDoc } from "firebase/firestore";
import { db } from "../../constants/connection";
import Comentario from "../../model/Comentario"
import Respuesta from "../../model/Respuesta";

export const dynamic = 'force-dynamic'; // Force dynamic route behavior

export async function getComments(itinerarioId: string, actividadId: string): Promise<Comentario[]> {
    const database = db;
    const itinerarioRef = doc(database, 'itinerarios', itinerarioId);
    const actividadRef = doc(itinerarioRef, 'actividades', actividadId);
    const comentariosRef = collection(actividadRef, 'comentarios');
    const comentariosSnapshot = await getDocs(comentariosRef);
    let comentarios: Comentario[] = [];
    for (const comentarioDoc of comentariosSnapshot.docs) {
        let comentario = comentarioDoc.data() as Comentario;
        comentario.id = comentarioDoc.id;
        const respuestasRef = collection(comentarioDoc.ref, 'respuestas');
        const respuestasSnapshot = await getDocs(respuestasRef);
        const respuestas: Respuesta[] = [];
        respuestasSnapshot.forEach((respuestaDoc) => {
            respuestas.push(respuestaDoc.data() as Respuesta);
        });
        comentario.respuestas = respuestas;
        comentarios.push(comentario);
    }
    return comentarios;
}

export async function addComment(itinerarioId: string, actividadId: string, comentario: Comentario): Promise<void> {
    const database = db;
    const itinerarioRef = doc(database, 'itinerarios', itinerarioId);
    const actividadRef = doc(itinerarioRef, 'actividades', actividadId);
    const comentariosRef = collection(actividadRef, 'comentarios');
    const commentDocRef = await addDoc(comentariosRef, {
        titulo: comentario.titulo,
        redactor: comentario.redactor,
        redaccion: comentario.redaccion,
        fechaYHora: comentario.fechaYHora,
    });
    const respuestasRef = collection(commentDocRef, 'respuestas');
    await addDoc(respuestasRef, {});
}

export async function getResponses(itinerarioId: string, actividadId: string, comentarioId: string): Promise<Respuesta[]> {
    const database = db;
    const itinerarioRef = doc(database, 'itinerarios', itinerarioId);
    const actividadRef = doc(itinerarioRef, 'actividades', actividadId);
    const comentariosRef = collection(actividadRef, 'comentarios');
    const comentarioRef = doc(comentariosRef, comentarioId);
    const respuestasRef = collection(comentarioRef, 'respuestas');
    const respuestasSnapshot = await getDocs(respuestasRef);
    let respuestas: Respuesta[] = [];
    respuestasSnapshot.forEach((respuestaDoc) => {
        respuestas.push(respuestaDoc.data() as Respuesta);
    });
    return respuestas;
}
export async function addResponse(itinerarioId: string, actividadId: string, comentarioId: string, respuesta: Respuesta): Promise<void> {
    const database = db;
    const itinerarioRef = doc(database, 'itinerarios', itinerarioId);
    const actividadRef = doc(itinerarioRef, 'actividades', actividadId);
    const comentariosRef = collection(actividadRef, 'comentarios');
    const comentarioRef = doc(comentariosRef, comentarioId);
    const respuestasRef = collection(comentarioRef, 'respuestas');
    await addDoc(respuestasRef, {
        redaccion: respuesta.redaccion,
        fechaYHora: respuesta.fechaYHora,
        redactor: respuesta.redactor
    });
}