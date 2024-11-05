'use client';
import Actividad from '@/model/Actividad';
import styles from '../page.module.css';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { handlerActivityDetails, handlerEditActivity, handlerEditFilePoster } from '@/controller/actividadController';
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface FileDB extends DBSchema {
    files: {
        key: number;
        value: File;
    };
}

class IndexedDBService {
    private dbPromise: Promise<IDBPDatabase<FileDB>>;

    constructor() {
        this.dbPromise = openDB<FileDB>('file-store', 1, {
            upgrade(db) {
                db.createObjectStore('files', { keyPath: 'key', autoIncrement: true });
            },
        });
    }

    async saveFile(file: File): Promise<void> {
        const db = await this.dbPromise;
        const tx = db.transaction('files', 'readwrite');
        const store = tx.objectStore('files');
        await store.add(file);
        await tx.done;
    }

    async getFile(): Promise<File | undefined> {
        const db = await this.dbPromise;
        const tx = db.transaction('files', 'readonly');
        const store = tx.objectStore('files');
        const files = await store.getAll();
        await tx.done;
        return files.length > 0 ? files[0] : undefined;
    }

    async deleteFile(): Promise<void> {
        const db = await this.dbPromise;
        const tx = db.transaction('files', 'readwrite');
        const store = tx.objectStore('files');
        await store.clear();
        await tx.done;
    }
}

// Función para generar un nombre único para el archivo
const generateUniqueFileName = (originalFileName: string) => {
    const uniqueId = uuidv4(); // Función para generar un UUID
    const fileExtension = originalFileName.split('.').pop();
    return `${uniqueId}.${fileExtension}`;
};

// Función para generar un UUID (Identificador Único Universal)
const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

export default function actEdit() {
    
    const [data, setData] = useState<Actividad>();
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const actividad = JSON.parse(localStorage.getItem("actividad") || "{}");
                const idIt = localStorage.getItem('itinerarioId') ?? '';
                const data = await handlerActivityDetails(idIt, actividad.id);
                setData(data);
                console.log(actividad);
                console.log(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);


    function handlerNombre(e: React.ChangeEvent<HTMLInputElement>) {
        setData(prevData => ({ ...prevData, nombre: e.target.value }) as Actividad);
    }

    function handlerSemana(e: React.ChangeEvent<HTMLSelectElement>) {
        setData(prevData => ({ ...prevData, semanaRealizacion: parseInt(e.target.value) }) as Actividad);
    }

    function handlerTipo(e: React.ChangeEvent<HTMLSelectElement>) {
        setData(prevData => ({ ...prevData, tipo: e.target.value }) as Actividad);
    }

    function handlerModalidad(e: React.ChangeEvent<HTMLSelectElement>) {
        setData(prevData => ({ ...prevData, modalidad: e.target.value }) as Actividad);
    }

    function handlerDate(e: React.ChangeEvent<HTMLInputElement>) {
        setData(prevData => ({ ...prevData, fecha: new Date(e.target.value) }) as Actividad);
    }

    function handlerHora(e: React.ChangeEvent<HTMLInputElement>) {
        setData(prevData => ({ ...prevData, hora: (e.target.value) }) as Actividad);
    }

    function handlerRecordatorio(e: React.ChangeEvent<HTMLInputElement>) {
        setData(prevData => ({ ...prevData, iniciarRecordatorio: new Date(e.target.value) }) as Actividad);
    }

    function handlerLink(e: React.ChangeEvent<HTMLInputElement>) {
        setData(prevData => ({ ...prevData, enlace: e.target.value }) as Actividad);
    }

    function handlerEstado(e: React.ChangeEvent<HTMLSelectElement>) {
        setData(prevData => ({ ...prevData, estado: e.target.value }) as Actividad);
    }

    /*function handlerFile(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setData(prevData => ({ ...prevData, afiche: e.target?.result }) as Actividad);
            };
            reader.readAsDataURL(file);
        }
    }*/

    const handlerFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            const fileName = selectedFile.name;
            const fileExtension = fileName.split('.').pop()?.toLowerCase();

            if (!fileExtension || !['pdf', 'png', 'jpg', 'jpeg'].includes(fileExtension)) {
                alert("El archivo seleccionado no es válido");
                return;
            }

            // Guardar el archivo en IndexedDB
            const indexedDBService = new IndexedDBService();
            await indexedDBService.saveFile(selectedFile);
            console.log('Archivo guardado con éxito.');

            // Actualizar el estado con el archivo seleccionado
            setFile(selectedFile);
            setAficheName(generateUniqueFileName(fileName));

            // También puedes realizar otras acciones aquí, como cambiar el nombre del archivo, etc.
        }
    };

    const [aficheName, setAficheName] = useState('');
    const handlerAficheName = (name: string) => {
        setAficheName(name);
    }

 
    const [file, setFile] = useState<File | null>(null);

    const selectProfesor = () => {
        console.log("Seleccionar profesor");
        router.push("/addManager");
    }

    const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
        
        e.preventDefault();
        const idIt = localStorage.getItem('itinerarioId') ?? '';
        const actividad = JSON.parse(localStorage.getItem("actividad") || "{}");
        console.log(actividad);
        if (file) {
            handlerEditFilePoster(file, aficheName, idIt, actividad.id);
        }
        
        if (data) {
            let fecha = new Date(data.fecha);
            let fechaISOString = fecha.toISOString();
            let memo = new Date(data.iniciarRecordatorio);
            let memoISO = memo.toISOString();
            const editedData = {
                nombre: data.nombre,
                estado: data.estado,
                semanaRealizacion: data.semanaRealizacion,
                tipo: data.tipo,
                modalidad: data.modalidad,
                fecha: fechaISOString, 
                hora: data.hora,
                enlace: data.enlace,
                afiche: aficheName !== '' ? aficheName : data.afiche,
                encargados: JSON.parse(localStorage.getItem('chosenProfessors') || '[]'),
                iniciarRecordatorio: memoISO
            };
            console.log(editedData);
            handlerEditActivity(idIt, actividad.id, editedData);
        }
        setTimeout(() => {
            router.push('/viewItinerary');
        }, 400);
    }
  return (
    <main className={styles.main} id="main">
        <div className={styles.studentEditContainer}>
            <h1>Editar Actividad</h1>
                <div className={styles.formstudentEdit}>
                    <form className={styles.formContainerstudentEdit} onSubmit={handleEdit}>

                        <div className={styles.formGroupStudentEdit}>
                            <label htmlFor="actName">Nombre</label>
                            <input type="text" id="actName" name="actName" placeholder="..." value={data?.nombre} onChange={handlerNombre} />
                        </div>
                        
                        <div className={styles.formGroupStudentEdit}>
                            <label htmlFor="semana">Semana de realización</label>
                            <select id="semanas" name="semanas" value={(data?.semanaRealizacion)?.toString()} onChange={handlerSemana}>
                                <option value='1'>Semana 1</option>
                                <option value='2'>Semana 2</option>
                                <option value='3'>Semana 3</option>
                                <option value='4'>Semana 4</option>
                                <option value='5'>Semana 5</option>
                                <option value='6'>Semana 6</option>
                                <option value='7'>Semana 7</option>
                                <option value='8'>Semana 8</option>
                                <option value='9'>Semana 9</option>
                                <option value='10'>Semana 10</option>
                                <option value='11'>Semana 11</option>
                                <option value='12'>Semana 12</option>
                                <option value='13'>Semana 13</option>
                                <option value='14'>Semana 14</option>
                                <option value='15'>Semana 15</option>
                                <option value='16'>Semana 16</option>
                            </select>
                        </div>

                        <div className={styles.formGroupStudentEdit}>
                            <label htmlFor="typeAct">Tipo</label>
                            <select id="typeAct" name="typeAct" value={data?.tipo} onChange={handlerTipo}>
                                    <option value="" >Selecciona un tipo de actividad...</option>
                                    <option value="Orientado">Orientadora</option>
                                    <option value="Motivacional">Motivacional</option>
                                    <option value="Apoyo a vida estudiantil">Apoyo a vida estudiantil</option>
                                    <option value="Orden técnico">Orden técnico</option>
                                    <option value="Recreación">Recreación</option>
                            </select>
                        </div>

                        <div className={styles.formGroupStudentEdit}>
                            <label htmlFor="modAct">Modalidad</label>
                            <select id="modAct" name="modAct" value={data?.modalidad} onChange={handlerModalidad}>
                                <option value="" >Selecciona la modalidad...</option>
                                <option value="Virtual">Virtual</option>
                                <option value="Presencial">Presencial</option>
                            </select>
                        </div>

                        <div className={styles.formGroupStudentEdit}>
                            <label htmlFor="actDate">Fecha</label>
                            <input type="date" id="actDate" name="actDate" value={data?.fecha + ""} onChange={handlerDate}/>
                        </div>

                        <div className={styles.formGroupStudentEdit}>
                            <label htmlFor="actHour">Hora</label>
                            <input type="time" id="actHour" name="actHour" value={data?.hora} onChange={handlerHora}/>
                        </div>

                        <div className={styles.formGroupStudentEdit}>
                            <label htmlFor="memoAct">Iniciar recordatorio</label>
                            <input type="date" id="memoAct" name="memoAct" value={data?.iniciarRecordatorio + ""} onChange={handlerRecordatorio}/>
                        </div>

                        <div className={styles.formGroupStudentEdit}>
                            <label htmlFor="linkAct">Enlace</label>
                            <input type="text" id="linkAct" name="linkAct" placeholder="..." value={data?.enlace} onChange={handlerLink}/> 
                        </div>
                        
                        <div className={styles.formGroupStudentEdit}>
                            <label htmlFor="statusAct">Estado de actividad</label>
                            <select id="statusAct" name="statusAct" value={data?.estado} onChange={handlerEstado}>
                                <option value="Planeada">Planeada</option>
                                <option value="Notificada">Notificada</option>
                                <option value="Finalizada">Finalizada</option>
                            </select>
                        </div>

                        <div className={styles.formGroupStudentEdit}>
                            <label htmlFor='myFile'>Afiche</label>
                            <input type="file" id="myFile" name="filename" accept="image/*, .pdf" onChange={handlerFile}></input>
   
                        </div>
                        <div className={styles.groupButton}>
                            <button className={styles.blueButton} style={{ padding: '0.6em', width:'60%' }} onClick={() => { }} type="submit">Actualizar</button>
                            <button className={styles.blueButton} style={{ padding: '0.6em', width:'60%' }} onClick={() => selectProfesor()}>Encargados</button>
                        </div>
                        
                    </form>
                </div>
                
            
        </div>
    </main>
  );
}
