'use client'
import styles from "../page.module.css";
import React, { useEffect, useState } from 'react';
import { BlueButton } from "../components/blueButton";
import Image from "next/image";
import SortIcon from "../../../public/sort_icon.svg";
import { handlerAllComments } from "@/controller/comentarioController";
import Comentario from "@/model/Comentario";
import { useRouter } from "next/navigation";

export default function commentsPage() {
    const [data, setData] = useState<Comentario[]>([]);
    const [user, setUser] = useState<any>({});
    const router = useRouter();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem('user') || '{}');
                setUser(userData);
                const itinerarioId = localStorage.getItem('itinerarioId');
                const activityId = localStorage.getItem('activityId');
                const data = await handlerAllComments(itinerarioId+"",activityId+""); 
                setData([...data]);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const handleOpening = (index: number) => {
        const comment = data[index];
        localStorage.setItem("comment", JSON.stringify(comment));
        router.push('/responses');
    };

    return (
        <main className={styles.main} id="main">
            <div className={styles.teamContainer}>
                <h1>Comentarios</h1>
                <div className={styles.searchAddContainer}>
                <h1>{}</h1>
                    <input type="text" value={""} readOnly style={{ border: 'none' }}/>
                    <div className={styles.addContainer}>
                        <button className={styles.blueButton} onClick={() => {router.push('/writingComment')}} style={{ width: '120px', height: '40px', marginTop: '20px'}} >Redactar</button>
                    </div>
                </div>
                <div className={styles.tableContainer}>
                    <table>
                        <tbody>
                            <tr>
                                <th className={styles.pasenZelda}>Titulo
                                    <button className={styles.sortButton} onClick={() => { }} >
                                        <Image src={SortIcon} alt="sort icon" className={styles.sortButtonIcon} />
                                    </button></th>
                                <th className={styles.pasenZelda}>Redactor
                                    <button className={styles.sortButton} onClick={() => { }} >
                                        <Image src={SortIcon} alt="sort icon" className={styles.sortButtonIcon} />
                                    </button></th>
                                <th className={styles.pasenZelda}>Fecha y Hora
                                    <button className={styles.sortButton} onClick={() => { }} >
                                        <Image src={SortIcon} alt="sort icon" className={styles.sortButtonIcon} />
                                    </button></th>
                                <th className={styles.pasenZelda}>Acciones</th>
                            </tr>

                        </tbody>
                    </table>
                    <div className={styles.tableContentContainer}>
                        <table>
                            <tbody>
                                {data.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.titulo}</td>
                                        <td>{item.redactor}</td>
                                        <td>{item.fechaYHora.toDate().toLocaleString()}</td>
                                        <td>
                                            <BlueButton text="Seleccionar" onClick={() => handleOpening(index)} type={undefined} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    );
}
