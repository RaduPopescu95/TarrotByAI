import React, { Component, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { screenName } from "./src/utils/screenName";

import DashBoardScreen from "./src/pages/dashboard";
import SideMenu from "./src/pages/sideMenu";
import PatientAppointments from "./src/pages/patients/patientAppointment";
import AppointmentList from "./src/pages/patients/appointmentsClinic";
import PrescriptionList from "./src/pages/patients/prescriptions";
import MedicalRecords from "./src/pages/patients/medicalRecords";
import Billing from "./src/pages/patients/billing";
import DoctorProfile from "./src/pages/doctors/doctorProfile";
import DoctorOverView from "./src/pages/doctors/doctorOverview";
import LocationView from "./src/pages/doctors/location";
import Reviews from "./src/pages/doctors/reviews";
import HoursView from "./src/pages/doctors/hours";
import PatientProfile from "./src/pages/patients/patientProfile";
import PatientOverView from "./src/pages/patients/overView";
import MyPatient from "./src/pages/doctors/myPatient";
import DoctorDashBoard from "./src/pages/doctors/doctorDashboard";
import CircularProgress from "./src/components/circularProgress";
import InvoiceList from "./src/pages/invoiceList";
import InvoiceView from "./src/pages/invoiceView";
import FavouritesScreen from "./src/pages/favourites";
import NotificationScreen from "./src/pages/notifications";
import Pages from "./src/pages/pages";
import SearchDoctor from "./src/pages/showAllDoctorsLinked";
import SocialMedia from "./src/pages/socialMedia";
import ClinicProfileSettings from "./src/pages/ClinicProfileSettings";
import BasicInfo from "./src/pages/profileSettings/basicInfo";
import AboutMe from "./src/pages/profileSettings/aboutMe";
import ClinicInfo from "./src/pages/profileSettings/clinicInfo";
import ContactDetails from "./src/pages/profileSettings/contactDetails";
import Pricing from "./src/pages/profileSettings/pricing";
import Education from "./src/pages/profileSettings/education";
import Awards from "./src/pages/profileSettings/awards";
import Registrations from "./src/pages/profileSettings/registraction";
import ChatList from "./src/pages/chatListClinic";
import ChatView from "./src/pages/chatViewClinic";
import ScheduleTimings from "./src/pages/doctors/scheduleTimings";
import BookAppointment from "./src/pages/bookAppointment";
import VoiceCall from "./src/pages/voiceCall";
import VideoCall from "./src/pages/videoCall";
import OnboardingScreen from "./src/pages/OnboardingScreen";
// import SignInScreenClinic from './src/pages/SignInScreenClinic';
// import SignUpScreenClinic from './src/pages/SignUpScreenClinic';
// import SignUpScreenPatient from './src/pages/SignUpScreenPatient';
// import SignInScreenPatient from './src/pages/SignInScreenPatient';
import SignInScreenClinic from "./src/pages/signInScreenClinic";
import SignUpScreenClinic from "./src/pages/signUpScreenClinic";
import SignUpScreenPatient from "./src/pages/signUpScreenPatient";
import SignInScreenPatient from "./src/pages/signInScreenPatient";

import ForgotPasswordClinic from "./src/pages/forgotPasswordClinic";
import ForgotPasswordPatient from "./src/pages/forgotPasswordPatient";
import ChangePasswordClinic from "./src/pages/changePasswordClinic";
import ChangePasswordPatient from "./src/pages/changePasswordPatient";
import ClinicCalendar from "./src/pages/doctors/clinicCalendar";
import ClinicCalendarTime from "./src/pages/ClinicCalendarTime";
import ProfileSettingsPatient from "./src/pages/profileSettingsPatient";
import myProfilePatient from "./src/pages/patients/myProfilePatient";

import Checkout from "./src/pages/checkout";

import CheckAppointmentClinic from "./src/pages/checkAppointmentClinic";

import clinicAppointments from "./src/pages/doctors/appointmentsClinic";
import ChatListClinic from "./src/pages/chatListClinic";
import ChatListPatient from "./src/pages/chatListPatient";
import ChatViewClinic from "./src/pages/chatViewClinic";
import ChatViewPatient from "./src/pages/chatViewPatient";
import PatientCalendarTime from "./src/pages/PatientCalendarTime";
import ClinicAppointmentsDay from "./src/pages/doctors/appointmentsClinicDay";
import TermsConditionsClinic from "./src/pages/doctors/TermsConditionsClinic";
import TermsConditionsPatient from "./src/pages/patients/TermsConditionsPatient";
import BookingCanceledClinic from "./src/pages/doctors/bookingCanceledClinic";
import DoctorProfileSettings from "./src/pages/doctors/DoctorProfileSettings";
import ClinicDashboard from "./src/pages/doctors/ClinicDashboard";
import ClinicDoctors from "./src/pages/doctors/ClinicDoctors";
import DoctorScheduleTimings from "./src/pages/doctors/DoctorScheduleTimings";
import DoctorCalendarTime from "./src/pages/doctors/DoctorCalendarTime";
import PatientSearchDashboard from "./src/pages/patients/PatientSearchDashboard";
import SearchResultPatient from "./src/pages/patients/SearchResultPatient";
import ShowAllDoctorsLinked from "./src/pages/showAllDoctorsLinked";
import AroundPatient from "./src/pages/patients/DocAroundPatient";
import DocAroundPatient from "./src/pages/patients/DocAroundPatient";
import ClinicsAroundPatient from "./src/pages/patients/ClinicsAroundPatient";
import ClinicDoctorsPatient from "./src/pages/patients/ClinicDoctorsPatient";
import DoctorCalendarTimePatient from "./src/pages/patients/DoctorCalendarTimePatient";
import UserSettingsPatient from "./src/pages/UserSettingsPatient";
import ClinicProfile from "./src/pages/doctors/ClinicProfile";
import PatientFeedback from "./src/pages/PatientFeedback";
import ClinicFeedback from "./src/pages/doctors/ClinicFeedback";
import ChangePhoneClinic from "./src/pages/doctors/changePhoneClinic";
import ChangeEmailClinic from "./src/pages/changeEmailClinic";
import ChangeEmailPatient from "./src/pages/ChangeEmailPatient";
import ChangePhonePatient from "./src/pages/patients/ChangePhonePatient";
import { SettingsPage } from "./src/pages/SettingsPage";

import PaywallScreen from "./src/pages/PaywallScreen/PawywallScreen";
import PatientInformation from "./src/pages/PatientInformation";
import GuestAppointemnts from "./src/pages/patients/GuestAppointments";
import ClinicAllDoctorsCalendar from "./src/pages/ClinicAllDoctorsCalendar";
import { ErrorView } from "./src/components/ErrorView";
import Bugsnag from "@bugsnag/expo";
import ClinicHistoryPatient from "./src/pages/patients/ClinicHistoryPatient";
import GuestPhoneInputModal from "./src/components/GuestPhoneInputModal";
import Dashboard2 from "./src/pages/doctors/Dashboard2";

import NavBarBottom from "./src/components/Navbar";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import TarrotSettings from "./src/pages/TarrotSettings";
import { authentication } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import HistoryTarrot from "./src/pages/HistoryTarrot";
import LanguageSelectScreen from "./src/pages/LangueageSelect";
import { useAuth } from "./src/context/AuthContext";
import LuckyColor from "./src/pages/LuckyColorComponent/LuckyColorComponent";
import {
  NavBarVisibilityProvider,
  useNavBarVisibility,
} from "./src/context/NavbarVisibilityContext";
import LuckyNumberColor from "./src/pages/LuckyNumberComponent/LuckyNumberComponent";
import PersonalReadingDashboard from "./src/pages/doctors/PeronalReadingDashboard";
import PersonalizedReading from "./src/pages/PersonalizedReading/PersonalizedReading";
import FutureReadingDashboard from "./src/pages/doctors/FutureReadingDashboard";
import FutureReading from "./src/pages/FutureReading/FutureReading";
import LuckyHour from "./src/pages/LuckyHourComponent/LuckyHourComponent";
import MotivationalQuotes from "./src/pages/MotivationalQuotesComponent/MotivationalQuotes";
import LuckyNumber from "./src/pages/LuckyNumberComponent/LuckyNumberComponent";

const Stack = createNativeStackNavigator();

interface NavigationProps {
  initialRouteName: string;
}

const HomeNavigation = (props: NavigationProps) => {
  const [isUser, setIsUser] = useState(false);
  const { isNavBarVisible } = useNavBarVisibility();
  onAuthStateChanged(authentication, (user) => {
    if (user) {
      // User is signed in, you can use the 'user' object to get user information
      // console.log("User is authenticated:", user);
      setIsUser(true);
    } else {
      // No user is signed in.
      setIsUser(false);
      console.log("User is not authenticated");
    }
  });
  return (
    <LinearGradient
      colors={["#000000", "#434343"]} // Înlocuiește cu culorile gradientului tău
      style={styles.container}
    >
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={props.initialRouteName}
      >
        <Stack.Screen
          name={screenName.OnboardingScreen}
          component={OnboardingScreen}
        />
        <Stack.Screen
          name={screenName.languageSelectScreen}
          component={LanguageSelectScreen}
        />

        <Stack.Screen
          name={screenName.PersonalizedReading}
          component={PersonalizedReading}
        />
        <Stack.Screen
          name={screenName.FutureReading}
          component={FutureReading}
        />
        <Stack.Screen
          name={screenName.FutureReadingDashboard}
          component={FutureReadingDashboard}
        />
        <Stack.Screen
          name={screenName.SignInScreenClinic}
          component={SignInScreenClinic}
        />
        <Stack.Screen
          name={screenName.SignUpScreenClinic}
          component={SignUpScreenClinic}
        />

        <Stack.Screen
          name={screenName.motivationalQuotes}
          component={MotivationalQuotes}
        />
        <Stack.Screen name={screenName.luckyHour} component={LuckyHour} />
        <Stack.Screen name={screenName.luckyColor} component={LuckyColor} />
        <Stack.Screen name={screenName.luckyNumber} component={LuckyNumber} />

        <Stack.Screen name={"TarrotSettings"} component={TarrotSettings} />

        <Stack.Screen
          name={screenName.ForgotPasswordClinic}
          component={ForgotPasswordClinic}
        />

        <Stack.Screen
          name={screenName.ChangePasswordClinic}
          component={ChangePasswordClinic}
        />

        <Stack.Screen
          name={screenName.DashBoardScreen}
          component={DashBoardScreen}
        />

        <Stack.Screen
          name={screenName.Subscription}
          component={PaywallScreen}
        />

        <Stack.Screen
          name={screenName.ClinicDashBoard}
          component={ClinicDashboard}
        />

        <Stack.Screen name="Dashboard2" component={Dashboard2} />
        <Stack.Screen
          name={screenName.PersonalReadingDashboard}
          component={PersonalReadingDashboard}
        />

        <Stack.Screen
          name={screenName.historyTarrot}
          component={HistoryTarrot}
        />
        {/* <Stack.Screen name={screenName.VoiceCall} component={VoiceCall} /> */}
        {/* <Stack.Screen name={screenName.VideoCall} component={VideoCall} /> */}
      </Stack.Navigator>
      {isUser && isNavBarVisible && <NavBarBottom />}
    </LinearGradient>
  );
};

const RootNavigation = () => {
  const { currentUser } = useAuth();
  const screen = currentUser
    ? screenName.SignInScreenClinic
    : screenName.OnboardingScreen;

  return <HomeNavigation initialRouteName={screen} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 1,
  },
});

export default RootNavigation;
