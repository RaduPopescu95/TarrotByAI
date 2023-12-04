import React, { Fragment, useState } from "react";
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ImageBackground,
  Alert,
} from "react-native";
import { Button } from "../components/commonButton";
import { GeneralProps } from "../interfaces/generalProps";
import { Route } from "@react-navigation/native";
import { labels } from "../utils/labels";
import { screenName } from "../utils/screenName";
import { MaterialIcons } from "@expo/vector-icons";
import {
  H10fontRegularWhite,
  H14fontRegularWhite,
  H6fontRegularBlack,
  H9fontRegularBlack,
  H9fontRegularGray,
} from "../components/commonText";
import {
  CardSurface,
  MainContainer,
  RowView,
  SubContainer,
  TextInputStyle,
} from "../components/commonViews";
import { colors } from "../utils/colors";
import {
  alignItemsCenter,
  mb20,
  mt10,
  mt20,
  ph30,
  pt10,
  pv10,
  pv30,
} from "../common/commonStyles";
import { useForm, Controller } from "react-hook-form";
import { InputFields } from "../components/commonInputFields";
import {
  emailValidation,
  minLengthValidation,
  requiredValidation,
  validationSchema,
} from "../utils/validationConfig";
import { FontAwesome5 } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

import { authentication } from "../../firebase";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { handleSignOut } from "../utils/handleSignOut";
import { Snackbar } from "react-native-paper";
import CustomLoader from "../components/customLoader";
import { updateClinicEmail } from "../utils/UploadFirebaseData";
import i18n from "../../i18n";

interface Props extends GeneralProps {
  route: Route<string, object | undefined>;
}

const ChangeEmailClinic: React.FC<Props> = ({
  navigation,
  route,
}): JSX.Element => {
  const [showSnackBar, setShowSnackback] = useState(false);
  const [updatePass, setUpdatedPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const formKeys = {
    email: "email",
    curentPassword: "currentPassword",
  };

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    watch,
  } = useForm();

  let pwd = watch("password");
  const auth = authentication;
  const user = auth.currentUser;

  const changeEmail = async (newEmail, currentPassword) => {
    setIsLoading(true);
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    await reauthenticateWithCredential(user, credential)
      .then(async () => {
        // User re-authenticated.

        await updateEmail(user, newEmail)
          .then(() => {
            // // Update successful.

            setIsLoading(false);
            setShowSnackback(true);
            updateClinicEmail(newEmail);
          })
          .catch((error) => {
            setIsLoading(false);
            // An error ocurred
            // ...
            console.log("Error...on update..pass....", error);
          });

        setIsLoading(false);
      })
      .catch((err: FirebaseError) => {
        setIsLoading(false);
        // An error ocurred
        // ...

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
              {
                text: i18n.translate("logOut"),
                onPress: () => handleSignOut(navigation, true),
              },
              { text: "OK", onPress: () => console.log("OK Pressed") },
            ]
          );
        } else if (err.code == "auth/email-already-in-use") {
          Alert.alert(
            i18n.translate("emailAlreadyInUse"),
            i18n.translate("emailAlreadyInUseMessage"),
            [
              {
                text: i18n.translate("tryAgain"),
                onPress: () => console.log("try again..."),
              },
              // {text: 'OK', onPress: () => console.log('OK Pressed')},
            ]
          );
        } else {
          Alert.alert(
            i18n.translate("problemOccured"),
            i18n.translate("problemOccuredMessage"),
            [
              {
                text: i18n.translate("contact"),
                onPress: () => navigation.navigate(screenName.ClinicFeedback),
              },
              { text: "OK", onPress: () => console.log("OK Pressed") },
            ]
          );
        }
      });
    setIsLoading(false);
  };

  const onsubmit = async (detaila) => {
    console.log(detaila);
    await changeEmail(detaila.email, detaila.currentPassword);
  };
  return (
    <Fragment>
      <MainContainer>
        <ImageBackground
          source={require("../images/loginBG.png")}
          resizeMode="cover"
          style={{
            flex: 1,
            width: null,
            height: null,
            // alignItems: 'flex-end',
          }}
        >
          <CustomLoader isLoading={isLoading} />
          <ScrollView>
            <View style={styles.subContainer}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{ position: "absolute", padding: 20, paddingTop: 30 }}
              >
                <AntDesign name="arrowleft" size={24} color="black" />
              </TouchableOpacity>
              {/* <View style={alignItemsCenter}>
                <LoginIcon fill={'#e0e0e0'} />
                <View>
                  <LogoIcon />
                </View>
              </View> */}
              <View style={{ marginTop: "90%" }}>
                <Controller
                  name={formKeys.email}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <InputFields
                      errorMessage={errors[formKeys.email]?.message.toString()}
                      value={value}
                      onChangeText={onChange}
                      placeholder={i18n.translate("newEmail")}
                      image={
                        <View style={styles.passwordIconStyle}>
                          <MaterialIcons name="email" size={30} color="grey" />
                        </View>
                      }
                    />
                  )}
                  rules={{
                    required: requiredValidation(i18n.translate("email")),
                    validate: emailValidation,
                  }}
                />

                <Controller
                  name={formKeys.curentPassword}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <InputFields
                      value={value}
                      isSecure={true}
                      onChangeText={onChange}
                      placeholder={i18n.translate("curentPassword")}
                      errorMessage={errors[
                        formKeys.curentPassword
                      ]?.message.toString()}
                      image={
                        <View style={styles.passwordIconStyle}>
                          <MaterialIcons name="lock" size={30} color="grey" />
                        </View>
                      }
                    />
                  )}
                  rules={{
                    required: requiredValidation(
                      i18n.translate("createPassword")
                    ),
                    minLength: minLengthValidation(
                      validationSchema.password.minLength
                    ),
                  }}
                />
              </View>

              <View style={pv10}>
                <Button
                  disabled={false}
                  funCallback={handleSubmit(onsubmit)}
                  label={i18n.translate("changeEmail")}
                />
              </View>

              {/* <View style={styles.infoTextViewStyle}>
                <H14fontRegularWhite>
                  {labels.gobacktoLogin}{' '}
                </H14fontRegularWhite>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate(screenName.SignInScreenClinic as any)
                  }>
                  <H14fontRegularWhite
                    style={{
                      textDecorationLine: 'underline',
                      fontWeight: 'bold',
                    }}>
                    {labels.registerLogin}
                  </H14fontRegularWhite>
                </TouchableOpacity>
              </View> */}
            </View>
          </ScrollView>
          <View
            style={{
              position: "absolute",
              width: 300,
              height: 100,
              bottom: "2%",
              left: "10%",
            }}
          >
            <Snackbar
              visible={showSnackBar}
              onDismiss={() => setShowSnackback(false)}
              action={{
                label: "OK",
                onPress: () => {
                  // Do something
                  setShowSnackback(false);
                  navigation.navigate(screenName.ClinicDashBoard);
                },
              }}
              // duration={2000}
            >
              Email changed!
            </Snackbar>
          </View>
        </ImageBackground>
      </MainContainer>
    </Fragment>
  );
};
export default ChangeEmailClinic;
const styles = StyleSheet.create({
  subContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  passwordImageStye: {
    height: 25,
    width: 25,
    alignSelf: "center",
  },
  infoTextViewStyle: {
    paddingTop: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  passwordIconStyle: { justifyContent: "center", alignItems: "center" },
});
