import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";



export const handleClinicPatientQueries = async (check,equals) => {
    let data = []
    try{

        const ref = collection(db, "Users");
   
        // Create a query against the collection.
        const q = query(ref, where(check, "==", equals));
        
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
            data.push(doc.data())
        });
        return data;
    }catch(err){
        console.log("error...handleClinicPatientQueries...", err)
    }
}

export const handleDoctorsQueries = async (check,equals) => {
    let data = []
    try{

        const ref = collection(db, "Doctors");
        
        // Create a query against the collection.
        const q = query(ref, where(check, "==", equals));
        
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            data.push(doc.data())
        });
        return data;
    }catch(err){
        console.log("error...handleDoctorsQueries...", err)
    }
}

