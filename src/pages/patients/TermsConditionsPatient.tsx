import React, { Fragment, useEffect, useState, Component } from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { MainContainer } from "../../components/commonViews";
import { NavBar, NavBarPatient } from "../../common/commonComponents";
import { termAndConditionTextClinic } from "../../utils/constant";
import { uploadTermsConditionsClinicPatient } from "../../utils/UploadFirebaseData";
import { useDispatch, useSelector } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "../../utils/screenName";
import {
  getGuestLoginDetails,
  getPatientInfo,
} from "../../actions/patientActions";
import i18n from "../../../i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

interface Props extends GeneralProps {
  route: Route<string, object | undefined>;
}

const TermsConditionsPatient: React.FC<Props> = ({}): JSX.Element => {
  const [accepted, setAccepted] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const patientInfoDB = useSelector((state) => state.patientInfoData);
  const { patientInformation } = patientInfoDB;

  const guestDetailsData = useSelector((state) => state.guestDetailsPatient);
  const { guestDetails } = guestDetailsData;

  const handleUploadTermsConditionsToGuestPatient = async (
    termAndConditionTextClinic,
    isAccepted
  ) => {
    console.log("termAndConditionTextClinic");
    console.log(termAndConditionTextClinic);
    try {
      const value = await AsyncStorage.getItem("guestLoginDetails");
      if (value !== null) {
        //
        console.log("We have data!!");
        // console.log(JSON.parse(value));
        let guestDetails = JSON.parse(value);
        console.log(guestDetails);

        // Add termAndConditionTextClinic and isAccepted to termsConditions
        guestDetails.termsConditions = {
          text: termAndConditionTextClinic,
          isAccepted: isAccepted,
        };

        // Update the guestLoginDetails in AsyncStorage
        await AsyncStorage.setItem(
          "guestLoginDetails",
          JSON.stringify(guestDetails)
        );
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  const handleAccept = () => {
    console.log("ASdasd");
    //   console.log('accepting...', termAndConditionTextClinic);
    //   console.log('accepting...', true);
    if (guestDetails.isGuest) {
      handleUploadTermsConditionsToGuestPatient(
        termAndConditionTextClinic,
        true
      ).then(() => {
        dispatch(getGuestLoginDetails()).then(() => {
          dispatch(getPatientInfo(guestDetails)).then(() => {
            navigation.navigate(screenName.PatientSearchDashboard);
          });
        });
      });
    } else {
      uploadTermsConditionsClinicPatient(termAndConditionTextClinic, true).then(
        () => {
          dispatch(getPatientInfo()).then(() => {
            navigation.navigate(screenName.ProfileSettingsPatient);
          });
        }
      );
    }
  };

  useEffect(() => {
    // console.log(patientInformation);
    console.log(guestDetails);
  }, []);
  return (
    <Fragment>
      <MainContainer>
        <NavBarPatient
          title={i18n.translate("tcMessage")}
          navHeight={80}
          isGoBack={
            guestDetails &&
            guestDetails.termsConditions &&
            guestDetails.termsConditions.isAccepted
              ? true
              : false
          }
          isTermsAccepted={
            guestDetails &&
            guestDetails.termsConditions &&
            guestDetails.termsConditions.isAccepted
              ? true
              : false
          }
          isPatient={true}
        />
        <View style={styles.container}>
          <Text style={styles.title}>{i18n.translate("tcMessage")}</Text>
          <ScrollView
            style={styles.tcContainer}
            onScroll={({ nativeEvent }) => {
              if (isCloseToBottom(nativeEvent)) {
                setAccepted(true);
              }
            }}
          >
            <Text style={styles.tcP}>{termAndConditionTextClinic[0].text}</Text>
            <Text style={styles.tcP}>{termAndConditionTextClinic[1].text}</Text>
            <Text style={styles.tcL}>{termAndConditionTextClinic[2].text}</Text>
            <Text style={styles.tcL}>{termAndConditionTextClinic[3].text}</Text>
            {/* <Text style={styles.tcP}>
                The use of this website is subject to the following terms of use
              </Text> */}
          </ScrollView>
          {(patientInformation &&
            patientInformation.termsConditions &&
            !patientInformation.termsConditions.isAccepted) ||
          (guestDetails &&
            guestDetails.termsConditions &&
            !guestDetails.termsConditions.isAccepted) ? (
            <TouchableOpacity
              disabled={!accepted}
              onPress={() => handleAccept()}
              style={
                accepted
                  ? styles.button
                  : [styles.buttonDisabled, { width: 200 }]
              }
            >
              <Text style={styles.buttonLabel}>{i18n.translate("accept")}</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.buttonDisabled}>
              <Feather name="check-circle" size={24} color="white" />
              <Text style={[styles.buttonLabel, { marginLeft: 10 }]}>
                {i18n.translate("termsAccepted")}
              </Text>
            </View>
          )}
        </View>
      </MainContainer>
    </Fragment>
  );
};

const { width, height } = Dimensions.get("window");

const styles = {
  container: {
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  title: {
    fontSize: 22,
    alignSelf: "center",
  },
  tcP: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 12,
  },
  tcP: {
    marginTop: 10,
    fontSize: 12,
  },
  tcL: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
    fontSize: 12,
  },
  tcContainer: {
    marginTop: 15,
    marginBottom: 15,
    height: height * 0.7,
  },

  button: {
    backgroundColor: "#136AC7",
    borderRadius: 5,
    padding: 10,
    justifyContent: "center",
    alignSelf: "center",
    flexDirection: "row",
    width: 200,
  },

  buttonDisabled: {
    backgroundColor: "#999",
    borderRadius: 5,
    padding: 10,
    justifyContent: "center",
    alignSelf: "center",
    flexDirection: "row",
  },

  buttonLabel: {
    fontSize: 14,
    color: "#FFF",
  },
};

export default TermsConditionsPatient;
