'use client'
import styles from "../page.module.css";
import Image from "next/image";
import Link from "next/link";
import UserLogo from "../../../public/password_recovry.svg";
import { BlueButton } from "../components/blueButton";
import PopUp from "../components/popUpInformation";
import { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import React from "react";

export default function PasswordRecoveryPage() {
    const [subject, setSubject] = useState('');

    const sendMail = async (e: any) => {
        e.preventDefault();
        const response = await fetch('/api/sendEmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                subject: subject
            })
        });

        console.log(await response);
        if(window !== undefined){
            localStorage.setItem("changePasswordNeeded", "true");
        }
    }
    const router = useRouter();
    const [dialogOpen, setDialogOpen] = useState(false);

    const defaultMessage = {
        title: "Correo enviado",
        content: "Se ha enviado una contraseña a su correo"
    };

    const [title, setTitle] = useState(defaultMessage.title);
    const [content, setContent] = useState(defaultMessage.content);

    const openDialog = () => {
        console.log("Abriendo dialogo");
        setDialogOpen(true);
    };

    const closeDialog = () => {
        console.log("Cerrando dialogo");
        setDialogOpen(false);
    };
    
    return (

        <main className={styles.main} id="main">
            <PopUp 
                title={title} 
                content={content} 
                openDialog={openDialog}
                closeDialog={closeDialog}
                dialogOpen={dialogOpen}
            />
            <div className={styles.loginContainer}>
                <Image src={UserLogo} alt="User Logo" />
                <h1>Recuperar Contraseña</h1>
                <form onSubmit={sendMail} className={styles.formContainer}>
                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" required placeholder="..." value={subject} onChange={(e)=>setSubject(e.target.value)}/>
                    </div>
                    
                    <div className={styles.recoveryButtons}>
                        <BlueButton text="Enviar Correo" onClick={()=>{}} type="submit" />
                        <BlueButton text="Ir a LOGIN" onClick={()=>(router.push('/login'))} type="button" />
                    </div>
                    
                </form>
            </div>
        </main>
    );
}