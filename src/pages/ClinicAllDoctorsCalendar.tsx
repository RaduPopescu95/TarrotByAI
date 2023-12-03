import { useAppSelector } from "../hooks/hooks";
import React, { useEffect } from "react";
import { View, Text, Image, Alert, Linking } from "react-native";
import { Agenda, Calendar } from "react-native-calendars";
import { NavBar } from "../common/commonComponents";
import i18n from "../../i18n";
import { useNavigation, useRoute } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import moment from "moment";
import { screenName } from "../utils/screenName";
import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../utils/colors";
import { handleSMSReminder } from "../utils/initiateSms";
import { storeData } from "../utils/asyncStorageHandler";
import { H6fontMediumWhite, H6fontRegularBlue } from "../components/commonText";
// import { parseDateTime, sendSMS } from '../utils/sendSMSReminde';
import ScheduleTimings from "./doctors/scheduleTimings";
import {
  convertTimeTo12Hours,
  createTimeFormat,
} from "../utils/convertTime24Hours";
import { useHourClockContext } from "../context/HourClockContext";
import useRevenueCat from "../hooks/useRevenueCat";

export default function ClinicAllDoctorsCalendar() {
  const { currentOffering, customerInfo, isProMember } = useRevenueCat();
  const hourClock = useHourClockContext();

  const route = useRoute();
  const navigation = useNavigation();

  const cAppointments = useAppSelector((state) => state.clinicAppointments);
  const { clinicAppointments, loading } = cAppointments;

  // Function to render each item in the agenda
  const renderItem = (item: any) => {
    console.log("item...");
    console.log(item);
    if (item.isApproved) {
      return (
        <View style={styles.item}>
          <View
            style={{ flexDirection: "row", backgroundColor: colors.facebook }}
          >
            <H6fontMediumWhite
              style={{ fontWeight: "600", paddingLeft: 10 }}
              numberOfLines={2}
            >
              {createTimeFormat(item.timeSelected.starttime, hourClock)}
            </H6fontMediumWhite>
          </View>
          <View style={{ padding: 10 }}>
            <View style={{ flexDirection: "row" }}>
              <Image
                source={{ uri: item.doctorInfo.doctorImgURI }}
                style={{ width: 60, height: 60, borderRadius: 50 }}
              />
              <View style={{ marginLeft: 5 }}>
                <Text style={{ width: "85%" }} numberOfLines={2}>
                  {i18n.translate("doctor")}:{" "}
                  {item.doctorInfo.doctorInfoData.firstname}{" "}
                  {item.doctorInfo.doctorInfoData.lastname}
                </Text>

                <Text style={{ width: "85%" }} numberOfLines={2}>
                  {i18n.translate("pacientName")}:{" "}
                  {item.patientInfo.basicInfoData.firstName}{" "}
                  {item.patientInfo.basicInfoData.lastName}
                </Text>
                <Text style={{ width: "85%" }} numberOfLines={2}>
                  {i18n.translate("dateRange")}:{" "}
                  {createTimeFormat(item.timeSelected.starttime, hourClock)} -{" "}
                  {createTimeFormat(item.timeSelected.endtime, hourClock)}
                </Text>
                {/* <Text style={{width:"85%"}} numberOfLines={2}>{i18n.translate("date")}: {item.daySelected}</Text> */}
              </View>
            </View>

            <View style={styles.cardButtonRow}>
              <TouchableOpacity
                style={styles.viewButtonStyle}
                onPress={async () => {
                  navigation.navigate(screenName.CheckAppointmentClinic, {
                    item,
                  });
                  await storeData("appointmentsTutorial", "done");
                }}
              >
                <View style={styles.buttonRow}>
                  <Feather name="eye" size={30} color="black" />
                  <Text style={styles.buttonTextStyle}>
                    {i18n.translate("view")}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.viewButtonStyle]}
                onPress={() =>
                  item.isApproved
                    ? handleSMSReminder(item, isProMember, navigation)
                    : // handleSendSms(item)

                      Alert.alert(
                        i18n.translate("appointmentNotConfirmed"),
                        i18n.translate("appointmentNotConfirmedMessage"),
                        [
                          {
                            text: i18n.translate("cancel"),
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel",
                          },
                          {
                            text: i18n.translate("confirmAppointment"),
                            onPress: () =>
                              navigation.navigate(
                                screenName.CheckAppointmentClinic,
                                {
                                  item,
                                }
                              ),
                          },
                        ]
                      )
                }
              >
                <View style={styles.buttonRow}>
                  <MaterialCommunityIcons
                    name="cellphone-message"
                    size={30}
                    color="black"
                  />
                  <Text style={styles.buttonTextStyle}>
                    {i18n.translate("sendReminder")}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.viewButtonStyle]}
                onPress={() =>
                  Linking.openURL(`tel:${item.patientInfo.phoneNumber}`)
                }
              >
                <View style={styles.buttonRow}>
                  <MaterialCommunityIcons
                    name="phone"
                    size={30}
                    color="black"
                  />
                  <Text style={styles.buttonTextStyle}>
                    {i18n.translate("callPatient")}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }
  };

  useEffect(() => {
    console.log("----ClinicAllDoctorsCalendar---");

    // console.log(clinicAppointments[0].daySelected)
  });

  // Function to extract item key (date in our case)
  const extractItemKey = (item: any) => item.daySelected;

  const getCurrentFormattedDate = () => {
    const currentDate = new Date();

    // Get the year, month, and day from the current date
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based, so we add 1
    const day = String(currentDate.getDate()).padStart(2, "0");

    // Create the formatted date string in the format "YYYY-MM-DD"
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  };

  // Usage
  const currentFormattedDate = getCurrentFormattedDate();

  const formatDateToYYYYMMDD = (dateString) => {
    // Use moment to parse the input date string with the specified format
    const parsedDate = moment(dateString, "DD-MM-YYYY");

    // Format the parsed date to the desired "YYYY-MM-DD" format
    const formattedDate = parsedDate.format("YYYY-MM-DD");

    return formattedDate;
  };

  // Create the items object for the Agenda component
  const items = clinicAppointments.reduce((acc, appointment) => {
    // Filter appointments based on the 'isApproved' property
    if (appointment.isApproved) {
      const formattedDate = formatDateToYYYYMMDD(appointment.daySelected);
      acc[formattedDate] = acc[formattedDate]
        ? [...acc[formattedDate], appointment]
        : [appointment];
    }
    return acc;
  }, {});

  return (
    <>
      <NavBar
        title={i18n.translate("appointmentCalendar")}
        navHeight={80}
        isModal={false}
        isTermsAccepted={true}
        isGoBack={route.params && route.params.isGoBack}
      />

      <Agenda
        selected={currentFormattedDate}
        items={items} // Replace with your list of appointments
        renderItem={renderItem}
        renderEmptyData={() => <Text>{i18n.translate("noAppointemnts")}</Text>}
        rowHasChanged={(r1, r2) => r1.daySelected !== r2.daySelected}
        //   pastScrollRange={0}
        futureScrollRange={2}
        hideKnob={false}
        theme={{
          // calendarBackground: colors.background, //agenda background
          // agendaKnobColor: colors.primary, // knob color
          // backgroundColor: colors.background, // background color below agenda
          // agendaDayTextColor: colors.primary, // day name
          // agendaDayNumColor: colors.primary, // day number
          agendaTodayColor: colors.facebook, // today in list
          // monthTextColor: colors.primary, // name in calendar
          // textDefaultColor: "red",
          // todayBackgroundColor: colors.facebook,
          textSectionTitleColor: colors.facebook,
          selectedDayBackgroundColor: colors.facebook, // calendar sel date
          // dayTextColor: colors.primary, // calendar day
          dotColor: colors.facebook, // dots
          // textDisabledColor: "red",
          todayTextColor: colors.facebook,
        }}
      />
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  item: {
    //   backgroundColor: 'white',
    borderBottomWidth: 1,
    flex: 1,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    borderBottomColor: colors.facebook,
    // padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  itemText: {
    color: "#888",
    fontSize: 16,
  },

  cardStyle: {
    height: "auto",
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  detailsStyles: { padding: 5, paddingTop: 10, flexDirection: "row" },
  profileImageStyle: {
    height: 60,
    width: 60,
    borderRadius: 50,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    // paddingRight: 25,
    // backgroundColor:"red"
  },
  basicDetails: { paddingLeft: 10 },
  cardButtonRow: {
    flexDirection: "row",
    marginTop: 15,
    justifyContent: "center",
  },
  confirmButtonStyle: {
    height: 28,
    // width: 80,
    // backgroundColor: ,
    borderRadius: 30,
    justifyContent: "center",
  },
  confirmViewStyle: {
    height: 28,
    // width: 80,
    backgroundColor: "rgba(29, 185, 71, 0.65)",
    borderRadius: 30,
    justifyContent: "center",
  },
  confirmImageStyle: { height: 10, width: 10, marginRight: 3 },
  buttonTextStyle: {
    paddingLeft: 5,
    // paddingTop: 5,
    color: "black",
    fontSize: 11,
  },
  buttonRow: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  viewButtonStyle: {
    height: "auto",
    width: "auto",

    justifyContent: "center",
    marginHorizontal: 5,
  },
  viewImageStyle: { height: 10, width: 15 },
  printButtonStyle: {
    height: 28,
    width: 78,
    backgroundColor: "#D4D4D4",
    borderRadius: 30,
    justifyContent: "center",
  },
  printImageStyle: { height: 13, width: 13 },
  printButtonTextStyle: {
    paddingLeft: 5,
    // paddingTop: 5,
    color: "#8B8A8A",
    fontSize: 11,
  },
});
