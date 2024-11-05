'use client';
import styles from '../page.module.css';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { handlerAddResponse } from '@/controller/comentarioController';
import { Timestamp } from 'firebase/firestore';
import Respuesta from '@/model/Respuesta';

export default function writingResponse() {
    const [data, setData] = useState({
        fechaYHora: '',
        redaccion: ''
    });
   const  router = useRouter()
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setData({
            ...data,
            [e.target.id]: e.target.value
        });
    };

    async function handlePost() {
        const commentData = JSON.parse(localStorage.getItem('comment') || '{}');
        const itinerarioId = localStorage.getItem('itinerarioId');
        const activityId = localStorage.getItem('activityId');
        const timestamp = Timestamp.now();
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        const respuesta = new Respuesta(data.redaccion,timestamp,userData.nombre);
        handlerAddResponse(itinerarioId+"",activityId+"",commentData.id,respuesta);
        router.push('/responses');
    };
  return (
    <main className={styles.main} id="main">
        <div className={styles.studentEditContainer}>
            <h1>Redactar Respuesta</h1>
                <div className={styles.formstudentEdit}>
                    <form className={styles.formContainerWriteComment}>
                        <div className={styles.formGroupWriteComment}>
                        <textarea id="redaccion" name="writing" placeholder="..." value={data.redaccion} style={{color: 'black', height: '150px', width: '300px', resize: 'none',backgroundColor: 'white'}} onChange={handleChange}/>
                        </div>
                    </form>
                </div>
                
            <div style={{ display: 'flex', gap: '10px' }}> {/* Contenedor de botones */}
                <button className={styles.greenButton} onClick={() =>  handlePost()} style={{ width: '120px' }} >Publicar</button>
                <button className={styles.deleteButton} onClick={() => { router.push('/responses') }} style={{ width: '120px' }} >Cancelar</button>
            </div>
        </div>
    </main>
  );
}
