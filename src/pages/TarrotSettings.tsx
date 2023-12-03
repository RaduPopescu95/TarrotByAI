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
  H7fontMediumPrimary,
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
import {
  createUserWithEmailAndPassword,
  signOut,
  updateEmail,
  updatePassword,
} from "firebase/auth";
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
import { handleChangePassword, handleLogout } from "../utils/authUtils";
import CheckCurrentPasswordModal from "../components/CheckCurrentPasswordModal";

interface Props extends GeneralProps {
  route: Route<string, object | undefined>;
}

const TarrotSettings: React.FC<Props> = ({ navigation }): JSX.Element => {
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

  const passwordValue = watch(formKeys.password);

  const route = useRoute();
  const [currentPassword, setCurrentPassword] = useState("");
  const [registerType, setRegisterType] = useState("email");
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  let pwd = watch("password");
  const auth = authentication;

  const [selectedCountry, setSelectedCountry] = useState<undefined | ICountry>(
    getCountryByCca2("RO")
  );

  function handleSelectedCountry(country: ICountry) {
    setSelectedCountry(country);
  }

  const onsubmit = (detaila) => {
    console.log("asas", currentPassword);
    console.log("asas", currentPassword.length);
    if (passwordValue && currentPassword.length == 0) {
      console.log("first");
      setModalVisible(true);
    } else if (passwordValue && currentPassword.length > 0) {
      console.log("second");
      handleChangePassword(currentPassword, passwordValue);
    }
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
            <ScrollView>
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
                          required: passwordValue
                            ? requiredValidation(
                                i18n.translate("createPassword")
                              )
                            : undefined,
                          minLength: passwordValue
                            ? minLengthValidation(
                                validationSchema.password.minLength
                              )
                            : undefined,
                          // Poți adăuga aici alte validări pentru complexitate, dacă este necesar.
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
                          validate: passwordValue
                            ? (value) =>
                                value === passwordValue ||
                                i18n.translate("passDontMatch")
                            : undefined,
                        }}
                      />
                    )}
                  </View>

                  <Button
                    disabled={false}
                    funCallback={handleSubmit(onsubmit)}
                    label={i18n.translate("saveChanges")}
                    success={true}
                    bgColor={colors.primary2}
                    borderColor={colors.white}
                    borderWidth={0.2}
                  />

                  <View>
                    <View style={styles.infoTextViewStyle}>
                      <TouchableOpacity
                        onPress={() => {
                          handleLogout().then(() => {
                            navigation.navigate(
                              screenName.SignInScreenClinic as any
                            );
                          });
                        }}
                      >
                        <H7fontMediumPrimary>
                          {i18n.translate("logOut")}
                        </H7fontMediumPrimary>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.infoTextViewStyle}>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate(
                            screenName.SignInScreenClinic as any
                          )
                        }
                      >
                        <H7fontMediumPrimary>
                          {i18n.translate("deleteAccount")}
                        </H7fontMediumPrimary>
                      </TouchableOpacity>
                    </View>
                    {/* <View style={styles.borderLineStyle}>
                  <CommonLineView />
                </View> */}
                  </View>
                </View>
              </KeyboardAvoidingView>
            </ScrollView>
            <CheckCurrentPasswordModal
              setIsModalVisible={setModalVisible}
              isModalVisible={modalVisible}
              setCurrentPassword={setCurrentPassword}
              handleSubmit={handleSubmit(onsubmit)}
            />
          </LinearGradient>
        </MainContainer>
      </Fragment>
    </TouchableWithoutFeedback>
  );
};
export default TarrotSettings;

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
