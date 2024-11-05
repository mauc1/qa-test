'use client'
import styles from '../page.module.css';
import { useEffect } from "react";
import { BlueButton } from './blueButton';
import { useState } from 'react';

interface PopUpInformationProps {
    title: string;
    content: string;
    openDialog: () => void;
    closeDialog: () => void;
    dialogOpen: boolean; // Agregamos dialogOpen como prop
  }

export default function PopUpInformation(PopUpInformationProps: PopUpInformationProps) {
    const { title, content, openDialog, closeDialog, dialogOpen } = PopUpInformationProps;

 
    useEffect(() => {
        if (dialogOpen) {

            const dialog = document.getElementById('dialogPopUpInfo') as HTMLDialogElement | null;

            if (dialog) {
                dialog.classList.add(styles.show);
                console.log("Hola mundo");
                dialog.showModal();
            }

            const main = document.getElementById('main') as HTMLDivElement | null;
            if (main) {
                main.style.filter = 'blur(4px)';
            }
        } else {
            const dialog = document.getElementById('dialogPopUpInfo') as HTMLDialogElement | null;
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
    


    
    
    return (
        <dialog id={'dialogPopUpInfo'}  className={styles.dialogPopUpInfo} >
            <h2>{title}</h2>
            <p>{content}</p>
            <BlueButton text="Aceptar" onClick={closeDialog} type='button'/>
        </dialog>
    );
}