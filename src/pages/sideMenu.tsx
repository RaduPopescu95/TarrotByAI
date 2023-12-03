import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Linking,
  ImageBackground,
} from "react-native";
import { Fontisto } from "@expo/vector-icons";
import {
  H14fontRegularLightBlack,
  H14fontRegularLightGray,
  H14fontRegularWhite,
  H14fontRegulargray,
  H7fontRegularBlack,
  H8fontRegularBlack,
} from "../components/commonText";
import { CardSurface, RowView } from "../components/commonViews";
import { colors } from "../utils/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { labels } from "../utils/labels";

import { screenName } from "../utils/screenName";
import { useNavigation } from "@react-navigation/native";
import {
  alignItemsCenter,
  flexRow,
  mh5,
  mv10,
  mv15,
  mv5,
} from "../common/commonStyles";
import { AntDesign } from "@expo/vector-icons";
import {
  sidemenuDetails,
  sidemenuDetailsClinicAccount,
  sidemenuDetailsPatient,
  sidemenuDetailsPatientAccount,
  sidemenuDetailsPatientGuest,
} from "../utils/constant";
import LogoutIcon from "../../assets/images/open-account-logout.svg";

import { signOut } from "firebase/auth";
import { authentication, db, storage } from "../../firebase";
import { ref, getDownloadURL } from "firebase/storage";
import { doc, getDoc } from "firebase/firestore";
import Doctor2 from "../../assets/images/blank-profile.svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import {
  getCalendarTimes,
  getClinicAppointments,
  getClinicApprovedAppointments,
  getClinicInfo,
  getClinics,
  getPatientsOfClinic,
  getScheduleTimings,
} from "../actions/clinicActions";
import {
  getPatientAppointments,
  getPatientInfo,
  setTemporaryPatientClinicReview,
  setTemporaryPatientReview,
} from "../actions/patientActions";
import { Divider } from "react-native-elements";
import i18n from "../../i18n";
import RoundInitials from "../components/RoundInitials";
import { handleGetGuestDetails } from "../utils/loginAsGuestHelper";

interface Props {
  setModalVisible?: any;
  isPatient?: boolean;
}
interface MenuList {
  name: string;
  screenName: string;
  iconName: string;
  iconsType: string;
  setModalVisible?: any;
  userTitle?: any;
  isClinicSettings?: any;
}
const SideMenu: React.FC<Props> = ({
  setModalVisible,
  isPatient,
  userTitle,
  isClinicSettings,
}): JSX.Element => {
  const navigation = useNavigation();
  // const [isModalVisible, setModalVisible] = useState(false);
  // const toggleModal = () => {
  //   setModalVisible(!isModalVisible);
  // };

  const clinicInfoDB = useSelector((state) => state.clinicInfoData);
  const { clinicInformation, loading } = clinicInfoDB;

  const patientInfoDB = useSelector((state) => state.patientInfoData);
  const { patientInformation } = patientInfoDB;

  const allClinicsPatients = useSelector((state) => state.clinicsPatients);
  const { clinicsPatients, loading: loadingClinicsPatients } =
    allClinicsPatients;

  const guestDetailsData = useSelector((state) => state.guestDetailsPatient);
  const { guestDetails } = guestDetailsData;

  const auth = authentication;
  const dispatch = useDispatch();

  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem("userType", value);
    } catch (e) {
      // saving error
    }
  };

  const renderOptions = (
    data: MenuList,
    index: number,
    setModalVisible,
    isClinic
  ) => {
    const dispatch = useDispatch();
    return (
      <RowView style={[mv5, alignItemsCenter]} key={index}>
        <TouchableOpacity
          key={index}
          style={[flexRow, alignItemsCenter]}
          onPress={() => {
            setModalVisible();
            if (data.screenName === "Comming soon") {
              Alert.alert(
                i18n.translate("inAppMessagingCommingSoon"),
                i18n.translate("checkUpdates"),
                [
                  {
                    text: i18n.translate("cancel"),
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                  },
                  {
                    text: i18n.translate("checkForUpdate"),
                    onPress: () => console.log("Check for updates"),
                  },
                ]
              );
            } else if (data.screenName === "Update App") {
              Linking.openURL(
                "https://play.google.com/store/apps/details?id=com.style.connect.saloon&pli=1"
              );
            } else {
              navigation.navigate(data.screenName, {
                isClinicSettings: isClinicSettings ? true : false,
              });
            }
            // navigation.navigate(data.screenName,{isClinicSettings: false});
            // dispatch(getScheduleTimings());
            // dispatch(getCalendarTimes());
            // dispatch(getPatientInfo());
            // dispatch(getPatientAppointments());
            // dispatch(getClinicApprovedAppointments());
            // dispatch(getClinicInfo());
            // dispatch(getClinics());
            // dispatch(getPatientsOfClinic());
            // dispatch(getClinicAppointments());
          }}
        >
          <CardSurface style={styles.surfaceStyle}>
            {data.iconsType === "MaterialIcons" ? (
              <MaterialIcons
                name={data.iconName}
                size={20}
                color={colors.white}
              />
            ) : data.iconsType === "MaterialCommunityIcons" ? (
              <MaterialCommunityIcons
                name={data.iconName}
                size={20}
                color={colors.white}
              />
            ) : (
              <Ionicons name={data.iconName} size={20} color={colors.white} />
            )}
          </CardSurface>
          <H7fontRegularBlack style={{ maxWidth: "80%" }}>
            {data.name}
          </H7fontRegularBlack>
        </TouchableOpacity>
      </RowView>
    );
  };

  // const image = {uri: 'https://reactjs.org/logo-og.png'};
  // const image = {require('../')};

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ImageBackground
        style={[
          {
            justifyContent: "flex-start",
            flexDirection: "column",
            alignItems: "flex-start",
            height: "auto",
          },
        ]}
        source={require("../images/navbarbg2.png")}
      >
        <View style={[styles.profileImageStyle]}>
          {guestDetails.isGuest ? (
            guestDetails.basicInfoData.firstName.length > 0 &&
            guestDetails.isGuest && (
              <RoundInitials
                firstName={guestDetails.basicInfoData.firstName}
                lastName={guestDetails.basicInfoData.lastName}
              />
            )
          ) : clinicInformation && clinicInformation.clinicMainImage ? (
            clinicInformation.clinicMainImage.img.length > 0 ? (
              <Image
                style={{ height: "100%", width: "100%" }}
                source={{
                  uri: clinicInformation
                    ? clinicInformation.clinicMainImage &&
                      clinicInformation.clinicMainImage.img
                    : "",
                }}
              />
            ) : (
              <Fontisto name="person" size={24} color="black" />
            )
          ) : (
            <Fontisto name="person" size={24} color="black" />
          )}
        </View>

        {guestDetails.isGuest ? (
          <View>
            {/* <TouchableOpacity onPress={() => {
            setModalVisible()
            navigation.navigate(screenName.SignUpScreenPatient)
          }}>
          <Text style={{marginLeft:"5%",width:"auto",  color:colors.white, fontWeight:"bold", fontSize:16, marginTop:isPatient ? "6%" : "3%", textDecorationLine: 'underline'}}>
              {i18n.translate("registerForAccount")}
          </Text>
          </TouchableOpacity>
          <Text style={{marginLeft:"5%",width:"auto",  color:colors.white, fontWeight:"450", fontSize:14, marginVertical:"1%"}}>
              {i18n.translate("registerBecause")}
          </Text> */}
          </View>
        ) : (
          <Text
            style={{
              marginLeft: "5%",
              width: "58%",
              color: colors.white,
              fontWeight: "400",
              fontSize: 16,
              marginTop: isPatient ? "6%" : "3%",
            }}
          >
            {userTitle}
          </Text>
        )}
        {!isPatient && !guestDetails.isGuest && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              paddingBottom: 5,
            }}
          >
            <Text
              style={{
                marginLeft: "5%",
                width: "28%",
                color: colors.white,
                fontWeight: "300",
                fontSize: 12,
                marginTop: "1%",
              }}
            >
              {clinicsPatients ? clinicsPatients.length : 0}{" "}
              {i18n.translate("patients")}
            </Text>
            <Octicons
              name="people"
              size={20}
              color="white"
              style={{ top: "1%" }}
            />
          </View>
        )}
      </ImageBackground>
      {/* <Divider style={{marginTop:10}}/> */}

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContainerStyle}
      >
        <View>
          {guestDetails.isGuest
            ? sidemenuDetailsPatientGuest.map((item, index) => {
                return renderOptions(item, index, setModalVisible);
              })
            : sidemenuDetails.map((item, index) => {
                return renderOptions(item, index, setModalVisible, true);
              })}
        </View>

        <TouchableOpacity
          onPress={handleSignOut}
          style={styles.loginoutButtonStyle}
        >
          <AntDesign name="logout" size={20} color="white" />
          <Text style={styles.logoutBtnStyle}>{i18n.translate("logOut")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};
export default SideMenu;
const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: "rgba(255,255,255, 0.8)",
  },
  container: {
    paddingHorizontal: 20,
  },
  profileImageStyle: {
    height: 80,
    width: "32%",
    borderRadius: 40,
    borderWidth: 0,
    borderColor: "#f7f7f7",
    overflow: "hidden",
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  sideMenuHeader: {
    height: 100,
    width: 100,
    // borderRadius: 40,
    // borderWidth: 5,
    // borderColor: '#f7f7f7',
    overflow: "hidden",
    marginLeft: 10,
    marginTop: 10,
  },
  loginoutButtonStyle: {
    height: 33,
    width: "auto",
    backgroundColor: colors.pink,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 22,
    marginTop: "5%",
  },
  logoutBtnStyle: {
    paddingLeft: 10,
    color: "white",
    fontSize: 14,
  },
  scrollContainerStyle: {
    flex: 1,
    justifyContent: "space-between",
    marginBottom: 30,
    // backgroundColor:"red"
  },
  surfaceStyle: {
    borderRadius: 15,
    height: 35,
    width: 35,
    marginTop: 10,
    backgroundColor: colors.facebook,
    // paddingLeft: 12,
    marginRight: 12,
    paddingHorizontal: 0,
    paddingVertical: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});
