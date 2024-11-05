'use client'
import styles from "../page.module.css";
import React, { useEffect, useState } from 'react';
import Comentario from "@/model/Comentario";
import { useRouter } from "next/navigation";
import { handlerAllComments, handlerGetResponses } from "@/controller/comentarioController";
import { set } from "firebase/database";
import Respuesta from "@/model/Respuesta";

export default function responsesPage() {
    const [data, setData] = useState<Comentario | null>(null);
    const [responses, setResponses] = useState<Respuesta[]>([]);
    const router = useRouter();
    useEffect(() => {
        const fetchData = async () => {
            const data = JSON.parse(localStorage.getItem('comment') || '{}');
            const itinerarioId = localStorage.getItem('itinerarioId');
            const activityId = localStorage.getItem('activityId');
            setData(data);
            const responses = await handlerGetResponses(itinerarioId + "", activityId + "", data.id);
            setResponses([...responses]);
            console.log(responses);
        };
        fetchData();
    }, []);

    return (
        <main className={styles.main} id="main">
            <div className={styles.teamContainer}>
                <h1 style={{ paddingBottom: '30px' }} >Respuestas</h1>
                <div >
                    <input type="text" value={data?.titulo || ''} style={{ color: 'black', backgroundColor: 'white', width: '300px' }} readOnly />
                    <div >
                        <textarea value={data?.redaccion || ''} readOnly style={{ color: 'black', backgroundColor: 'white', height: '100px', width: '300px', resize: 'none', float: 'left', marginTop: '15px' }} />
                        <button className={styles.blueButton} onClick={() => router.push('/writingResponse')} style={{ width: '120px', height: '40px', marginLeft: '150px' }} >Redactar</button>
                        <button className={styles.blueButton} onClick={() => router.push('/comments')} style={{ width: '120px', height: '40px', marginLeft: '150px' }} >Atras</button>
                    </div>
                </div>
                <div className={styles.tableContainerResponses}>
                    <table>
                        <tbody>
                            <tr>
                                <th className={styles.pasenZelda}>Respuesta</th>
                                <th className={styles.pasenZelda}>Usuario</th>
                                <th className={styles.pasenZelda}>Fecha y hora</th>
                            </tr>
                        </tbody>
                    </table>
                    <div className={styles.tableContentContainerResponses}>
                        <table>
                            <tbody>
                                {Array.isArray(responses) ? responses
                                    .filter(respuesta => respuesta.redaccion && respuesta.redaccion.trim() !== "") // Verificar que redaccion no sea undefined antes de usar trim()
                                    .map((respuesta, index) => (
                                        <tr key={index}>
                                            <td>{respuesta.redaccion}</td>
                                            <td>{respuesta.redactor}</td>
                                            <td>{respuesta.fechaYHora?.toDate().toLocaleString()}</td>
                                        </tr>
                                    ))
                                    : <tr><td>No responses found</td></tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    );
}

