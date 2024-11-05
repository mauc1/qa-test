import Usuario from "../model/Usuario";
import { searchUserByEmail } from "../app/DAO/daoUsuario";
import { useRouter } from "next/navigation";


interface userData {
    email: string;
    password: string;
    rol : string;
    celular : string;
}

export const handlerLogin = async (email : string, password : string, router: any, openDialog : any) => {

    // Define the api request to search for the user with the given email and password
    
    let data = await searchUserByEmail(email);
    // convert the data to a json object
    data = JSON.parse(JSON.stringify(data));
    
    

    
    if(data == null){
        console.log("Usuario no encontrado");
        openDialog();
    } else {
        const user : userData = {
            email: data.correo,
            password: data.contraseña,
            rol: data.rol,
            celular: data.celular
        };

        if(user.password != password){
            console.log("Contraseña incorrecta");
            openDialog();
            return;
        }else{
            setLocalStorage(data);
            router.push('/mainMenu');
        }
        
        
        
        
    }

};
  
const setLocalStorage = (data : any) => {
    localStorage.setItem("user", JSON.stringify(data));
}