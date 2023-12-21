import React, { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  Image,
  StyleSheet,
  FlatList,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { authentication, db } from "../../firebase";
import { screenName } from "../utils/screenName";
import { useDispatch, useSelector } from "react-redux";
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
  getClinicsOfPatient,
  getPatientAppointments,
  getPatientInfo,
  setTemporaryPatientClinicReview,
  setTemporaryPatientReview,
  getAllClinicsSearchDashboard,
  getGuestLoginDetails,
} from "../actions/patientActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from "lottie-react-native";
import { ActivityIndicator } from "react-native-paper";
import { handleSignOutFromSignIn } from "../utils/handleSignOut";
import { doc, getDoc } from "firebase/firestore";
import i18n from "../../i18n";
import { handleGetGuestDetails } from "../utils/loginAsGuestHelper";
import { getTimeFormat } from "../actions/comonActions";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../utils/colors";
import {
  H2fontBoldPrimary,
  H6fontBoldPrimary,
  H7fontBoldPrimary,
  H7fontRegularLight,
} from "../components/commonText";
import { useAuth } from "../context/AuthContext";
// import AppStackClinic from '../navigation/AppStackClinic';

const { width, height } = Dimensions.get("window");

const COLORS = { primary: colors.primary2, white: "#fff" };

const slides = [
  // {
  //   id: "1",
  //   image: require("../../assets/LogoPngTransparent.png"),
  //   title: i18n.translate("onboardingFirstTitle"),
  //   subtitle: i18n.translate("onboardingFirstTitleMessage"),
  // },
  {
    id: "2",
    image: require("../../assets/onboardImg.png"),
    title: i18n.translate("onboardingSecondTitle"),
    subtitle: i18n.translate("onboardingSecondTitleMessage"),
  },
  // {
  //   id: "3",
  //   image: require("../../assets/Onboarding2.png"),
  //   title: i18n.translate("onboardingThirdTitle"),
  //   subtitle: i18n.translate("onboardingThirdTitleMessage"),
  // },
];

const Slide = ({ item }) => {
  return (
    <View style={{ alignItems: "center", position: "relative", top: "12%" }}>
      {/* Condiție pentru a verifica tipul fișierului și a alege între LottieView și Image */}

      <Image
        source={require("../../assets/headerIcon.png")}
        style={{ width: 300, height: 200 }}
        resizeMode="contain" // Aceasta va asigura că întreaga imagine se va încadra în spațiul disponibil, păstrând proporțiile.
      />
      <Image
        source={item.image}
        style={{
          height: 350,
          width: 350,
          position: "relative",
          bottom: "10%",
          resizeMode: "contain",
        }}
      />
      {/* Restul componentei rămâne neschimbat */}
      <View
        style={{
          width,
          resizeMode: "contain",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          bottom: "15%",
        }}
      >
        <H7fontRegularLight style={styles.subtitle}>
          {i18n.translate("welcomeTo")}
        </H7fontRegularLight>
        <H2fontBoldPrimary>{i18n.translate("tarotByAi")}</H2fontBoldPrimary>
        <Image
          source={require("../../assets/onboardSubImg.png")}
          style={{ width: 200, height: 100 }}
          resizeMode="contain" // Aceasta va asigura că întreaga imagine se va încadra în spațiul disponibil, păstrând proporțiile.
        />
      </View>
    </View>
  );
};

const OnboardingScreen = ({ navigation }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);

  const auth = authentication;
  const isFocused = useIsFocused();

  const dispatch = useDispatch();

  const ref = React.useRef();

  // if (isLoading) {
  //   return (
  //     <View style={[styles.container, styles.horizontal]}>
  //       <ActivityIndicator size="large" />
  //     </View>
  //   );
  // }

  const updateCurrentSlideIndex = (e) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentSlideIndex(currentIndex);
  };

  const goToNextSlide = () => {
    const nextSlideIndex = currentSlideIndex + 1;
    if (nextSlideIndex != slides.length) {
      const offset = nextSlideIndex * width;
      ref?.current.scrollToOffset({ offset });
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const skip = () => {
    const lastSlideIndex = slides.length - 1;
    const offset = lastSlideIndex * width;
    ref?.current.scrollToOffset({ offset });
    setCurrentSlideIndex(lastSlideIndex);
  };

  const Footer = () => {
    return (
      <View
        style={{
          height: height * 0.15,
          justifyContent: "space-between",
          paddingHorizontal: 20,
        }}
      >
        {/* Indicator container */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 20,
          }}
        >
          {/* Render indicator */}
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentSlideIndex == index && {
                  backgroundColor: COLORS.white,
                  width: 25,
                },
              ]}
            />
          ))}
        </View>

        {/* Render buttons */}
        <View style={{ marginBottom: 20 }}>
          {currentSlideIndex == slides.length - 1 ? (
            <View
              style={{
                height: 50,
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <TouchableOpacity
                style={[styles.btnTwo, { backgroundColor: colors.primary2 }]}
                onPress={() =>
                  navigation.replace(screenName.languageSelectScreen)
                }
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 15,
                    color: colors.secondary2,
                  }}
                >
                  {i18n.translate("clinicLoginRedirect")}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.btn,
                  {
                    borderColor: colors.primary2,
                    borderWidth: 1,
                    backgroundColor: "transparent",
                  },
                ]}
                onPress={skip}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 15,
                    color: colors.primary2,
                  }}
                >
                  {i18n.translate("skip")}
                </Text>
              </TouchableOpacity>
              <View style={{ width: 15 }} />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={goToNextSlide}
                style={styles.btn}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 15,
                    color: colors.secondary2,
                  }}
                >
                  {i18n.translate("nextOnboard")}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={[
          colors.gradientLogin1,
          colors.gradientLogin2,
          colors.gradientLogin2,
          colors.gradientLogin1,
          colors.gradientLogin3,
        ]} // Înlocuiește cu culorile gradientului tău
        style={styles.gradient}
      >
        {/* <StatusBar backgroundColor={COLORS.primary} /> */}
        <FlatList
          ref={ref}
          onMomentumScrollEnd={updateCurrentSlideIndex}
          contentContainerStyle={{ height: "100%" }}
          showsHorizontalScrollIndicator={false}
          horizontal
          data={slides}
          pagingEnabled
          renderItem={({ item }) => <Slide item={item} />}
        />
        <Footer />
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    width: "100%",
    height: "100%",

    // Alte stiluri necesare pentru a pozitiona gradientul după cum este necesar
  },
  subtitle: {
    color: colors.primary2,
    fontSize: 13,
    marginTop: 10,
    maxWidth: "70%",
    textAlign: "center",
    lineHeight: 23,
  },
  title: {
    color: colors.primary2,
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
  },
  image: {
    height: "100%",
    width: "100%",
    resizeMode: "contain",
  },
  indicator: {
    height: 2.5,
    width: 10,
    backgroundColor: "grey",
    marginHorizontal: 3,
    borderRadius: 2,
  },
  btn: {
    flex: 1,
    height: 50,
    width: 150,
    borderRadius: 5,
    backgroundColor: colors.primary2,
    justifyContent: "center",
    alignItems: "center",
  },
  btnTwo: {
    // flex: 1,
    height: 50,
    width: "80%",
    borderRadius: 5,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 10,
    width: "100%",
  },
});
export default OnboardingScreen;
