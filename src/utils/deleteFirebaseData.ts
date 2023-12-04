import {authentication, db, storage} from '../../firebase';
// import { collection, query, where } from "firebase/firestore";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  collectionGroup,
  orderBy,
  deleteDoc,
  updateDoc,
  arrayRemove,
} from 'firebase/firestore';
import moment from 'moment';

import {ref, getDownloadURL, listAll, deleteObject} from 'firebase/storage';

const auth = authentication;

export const deleteDoctorFromClinic = async (doctorId, doctorImg) => {
  console.log('---------------');
  console.log('doctorId....', doctorId);

  try {
    //DELETE IMAGE OF DOCTOR FROM STORAGE
    let imageRef = ref(storage, `images/clinics/${auth.currentUser.uid}/doctors/${doctorImg}`);
    deleteObject(imageRef).then(() => {
      // File deleted successfully
      console.log("File deleted successfully from storage...")
    }).catch((error) => {
      console.log("Error ON File deleted from storage...", error)
      // Uh-oh, an error occurred!
    });

    // DELETE DOC FROM DOCTOR COLLECTION AND SUBCOLLECTIO
    await deleteDoc(
      doc(db, 'Users', auth.currentUser.uid, 'Doctors', doctorId),
    );
    await deleteDoc(
      doc(db, 'Doctors', doctorId),
    );
  } catch (err) {
    console.log('error deleting doctor', err);
  }
};


export const deletePatientFromClinic = async (patientData) => {
  console.log('---------------');
  console.log('patientData....', patientData.phoneNumber);

  try {

    if(patientData.isUnregistered){
   

      await deleteDoc(doc(db, "Users", auth.currentUser.uid, "clinicsPatientsUnregistered", patientData.phoneNumber));
    } else {
      
      // await deleteDoc(doc(db, "Userds", auth.currentUser.uid, "clinicsPatientsUnregistered", patientData.phoneNumber));
    }

  } catch (err) {
    console.log('error deleting patient', err);
  }

};
