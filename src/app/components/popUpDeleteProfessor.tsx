'use client'
import styles from '../page.module.css';
import { useEffect,useState } from "react";

interface PopUpInformationProps {
    title: string;
    content: string;
    openDialog: () => void;
    closeDialog: () => void;
    confirmDelete: (mensaje:string) => void;
    dialogOpen: boolean; // Agregamos dialogOpen como prop
  }





export default function PopUpInformation(PopUpInformationProps: PopUpInformationProps) {
    const { title, content, openDialog, closeDialog, dialogOpen, confirmDelete } = PopUpInformationProps;
    const [selectedValue, setSelectedValue] = useState("");

 
    useEffect(() => {
        if (dialogOpen) {

            const dialog = document.getElementById('dialogPopUpInfo') as HTMLDialogElement | null;

            if (dialog) {
                dialog.classList.add(styles.show);
                dialog.showModal();
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
        <dialog id={'dialogPopUpInfo'}  className={styles.dialogPopUpInfoDelete} >
            <h2>{title}</h2>
            <p>{content}</p>
            <textarea id="redaccion" name="writing" placeholder="..." value={selectedValue} style={{ height: '150px', width: '300px', resize: 'none'}} onChange={(e) => setSelectedValue(e.target.value)}/>
            <div>
                <button className={styles.deleteButton} onClick={()=>confirmDelete(selectedValue)} style={{ width: '100px', height: '40px', marginRight: '10px' }} >Eliminar</button>
                <button className={styles.greenButton} onClick={closeDialog} style={{ width: '100px', height: '40px' }}>Cancelar</button>
            </div>
        </dialog>
    );
}