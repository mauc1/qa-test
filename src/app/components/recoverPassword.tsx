'use client'
import styles from '../page.module.css';
import { useEffect } from "react";
import { BlueButton } from './blueButton';

interface PopUpInformationProps {
    title: string;
    content: string;
    openDialog: () => void;
    closeDialog: () => void;
    confirmChangePassword: (password: string) => void;
    dialogOpen: boolean; // Agregamos dialogOpen como prop
}





export default function PopUpResetPassword(PopUpInformationProps: PopUpInformationProps) {
    const { title, content, openDialog, closeDialog, dialogOpen, confirmChangePassword } = PopUpInformationProps;


    useEffect(() => {
        if (dialogOpen) {

            const dialog = document.getElementById('dialogResetPassword') as HTMLDialogElement | null;

            if (dialog) {
                dialog.classList.add(styles.show);
                dialog.showModal();
            }

        } else {
            const dialog = document.getElementById('dialogResetPassword') as HTMLDialogElement | null;
            if (dialog) {
                dialog.classList.remove(styles.show);
                console.log("Hola mundo");
                dialog.close();
            }
            const main = document.getElementById('main') as HTMLDivElement | null;
            if (main) {
                main.style.filter = 'blur(0px)';
            }
        }
    }, [dialogOpen]);

    useEffect(() => {
        const form = document.querySelector('form');
        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const password = (document.getElementById('password') as HTMLInputElement);
            const confirm = (document.getElementById('confirm') as HTMLInputElement);
            const error = document.getElementById('error') as HTMLParagraphElement;
            

            if (password.value === confirm.value) {
                error.style.display = 'none';
                confirmChangePassword(password.value);
            } else {
                
                error.style.display = 'block';

            }
            
        });
    });





    return (
        <dialog id={'dialogResetPassword'} className={styles.dialogResetPassword} >
            <h2>{title}</h2>
            <p>{content}</p>
            <form className={styles.formContainer}>
                <div className={styles.formGroup}>
                    <label htmlFor="password">Nueva contraseña</label>
                    <input type="password" id="password" name="password" required placeholder="..." />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="confirm">Confirmar Contraseña</label>
                    <input type="password" id="confirm" name="confirm" required placeholder="..." />
                    <p id='error' className={styles.error}>Las contraseñas no coinciden</p>
                </div>

                <BlueButton text="Cambiar contraseña" onClick={() => { }} type="submit" />
            </form>
        </dialog>
    );
}