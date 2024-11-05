'use client'
import styles from "../page.module.css";
import Image from "next/image";
import MainLogo from "../../../public/mainLogo.svg";
import { BlueButton } from "../components/blueButton";
import Actividad from "@/model/Actividad";
import { useRouter } from "next/navigation";
import { handlerNextActivity } from "@/controller/actividadController";
import { use, useEffect, useState } from "react";
import { TipoActividad } from "@/model/TipoActividad";
import Profesor from "@/model/Profesor";
import Comentario from "@/model/Comentario";
import Prueba from "@/model/Prueba";
import ChangePassword from "@/app/components/recoverPassword";
import PopUpInformation from "../components/popUpInformation";
import { handlerChangePassword } from "@/controller/profesorController";

export default function MainMenuPage() {
    useEffect(() => {
        const fetchData = async () => {
            const data = await handlerNextActivity();
            console.log(data);
            var nombreActividad = data?.nombre;
            var estadoActividad = data?.estado;
            var tipoActividad = data?.tipo;
            var modalidadActividad = data?.modalidad;
            var semanaActividad = data?.semanaRealizacion;
            var fechaActividad = data?.fecha;

            var nombreActividadElement = document.getElementById("nombreActividad");
            if (nombreActividadElement) {
                nombreActividadElement.innerText = nombreActividad + "";
            }

            var estadoActividadElement = document.getElementById("estadoActividad");
            if (estadoActividadElement) {
                estadoActividadElement.innerText = estadoActividad + "";
            }

            var tipoActividadElement = document.getElementById("tipoActividad");
            if (tipoActividadElement) {
                tipoActividadElement.innerText = tipoActividad + "";
            }

            var modalidadActividadElement = document.getElementById("modalidadActividad");
            if (modalidadActividadElement) {
                modalidadActividadElement.innerText = modalidadActividad + "";
            }

            var semanaActividadElement = document.getElementById("semanaActividad");
            if (semanaActividadElement) {

                semanaActividadElement.innerText = semanaActividad + "";
            }

            var fechaActividadElement = document.getElementById("fechaActividad");
            if (fechaActividadElement) {
                const date = new Date(fechaActividad + "");
                fechaActividadElement.innerText = date.toLocaleDateString();
            }
        };
        fetchData();
    }, []);

    let rol = '';
    if (typeof window !== 'undefined') {
        const storedData = localStorage.getItem("user");
        if (storedData) {
            const userData = JSON.parse(storedData);
            rol = userData.rol;
        } else {
            console.log("No data found in localStorage for key 'user'");
        }
    }


    const handleProfessorRegister = () => {
        if (rol == "Administradora") {
            router.push('/professor_register')
        };
    };


    const router = useRouter();
    const [dialogOpen, setDialogOpen] = useState(false);
    const openDialog = () => {
        console.log("Abriendo dialogo");
        setDialogOpen(true);
    };
    const closeDialog = () => {
        console.log("Cerrando dialogo");
        setDialogOpen(false);
    }
    useEffect(() => {
        try {
            const isChangePassword = localStorage.getItem("changePasswordNeeded");
            if (isChangePassword === "true") {
                openDialog();
                localStorage.setItem("changePasswordNeeded", "false");
            }
        } catch (error) {
            console.log(error);
        }
    });



    const [title, setTitle] = useState("Información");
    const [content, setContent] = useState("Contraseña cambiada exitosamente.");
    const [dialogInfo, setDialogInfo] = useState(false);
    const [password, setPassword] = useState("");
    const openDialogInfo = () => {
        console.log("Abriendo dialogo");
        setDialogInfo(true);
    };
    const closeDialogInfo = () => {
        console.log("Cerrando dialogo");
        setDialogInfo(false);
    }

    const changePasswordHandler = async (password: string) => {
        if (typeof window !== 'undefined') {
            const storedData = localStorage.getItem("user");
            if (storedData) {
                const userData = JSON.parse(storedData);

                const result = await handlerChangePassword(userData.id, password);
                if (result) {
                    closeDialog();
                    openDialogInfo();
                } else {
                    console.log(result);
                    setTitle("Datos Inválidos");
                    setContent("Las contraseñas no coinciden.");
                    openDialogInfo();
                }
            }
        }
    }



    useEffect(() => {
        if(typeof window !== 'undefined'){
        
            const divBotones = document.getElementById('divBotones') as HTMLDivElement;
            const children = divBotones.children;
    
            const storedData = localStorage.getItem("user");
            if(storedData){
                const userData = JSON.parse(storedData);
                if(userData.rol !== "Administradora"){
                    if(children){
                        const btnAddProfessor = children.item(3) as HTMLButtonElement;
                        btnAddProfessor.style.display = "none";
                    }
                }
            }
            
        }
    });

    return (
        <main className={styles.main} id="main">
            <PopUpInformation
                title={title}
                content={content}
                openDialog={openDialogInfo}
                closeDialog={closeDialogInfo}
                dialogOpen={dialogInfo}
            />

            <ChangePassword
                title="Cambio de contraseña"
                content="Ingrese su nueva contraseña."
                openDialog={openDialog}
                closeDialog={closeDialog}
                dialogOpen={dialogOpen}
                confirmChangePassword={
                    (password: string) => {
                        changePasswordHandler(password);
                    }
                }

            />
            <div className={styles.mainMenuContainer}>
                <div className={styles.divisionContainer}>
                    <h1>Menú Principal</h1>
                    <div className={styles.flexContainer}>
                        <Image src={MainLogo} alt="Main Logo" />
                        <div className={styles.flexFlexContainer} id="divBotones">
                            <BlueButton text="Mostrar equipo" onClick={() => { router.push('/teamMembers') }} type="button" />
                            <BlueButton text="Mostrar estudiantes" onClick={() => { router.push('/viewStudents') }} type="button" />
                            <BlueButton text="Itinerario" onClick={() => { router.push('/itineraries') }} type="button" />
                            <BlueButton text="Registrar profesor" onClick={() => { router.push('/professor_register') }} type="button" />
                        </div>

                    </div>
                </div>
                <div className={styles.verticalLine}></div>
                <div className={styles.divisionContainer}>
                    <h1>Próxima Actividad</h1>
                    <table>
                        <tbody>
                            <tr>
                                <td>Nombre</td>
                                <td id="nombreActividad"></td>
                            </tr>
                            <tr>
                                <td>Estado</td>
                                <td id="estadoActividad"></td>
                            </tr>
                            <tr>
                                <td>Tipo</td>
                                <td id="tipoActividad"></td>
                            </tr>
                            <tr>
                                <td>Modalidad</td>
                                <td id="modalidadActividad"></td>
                            </tr>
                            <tr>
                                <td>Semana</td>
                                <td id="semanaActividad"></td>
                            </tr>
                            <tr>
                                <td>Fecha</td>
                                <td id="fechaActividad"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}

