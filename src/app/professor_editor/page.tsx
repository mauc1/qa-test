'use client';
import styles from '../page.module.css';
import Link from 'next/link';
import { BlueButton } from '../components/blueButton';
import Image from 'next/image';
import Profile from '../../../public/Profile.png';
import PopUp from '../components/popUpInformation';
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { handleActionLog, handlerDeleteFile, handlerLoad, handlerOneLoad, VerifyPassword, VerifyEmail, handlerUploadFile, handlerUpdateController } from "../../controller/profesorController";
import Profesor from '@/model/Profesor';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { profile } from 'console';

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

export default function ProfessorEditor() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [currentTitle, setcurrentTitle] = useState("");
    const [currentMessage, setcurrentMessage] = useState("");
    const [dataProfessors, setDataProfessors] = useState<Profesor[]>([]);
    const [currentImageUrl, setCurrentImageUrl] = useState("");
    const [originalFileName, setoriginalFileName] = useState("");

    const router = useRouter();
    const [loadData, setloadData] = useState<Profesor[]>([]);
    const [data, setData] = useState({
        name: '',
        lastName: '',
        telephone: '',
        email: '',
        cellphone: '',
        opciones: '',
        password: '',
        fotoPerfil: '',
        passwordConfirm: '',
        rol: '',
    });
    const openDialog = () => {
        console.log("Abriedo dialogo");
        setDialogOpen(true);
    };

    const closeDialog = () => {
        console.log("Cerrando dialogo");
        setDialogOpen(false);
    };
    let correo = '';
    useEffect(() => {
        
        console.log(window)
        if (typeof window !== 'undefined') {
            const storedData = localStorage.getItem("profesor");
            if (storedData) {
                console.log(storedData);
                const professorData = JSON.parse(storedData);
                correo = professorData.correo;
            } else {
                console.log("No data found in localStorage for key 'professor'");
            }
        }
    }, []);

    let rol = '';
    let sede = '';
    let nombre = '';
    let correo_usuario = '';

    if (typeof window !== 'undefined') {
        const storedUserData = localStorage.getItem("user");
        if (storedUserData) {
            const userData = JSON.parse(storedUserData);
            rol = userData.rol;
            sede = userData.centroAcademico;
            nombre = userData.nombre;
            correo_usuario = userData.correo;
        } else {
            console.log("No data found in localStorage for key 'user'");
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const loadData = await handlerOneLoad(correo);
                setloadData([...loadData]);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dataProfessors = await handlerLoad();
                setDataProfessors([...dataProfessors]);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (loadData.length > 0) {
            setData({
                name: loadData[0].nombre,
                lastName: loadData[0].apellidos,
                telephone: loadData[0].telefono,
                email: loadData[0].correo,
                cellphone: loadData[0].celular,
                opciones: loadData[0].centroAcademico,
                password: loadData[0].contraseña,
                fotoPerfil: loadData[0].fotoPerfil,
                passwordConfirm: loadData[0].contraseña,
                rol: loadData[0].rol,
            });
            setoriginalFileName(loadData[0].fotoPerfil);
            handleLoadProfile(loadData[0].fotoPerfil);
        }
    }, [loadData]);

    const handleLoadProfile = (imageUrl: string) => {
        const storage = getStorage();
        const starsRef = ref(storage, 'gs://teamtec-727df.appspot.com/profile/' + imageUrl);
        getDownloadURL(starsRef)
            .then((url) => {
                console.log(url);
                setCurrentImageUrl(url);
            })
            .catch((error) => {
                console.error("Error downloading image:", error);
            });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({
            ...data,
            [e.target.id]: e.target.value
        });
    };

    const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setData({
            ...data,
            [e.target.id]: e.target.value
        });
    };

    const handleChangeSelectRol = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (rol == "Administradora" && sede == "Cartago") {
            setData({
                ...data,
                [e.target.id]: e.target.value
            });
        };
    };

    const handlerfileName = (name: string) => {
        setData({
            ...data,
            fotoPerfil: name
        });
    }

    const handlerFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            const fileName = selectedFile.name;
            const fileExtension = fileName.split('.').pop()?.toLowerCase();
            if (!fileExtension || (fileExtension !== 'pdf' && fileExtension !== 'png' && fileExtension !== 'jpg' && fileExtension !== 'jpeg')) {
                alert("El archivo seleccionado no es válido");
                return;
            }
            if (data.fotoPerfil != originalFileName) {
                handlerDeleteFile(data.fotoPerfil);
            }
            const newName = generateUniqueFileName(fileName);
            handlerfileName(newName);
            setFile(selectedFile);
            handlerUploadFile(selectedFile, newName)
                .then(resulta => {
                    console.log(resulta);
                    if (resulta) {
                        handleLoadProfile(newName);
                    } else {
                    }
                })
                .catch(error => {
                    console.log("Error cargando la imagen");
                });
        }
    };

    const handleEdit = async () => {
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                if (data[key as keyof typeof data] === '') {
                    console.log(`${key} está vacío.`);
                    setcurrentTitle(`Hay datos vacíos.`);
                    setcurrentMessage("Se necesita agregar toda la información");
                    openDialog();
                    return;
                }
            }
        }
        if (await VerifyPassword(data)) {
            if (await VerifyEmail(data, dataProfessors) || data.email == loadData[0].correo) {
                if (data.fotoPerfil != originalFileName) {
                    handlerDeleteFile(originalFileName);
                }
                //if (file !== null) {
                //    handlerUploadFile(file, data.fotoPerfil);
                //}
                handlerUpdateController(loadData[0].correo, data, loadData[0].codigo, loadData[0].estado);
                handleActionLog(nombre, correo_usuario, data.email, "Edit");
                router.push(`/teamMembers`);
            }
            else {
                setcurrentTitle("Correo duplicado");
                setcurrentMessage("El correo ingresado ya se encuentra registrado, por favor ingresar otro.");
                openDialog();
            }
        } else {
            setcurrentTitle("Contraseña erronea");
            setcurrentMessage("Las contraseñas no concuerdan");
            openDialog();
        }
    };

    const handleCancele = () => {
        if (data.fotoPerfil != originalFileName) {
            handlerDeleteFile(data.fotoPerfil);
        }
        router.push(`/teamMembers`)
    };



    return (
        <main className={styles.main} id="main">
            <PopUp
                title={currentTitle}
                content={currentMessage}
                openDialog={openDialog}
                closeDialog={closeDialog}
                dialogOpen={dialogOpen}
            />
            <div className={styles.professorRegisterContainer}>
                <h1>Editar Profesor</h1>
                <div className={styles.professorScreenDivider}>
                    <div className={styles.formRegisterProfessors}>
                        <form className={styles.formContainerRegisterProfessors}>
                            <div className={styles.formGroupProfessorRegister}>
                                <label htmlFor="name">Nombre</label>
                                <input type="name" id="name" name="name" required placeholder="..." value={data.name} onChange={handleChange} />
                            </div>
                            <div className={styles.formGroupProfessorRegister}>
                                <label htmlFor="lastName">Apellidos</label>
                                <input type="text" id="lastName" name="lastName" required placeholder="..." value={data.lastName} onChange={handleChange} />
                            </div>

                            <div className={styles.formGroupProfessorRegister}>
                                <label htmlFor="telephone">Número de teléfono</label>
                                <input type="tel" id="telephone" name="telephone" placeholder="..." value={data.telephone} onChange={handleChange} />
                            </div>
                            <div className={styles.formGroupProfessorRegister}>
                                <label htmlFor="email">Correo</label>
                                <input type="email" id="email" name="email" required placeholder="..." value={data.email} onChange={handleChange} />
                            </div>

                            <div className={styles.formGroupProfessorRegister}>
                                <label htmlFor="cellphone">Número celular</label>
                                <input type="tel" id="cellphone" name="cellphone" required placeholder="..." value={data.cellphone} onChange={handleChange} />
                            </div>
                            <div className={styles.formGroupProfessorRegister}>
                                <label htmlFor="opciones">Centro académico</label>
                                <select id="opciones" name="opciones" value={data.opciones} onChange={handleChangeSelect}>
                                    <option value="San José">San José</option>
                                    <option value="Cartago">Cartago</option>
                                    <option value="Alajuela">Alajuela</option>
                                    <option value="San Carlos">San Carlos</option>
                                    <option value="Limón">Limón</option>
                                </select>
                            </div>
                            <div className={styles.formGroupProfessorRegister}>
                                <label htmlFor="password">Contraseña</label>
                                <input type="password" id="password" name="password" required placeholder="..." value={data.password} onChange={handleChange} />
                            </div>

                            <div className={styles.formGroupProfessorRegister}>
                                <label htmlFor="passwordConfirm">Confirmación de contraseña</label>
                                <input type="password" id="passwordConfirm" name="passwordConfirm" required placeholder="..." value={data.passwordConfirm} onChange={handleChange} />
                            </div>
                            <div className={styles.formGroupProfessorRegister}>
                                <label htmlFor="rol">Rol</label>
                                <select id="rol" name="rol" value={data.rol} onChange={handleChangeSelectRol}>
                                    <option value="Profesor">Profesor</option>
                                    <option value="Administradora">Administradora</option>
                                    <option value="Coordinador">Coordinador</option>
                                </select>
                            </div>
                            <span>
                                ❌ Ocho caracteres <br />
                                ❌ Una letra mayúscula <br />
                                ❌ Un minúscula <br />
                                ❌ Un símbolo
                            </span>


                        </form>


                    </div>
                    <div className={styles.dividerLine}>
                        <span></span>
                    </div>

                    <div className={styles.photoProfessorContainer}>

                        <Image src={currentImageUrl} alt="Profile" width={500} height={500} />
                        <label htmlFor="photo">Subir foto de perfil</label>
                        <input type="file" id="photo" name="photo" accept="image/*" hidden onChange={handlerFile} />


                    </div>

                </div>

                <div className={styles.buttonEditContainer}>
                    <BlueButton text="Guardar" onClick={() => { handleEdit() }} type='button' />
                    <button className={styles.buttonCancel} onClick={() => { handleCancele() }}>Cancelar</button>
                </div>
            </div>
        </main>
    );
}