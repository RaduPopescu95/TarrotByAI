import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
} from "react-native";
import { CommonButton, RowView } from "../components/commonViews";
import {
  H15fontMediumBlack,
  H9fontRegularGray,
  H8fontMediumLightBlack,
  H8fontMediumBlack,
  H9fontMediumLightBlack,
  H6fontRegularBlack,
  H14fontMediumBlack,
  H14fontRegularWhite,
} from "../components/commonText";
import {
  alignItemsCenter,
  flexRow,
  justyfyCenter,
  pb10,
  pb5,
  pl5,
  pv10,
  spaceBetween,
} from "../common/commonStyles";
import { colors } from "../utils/colors";
import StarIcon from "../../assets/images/star.svg";
import Doctor2 from "../../assets/images/blank-profile.svg";
import Specialities5 from "../../assets/images/specialities/specialities-05.svg";
// import Icon from 'react-native-vector-icons/FontAwesome';
import { NavBarPatient } from "../common/commonComponents";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";
import {
  uploadAppointmentDataToClinic,
  uploadAppointmentDataToPatient,
} from "../utils/UploadFirebaseData";
import { Text } from "react-native-paper";
import { screenName } from "../utils/screenName";
import { labels } from "../utils/labels";
import i18n from "../../i18n";
import {
  convertTimeTo12Hours,
  createTimeFormat,
} from "../utils/convertTime24Hours";
import { useAppSelector } from "../hooks/hooks";
import { useHourClockContext } from "../context/HourClockContext";

interface Props {
  onpress: CallableFunction;
}

const CheckAppointmentPatient: React.FC<Props> = ({ onpress }): JSX.Element => {
  const route = useRoute();
  const appointmentInfo = route.params;

  const navigation = useNavigation();

  const hourClock = useHourClockContext();

  // const [clinicInfo, setClinicInfo] = useState(
  //   clinicInfoSelected.AllClinicInfo.clinicAllInfo,
  // );
  // const [clinicTimeSelected, setClinicTimeSelected] = useState(
  //   clinicInfoSelected.AllClinicInfo.clinicAllInfo,
  // );
  // const [daySelected, setDaySelected] = useState(
  //   clinicInfoSelected.AllClinicInfo.clinicAllInfo,
  // );

  // const patientInfoDB = useSelector(state => state.patientInfoData);
  // const {patientInformation} = patientInfoDB;

  useEffect(() => {
    // console.log('appointmentInfo....', appointmentInfo.item.clinicInfo);
    console.log(
      "appointmentInfo....",
      appointmentInfo.item.doctorInfo.doctorImgURI
    );
    // console.log('appointmentInfo.doctorImg....', appointmentInfo);
  }, []);

  const handleCancelAppointment = () => {
    Alert.alert(
      i18n.translate("contactClinic"),
      i18n.translate("contactClinicMessage"),
      [
        {
          text: i18n.translate("cancel"),
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        // {text: 'Contact', onPress: () => navigation.navigate(screenName.ChatListPatient)},
        {
          text: i18n.translate("contact"),
          onPress: () =>
            Linking.openURL(
              `tel:${appointmentInfo.item.clinicInfo.phoneNumber}`
            ),
        },
      ]
    );
  };

  const startImage = () => {
    return <StarIcon height={12} width={12} />;
  };

  const otherDetailsRow = (label: string, value: any) => {
    return (
      <RowView style={pb5}>
        <H8fontMediumLightBlack>{label}</H8fontMediumLightBlack>
        <H9fontRegularGray>{value}</H9fontRegularGray>
      </RowView>
    );
  };

  // return(
  //   <View>
  //     <Text>
  //       asdas
  //     </Text>
  //   </View>
  // )

  return (
    <>
      <NavBarPatient
        title={i18n.translate("bookingSummary")}
        isPatient={true}
        isTermsAccepted={true}
        isGoBack={true}
      />
      <View style={styles.container}>
        <View
          style={{
            marginBottom: 10,
            alignItems: "center",
          }}
        >
          <H6fontRegularBlack>
            {i18n.translate("bookingSummary")}
          </H6fontRegularBlack>
        </View>
        <TouchableOpacity onPress={() => onpress} style={styles.drSelection}>
          <View style={styles.drImageStyle}>
            {appointmentInfo.item.doctorInfo.doctorImgURI ? (
              <Image
                source={{ uri: appointmentInfo.item.doctorInfo.doctorImgURI }}
                style={{ height: "100%", width: "100%" }}
              />
            ) : (
              <Doctor2 height={"100%"} width={"150%"} />
            )}
          </View>
          <View style={styles.drDetailsStyle}>
            <View style={[pl5, spaceBetween]}>
              <H15fontMediumBlack>
                {appointmentInfo.item.doctorInfo.doctorInfoData.firstname}{" "}
                {appointmentInfo.item.doctorInfo.doctorInfoData.lastname}
              </H15fontMediumBlack>
              {/* <View style={[flexRow, alignItemsCenter]}>
              {startImage()}
              {startImage()}
              {startImage()}
              {startImage()}
              {startImage()}
              <H9fontMediumLightBlack>{'(47)'}</H9fontMediumLightBlack>
            </View> */}
              <View style={[flexRow, alignItemsCenter]}>
                {/* <H8fontMediumLightBlack>{'('}</H8fontMediumLightBlack> */}
                {/* <Icon name="map-marker" size={14} color={'black'} /> */}
                <H8fontMediumLightBlack>
                  {
                    appointmentInfo.item.doctorInfo.doctorInfoData
                      .specializations
                  }
                </H8fontMediumLightBlack>
              </View>
              <View style={[flexRow, alignItemsCenter]}>
                <H8fontMediumLightBlack>
                  {appointmentInfo.item.doctorInfo.doctorInfoData.services}
                </H8fontMediumLightBlack>
              </View>
            </View>
            {/* <View style={styles.typeofDrImageContainer}>
              <Specialities5 height={12} width={12} />
            </View> */}
          </View>
        </TouchableOpacity>

        <View style={styles.cardContainerStyles}>
          {otherDetailsRow(
            i18n.translate("date"),
            appointmentInfo.item.daySelected
          )}
          {otherDetailsRow(
            i18n.translate("startTime"),
            createTimeFormat(
              appointmentInfo.item.timeSelected.starttime,
              hourClock
            )
          )}
          {otherDetailsRow(
            i18n.translate("endTime"),
            hourClock
              ? item.timeSelected.endtime
              : convertTimeTo12Hours(item.timeSelected.endtime)
          )}
          {/* {otherDetailsRow('Consulting', 'Fee$100')} */}
          {/* {otherDetailsRow('Slot Timing Fees', '$10')} */}
        </View>
        {/* 
        <View style={styles.cardContainerStyles}>
          {otherDetailsRow('Date', '16 Nov 2019')}
          {otherDetailsRow('Consulting', 'Fee$100')}
          {otherDetailsRow('Slot Timing Fees', '$10')}
        </View> */}
        <TouchableOpacity
          style={styles.nextButtonStyle}
          onPress={() => handleCancelAppointment()}
          title="Submit"
        >
          <H14fontRegularWhite>
            {i18n.translate("cancelAppointment")}
          </H14fontRegularWhite>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default CheckAppointmentPatient;

const styles = StyleSheet.create({
  nextButtonStyle: {
    height: 45,
    backgroundColor: "#1B5A90",
    marginVertical: 15,
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  container: {
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  drSelection: {
    height: 104,
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
    flexDirection: "row",
  },
  drImageStyle: {
    height: 80,
    width: 80,
    borderRadius: 40,
    borderWidth: 5,
    borderColor: "#f7f7f7",
    overflow: "hidden",
  },
  drDetailsStyle: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  starImageStyle: { height: 12, width: 12 },
  typeofDrImageContainer: {
    height: 24,
    width: 24,
    borderRadius: 14,
    elevation: 3,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  typeofDrImageStyle: {
    height: 12,
    width: 12,
  },
  cardContainerStyles: {
    backgroundColor: colors.white,
    //   height: 145,
    borderRadius: 10,
    elevation: 3,
    padding: 12,
    justifyContent: "space-between",
    marginTop: 10,
  },
});
