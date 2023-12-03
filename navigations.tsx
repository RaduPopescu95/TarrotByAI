import React, { Component, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { screenName } from "./src/utils/screenName";

import BookingSuccess from "./src/pages/bookingSuccess";
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
import AppointmentsPatient from "./src/pages/patients/PastAppointmentsPatient";
import Checkout from "./src/pages/checkout";
import CheckAppointmentPatient from "./src/pages/checkAppointmentPatient";
import CheckAppointmentClinic from "./src/pages/checkAppointmentClinic";
import BookingSuccessClinic from "./src/pages/bookingSuccessClinic";

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

const Stack = createNativeStackNavigator();

interface NavigationProps {
  initialRouteName: string;
}

const HomeNavigation = (props: NavigationProps) => {
  const [isUser, setIsUser] = useState(false);
  onAuthStateChanged(authentication, (user) => {
    if (user) {
      // User is signed in, you can use the 'user' object to get user information
      console.log("User is authenticated:", user);
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
          name={screenName.SignInScreenClinic}
          component={SignInScreenClinic}
        />
        <Stack.Screen
          name={screenName.SignUpScreenClinic}
          component={SignUpScreenClinic}
        />
        <Stack.Screen name={"TarrotSettings"} component={TarrotSettings} />
        <Stack.Screen
          name={screenName.SignUpScreenPatient}
          component={SignUpScreenPatient}
        />
        <Stack.Screen
          name={screenName.SignInScreenPatient}
          component={SignInScreenPatient}
        />
        <Stack.Screen
          name={screenName.ForgotPasswordClinic}
          component={ForgotPasswordClinic}
        />
        <Stack.Screen
          name={screenName.ForgotPasswordPatient}
          component={ForgotPasswordPatient}
        />
        <Stack.Screen
          name={screenName.ChangePasswordClinic}
          component={ChangePasswordClinic}
        />
        <Stack.Screen
          name={screenName.ChangeEmailClinic}
          component={ChangeEmailClinic}
        />
        <Stack.Screen
          name={screenName.ChangeEmailPatient}
          component={ChangeEmailPatient}
        />
        <Stack.Screen
          name={screenName.ChangePhonePatient}
          component={ChangePhonePatient}
        />
        <Stack.Screen
          name={screenName.ChangePhoneClinic}
          component={ChangePhoneClinic}
        />
        <Stack.Screen
          name={screenName.ChangePasswordPatient}
          component={ChangePasswordPatient}
        />
        <Stack.Screen
          name={screenName.BookingSuccess}
          component={BookingSuccess}
        />
        <Stack.Screen
          name={screenName.BookingSuccessClinic}
          component={BookingSuccessClinic}
        />
        <Stack.Screen
          name={screenName.BookingCanceledClinic}
          component={BookingCanceledClinic}
        />
        <Stack.Screen
          name={screenName.DashBoardScreen}
          component={DashBoardScreen}
        />
        <Stack.Screen name={screenName.SideMenu} component={SideMenu} />
        <Stack.Screen
          name={screenName.PatientAppointments}
          component={PatientAppointments}
        />
        <Stack.Screen
          name={screenName.clinicAppointments}
          component={clinicAppointments}
        />
        <Stack.Screen
          name={screenName.clinicAppointmentsDay}
          component={ClinicAppointmentsDay}
        />
        <Stack.Screen
          name={screenName.AppointmentsPatient}
          component={AppointmentsPatient}
        />
        <Stack.Screen
          name={screenName.Subscription}
          component={PaywallScreen}
        />
        <Stack.Screen
          name={screenName.clinicAllDoctorsCalendar}
          component={ClinicAllDoctorsCalendar}
        />
        {/* <Stack.Screen name={screenName.PrescriptionList} component={PrescriptionList} /> */}
        {/* <Stack.Screen name={screenName.MedicalRecords} component={MedicalRecords} /> */}
        {/* <Stack.Screen name={screenName.Billing} component={Billing} /> */}
        <Stack.Screen
          name={screenName.DoctorProfile}
          component={DoctorProfile}
        />
        <Stack.Screen
          name={screenName.ClinicProfile}
          component={ClinicProfile}
        />
        <Stack.Screen name={screenName.Feedback} component={PatientFeedback} />
        <Stack.Screen
          name={screenName.ClinicFeedback}
          component={ClinicFeedback}
        />
        {/* <Stack.Screen name={screenName.DoctorOverView} component={DoctorOverView} /> */}
        {/* <Stack.Screen name={screenName.LocationView} component={LocationView} /> */}
        {/* <Stack.Screen name={screenName.Reviews} component={Reviews} /> */}
        {/* <Stack.Screen name={screenName.HoursView} component={HoursView} /> */}
        <Stack.Screen
          name={screenName.PatientProfile}
          component={PatientProfile}
        />
        <Stack.Screen
          name={screenName.SearchResultPatient}
          component={SearchResultPatient}
        />
        <Stack.Screen
          name={screenName.myProfilePatient}
          component={myProfilePatient}
        />
        {/* <Stack.Screen name={screenName.PatientOverView} component={PatientOverView} /> */}
        <Stack.Screen name={screenName.MyPatient} component={MyPatient} />
        <Stack.Screen
          name={screenName.ClinicDoctors}
          component={ClinicDoctors}
        />
        <Stack.Screen
          name={screenName.ClinicDoctorsPatient}
          component={ClinicDoctorsPatient}
        />
        <Stack.Screen
          name={screenName.saloonHistory}
          component={ClinicHistoryPatient}
        />
        <Stack.Screen
          name={screenName.DoctorDashBoard}
          component={DoctorDashBoard}
        />
        <Stack.Screen
          name={screenName.ClinicDashBoard}
          component={ClinicDashboard}
        />

        <Stack.Screen
          name={screenName.PatientSearchDashboard}
          component={PatientSearchDashboard}
        />
        <Stack.Screen name={screenName.SettingsPage} component={SettingsPage} />
        {/* <Stack.Screen name={screenName.CircularProgress} component={CircularProgress} /> */}
        {/* <Stack.Screen name={screenName.InvoiceList} component={InvoiceList} /> */}
        {/* <Stack.Screen name={screenName.InvoiceView} component={InvoiceView} /> */}
        {/* <Stack.Screen name={screenName.FavouritesScreen} component={FavouritesScreen} /> */}
        {/* <Stack.Screen name={screenName.NotificationScreen} component={NotificationScreen} /> */}
        {/* <Stack.Screen name={screenName.Pages} component={Pages} /> */}
        <Stack.Screen
          name={screenName.SearchDoctor}
          component={ShowAllDoctorsLinked}
        />
        <Stack.Screen
          name={screenName.DocAroundPatient}
          component={DocAroundPatient}
        />
        <Stack.Screen
          name={screenName.ClinicsAroundPatient}
          component={ClinicsAroundPatient}
        />
        {/* <Stack.Screen name={screenName.SocialMedia} component={SocialMedia} /> */}
        <Stack.Screen
          name={screenName.ClinicProfileSettings}
          component={ClinicProfileSettings}
        />
        <Stack.Screen
          name={screenName.DoctorProfileSettings}
          component={DoctorProfileSettings}
        />
        <Stack.Screen
          name={screenName.ProfileSettingsPatient}
          component={ProfileSettingsPatient}
        />
        <Stack.Screen
          name={screenName.UserSettingsPatient}
          component={UserSettingsPatient}
        />
        <Stack.Screen
          name={screenName.myGuestAppointments}
          component={GuestAppointemnts}
        />
        {/* <Stack.Screen name={screenName.BasicInfo} component={BasicInfo} /> */}
        {/* <Stack.Screen name={screenName.AboutMe} component={AboutMe} /> */}
        {/* <Stack.Screen name={screenName.ClinicInfo} component={ClinicInfo} /> */}
        {/* <Stack.Screen name={screenName.ContactDetails} component={ContactDetails} /> */}
        {/* <Stack.Screen name={screenName.Pricing} component={Pricing} /> */}
        {/* <Stack.Screen name={screenName.Education} component={Education} /> */}
        {/* <Stack.Screen name={screenName.Awards} component={Awards} /> */}
        {/* <Stack.Screen name={screenName.Registrations} component={Registrations} /> */}
        <Stack.Screen
          name={screenName.ChatListClinic}
          component={ChatListClinic}
        />

        <Stack.Screen name="Dashboard2" component={Dashboard2} />

        <Stack.Screen
          name={screenName.ChatListPatient}
          component={ChatListPatient}
        />
        <Stack.Screen
          name={screenName.ChatViewClinic}
          component={ChatViewClinic}
        />
        <Stack.Screen
          name={screenName.ChatViewPatient}
          component={ChatViewPatient}
        />
        <Stack.Screen
          name={screenName.ScheduleTimings}
          component={ScheduleTimings}
        />
        <Stack.Screen
          name={screenName.DoctorScheduleTimings}
          component={DoctorScheduleTimings}
        />
        <Stack.Screen
          name={screenName.ClinicCalendar}
          component={ClinicCalendar}
        />
        {/* <Stack.Screen name={screenName.BookAppointment} component={BookAppointment} /> */}
        <Stack.Screen
          name={screenName.ClinicCalendarTime}
          component={ClinicCalendarTime}
        />
        <Stack.Screen
          name={screenName.DoctorCalendarTime}
          component={DoctorCalendarTime}
        />
        <Stack.Screen
          name={screenName.PatientCalendarTime}
          component={PatientCalendarTime}
        />
        <Stack.Screen
          name={screenName.DoctorCalendarTimePatient}
          component={DoctorCalendarTimePatient}
        />
        <Stack.Screen
          name={screenName.AppointmentCheckout}
          component={Checkout}
        />
        <Stack.Screen
          name={screenName.CheckAppointmentPatient}
          component={CheckAppointmentPatient}
        />
        <Stack.Screen
          name={screenName.CheckAppointmentClinic}
          component={CheckAppointmentClinic}
        />
        <Stack.Screen
          name={screenName.termConditionsClinic}
          component={TermsConditionsClinic}
        />
        <Stack.Screen
          name={screenName.termConditionsPatients}
          component={TermsConditionsPatient}
        />
        <Stack.Screen
          name={screenName.patientInformation}
          component={PatientInformation}
        />
        <Stack.Screen
          name={screenName.addPhoneNumberToGuest}
          component={PatientInformation}
        />
        <Stack.Screen
          name={screenName.guestPhoneInputModal}
          component={GuestPhoneInputModal}
        />
        {/* <Stack.Screen name={screenName.VoiceCall} component={VoiceCall} /> */}
        {/* <Stack.Screen name={screenName.VideoCall} component={VideoCall} /> */}
      </Stack.Navigator>
      {isUser && <NavBarBottom />}
    </LinearGradient>
  );
};
interface RootNavigationProps {
  initialRouteName: string;
}
const RootNavigation = (props: RootNavigationProps) => {
  return <HomeNavigation initialRouteName={props.initialRouteName} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Stilizează după cum e necesar
});

export default RootNavigation;
