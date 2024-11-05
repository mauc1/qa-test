import { FirebaseApp, initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";

// Interface for Firebase configuration (replace with your actual types)
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

let appInstance: FirebaseApp | undefined; // Private variable for singleton instance

function getFirestoreInstance(): Firestore {
  if (!appInstance) {
    const firebaseConfig: FirebaseConfig = {
      // Your web app's Firebase configuration (replace with your actual config)
      apiKey: "AIzaSyBSw2wFDNoQdwiLVSa1gpPc7wB6rg2Y-oU",
      authDomain: "teamtec-727df.firebaseapp.com",
      projectId: "teamtec-727df",
      storageBucket: "teamtec-727df.appspot.com",
      messagingSenderId: "622833003979",
      appId: "1:622833003979:web:46b306451dd0a941b15a4e"
    };

    appInstance = initializeApp(firebaseConfig);
  }

  return getFirestore(appInstance);
}

export const db = getFirestoreInstance(); // Singleton instance for Firestore
