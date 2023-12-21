import { doc, updateDoc } from "firebase/firestore";
import { authentication, db } from "../../firebase";

const auth = authentication;
export const userLocation = `Users/${
  auth.currentUser ? auth.currentUser.uid : ""
}`; // Calea către document

export const handleUpdateFirestore = async (location, updatedData) => {
  const ref = doc(db, location);

  // Set the "capital" field of the city 'DC'
  await updateDoc(ref, updatedData);
};
