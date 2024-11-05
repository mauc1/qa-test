'use client'
import styles from "../page.module.css";
import { GreenButton } from "../components/greenButton";
import { BlueButton } from "../components/blueButton";
import Image from "next/image";
import SortIcon from "../../../public/sort_icon.svg";
import React, { useState, useEffect } from 'react';
import { handlerLoad, reloadPageAfterOperation, handleAddMemberController} from "../../controller/profesorController";
import Profesor from '@/model/Profesor';

const sortProfessorsByName = (professors: Profesor[], direction : boolean) => {
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
    }else{
    
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

const sortProfessorsByLastName = (professors: Profesor[], direction : boolean) => {
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
    }else{
    
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

const sortProfessorsByCode = (professors: Profesor[], direction : boolean) => {
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
    }else{
    
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
    const [search, setSearch] = useState("");
    const [data, setData] = useState<Profesor[]>([]);
    const [dataTemp, setDataTemp] = useState<Profesor[]>([]);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await handlerLoad();
                const filteredData = data.filter(item => item.estado === 'Inhabilitado');
                setData([...filteredData]);
                setDataTemp([...filteredData]);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    function handleAdding(index: number) {
        const item = data[index];
        handleAddMemberController(item.correo);
        reloadPageAfterOperation();
    }

    const handleSubmit = () => {
        if (search.toLowerCase() == "") {
            setData(dataTemp);
        }else {
            const resultadosFiltrados = data.filter((profesor) =>
            profesor.nombre.toLowerCase().includes(search.toLowerCase())
            );
            setData(resultadosFiltrados);
      }
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

    return (
        <main className={styles.main} id="main">
            <div className={styles.teamContainer}>
                <h1>Agregar miembro</h1>
                <p>Buscar profesor</p>
                <div className={styles.searchAddContainer}>
                    <input type="text" 
                    onChange={(e) => setSearch(e.target.value)} />
                    <BlueButton text="Buscar" type="button" onClick={() => {handleSubmit()}} />
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
                                            <GreenButton text="Agregar" onClick={() => handleAdding(index)} />
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

