'use client'
import styles from "../page.module.css";
import { BlueButton } from "../components/blueButton";
import Image from "next/image";
import SortIcon from "../../../public/sort_icon.svg";
import { useState, useEffect, useRef } from "react";
import Profesor from "@/model/Profesor";
import { handlerLoadProfessorByYear } from "@/controller/profesorController";


interface ProfesorData {
    nombre: string;
    apellidos: string;
    codigo: string;
}


export default function addManagerPage() {
    const [professors, setProfessors] = useState<Profesor[]>([]); // Estado para almacenar los profesores
    const [data, setData] = useState<ProfesorData[]>([]); // Estado para almacenar los datos convertidos
    const buttonRefs = useRef<HTMLButtonElement[]>([]);
    const chosenProfessors = useRef<Profesor[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const professorData = await handlerLoadProfessorByYear(); // Espera a que se resuelva la promesa
                setProfessors(professorData); // Almacena los datos en el estado
            } catch (error) {
                console.error('Error al cargar los profesores:', error);
            }
        };

        fetchData(); // Llama a la función asincrónica para cargar los datos
    }, []);

    useEffect(() => {
        if (professors) {
            const convertedData = professors.map(professor => ({
                nombre: professor.nombre,
                apellidos: professor.apellidos,
                codigo: professor.codigo
            }));
            setData(convertedData); // Almacena los datos convertidos en el estado
        }
    }, [professors]);



    function handleAdding(index: number) {
        const item = data[index];
        console.log(`Adding item: ${item.nombre} ${item.apellidos} ${item.codigo}`);
        // Accede al botón correspondiente utilizando la referencia
        const button = buttonRefs.current[index];
        if (button) {
            // Modifica el botón como lo desees
            console.log(button.style.backgroundColor.toString());
            if (button.style.backgroundColor.toString() === 'rgb(31, 196, 26)') {
                button.style.backgroundColor = '#1A73E8';
                button.textContent = 'Seleccionar';
                chosenProfessors.current.splice(chosenProfessors.current.indexOf(professors[index]), 1);
            } else {
                button.style.backgroundColor = '#1fc41a';
                button.textContent = 'Seleccionado';
                chosenProfessors.current.push(professors[index]);
            }
            localStorage.setItem('chosenProfessors', JSON.stringify(chosenProfessors.current));
        }

        // Aquí puedes agregar el código para agregar el item
    }

    return (
        <main className={styles.main} id="main">
            <div className={styles.teamContainer}>
                <h1>Elegir responsable</h1>
                <p>Buscar profesor</p>
                <div className={styles.searchAddContainer}>
                    <input type="text" />
                    <BlueButton text="Buscar" onClick={() => { }} type="button" />
                </div>
                <div className={styles.tableContainer}>
                    <table>
                        <tbody>
                            <tr>
                                <th className={styles.pasenZelda}>Nombre
                                    <button className={styles.sortButton} onClick={() => { }} >
                                        <Image src={SortIcon} alt="sort icon" className={styles.sortButtonIcon} />
                                    </button></th>
                                <th className={styles.pasenZelda}>Apellidos
                                    <button className={styles.sortButton} onClick={() => { }} >
                                        <Image src={SortIcon} alt="sort icon" className={styles.sortButtonIcon} />
                                    </button></th>
                                <th className={styles.pasenZelda}>Codigo
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
                                {data.length > 0 && data.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.nombre}</td>
                                        <td>{item.apellidos}</td>
                                        <td>{item.codigo}</td>
                                        <td>
                                            <button
                                                className={styles.blueButton}
                                                ref={button => { buttonRefs.current[index] = button!; }}
                                                onClick={() => handleAdding(index)}
                                                type="button"
                                            >
                                                Seleccionar
                                            </button>
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

