import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { authentication, db } from "../../firebase";
import { handleDeleteAccount } from "./authUtils";

const auth = authentication;
export const userLocation = `Users/${
  auth.currentUser ? auth.currentUser.uid : ""
}`; // Calea către document

export const handleUpdateFirestore = async (location, updatedData) => {
  const ref = doc(db, location);

  // Set the "capital" field of the city 'DC'
  await updateDoc(ref, updatedData);
};
export const handleDeleteFirestore = async (location, currentPassword) => {
  const ref = doc(db, location);

  // Set the "capital" field of the city 'DC'
  await deleteDoc(ref).then(() => {
    handleDeleteAccount(currentPassword);
  });
};
