'use client';
import styles from '../page.module.css';
import { useRouter } from 'next/navigation';
import { BlueButton } from '../components/blueButton';
import Image from 'next/image';
import FileIcon from '../../../public/file-icon.svg';
import PopUp from '../components/popUpInformation';
import React, { useState, useEffect } from 'react';
import fs from 'fs';
import readline from 'readline';
import { handlerAddData, reloadPageAfterOperation } from "../../controller/studentsController";
import Estudiante from "../../model/Estudiante";

export default function StudentRegister() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  let students: Estudiante[] = [];
  const [dialogOpen, setDialogOpen] = useState(false);


  const openDialog = () => {
    console.log("Abriedo dialogo");
    setDialogOpen(true);
  };

  const closeDialog = () => {
    console.log("Cerrando dialogo");
    setDialogOpen(false);
  };

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

  const handlerFile = (e: React.ChangeEvent<HTMLInputElement>) => { // Utiliza React.ChangeEvent<HTMLInputElement> para manejar eventos de cambio de input
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      const reader = new FileReader();
      const fileName = selectedFile.name;
      const fileExtension = fileName.split('.').pop();

      if (fileExtension !== 'csv' && fileExtension !== 'xlsx') {
        openDialog();
        return; // Sal de la función si la extensión del archivo no es CSV o XLSX
      }

      reader.onload = (event) => {
        if (event.target && event.target.result) {
          const fileContent = event.target.result as string;
          const lines = fileContent.split('\r');
          for (let line of lines) {
            const data = line.split(';');
            console.log(data);
            const student: Estudiante = new Estudiante(
              data[0],
              data[1],
              data[2],
              data[3],
              data[4],
              data[5],
              data[6],
            );
            if (data[0] != "\n") {
              students.push(student);
            }
          }

          console.log(students);
          document.getElementById('selectedFile')!.innerText = fileName;
          document.getElementById('selectedFile')!.style.fontSize = '1.0rem';

        }
      };

      reader.readAsText(selectedFile);
    }
  }


  function handleAdd() {
    console.log(students);
    if (rol == "Administradora") {
      if (students.length == 0) {
        openDialog();
        return;
      }
      else {
        handlerAddData(students);
        router.push('/viewStudents');
      }
    };

  }

  return (
    <main className={styles.main} id="main">
      <PopUp
        title="Archivo no subido"
        content="Para poder continuar con el ingreso de los estudiantes por favor subir el archivo con los datos."
        openDialog={openDialog}
        closeDialog={closeDialog}
        dialogOpen={dialogOpen}
      />
      <div className={styles.addStudentsContainer}>
        <h1>Agregar Estudiantes</h1>
        <div className={styles.loadCSVStudents}>

          <Image src={FileIcon} alt="profile" style={{ width: '45px', height: '45px' }} />
          <span>Sube o arrastra un archivo</span>
          <p>Archivos .csv solamente</p>
          <input
            type="file"
            id="file"
            name="file"
            accept=".csv, .xlsx"
            onChange={handlerFile}
          />
          <p className={styles.selectedFile} id='selectedFile'></p>
        </div>
        <BlueButton text="Agregar" onClick={() => { handleAdd() }} type="submit" />
      </div>
    </main>
  );
}