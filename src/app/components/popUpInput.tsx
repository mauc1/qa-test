'use client'
import styles from '../page.module.css';
import { useEffect } from "react";
import { BlueButton } from './blueButton';
import { useState } from 'react';

interface PopUpInputProps {
    title: string;
    content: string;
    input: string;
    openDialog: () => void;
    closeDialog: () => void;
    dialogOpen: boolean; // Agregamos dialogOpen como prop
  }

export default function PopUpInput(PopUpInputProps: PopUpInputProps) {
    const { title, content, input, openDialog, closeDialog, dialogOpen } = PopUpInputProps;

 
    useEffect(() => {
        if (dialogOpen) {

            const dialog = document.getElementById('dialogPopUpInfo') as HTMLDialogElement | null;

            if (dialog) {
                dialog.classList.add(styles.show);
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
            <input type="text" />
            <BlueButton text="Guardar" onClick={closeDialog} type='button'/>
        </dialog>
    );
}