import { collection, query, where, getDocs, deleteDoc, updateDoc, addDoc,doc  } from "firebase/firestore";
import { getStorage, ref, uploadBytes, deleteObject } from "firebase/storage";
import { db } from "../../../constants/connection";
import Profesor from "../../../model/Profesor";

export const dynamic = 'force-dynamic'; // Force dynamic route behavior

export const uploadFile = async (file: File, fileName : string) => {
  // Create a root reference
  const storage = getStorage();
  const storageRef = ref(storage, 'profile/' + fileName);
  const snapshot = await uploadBytes(storageRef, file);
  if(snapshot){
      console.log("Archivo subido correctamente");
      return true;
  }
  return false;
}

export const deleteFile = async (fileName: string) => {
  const storage = getStorage();
  const fileRef = ref(storage, 'gs://teamtec-727df.appspot.com/profile/' +  fileName);
  
  try {
    await deleteObject(fileRef);
    console.log("Archivo eliminado correctamente");
    return true;
  } catch (error) {
    console.error("Error al eliminar el archivo:", error);
    return false;
  }
}

export async function addProfesor(profesor: Profesor): Promise<boolean> {
    try {
      const database = db;
      const profesorsRef = collection(database, 'usuarios');
        const profesorData = {
          nombre: profesor.nombre,
          apellidos: profesor.apellidos,
          telefono: profesor.telefono,
          correo: profesor.correo,
          celular: profesor.celular,
          centroAcademico: profesor.centroAcademico,
          contraseña: profesor.contraseña,
          codigo: profesor.codigo,
          fotoPerfil: profesor.fotoPerfil,
          rol: profesor.rol,
          estado:profesor.estado,
        };
        await addDoc(profesorsRef, profesorData);
        return true;
    } catch (error) {
      console.error("Error adding profesor:", error);
      return false;
    }
  }

  export async function loadProfessor(): Promise<Profesor[]> {
    const database = db;
    const professorsRef = collection(database, 'usuarios');
    const professor = query(professorsRef);
    const querySnapshot = await getDocs(professor);
    let data: Profesor[] =[];
    querySnapshot.forEach((doc) => {
        data.push(doc.data() as Profesor);
    });
    return data;
  }

  export async function loadProfessorByYear(): Promise<Profesor[]> {
    const database = db;
    const currentYear = new Date().getFullYear();
    const professorsRef = collection(database, 'usuarios');
    const professor = query(professorsRef, where("estado", "==", "Activo"), where("rol", "==", "Profesor"), where("año", "==", currentYear));
    const querySnapshot = await getDocs(professor);
    let data: Profesor[] =[];
    querySnapshot.forEach((doc) => {
        data.push(doc.data() as Profesor);
    });
    return data;
  }

  export async function deleteProfessor(id : string): Promise<boolean> {
    try{
      const database = db;
      const professorsRef = collection(database, 'usuarios');
      const professor = query(professorsRef, where("correo", "==", id));
      const querySnapshot = await getDocs(professor);
      if (querySnapshot.empty) {
        return false;
      }
      querySnapshot.forEach(async (docSnap) => {
        const professorDocRef = doc(database, 'usuarios', docSnap.id);
        await updateDoc(professorDocRef, { estado: "Inhabilitado" });
    });
      return true;
    } catch (error) {
      console.error("Error deleting professor:", error);
      return false;
      }
  }

  export async function addProfessor(id : string): Promise<boolean> {
    try{
      const database = db;
      const professorsRef = collection(database, 'usuarios');
      const professor = query(professorsRef, where("correo", "==", id));
      const querySnapshot = await getDocs(professor);
      if (querySnapshot.empty) {
        return false;
      }
      querySnapshot.forEach(async (docSnap) => {
        const professorDocRef = doc(database, 'usuarios', docSnap.id);
        await updateDoc(professorDocRef, { estado: "Activo" });
    });
      return true;
    } catch (error) {
      console.error("Error deleting professor:", error);
      return false;
      }
  }

  export async function deleteConfirmation(mensaje:string,authorName:string, idAutor: string,id:string): Promise<boolean> {
    try {
      const database = db;
      const mensajesRef = collection(database, 'Registro');
        const mensajeData = {
          Justificacion: mensaje,
          Nombre_Autor: authorName,
          Correo_autor: idAutor,
          Accion: "Delete",
          Correo_Afectado: id,
        };
        await addDoc(mensajesRef, mensajeData);
        return true;
    } catch (error) {
      console.error("Error adding mensaje:", error);
      return false;
    }
  }

  export async function actionLog(authorName:string, idAutor: string, idAfected: string, actionType: string): Promise<boolean> {
    try {
      const database = db;
      const mensajesRef = collection(database, 'Registro');
        const mensajeData = {
          Nombre_Autor: authorName,
          Correo_autor: idAutor,
          Accion: actionType,
          Correo_Afectado: idAfected,
        };
        await addDoc(mensajesRef, mensajeData);
        return true;
    } catch (error) {
      console.error("Error adding mensaje:", error);
      return false;
    }
  }

  export async function updateProfessor(id: string, newData: Profesor): Promise<boolean> {
    try {
      const database = db;
      const professorsRef = collection(database, 'usuarios');
      const professorData = {
        nombre: newData.nombre,
        apellidos: newData.apellidos,
        telefono: newData.telefono,
        correo: newData.correo,
        celular: newData.celular,
        centroAcademico: newData.centroAcademico,
        contraseña: newData.contraseña,
        codigo: newData.codigo,
        fotoPerfil: newData.fotoPerfil,
        rol: newData.rol,
        estado: newData.estado,
      };
      const professorQuery = query(professorsRef, where("correo", "==", id));
      const querySnapshot = await getDocs(professorQuery);
      if (querySnapshot.empty) {
        console.log("hemos fallado")
        return false;
      }
      await Promise.all(querySnapshot.docs.map(async (doc) => {
        await updateDoc(doc.ref, professorData);
      }));
      return true;
    } catch (error) {
      console.error("Error updating professor:", error);
      return false;
    }
  }

  export async function loadOneProfessor(id: string): Promise<Profesor[]> {
    const database = db;
    const professorsRef = collection(database, 'usuarios');
    const professor = query(professorsRef, where("correo", "==", id));
    const querySnapshot = await getDocs(professor);
    let ProfesorData: Profesor;
    let data: Profesor[] =[];
    querySnapshot.forEach((doc) => {
        data.push(doc.data() as Profesor);
    });
    return data;
  }