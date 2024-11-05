'use client'
import styles from '../page.module.css';
import { useEffect } from "react";

interface PopUpImageProps {
    imageUrl: string;
    openDialog: () => void;
    closeDialog: () => void;
    dialogOpen: boolean;
}

export default function PopUpImage(props: PopUpImageProps) {
    const { imageUrl, openDialog, closeDialog, dialogOpen } = props;

    useEffect(() => {
        if (dialogOpen) {
            const dialog = document.getElementById('dialogPopUpImage') as HTMLDialogElement | null;

            if (dialog) {
                dialog.classList.add(styles.show);
                dialog.showModal();
            }

            const main = document.getElementById('main') as HTMLDivElement | null;
            if (main) {
                main.style.filter = 'blur(4px)';
            }
        } else {
            const dialog = document.getElementById('dialogPopUpImage') as HTMLDialogElement | null;
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
        <dialog id={'dialogPopUpImage'} className={styles.dialogPopUpImage}>
            <img src={imageUrl} alt="Popup Image" />
            <button className={styles.deleteButton} onClick={closeDialog} style={{ width: '120px', height: '40px', marginTop: '20px' }} >Cerrar</button>
        </dialog>
        
    );
}