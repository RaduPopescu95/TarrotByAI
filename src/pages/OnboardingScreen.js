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
// import AppStackClinic from '../navigation/AppStackClinic';

const { width, height } = Dimensions.get("window");

const COLORS = { primary: "#282534", white: "#fff" };

const slides = [
  {
    id: "1",
    image: require("../images/first.json"),
    title: i18n.translate("onboardingFirstTitle"),
    subtitle: i18n.translate("onboardingFirstTitleMessage"),
  },
  {
    id: "2",
    image: require("../images/second.json"),
    title: i18n.translate("onboardingSecondTitle"),
    subtitle: i18n.translate("onboardingSecondTitleMessage"),
  },
  {
    id: "3",
    image: require("../images/third.json"),
    title: i18n.translate("onboardingThirdTitle"),
    subtitle: i18n.translate("onboardingThirdTitleMessage"),
  },
];

const Slide = ({ item }) => {
  return (
    <View style={{ alignItems: "center" }}>
      {/* <Image
        source={item?.image}
        style={{height: '75%', width, resizeMode: 'contain'}}
      /> */}
      <View
        style={{
          height: "65%",
          width,
          resizeMode: "contain",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LottieView
          autoPlay={false}
          // ref={animation}
          progress={0.5}
          loop={false}
          style={{
            width: item.id === "1" ? 200 : 300,
            height: item.id === "1" ? 200 : 300,
            // backgroundColor: '#eee',
          }}
          // Find more Lottie files at https://lottiefiles.com/featured
          source={item.image}
        />
      </View>
      <View
        style={{
          width,
          resizeMode: "contain",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={styles.title}>{item?.title}</Text>
        <Text style={styles.subtitle}>{item?.subtitle}</Text>
      </View>
    </View>
  );
};

const OnboardingScreen = ({ navigation }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState("");

  const patientInfoDB = useSelector((state) => state.patientInfoData);
  const { patientInformation, loading: patientLoading } = patientInfoDB;

  const clinicInfoDB = useSelector((state) => state.clinicInfoData);
  const { clinicInformation, loading } = clinicInfoDB;

  const auth = authentication;
  const isFocused = useIsFocused();

  const dispatch = useDispatch();

  const animation = useRef(null);

  // const getValueFunction = () => {
  //   //function to get the value from AsyncStorage
  //   AsyncStorage.getItem('userType').then(
  //     (value) =>
  //       //AsyncStorage returns a promise so adding a callback to get the value
  //       setUserType(value)
  //     //Setting the value in Text
  //   );
  // };

  const handleChangeAuthState = async (user) => {
    try {
      const value = await AsyncStorage.getItem("userType");
      if (value !== null) {
        // value previously stored
        // console.log('value...', value);
        if (value === "Clinic") {
          const docRef = doc(db, "Users", user.uid);
          const docSnap = await getDoc(docRef);
          dispatch(getClinicDoctors())
            .then(() => {})
            .then(() => {
              dispatch(getClinicAppointments());
            })
            .then(() => {
              dispatch(getClinicInfo()).then(() => {
                if (docSnap.exists()) {
                  if (!docSnap.data().hasProfile) {
                    console.log("---second yes--CLINIC");

                    if (docSnap.data().termsConditions) {
                      console.log(
                        "---patientInformation.termsConditions exists--"
                      );
                      if (!docSnap.data().termsConditions.isAccepted) {
                        console.log(
                          "---patientInformation.termsConditions not accepted--"
                        );
                        navigation.navigate(screenName.termConditionsClinic, {
                          isAccepted: docSnap.data().termsConditions.isAccepted,
                        });
                      } else if (!docSnap.data().basicInfoData) {
                        console.log("---not basic info data--");

                        navigation.navigate(screenName.ClinicProfileSettings);
                      }
                    }
                  } else {
                    navigation.navigate(screenName.ClinicDashBoard);
                  }
                }
              });
            });

          // navigation.navigate(AppStackClinic);
          // console.log('user....testing2 clinic');
        } else if (value === "Patient") {
          const docRef = doc(db, "Users", user.uid);
          const docSnap = await getDoc(docRef);

          dispatch(getPatientInfo()).then(() => {
            if (docSnap.exists()) {
              if (!docSnap.data().hasProfile) {
                console.log("---second yes--PATIENT");

                if (docSnap.data().termsConditions) {
                  console.log("---patientInformation.termsConditions exists--");
                  console.log(docSnap.data().basicInfoData);
                  if (!docSnap.data().termsConditions.isAccepted) {
                    console.log(
                      "---patientInformation.termsConditions not accepted--"
                    );
                    navigation.navigate(screenName.termConditionsPatients, {
                      isAccepted: docSnap.data().termsConditions.isAccepted,
                    });
                  } else if (!docSnap.data().hasProfile) {
                    console.log("---not basic info data--");

                    navigation.navigate(screenName.ProfileSettingsPatient);
                  }
                }
              } else {
                navigation.navigate(screenName.PatientSearchDashboard);
              }
            }
          });
          // dispatch(getAllClinicsSearchDashboard()).then(() =>{

          // });
        }
        // setUserType(value);
        // return value;
      }
    } catch (e) {
      // error reading valuezz
      console.log("Error getting async storage info", e);
    }
  };

  const handleNoUser = async () => {
    setIsLoading(false);
    const guestDetails = await handleGetGuestDetails();
    console.log("guestDetails---------=");
    console.log(guestDetails);
    if (guestDetails) {
      if (guestDetails.isGuest) {
        navigation.navigate(screenName.SignInScreenPatient);
      }
    }
  };

  useEffect(() => {
    // handleSignOutFromSignIn()
    // getValueFunction()

    // console.log('asdadadad ONBOARD');

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // console.log('is user...');
        navigation.navigate(screenName.ClinicDashBoard);
      } else {
        navigation.navigate(screenName.SignInScreenClinic);
      }
    });

    return unsubscribe;

    // You can control the ref programmatically, for lottie rather than using autoPlay
    // animation.current?.play();
  }, [isFocused]);

  const ref = React.useRef();

  if (isLoading) {
    return (
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

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
          height: height * 0.25,
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
                style={[styles.btnTwo, { backgroundColor: "white" }]}
                onPress={() => navigation.replace("SignInScreenClinic")}
              >
                <Text
                  style={{ fontWeight: "bold", fontSize: 15, color: "black" }}
                >
                  {i18n.translate("clinicLoginRedirect")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnTwo}
                onPress={() => navigation.replace("SignInScreenPatient")}
              >
                <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                  {i18n.translate("patientLoginRedirect")}
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
                    borderColor: COLORS.white,
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
                    color: COLORS.white,
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
      <ImageBackground
        source={require("../images/onboardingBG.jpeg")}
        resizeMode="cover"
        style={{ height: "100%", width: "100%" }}
      >
        {/* <StatusBar backgroundColor={COLORS.primary} /> */}
        <FlatList
          ref={ref}
          onMomentumScrollEnd={updateCurrentSlideIndex}
          contentContainerStyle={{ height: height * 0.75 }}
          showsHorizontalScrollIndicator={false}
          horizontal
          data={slides}
          pagingEnabled
          renderItem={({ item }) => <Slide item={item} />}
        />
        <Footer />
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    color: COLORS.white,
    fontSize: 13,
    marginTop: 10,
    maxWidth: "70%",
    textAlign: "center",
    lineHeight: 23,
  },
  title: {
    color: COLORS.white,
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
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  btnTwo: {
    // flex: 1,
    height: 50,
    width: 150,
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
