import { collection, query, where, getDocs, orderBy, addDoc } from "firebase/firestore";
import { db } from "../../constants/connection";
import Itinerario from "@/model/Itinerario";

export const dynamic = 'force-dynamic'; // Force dynamic route behavior

export async function getItineraries() {
    const database = db;
    const itineraryRef = collection(database, 'itinerarios');
    const itinerary = query(itineraryRef, orderBy("nombre"));
    const querySnapshot = await getDocs(itinerary);
    var itineraries:Itinerario[] = [];
    querySnapshot.forEach((doc) => {
        itineraries.push(doc.data() as Itinerario);
    });
    return itineraries;
}

export async function addItinerary(nombre: string, autor: string) {
    const database = db;
    const itineraryRef = collection(database, 'itinerarios');
    const itinerary = {
        nombre: nombre,
        autor: autor
    };
    await addDoc(itineraryRef, itinerary);
}

