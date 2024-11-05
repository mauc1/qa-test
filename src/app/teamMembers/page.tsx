'use client'
import styles from "../page.module.css";
import { BlueButton } from "../components/blueButton";
import PopUp from '../components/popUpDeleteProfessor';
import Image from "next/image";
import SortIcon from "../../../public/sort_icon.svg";
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, use } from 'react';
import { handlerLoad, handleDeleteController, reloadPageAfterOperation, handleDeleteConfirmation, handlerPassData } from "../../controller/profesorController";
import Profesor from '@/model/Profesor';
import { set } from "firebase/database";

const sortProfessorsByName = (professors: Profesor[], direction: boolean) => {
    if (direction) {
        return professors.sort((a, b) => {
            if (a.nombre.toLowerCase() < b.nombre.toLowerCase()) {
                return -1;
            }
            if (a.nombre > b.nombre) {
                return 1;
            }
            return 0;
        });
    } else {

        return professors.sort((a, b) => {
            if (a.nombre.toLowerCase() > b.nombre.toLowerCase()) {
                return -1;
            }
            if (a.nombre < b.nombre) {
                return 1;
            }
            return 0;
        });
    }
}

const sortProfessorsByLastName = (professors: Profesor[], direction: boolean) => {
    if (direction) {
        return professors.sort((a, b) => {
            if (a.apellidos.toLowerCase() < b.apellidos.toLowerCase()) {
                return -1;
            }
            if (a.apellidos > b.apellidos) {
                return 1;
            }
            return 0;
        });
    } else {

        return professors.sort((a, b) => {
            if (a.apellidos.toLowerCase() > b.apellidos.toLowerCase()) {
                return -1;
            }
            if (a.apellidos < b.apellidos) {
                return 1;
            }
            return 0;
        });
    }
}

const sortProfessorsByCode = (professors: Profesor[], direction: boolean) => {
    if (direction) {
        return professors.sort((a, b) => {
            if (a.codigo.toLowerCase() < b.codigo.toLowerCase()) {
                return -1;
            }
            if (a.codigo > b.codigo) {
                return 1;
            }
            return 0;
        });
    } else {

        return professors.sort((a, b) => {
            if (a.codigo.toLowerCase() > b.codigo.toLowerCase()) {
                return -1;
            }
            if (a.codigo < b.codigo) {
                return 1;
            }
            return 0;
        });
    }
}

export default function MainMenuPage() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [search, setSearch] = useState("");
    const router = useRouter();
    const [itemToDelete, setItemToDelete] = useState<Profesor | null>(null);
    const [data, setData] = useState<Profesor[]>([]);
    const [dataTemp, setDataTemp] = useState<Profesor[]>([]);

    const openDialog = () => {
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
    };

    const [sortNameDirection, setSortNameDirection] = useState(true);

    const handlerSortName = () => {
        const sortedData = sortProfessorsByName(data, sortNameDirection);
        setData(sortedData);
        setSortNameDirection(!sortNameDirection);
        setSortLastNameDirection(true);
        setSortCodeDirection(true);
    };

    const [sortLastNameDirection, setSortLastNameDirection] = useState(true);
    const handlerSortLastName = () => {
        const sortedData = sortProfessorsByLastName(data, sortLastNameDirection);
        setData(sortedData);
        setSortLastNameDirection(!sortLastNameDirection);
        setSortNameDirection(true);
        setSortCodeDirection(true);
    };

    const [sortCodeDirection, setSortCodeDirection] = useState(true);
    const handlerSortCode = () => {
        const sortedData = sortProfessorsByCode(data, sortCodeDirection);
        setData(sortedData);
        setSortCodeDirection(!sortCodeDirection);
        setSortNameDirection(true);
        setSortLastNameDirection(true);
    };




    let codigo = '';
    let rol = '';
    let nombre = '';
    let correo = '';
    if (typeof window !== 'undefined') {
        const storedData = localStorage.getItem("user");
        if (storedData) {
            const userData = JSON.parse(storedData);
            codigo = userData.codigo;
            rol = userData.rol;
            nombre = userData.nombre;
            correo = userData.correo;

            useEffect(() => {
                if (rol !== "Administradora") {
                    const buttonAdd = document.querySelector(`.${styles.addContainer}`) as HTMLDivElement;
                    if (buttonAdd) {
                        buttonAdd.style.display = 'none';
                    }
                }

            }, [userData]);

        } else {
            console.log("No data found in localStorage for key 'user'");
        }
    }



    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await handlerLoad();
                const filteredData = data.filter(item => item.estado === 'Activo');
                setData([...filteredData]);
                setDataTemp([...filteredData]);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);


    function handleEdit(index: number) {
        const item = data[index];
        console.log(item);
        if (codigo == item.codigo || rol == "Administradora") {
            handlerPassData(item);
            router.push('/professor_editor');
        };
        // Aquí puedes agregar el código para editar el item
    }

    function handleAdd() {
        if (rol == "Administradora") {
            router.push(`/addMember`)
        };
    }

    function handleDelete(index: number) {
        const item = data[index];
        if (rol == "Administradora") {
            setDialogOpen(true);
            setItemToDelete(item);
        };
    }

    function confirmDelete(mensaje: string) {
        setDialogOpen(false);
        if (itemToDelete) {
            handleDeleteController(itemToDelete.correo);
            handleDeleteConfirmation(mensaje, nombre, correo, itemToDelete.correo);
            reloadPageAfterOperation();
        } else {
            console.error("El valor a eliminar es null.");
        }
    }

    const handleSubmit = () => {
        const searchField = document.getElementById('searchField') as HTMLInputElement;
        if (searchField?.value == "") {
            setData(dataTemp);
        } else {
            const resultadosFiltrados = dataTemp.filter((profesor) =>
                profesor.nombre.toLowerCase().includes(searchField?.value.toLowerCase()) ||
                profesor.apellidos.toLowerCase().includes(searchField?.value.toLowerCase())
            );

            setData(resultadosFiltrados);
        }
    };
    return (
        <main className={styles.main} id="main">
            <PopUp
                title="Alerta"
                content="Justifique la eliminación"
                openDialog={openDialog}
                closeDialog={closeDialog}
                dialogOpen={dialogOpen}
                confirmDelete={confirmDelete}
            />
            <div className={styles.teamContainer}>
                <h1>Miembros equipo</h1>
                <p>Buscar profesor</p>
                <div className={styles.searchAddContainer}>
                    <input type="text"
                        onChange={(e) => { setSearch(e.target.value); handleSubmit() }}
                        id="searchField"
                    />
                    <BlueButton text="Buscar" onClick={() => { handleSubmit() }} type="button" />
                    <div className={styles.addContainer}>
                        <BlueButton text="Agregar Profesor" onClick={() => { handleAdd() }} type="button" />
                    </div>
                </div>
                <div className={styles.tableContainer}>
                    <table>
                        <tbody>
                            <tr>
                                <th className={styles.pasenZelda}>Nombre
                                    <button className={styles.sortButton} onClick={handlerSortName} >
                                        <Image src={SortIcon} alt="sort icon" className={styles.sortButtonIcon} />
                                    </button></th>
                                <th className={styles.pasenZelda}>Apellidos
                                    <button className={styles.sortButton} onClick={handlerSortLastName} >
                                        <Image src={SortIcon} alt="sort icon" className={styles.sortButtonIcon} />
                                    </button></th>
                                <th className={styles.pasenZelda}>Codigo
                                    <button className={styles.sortButton} onClick={handlerSortCode} >
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
                                        <td>{item.nombre}</td>
                                        <td>{item.apellidos}</td>
                                        <td>{item.codigo}</td>
                                        <td>
                                            <BlueButton text="Editar" onClick={() => handleEdit(index)} type='button' />
                                            <button className={styles.deleteButton} onClick={() => handleDelete(index)}>Eliminar</button>
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

