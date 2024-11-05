'use client';
import styles from '../page.module.css';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { handlerOneLoad, handlerUpdateController } from "../../controller/studentsController";
import Estudiante from "../../model/Estudiante";

export default function StudentEdit() {
    const router = useRouter();
    const [loadData, setloadData] = useState<Estudiante[]>([]);
    const [data, setData] = useState({
        carne: '',
        nombre: '',
        primerApellido: '',
        segundoApellido: '',
        correo: '',
        celular: ''
    });
    let carne = '';
    if (typeof window !== 'undefined') {
        const storedData = localStorage.getItem("student");
        if (storedData) {
            const studentData = JSON.parse(storedData);
            carne = studentData.carne;
        } else {
            console.log("No data found in localStorage for key 'student'");
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const loadData = await handlerOneLoad(carne);
                setloadData([...loadData]);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (loadData.length > 0) {
            setData({
                carne: loadData[0].carne,
                nombre: loadData[0].nombre,
                primerApellido: loadData[0].primerApellido,
                segundoApellido: loadData[0].segundoApellido,
                correo: loadData[0].correo,
                celular: loadData[0].celular
            });
        }
    }, [loadData]);




    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({
            ...data,
            [e.target.id]: e.target.value
        });
    };

    function handleEdit() {
        const student: Estudiante = new Estudiante(
            data.carne,
            data.nombre,
            data.primerApellido,
            data.segundoApellido,
            data.correo,
            data.celular,
            loadData[0].sede
        );
        handlerUpdateController(loadData[0].carne, student);
        router.push('/viewStudents');
        // Aquí puedes agregar el código para editar el item
    }



    return (
        <main className={styles.main} id="main">
            <div className={styles.studentEditContainer}>
                <h1>Editar Estudiante</h1>
                <div className={styles.formstudentEdit}>
                    <form className={styles.formContainerstudentEdit}>

                        <div className={styles.formGroupStudentEdit}>
                            <label htmlFor="carne">Carne</label>
                            <input type="text" id="carne" name="carne" required placeholder="..." value={data.carne} onChange={handleChange} />
                        </div>

                        <div className={styles.formGroupStudentEdit}>
                            <label htmlFor="name">Nombre</label>
                            <input type="text" id="nombre" name="name" placeholder="..." value={data.nombre} onChange={handleChange} />
                        </div>
                        <div className={styles.formGroupStudentEdit}>
                            <label htmlFor="lastName1">Primer Apelldio</label>
                            <input type="text" id="primerApellido" name="lastName1" required placeholder="..." value={data.primerApellido} onChange={handleChange} />
                        </div>
                        <div className={styles.formGroupStudentEdit}>
                            <label htmlFor="lastName2">Segundo Apellido</label>
                            <input type="text" id="segundoApellido" name="lastName2" required placeholder="..." value={data.segundoApellido} onChange={handleChange} />
                        </div>
                        <div className={styles.formGroupStudentEdit}>
                            <label htmlFor="email">Correo</label>
                            <input type="text" id="correo" name="email" placeholder="..." value={data.correo} onChange={handleChange} />
                        </div>
                        <div className={styles.formGroupStudentEdit}>
                            <label htmlFor="cellphone">Número celular</label>
                            <input type="tel" id="celular" name="cellphone" required placeholder="..." value={data.celular} onChange={handleChange} />
                        </div>
                    </form>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}> {/* Contenedor de botones */}
                    <button className={styles.greenButton} onClick={() => handleEdit()} style={{ width: '120px' }} >Guardar</button>
                    <button className={styles.deleteButton} onClick={() => { router.push('/viewStudents'); }} style={{ width: '120px' }} >Cancelar</button>
                </div>
            </div>
        </main>
    );
}