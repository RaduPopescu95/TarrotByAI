import React, { Fragment, useEffect, useState } from "react";
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback
} from "react-native";
import { Button, SocialMediaLogin } from "../components/commonButton";
import { GeneralProps } from "../interfaces/generalProps";
import { Route } from "@react-navigation/native";
import { labels } from "../utils/labels";
import { screenName } from "../utils/screenName";
import { LinearGradient } from 'expo-linear-gradient';
import {
  FirebaseRecaptchaVerifierModal,
  FirebaseRecaptchaBanner,
} from "expo-firebase-recaptcha";
import {
  FormErrorMessage,
  H10fontRegularWhite,
  H6fontBoldPrimary,
  H6fontBoldWhite,
  H6fontRegularBlack,
  H7fontMediumWhite,
  H8fontMediumPrimary,
  H8fontMediumWhite,
  H8fontRegularPrimary,
  H8fontRegularWhite,
  H9fontRegularBlack,
  H9fontRegularGray,
} from "../components/commonText";
import {
  CommonLineView,
  MainContainer,
  RowView,
  SubContainer,
} from "../components/commonViews";
import { colors } from "../utils/colors";

// import {DevWidth} from '../utils/device';
import { Dimensions } from "react-native";
import {
  alignItemsCenter,
  alignItemsLeft,
  alignSelfRight,
  flex1,
  mb20,
  ml10,
  mt10,
  mt20,
  pb10,
  ph15,
  pt10,
} from "../common/commonStyles";
import {
  emailValidation,
  minLengthValidation,
  requiredValidation,
  validationSchema,
} from "../utils/validationConfig";
import { useForm, Controller } from "react-hook-form";
import { InputFields } from "../components/commonInputFields";
import LoginIcon from "../../assets/images/login-img.svg";
import LogoIcon from "../../assets/images/logo.svg";
import FacebookIcon from "../../assets/images/facebook-letter.svg";
import GoogleIcon from "../../assets/images/google-plus-letter.svg";
import EmailIcon from "../../assets/images/email.svg";
import LockIcon from "../../assets/images/lock-icon.svg";
import { Text } from "react-native-paper";

import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  getAuth,
  PhoneAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { authentication, db } from "../../firebase";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import {
  getCalendarTimes,
  getClinicAppointments,
  getClinicApprovedAppointments,
  getClinicDoctors,
  getClinicInfo,
  getClinics,
  getPatientsOfClinic,
  getScheduleTimings,
} from "../actions/clinicActions";
import {
  getGuestLoginDetails,
  getPatientAppointments,
  getPatientInfo,
  setTemporaryPatientClinicReview,
} from "../actions/patientActions";
import { registerForPushNotificationsAsync } from "../utils/Notification/registerPushNotification";
import { uploadExpoPushToken } from "../utils/UploadFirebaseData";
import { retrieveTypeOfUser } from "../utils/getFirebaseData";
import { handleSignOut, handleSignOutFromSignIn } from "../utils/handleSignOut";
import CustomLoader from "../components/customLoader";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import i18n from "../../i18n";
import {
  ICountry,
  PhoneInput,
  getCountryByCca2,
} from "react-native-international-phone-number";
import { handleLoginAsGuest } from "../utils/loginAsGuestHelper";



interface Props extends GeneralProps {
  route: Route<string, object | undefined>;
}

const SignInScreenClinic: React.FC<Props> = ({
  navigation,
  route,
}): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const [borderWhite, setBorderWhite] = useState(false);
  const [isWhite1, setIsWhite1] = useState(false);
  const [isWhite2, setIsWhite2] = useState(false);
  const [loginType, setLoginType] = useState("email");


  const formKeys = {
    email: "email",
    password: "password",
  };
  const formKeysPhone = {
    mobileNo: "mobileNo",
  };

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();

  const auth = authentication;
  const dispatch = useDispatch();

  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem("userType", value);
    } catch (e) {
      // saving error
    }
  };

  const onsubmit = async (detaila) => {
    // Use the replace method with a regular expression to remove white spaces
    const emailWithoutSpace = detaila.email.replace(/\s/g, "");
    detaila.email = emailWithoutSpace;

    // setIsLoading(true)
    let expoToken;
    try {
      // console.log("sds");
      // expoToken = await registerForPushNotificationsAsync()
      // console.log("Sss")
      // console.log(expoToken);
    } catch (err) {
      console.log("errror expo", err);
    }
    signInWithEmailAndPassword(auth, detaila.email, detaila.password)
      .then(async (userCredentials) => {
        console.log("userCredentials...", userCredentials.user.uid);
        const userType = await retrieveTypeOfUser(userCredentials.user.uid);
        console.log("test here....");
        if (userCredentials.user.uid) {
          console.log("test here....with yes");
          handleLoginAsGuest(false, true).then(() => {
            dispatch(getGuestLoginDetails());
          });
        }

        console.log("userType...", userType);
     
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("error.name...", error.name);
        if (error.name === "Not the right user type") {
          Alert.alert(
            "Could Not Log In",
            "We found an account with this e-mail created as a patient account. Please use a clinic account or register for a clinic account",
            [
              {
                text: "Try Again",
                onPress: () => {
                  console.log("Try Again pressed");
                  handleSignOutFromSignIn();
                  setIsLoading(false);
                },
                style: "cancel",
              },
              {
                text: "Register",
                onPress: () => {
                  navigation.push("RegisterScreen");
                  handleSignOutFromSignIn();
                  setIsLoading(false);
                },
              },
            ]
          );
        } else {
          Alert.alert(
            "Could Not Log In",
            "Your email or password is incorect or there is no existing user with this account. Please try again or register for an account",
            [
              {
                text: "Try Again",
                onPress: () => {
                  console.log("Try Again pressed");
                  handleSignOutFromSignIn();
                  setIsLoading(false);
                },
                style: "cancel",
              },
              {
                text: "Register",
                onPress: () => {
                  navigation.push(screenName.SignUpScreenClinic);
                  handleSignOutFromSignIn();
                  setIsLoading(false);
                },
              },
            ]
          );
        }

        console.log("error on sign in clinic...", error.name);
      });
  };

  const [selectedCountry, setSelectedCountry] = useState<undefined | ICountry>(
    getCountryByCca2("RO")
  );

  function handleSelectedCountry(country: ICountry) {
    setSelectedCountry(country);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // console.log('is user...');
        navigation.navigate(screenName.ClinicDashBoard);
      } else {
      }
    });

    return unsubscribe;
  }, []);

  return (
    <TouchableWithoutFeedback onPress={() => console.log("ass")}>
    <Fragment>
      <MainContainer>
        <CustomLoader isLoading={isLoading} />
        <LinearGradient
          colors={["#000000", "#434343"]} // Înlocuiește cu culorile gradientului tău
          style={styles.gradient}
        >
       
          <KeyboardAvoidingView
            style={{ flex: 1, justifyContent:"center" }}
    
            keyboardVerticalOffset={65}
          >
            
            <View style={styles.subContainer}>
            <View style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
       <H6fontBoldPrimary>{i18n.translate("login")}</H6fontBoldPrimary> 
              
  <Image
    source={require('../../assets/headerIcon.png')}
    style={{width: 300, height: 200}}
    resizeMode="contain" // Aceasta va asigura că întreaga imagine se va încadra în spațiul disponibil, păstrând proporțiile.
  />
</View>
      

            
                <View>
                  <Controller
                    name={formKeys.email}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <InputFields
                        errorMessage={errors[
                          formKeys.email
                        ]?.message.toString()}
                        value={value}
                        onChangeText={onChange}
                        placeholder={i18n.translate("email")}
                        image={"email"}
              
                        setIsWhite1={setIsWhite1}
    
                      />
                    )}
                    rules={{
                      required: requiredValidation(i18n.translate("email")),
                      validate: emailValidation,
                    }}
                  />

                  <Controller
                    name={formKeys.password}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <InputFields
                        isPassword={true}
                        value={value}
                        isSecure={true}
                        onChangeText={onChange}
                        placeholder={i18n.translate("password")}
                        errorMessage={errors[
                          formKeys.password
                        ]?.message.toString()}
                      image={"lock-outline"}
                        setIsWhite2={setIsWhite2}
                      />
                    )}
                    rules={{
                      required: requiredValidation(i18n.translate("password")),
                      minLength: minLengthValidation(
                        validationSchema.password.minLength
                      ),
                    }}
                  />
                </View>
           

              <RowView style={[mt10, alignSelfRight]}>
              
                {loginType === "email" && (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate(
                        screenName.ForgotPasswordClinic as any
                      )
                    }
                  >
                    <H8fontMediumPrimary>
                      {i18n.translate("forgotPassword")}
                    </H8fontMediumPrimary>
                  </TouchableOpacity>
                )}
              </RowView>

              <Button
                disabled={false}
                funCallback={handleSubmit(onsubmit)}
                borderWidth={0.2}
                bgColor={colors.primary2}
                label={i18n.translate("loginNow")}
                borderColor={colors.white}
                success={true}
              />
            

              <View>
                <View style={styles.infoTextViewStyle}>
                  <H8fontMediumWhite>
                    {i18n.translate("dntHaveAccount")}{" "}
                  </H8fontMediumWhite>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate(
                        screenName.SignUpScreenClinic as any,
                        { item: loginType }
                      )
                    }
                  >
                    <H8fontRegularPrimary>
                      {i18n.translate("signUp")}
                    </H8fontRegularPrimary>
                  </TouchableOpacity>
                </View>
                
              </View>
            </View>
            {/* </View> */}
          </KeyboardAvoidingView>
        </LinearGradient>
      </MainContainer>
    </Fragment>
    </TouchableWithoutFeedback>
  );
};
export default SignInScreenClinic;

const styles = StyleSheet.create({
  subContainer: {
    flex: 1,
    paddingHorizontal: 20,
    // paddingVertical: 15,
    justifyContent: "center",
    
    
  },
  gradient: {
    flex: 1,
    width: "100%",
    height: "100%",
    paddingBottom:100,
    // Alte stiluri necesare pentru a pozitiona gradientul după cum este necesar
  },
  infoTextViewStyle: {
    paddingTop: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  socialMediaBtnIconsStyle: { position: "absolute", marginLeft: 15, top: -19 },
  socialMediaBtnIconContainerStyle: {
    borderRadius: 25,
    height: 30,
    width: 30,
    backgroundColor: colors.white,
    paddingTop: 10,
    paddingLeft: 3,
  },
  socialMediaIconStyle: { height: 15, width: 22, alignSelf: "center" },
  socialMediaBtnStyle: {
    zIndex: -1,
    height: 45,
    width: Dimensions.get("window").width / 3,
    backgroundColor: colors.google,
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  socialMediaBtnTextStyele: {
    color: "white",
    fontSize: 14,
  },
  socialMediaFBIconStyle: { alignItems: "center" },
  userIconsStyle: {
    // height: 20,
    // width: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  borderLineStyle: { paddingTop: 10 },
  footerComponentView: { paddingTop: 30 },
});
