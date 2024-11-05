'use client'
import styles from '../page.module.css';
interface GreenButtonProps {
    text: string;
    onClick: () => void;
  }


export function GreenButton(GreenButtonProps: GreenButtonProps) {
    const { text, onClick } = GreenButtonProps;
    
    return (
      <button type='button' className={styles.greenButton} onClick={onClick}>
        {text}
      </button>
    );
  }
  