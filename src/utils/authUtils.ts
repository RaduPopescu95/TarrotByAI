import {
  EmailAuthProvider,
  deleteUser,
  reauthenticateWithCredential,
  signOut,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import { Alert } from "react-native";
import { authentication } from "../../firebase";
import { FirebaseError } from "firebase/app";

const auth = authentication;

export const handleChangeEmail = async (newEmail) => {
  try {
    await updateEmail(auth.currentUser, newEmail);
    Alert.alert("Email Updated", "Your email has been successfully updated.");
  } catch (error) {
    console.error(error);
    Alert.alert("Error", "Failed to update email.");
  }
};

export const handleChangePassword = async (currentPassword, newPassword) => {
  console.log("change passowrd...");
  try {
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    await reauthenticateWithCredential(user, credential)
      .then(async () => {
        await updatePassword(user, newPassword)
          .then(() => {
            console.log("password succesfuly changed");
          })
          .catch((error) => {
            console.log("password error changed", error);
          });
      })
      .catch((err: FirebaseError) => {
        if (err.code == "auth/wrong-password") {
          Alert.alert(
            "Wrong current password",
            "The current password you provided is not correct. Please provide your current password",
            [{ text: "OK", onPress: () => console.log("OK Pressed") }]
          );
        } else if (err.code == "auth/too-many-requests") {
          Alert.alert(
            "Too many wrong current password entries",
            "Access changing password has been temporarily disabled due to many failed current password entries. Please logout and login or reset your password to be able to change your password.",
            [
              { text: "Logout", onPress: () => handleLogout() },
              { text: "OK", onPress: () => console.log("OK Pressed") },
            ]
          );
        }
      });
  } catch (err) {
    console.log("error on handlechange pass", err);
  }
};

export const handleLogout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error(error);
    Alert.alert("Error", "Failed to log out.");
  }
};

export const handleDeleteAccount = async () => {
  try {
    await deleteUser(auth.currentUser);

    Alert.alert(
      "Account Deleted",
      "Your account has been successfully deleted."
    );
  } catch (error) {
    console.error(error);
    Alert.alert("Error", "Failed to delete account.");
  }
};
