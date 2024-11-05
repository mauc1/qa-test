'use client'
import styles from "../page.module.css";
import { BlueButton } from "../components/blueButton";
import Image from "next/image";
import UploadIcon from "../../../public/upload.svg";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { TipoActividad } from "@/model/TipoActividad";
import PopUp from "../components/popUpInformation";
import { handlerAddActivity } from "../../controller/actividadController";
import Profesor from "@/model/Profesor";
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

const tipoActividadFabrica = (tipo: string) => {
    switch (tipo) {
        case "opcion1":
            return TipoActividad.ORIENTADORA;
        case "opcion2":
            return TipoActividad.MOTIVACIONAL;
        case "opcion3":
            return TipoActividad.VIDA_ESTUDIANTIL;
        case "opcion4":
            return TipoActividad.ORDEN_TECNICO;
        case "opcion5":
            return TipoActividad.RECREACION;
        default:
            return TipoActividad.ORIENTADORA;
    }
}

const tipoActividadInversa = (tipo: string) => {
    switch (tipo) {
        case TipoActividad.ORIENTADORA:
            return 1;
        case TipoActividad.MOTIVACIONAL:
            return 2;
        case TipoActividad.VIDA_ESTUDIANTIL:
            return 3;
        case TipoActividad.ORDEN_TECNICO:
            return 4;
        case TipoActividad.RECREACION:
            return 5;
        default:
            return 0;
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

export default function NewActivity() {


    const [titlePopUp, setTitlePopUp] = useState('Actividad creada');
    const [contentPopUp, setContentPopUp] = useState('La actividad se ha creado correctamente');
    const changeTitlePopUp = (title: string) => {
        setTitlePopUp(title);
    }
    const changeContentPopUp = (content: string) => {
        setContentPopUp(content);
    }
    const router = useRouter();
    const [dialogOpen, setDialogOpen] = useState(false);
    const openDialog = () => {
        console.log("Abriendo dialogo");
        setDialogOpen(true);
    };

    const closeDialog = () => {
        console.log("Cerrando dialogo");
        setDialogOpen(false);
    };


    const [nombre, setNombre] = useState('');
    const handlerNombre = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNombre(e.target.value);
    }

    const [tipoActividad, setTipoActividad] = useState('');
    const handlerTipoActividad = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTipoActividad(tipoActividadFabrica(e.target.value));
    }
    const changeTipoActividad = (tipo: string) => {
        setTipoActividad(tipo);
        const tipoHTML: HTMLSelectElement = document.getElementById('tipo') as HTMLSelectElement;
        tipoHTML.selectedIndex = tipoActividadInversa(tipo);
    }

    const [modalidad, setModalidad] = useState('');
    const handlerModalidad = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setModalidad(e.target.value);
    }
    const changeModalidad = (modalidad: string) => {
        setModalidad(modalidad);
        const modalidadHTML: HTMLSelectElement = document.getElementById('modalidad') as HTMLSelectElement;
        modalidadHTML.selectedIndex = modalidad === 'Virtual' ? 1 : 2;
    }

    const [semana, setSemana] = useState(0);
    const handlerSemana = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSemana(parseInt(e.target.value));
    }
    const changeSemana = (semana: number) => {
        setSemana(semana);
        const semanaHTML: HTMLSelectElement = document.getElementById('semana') as HTMLSelectElement;
        semanaHTML.selectedIndex = semana;
    }

    const [fecha, setFecha] = useState('');
    const handlerFecha = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFecha(e.target.value);
    }

    const [hora, setHora] = useState('');
    const handlerHora = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHora(e.target.value);
    }

    const [recordatorio, setRecordatorio] = useState('');
    const handleRecordatorioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const recordatorioDate = e.target.value;
        console.log(recordatorioDate >= fecha);
        console.log(recordatorioDate);
        console.log(fecha);
        if (recordatorioDate < fecha) {
            setRecordatorio(recordatorioDate);
        } else {
            e.target.value = '';
            e.target.setCustomValidity(e.target.value ? "" : "Por favor, ingresa una fecha previa a la actividad.");
            e.target.reportValidity();
        }
    };

    const [enlace, setEnlace] = useState('');
    const handlerEnlace = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEnlace(e.target.value);
    }

    const [aficheName, setAficheName] = useState('');
    const handlerAficheName = (name: string) => {
        setAficheName(name);
    }

    const createFileFromPath = (filePath: string): File | null => {
        // Extraer el nombre del archivo de la ruta
        const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);

        // Crear un objeto Blob a partir de la ruta
        const blob = new Blob([filePath], { type: 'application/octet-stream' });

        // Crear un objeto File a partir del Blob
        const file = new File([blob], fileName);

        return file;
    };

    const [filePath, setFilePath] = useState('');


    const [file, setFile] = useState<File | null>(null);


    useEffect(() => {
        if (localStorage.getItem('actividad') !== '{}' && localStorage.getItem('actividad') !== null){
            

            const formData = JSON.parse(localStorage.getItem('actividad') as string);

            // Actualizar los estados solo si los valores son diferentes
            if (nombre === '') {
                setNombre(formData.nombre);
            }
            if (semana === 0) {
                changeSemana(formData.semanaRealizacion);
            }
            if (tipoActividad === '') {
                changeTipoActividad(formData.tipo);
            }
            if (modalidad === '') {
                changeModalidad(formData.modalidad);
            }
            if (fecha === '') {
                setFecha(formData.fecha);
            }
            if (hora === '') {
                setHora(formData.hora);
            }
            if (recordatorio === '') {
                setRecordatorio(formData.iniciarRecordatorio);
            }
            if (enlace === '') {
                setEnlace(formData.enlace);
            }
            if (aficheName === '') {
                setAficheName(formData.aficheName);
            }
            if (file === null) {
                const loadFileFromDB = async () => {
                    const indexedDBService = new IndexedDBService();
                    const archivoDB = await indexedDBService.getFile();
                    if (archivoDB) {
                        console.log('Archivo cargado desde IndexedDB:', archivoDB);
                        setFile(archivoDB);
                    }
                };

                // Llama a la función para cargar el archivo si el archivo en el estado es null
                loadFileFromDB();
            }
        }
    }, []);

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



    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        const chosenProfessors: Profesor[] = JSON.parse(localStorage.getItem('chosenProfessors') as string);
        e.preventDefault();

        if (chosenProfessors.length === 0) {
            changeTitlePopUp('Error');
            changeContentPopUp('No se han seleccionado encargados, por favor seleccione al menos uno.');
            openDialog();

        } else {
            const actividad = {
                nombre: nombre,
                semanaRealizacion: semana,
                tipo: tipoActividad,
                modalidad: modalidad,
                fecha: fecha,
                hora: hora,
                iniciarRecordatorio: recordatorio,
                enlace: enlace,
                afiche: aficheName,
                encargados: chosenProfessors,
                estado: "Planeada"
            };

            console.log(actividad);


            localStorage.setItem('actividad', JSON.stringify({}));
            const idItinerario = localStorage.getItem('itinerarioId');

            if (idItinerario !== null && file !== null) {
                handlerAddActivity(actividad, idItinerario, file, aficheName, router, openDialog);
            } else {
                console.error("No 'itinerarioId' in localStorage");
            }
            // Eliminar el archivo de IndexedDB después de agregar la actividad
            const deleteFileFromDB = async () => {
                const indexedDBService = new IndexedDBService();
                await indexedDBService.deleteFile();
                console.log('Archivo eliminado de IndexedDB con éxito.');
            };
            deleteFileFromDB();
        }

    }

    const selectProfesor = () => {
        console.log("Seleccionar profesor");
        const actividad = {
            nombre: nombre,
            semanaRealizacion: semana,
            tipo: tipoActividad,
            modalidad: modalidad,
            fecha: fecha,
            hora: hora,
            iniciarRecordatorio: recordatorio,
            enlace: enlace,
            aficheName: aficheName,
            encargados: []
        };
        localStorage.setItem('actividad', JSON.stringify(actividad));

        router.push("/addManager");
    }



    return (
        <main className={styles.main} id="main">
            <PopUp
                title={titlePopUp}
                content={contentPopUp}
                openDialog={openDialog}
                closeDialog={closeDialog}
                dialogOpen={dialogOpen}
            />
            <div className={styles.activityContainer}>
                <h1>Nueva Actividad</h1>
                <form className={styles.activityFormContainer} onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="nombre">Nombre</label>
                        <input type="nombre" id="nombre" name="nombre" required placeholder="..." onChange={handlerNombre} value={nombre !== '' ? nombre : ""} />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="semana">Semana de realización</label>
                        <select className={styles.selectContainer} id="semana" name="semana" required onChange={handlerSemana}>
                            <option value="" >Selecciona una semana...</option>
                            {
                                Array.from({ length: 16 }, (_, i) => i + 1).map(num =>
                                    <option key={num} value={num}>Semana {num}</option>
                                )
                            }
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="tipo">Tipo</label>
                        <select id="tipo" name="tipo" required onChange={handlerTipoActividad}>
                            <option value="" >Selecciona un tipo de actividad...</option>
                            <option value="opcion1">Orientadora</option>
                            <option value="opcion2">Motivacional</option>
                            <option value="opcion3">Apoyo a vida estudiantil</option>
                            <option value="opcion4">Orden técnico</option>
                            <option value="opcion5">Recreación</option>
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="modalidad">Modalidad</label>
                        <select id="modalidad" name="modalidad" required onChange={handlerModalidad}>
                            <option value="" >Selecciona la modalidad...</option>
                            <option value="Virtual">Virtual</option>
                            <option value="Presencial">Presencial</option>
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="fecha">Fecha</label>
                        <input type="date" id="fecha" name="fecha" required placeholder="..." onChange={handlerFecha} value={fecha !== "" ? fecha : ""} />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="hora">Hora</label>
                        <input type="time" id="hora" name="hora" required placeholder="..." onChange={handlerHora} value={hora !== "" ? hora : ""} />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="recordatorio">Iniciar recordatorio</label>
                        <input type="date" id="recordatorio" name="recordatorio" required placeholder="..." onChange={handleRecordatorioChange} value={recordatorio !== "" ? recordatorio : ""} />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="enlace">Enlace</label>
                        <input type="link" id="enlace" name="enlace" placeholder="..." onChange={handlerEnlace} value={enlace !== "" ? enlace : ""} />
                    </div>
                    <div className={styles.uploadContainer}>
                        <label htmlFor="afiche">
                            <Image src={UploadIcon} alt="upload Icon" />
                            {"Afiche"}
                        </label>
                        <input type="file" id="afiche" name="afiche" accept="image/*, .pdf" hidden onChange={handlerFile} />
                    </div>

                    <div className={styles.buttonActivityContainer}>
                        <BlueButton text="Crear actividad" onClick={() => { }} type="submit" />
                        <BlueButton text="Encargados" onClick={selectProfesor} type="button" />
                    </div>


                </form>

            </div>
        </main>
    );
}