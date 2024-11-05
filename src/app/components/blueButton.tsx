'use client'
import styles from '../page.module.css';
interface BlueButtonProps {
    text: string;
    onClick: () => void;
    type: 'button' | 'submit' | 'reset' | undefined;
  }


export function BlueButton(BlueButtonProps: BlueButtonProps) {
    const { text, onClick, type } = BlueButtonProps;
    
    return (
      <button type={type} className={styles.blueButton} onClick={onClick}>
        {text}
      </button>
    );
  }
  