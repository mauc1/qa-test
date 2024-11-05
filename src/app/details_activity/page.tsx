'use client';
import styles from '../page.module.css';
import React, { useEffect, useState } from 'react';
import PopUp from '../components/popUpImage';

import { handlerActivitiesIt, handlerActivityDetails } from '@/controller/actividadController';
import Actividad from '@/model/Actividad';
import { useRouter } from 'next/navigation';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';

export default function ActivityDetails() {

    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentImageUrl, setCurrentImageUrl] = useState("");

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
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const openDialog = () => {
        console.log("Abriedo dialogo");
        setDialogOpen(true);
    };

    const closeDialog = () => {
        console.log("Cerrando dialogo");
        setDialogOpen(false);
    };
    // pasarlo al DAO
    const handleButtonPoster = (imageUrl: string) => {
        const storage = getStorage();
        const starsRef = ref(storage, 'gs://teamtec-727df.appspot.com/poster/' + imageUrl);
        getDownloadURL(starsRef)
            .then((url) => {
                setCurrentImageUrl(url);
                openDialog();
            })
            .catch((error) => {
                console.error("Error downloading image:", error);
            });
    };
    const handleButtonEvidence = (imageUrl: string) => {
        setCurrentImageUrl(imageUrl);
        openDialog();
    };
    useEffect(() => {
        //const addActivity = document.querySelector(styles.addItineraryContainer) as HTMLDivElement | null;
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        const addActivity = document.querySelector(`.${styles.blueButtonComments}`) as HTMLDivElement | null;
        console.log(addActivity);
        console.log(user.rol);
        if (addActivity && user.rol === 'Administradora') {
            addActivity.style.display = 'none';
            

        }
    });
    return (
        <main className={styles.main} id="main">
            <div>
                <PopUp
                    imageUrl={currentImageUrl}
                    openDialog={openDialog}
                    closeDialog={closeDialog}
                    dialogOpen={dialogOpen}
                />
            </div>
            <div className={styles.studentEditContainer}>
                <h1>Detalles Actividad</h1>
                <div className={styles.formstudentEdit}>
                    <form className={styles.formContainerstudentEdit}>

                        <div className={styles.formGroupStudentEdit}>
                            <label htmlFor="name">Nombre</label>
                            <input type="text" id="name" name="name" placeholder="..." value={data?.nombre} readOnly />
                        </div>
                        <div className={styles.formGroupStudentEdit}>
                            <label htmlFor="week">Semana de realización</label>
                            <input type="text" id="week" name="week" required placeholder="..." value={data?.semanaRealizacion} readOnly />
                        </div>
                        <div className={styles.formGroupStudentEdit}>
                            <label htmlFor="type">Tipo</label>
                            <input type="text" id="type" name="type" required placeholder="..." value={data?.tipo} readOnly />
                        </div>
                        <div className={styles.formGroupStudentEdit}>
                            <label htmlFor="modality">Modalidad</label>
                            <input type="text" id="modality" name="modality" required placeholder="..." value={data?.modalidad} readOnly />
                        </div>
                        <div className={styles.formGroupStudentEdit}>
                            <label htmlFor="date">Fecha</label>
                            <input type="date" id="date" name="date" placeholder="..." value={data ? new Date(data.fecha).toISOString().slice(0, 10) : ""} disabled />
                        </div>
                        {/* cambio: no se mostraba con type = time, asi que lo cambie a text */}
                        <div className={styles.formGroupStudentEdit}>
                            <label htmlFor="time">Hora</label>
                            <input type="text" id="time" name="time" required placeholder="..." value={data?.hora} disabled />
                        </div>
                        <div className={styles.formGroupStudentEdit}>
                            <label htmlFor="reminder">Iniciar recordatorio</label>
                            <input type="date" id="reminder" name="reminder" required placeholder="..." value={data ? new Date(data.iniciarRecordatorio).toISOString().slice(0, 10) : ""} readOnly />
                        </div>
                        <div className={styles.formGroupStudentEdit}>
                            <label htmlFor="link">Enlace</label>
                            <input type="text" id="link" name="link" required placeholder="..." value={data?.enlace} readOnly />
                        </div>
                    </form>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}> {/* Contenedor de botones */}
                    <button className={styles.blueButtonComments} onClick={() => { router.push('/comments') }} style={{ width: '120px' }} >Comentarios</button>
                    <button className={styles.blueButton} onClick={() => { handleButtonPoster(data?.afiche + "") }} style={{ width: '120px' }} >Afiche</button>
                    <button className={styles.blueButton} onClick={() => { handleButtonEvidence(data?.pruebas + "") }} style={{ width: '120px' }} >Pruebas</button>
                </div>
            </div>
        </main>
    );
}
