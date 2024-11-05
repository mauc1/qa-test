'use client'
import styles from "../page.module.css";
import Image from "next/image";
import PopUp from '../components/popUpDelete';
import CSVPopUp from '../components/popUpCSV';
import { BlueButton } from "../components/blueButton";
import DownloadIcon from "../../../public/download_icon.svg";
import SortIcon from "../../../public/sort_icon.svg";
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { handlerLoad, handleDeleteController, reloadPageAfterOperation, handlerPassData, createCSV } from "../../controller/studentsController";
import Estudiante from "../../model/Estudiante";


export default function ViewStudents() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogOpenCSV, setDialogOpenCSV] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<Estudiante | null>(null);
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [data, setData] = useState<Estudiante[]>([]);
    const [dataTemp, setDataTemp] = useState<Estudiante[]>([]);

    let sede = '';
    let rol = '';
    if (typeof window !== 'undefined') {
        const storedData = localStorage.getItem("user");
        if (storedData) {
            const userData = JSON.parse(storedData);
            sede = userData.centroAcademico;
            rol = userData.rol;
        } else {
            console.log("No data found in localStorage for key 'user'");
        }
    }

    const openDialog = () => {
        console.log("Abriedo dialogo");
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
    };

    const openDialogCSV = () => {
        if (rol == "Profesor" || rol == "Coordinador") {
            setDialogOpenCSV(true);
        };

    };
    const closeDialogCSV = () => {
        setDialogOpenCSV(false);
    };


    function handleEdit(index: number) {
        const item = data[index];
        if (sede == item.sede || rol == "Administradora") {
            handlerPassData(item);
            console.log(`Editing item: ${item.carne} ${item.nombre}`);
            router.push(`/edit_student`);
        };
        // Aquí puedes agregar el código para editar el item
    }

    function handleDownload(tipo: string) {
        createCSV(data, tipo, sede);
    }

    function handleDelete(index: number) {
        const item = data[index];
        if (rol == "Administradora") {
            setDialogOpen(true);
            setItemToDelete(item);
        };
    }

    function confirmDelete() {
        setDialogOpen(false);
        if (itemToDelete) {
            handleDeleteController(itemToDelete.carne);
            reloadPageAfterOperation();
        } else {
            console.error("El valor a eliminar es null.");
        }
    }

    const handleSubmit = () => {
        if (search.toLowerCase() == "") {
            setData(dataTemp);
        } else {
            const resultadosFiltrados = data.filter((estudiante) =>
                estudiante.nombre.toLowerCase().includes(search.toLowerCase())
            );
            setData(resultadosFiltrados);
        }
    };

    const handleAddStudents = () => {
        if (rol == "Administradora") {
            router.push('/add_students');
        };
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await handlerLoad();
                setData([...data]);
                setDataTemp([...data]);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();

        if (rol !== "Administradora") {
            const addButton = document.getElementById("add_students_button");
            if (addButton) {
                addButton.style.display = "none";
            }
        }



    }, []);

    useEffect(() => {
        if(typeof window !== 'undefined'){
        
            const addItineraryButton = document.getElementById('csvButton') as HTMLButtonElement;
            
            const storedData = localStorage.getItem("user");
            if(storedData){
                const userData = JSON.parse(storedData);
                if(userData.rol !== "Administradora"){
                    addItineraryButton.style.display = "flex";
                }
                else{
                    addItineraryButton.style.display = "none";
                }
            }
        }
    });

    return (
        <main className={styles.main} id="main">
            <div>
                {dialogOpenCSV && (
                    <CSVPopUp
                        openDialog={openDialogCSV}
                        closeDialog={closeDialogCSV}
                        dialogOpen={dialogOpenCSV}
                        confirmType={handleDownload}
                    />
                )}
                {dialogOpen && (
                    <PopUp
                        title="Alerta"
                        content="¿Seguro de eliminar al estudiante?"
                        openDialog={openDialog}
                        closeDialog={closeDialog}
                        dialogOpen={dialogOpen}
                        confirmDelete={confirmDelete}
                    />
                )}
            </div>
            <div className={styles.teamContainer}>
                <h1>Estudiantes</h1>
                <p>Buscar estudiante</p>
                <div className={styles.searchAddContainer}>
                    <input type="search"
                        onChange={(e) => setSearch(e.target.value)} />
                    <BlueButton text="Buscar" type="button" onClick={() => { handleSubmit() }} />
                    <div className={styles.csvAddStudentContainer}>
                        <button id="csvButton" className={styles.downButton} onClick={() => { openDialogCSV() }}>
                            <Image src={DownloadIcon} alt="csv Icon" />
                            {"CSV"}
                        </button>
                        <button id="add_students_button" className={styles.blueButton} onClick={() => { handleAddStudents() }}>
                            Agregar Estudiantes
                        </button>
                    </div>
                </div>
                <div className={styles.tableContainer}>
                    <table>
                        <tbody>
                            <tr>
                                <th className={styles.pasenZelda}>Nombre
                                    <button className={styles.sortButton} onClick={() => { }} >
                                        <Image src={SortIcon} alt="sort icon" className={styles.sortButtonIcon} />
                                    </button>
                                </th>
                                <th className={styles.pasenZelda}>Carné
                                    <button className={styles.sortButton} onClick={() => { }} >
                                        <Image src={SortIcon} alt="sort icon" className={styles.sortButtonIcon} />
                                    </button>
                                </th>
                                <th className={styles.pasenZelda}>Sede
                                    <button className={styles.sortButton} onClick={() => { }} >
                                        <Image src={SortIcon} alt="sort icon" className={styles.sortButtonIcon} />
                                    </button>
                                </th>
                                <th className={styles.pasenZelda}>Acciones</th>
                            </tr>

                        </tbody>
                    </table>
                    <div className={styles.tableContentContainer}>
                        <table>
                            <tbody>
                                {data.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.nombre}</td>
                                        <td>{item.carne}</td>
                                        <td>{item.sede}</td>
                                        <td>
                                            <BlueButton text="Editar" type="button" onClick={() => { handleEdit(index) }} />
                                            <button className={styles.deleteButton} onClick={() => { handleDelete(index) }}>Eliminar</button>
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