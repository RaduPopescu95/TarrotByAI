import React, { Fragment, useEffect, useState } from "react";
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
} from "react-native";
import { Button, SocialMediaLogin } from "../components/commonButton";
import { GeneralProps } from "../interfaces/generalProps";
import { Route, useRoute } from "@react-navigation/native";
import { labels } from "../utils/labels";
import { screenName } from "../utils/screenName";
import {
  FormErrorMessage,
  H10fontRegularWhite,
  H6fontBoldPrimary,
  H6fontRegularBlack,
  H7fontMediumWhite,
  H8fontMediumPrimary,
  H8fontMediumWhite,
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
import {
  alignItemsCenter,
  flex1,
  ml10,
  mt10,
  mt20,
  pb10,
  ph15,
} from "../common/commonStyles";
import { StyleSheet } from "react-native";
import { useForm, Controller } from "react-hook-form";
import {
  emailValidation,
  minLengthValidation,
  numberValidation,
  requiredValidation,
  validationSchema,
} from "../utils/validationConfig";
import { InputFields } from "../components/commonInputFields";

import { authentication, db, storage } from "../../firebase";
import { ref, uploadBytes, uploadBytesResumable } from "firebase/storage";
import { setDoc, doc } from "firebase/firestore";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { handleSignOut } from "../utils/handleSignOut";
import i18n, { languageCode } from "../../i18n";
import {
  ICountry,
  PhoneInput,
  getCountryByCca2,
} from "react-native-international-phone-number";
import CustomLoader from "../components/customLoader";
import { TouchableWithoutFeedback } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface Props extends GeneralProps {
  route: Route<string, object | undefined>;
}

const SignUpScreenClinic: React.FC<Props> = ({ navigation }): JSX.Element => {
  const formKeys = {
    email: "email",
    mobileNo: "mobileNo",
    firstName: "firstName",
    lastName: "lastName",
    password: "password",
    confirmPassword: "confirmPassword",
  };

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    watch,
  } = useForm();

  const route = useRoute();

  // const [registerType, setRegisterType] = useState(route.params.item)
  const [registerType, setRegisterType] = useState("email");
  const [isLoading, setIsLoading] = useState(false);

  let pwd = watch("password");
  const auth = authentication;

  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem("userType", value);
    } catch (e) {
      // saving error
    }
  };

  const [selectedCountry, setSelectedCountry] = useState<undefined | ICountry>(
    getCountryByCca2("RO")
  );

  function handleSelectedCountry(country: ICountry) {
    setSelectedCountry(country);
  }

  const onsubmit = (detaila) => {
    setIsLoading(true);
    console.log(detaila);
    console.log(selectedCountry);

    let firstName = detaila.firstName;
    let lastName = detaila.lastName;
    createUserWithEmailAndPassword(auth, detaila.email, detaila.password)
      .then((userCredentials) => {
        setTimeout(async () => {
          const user = userCredentials.user;

          const collectionId = "Users";
          const documentId = user.uid;
          const value = {
            owner_uid: user.uid,
            firstName,
            lastName,
            email: user.email,
          };
          setDoc(doc(db, collectionId, documentId), value);
          console.log("success PASS");
        }, 1500);
      })
      .then(() => {
        // storeData('Clinic');
        handleSignOut(navigation, false);
      })
      .then(() => {
        // navigation.navigate(screenName.SignInScreenClinic);
      })
      .catch((error) => {
        Alert.alert(
          "User already in use",
          "Your e-mail is already in use. Please try again with another e-mail or log in into an existing account",
          [
            {
              text: "Try Again",
              onPress: () => console.log("Try Again pressed"),
              style: "cancel",
            },
          ]
        );

        console.log(error);
      });

    setIsLoading(false);
  };

  const onChange = (password, score, { label, labelColor, activeBarColor }) => {
    console.log(password, score, { label, labelColor, activeBarColor });
  };

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
              style={{ flex: 1, marginTop: "10%" }}
              keyboardVerticalOffset={65}
            >
              <View style={styles.subContainer}>
                <View
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <H6fontBoldPrimary>
                    {i18n.translate("signUp")}
                  </H6fontBoldPrimary>

                  <Image
                    source={require("../../assets/headerIcon.png")}
                    style={{ width: 300, height: 200 }}
                    resizeMode="contain" // Aceasta va asigura că întreaga imagine se va încadra în spațiul disponibil, păstrând proporțiile.
                  />
                </View>

                <View>
                  {registerType === "email" && (
                    <Controller
                      name={formKeys.firstName}
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <InputFields
                          errorMessage={errors[
                            formKeys.firstName
                          ]?.message.toString()}
                          value={value}
                          onChangeText={onChange}
                          placeholder={i18n.translate("firstName")}
                          image={"person"}
                        />
                      )}
                      rules={{
                        required: requiredValidation(
                          i18n.translate("firstName")
                        ),
                      }}
                    />
                  )}
                  {registerType === "email" && (
                    <Controller
                      name={formKeys.lastName}
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <InputFields
                          errorMessage={errors[
                            formKeys.lastName
                          ]?.message.toString()}
                          value={value}
                          onChangeText={onChange}
                          placeholder={i18n.translate("lastName")}
                          image={"person"}
                        />
                      )}
                      rules={{
                        required: requiredValidation(
                          i18n.translate("lastName")
                        ),
                      }}
                    />
                  )}
                  {registerType === "email" && (
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
                        />
                      )}
                      rules={{
                        required: requiredValidation(i18n.translate("email")),
                        validate: emailValidation,
                      }}
                    />
                  )}

                  {registerType === "email" && (
                    <Controller
                      name={formKeys.password}
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <InputFields
                          isPassword={true}
                          value={value}
                          isSecure={true}
                          onChangeText={onChange}
                          placeholder={i18n.translate("createPassword")}
                          errorMessage={errors[
                            formKeys.password
                          ]?.message.toString()}
                          image={"lock-outline"}
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
                  )}

                  {registerType === "email" && (
                    <Controller
                      name={formKeys.confirmPassword}
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <InputFields
                          isPassword={true}
                          value={value}
                          isSecure={true}
                          onChangeText={onChange}
                          placeholder={i18n.translate("confirmPassword")}
                          errorMessage={errors[
                            formKeys.confirmPassword
                          ]?.message.toString()}
                          image={"lock-outline"}
                        />
                      )}
                      rules={{
                        required: requiredValidation(
                          i18n.translate("confirmPassword")
                        ),
                        validate: (value) =>
                          value === pwd || i18n.translate("passDontMatch"),
                      }}
                    />
                  )}
                </View>

                <Button
                  disabled={false}
                  funCallback={handleSubmit(onsubmit)}
                  label={i18n.translate("register")}
                  success={true}
                  bgColor={colors.primary2}
                  borderColor={colors.white}
                  borderWidth={0.2}
                />

                <View>
                  <View style={styles.infoTextViewStyle}>
                    <H8fontMediumWhite>
                      {i18n.translate("alreadyAccount")}{" "}
                    </H8fontMediumWhite>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate(
                          screenName.SignInScreenClinic as any
                        )
                      }
                    >
                      <H8fontMediumPrimary>
                        {i18n.translate("registerLogin")}
                      </H8fontMediumPrimary>
                    </TouchableOpacity>
                  </View>
                  {/* <View style={styles.borderLineStyle}>
                  <CommonLineView />
                </View> */}
                </View>
              </View>
            </KeyboardAvoidingView>
          </LinearGradient>
        </MainContainer>
      </Fragment>
    </TouchableWithoutFeedback>
  );
};
export default SignUpScreenClinic;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    width: "100%",
    height: "100%",
    paddingBottom: 100,
    // Alte stiluri necesare pentru a pozitiona gradientul după cum este necesar
  },
  subContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 15,
    justifyContent: "center",
  },
  infoTextViewStyle: {
    paddingTop: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  socialMediaIconStyle: { height: 15, width: 22, alignSelf: "center" },

  socialMediaFBIconStyle: { alignItems: "center", justifyContent: "center" },
  borderLineStyle: { paddingTop: 10 },
  footerComponentView: { paddingTop: 30 },
  passwordIconStyle: { justifyContent: "center", alignItems: "center" },
  userIconsStyle: {
    height: 20,
    width: 20,
    alignSelf: "center",
    justifyContent: "center",
  },
});
