'use client'
import styles from '../page.module.css';
import { useEffect,useState } from "react";

interface PopUpInformationProps {
    openDialog: () => void;
    closeDialog: () => void;
    confirmType: (tipo:string) => void;
    dialogOpen: boolean; // Agregamos dialogOpen como prop
  }
export default function PopUpInformation(PopUpInformationProps: PopUpInformationProps) {
    const { openDialog, closeDialog, dialogOpen, confirmType } = PopUpInformationProps;
    const [selectedValue, setSelectedValue] = useState<string>("local");


 
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
                dialog.close();
            }
            const main = document.getElementById('main') as HTMLDivElement | null;
            if (main) {
                main.style.filter = 'blur(0px)';
            }
        }
      }, [dialogOpen]);
    

    const handleSave = () => {
        confirmType(selectedValue);
        closeDialog();
    };
    
    
    return (
        <dialog id={'dialogPopUpInfo'}  className={styles.dialogPopUpInfo} >
            <h2>{"Seleccione el tipo de archivo"}</h2>
                <div className={styles.formGroupStudentEdit} style={{ width: '100px', height: '40px', marginTop: '20px' }}>
                    <select id="valor" name="valor"  value={selectedValue} onChange={(e) => setSelectedValue(e.target.value)}>
                        <option value="local">Local</option>
                        <option value="general">General</option>
                    </select>
                </div>
            <div>
                <button className={styles.greenButton} onClick={() => confirmType(selectedValue)} style={{ width: '100px', height: '40px', marginTop: '20px' }}>Guardar</button>
                <button className={styles.deleteButton} onClick={closeDialog} style={{ width: '100px', height: '40px', marginLeft: '10px', marginTop: '20px' }} >Cancelar</button>
            </div>
        </dialog>
    );
}