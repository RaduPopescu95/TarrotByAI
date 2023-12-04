import React, { Fragment, useEffect, useState } from "react";
import {
  TextInput,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { CardSurface, MainContainer, RowView } from "../components/commonViews";
import {
  H15fontMediumBlack,
  H9fontRegularGray,
  H8fontMediumBlack,
  H8fontMediumWhite,
  H14fontRegularBlue,
} from "../components/commonText";
// import {DevWidth} from '../utils/device';
import { Dimensions } from "react-native";

import { dayOptions } from "../utils/constant";
import moment from "moment";
import {
  alignItemsCenter,
  mh10,
  ml10,
  ml5,
  mr10,
  mr25,
  pb0,
  pb10,
  pt0,
  pt10,
  spaceBetween,
} from "../common/commonStyles";
import { colors } from "../utils/colors";
import { labels } from "../utils/labels";
import { Entypo } from "@expo/vector-icons";

import { useSelector } from "react-redux";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { Text } from "react-native-paper";
import { screenName } from "../utils/screenName";
import { RouteProp, useNavigation } from "@react-navigation/native";
import i18n from "../../i18n";
import { useAppSelector } from "../hooks/hooks";
import { checkIfBooked } from "../utils/helpers";

interface Props {
  clinicInfoChecked?: any;
  allDaysForPatiet?: any;
  AllDoctorInfo?: any;
  clinicApprovedAppointments?: any;
}

// Define tipurile pentru rute
type RootStackParamList = {
  AppointmentCheckout: {
    daySelected: any;
    item: any;
    doctorInfo: any;
  };
  // Alte rute din aplicație
};

// Define tipul pentru ecranul de checkout
type AppointmentCheckoutScreenRouteProp = RouteProp<
  RootStackParamList,
  "AppointmentCheckout"
>;

const TimeAndDatePatient: React.FC<Props> = ({
  clinicInfoChecked,
  allDaysForPatiet,
  AllDoctorInfo,
  clinicApprovedAppointments,
  clinicApprovedAppointmentsUnregistered,
}): JSX.Element => {
  const navigation = useNavigation<AppointmentCheckoutScreenRouteProp>();

  const [selectTime, setSelectTime] = useState(0);
  const [checkedDate, setCheckedDate] = useState(0);
  const [changedDays, setChangedDays] = useState(false);

  const [daySelected, setDaySelected] = useState("");
  const [monthNumber, setMonthNumber] = useState(0);
  const [monthSelected, setMonthSelected] = useState<any>(3);

  const clinicTimeSlotsDB = useAppSelector((state) => state.clinicTimeSlots);
  const { allDaysDB } = clinicTimeSlotsDB;

  const clinicCalendarTimes = useAppSelector(
    (state) => state.clinicCalendarTimes
  );
  const { calendarTimes } = clinicCalendarTimes;

  const [allDays, setAllDays] = useState(allDaysDB ? allDaysDB.allDays : []);

  const today = moment(new Date()).format("MMMM YYYY");

  const _format = "YYYY-MM-DD";
  const _today = moment().format(_format);
  const _maxDate = moment().add(100, "days").format(_format);

  const [_markedDates, setMarkedDates] = useState([]);

  const [selectedDates, setSelectdates] = useState([]);
  const [selectedDay, setSelectday] = useState("");

  // Aplică tipul pe functia de checkout
  const handleCheckBookedCurrentPatient = async (
    daySelected: any,
    item: any,
    AllDoctorInfo: any
  ) => {
    let isAppointmentMade = await checkIfBooked(
      daySelected,
      item,
      AllDoctorInfo
    );
    console.log("is appointment made?....");
    console.log(isAppointmentMade);
    if (isAppointmentMade) {
      // programarea a fost deja făcută
      Alert.alert(
        i18n.translate("appointmentAlreadyMade"),
        i18n.translate("appointmentAlreadyMadeMsg"),
        [
          {
            text: i18n.translate("seeTheAppointment"),
            onPress: () => {
              navigation.navigate(screenName.myGuestAppointments);
            },
            style: "cancel",
          },
          {
            text: "OK",
            onPress: () => console.log("OK Apăsat"),
          },
        ]
      );
    } else {
      // Navigare către ecranul de checkout cu tipul corect
      navigation.navigate("AppointmentCheckout", {
        daySelected,
        item,
        doctorInfo: AllDoctorInfo,
      });
    }
  };

  const onDaySelect = (day) => {
    console.log("---------------BEGIN-----------------------");

    console.log("allDaysForPatiet...", allDaysForPatiet);
    // const setableDate = moment.utc(day.dateString).format('DD-MM-YYYY');
    // setSelectday(setableDate);
    const names = Object.freeze([
      "Sat",
      "Sun",
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
    ]);

    const monthIndex = monthNumber - 1;
    const dDay = day.day + 1;
    const dMonth = day.month - 1;
    const date = new Date(day.year, dMonth, dDay);
    let result;

    const setableDate = moment.utc(date).format("DD-MM-YYYY");
    setDaySelected(setableDate);
    setSelectday(setableDate);

    result = `${names[date.getDay()]}`;
    console.log("result");
    console.log(result);

    let found = [];
    found = allDaysForPatiet.find((element) => element.val === result);
    console.log("found....", found == undefined);
    if (found == undefined) {
      setCheckedDate([]);
      return;
    }
    const nr = found.nr;
    const timeS = found.timeS;
    const timeSPack = [];
    for (let i = 0; i < found.timeSPack.length; i++) {
      const tempMyObj = Object.assign({}, found.timeSPack[i]);
      timeSPack.push(tempMyObj);
    }

    const val = found.val;

    const foundCopy = {
      date: setableDate,
      nr: nr,
      timeS: timeS,
      timeSPack: timeSPack,
      val: val,
    };

    let isBooked = false;
    const newArr = [];
    let newObj = {};

    // ADD IS BOOKED TO APPOINTMENTS OF REGISTERED PATIENTS
    for (let i = 0; i < clinicApprovedAppointments.length; i++) {
      console.log(
        "................START LOOP CLINIC APPROVED APP.............."
      );
      console.log(
        "clinicApprovedAppointments...",
        clinicApprovedAppointments[i].daySelected
      );
      for (let z = 0; z < foundCopy.timeSPack.length; z++) {
        console.log(
          "//////////////////START LOOP FOUND COPY APP/////////////////////"
        );
        console.log("foundCopy...", foundCopy);
        if (
          clinicApprovedAppointments[i].daySelected === foundCopy.date &&
          clinicApprovedAppointments[i].timeSelected.starttime ===
            foundCopy.timeSPack[z].starttime &&
          clinicApprovedAppointments[i].timeSelected.starttime ===
            foundCopy.timeSPack[z].starttime &&
          clinicApprovedAppointments[i].isApproved
        ) {
          console.log("yes test...");
          isBooked = true;
          foundCopy.timeSPack[z].isBooked = true;
          // newObj = {...foundCopy.timeSPack[z], isBooked};
          // newArr.push(newObj);
        } else isBooked = false;
      }
    }

    // ADD IS BOOKED TO APPOINTMENTS OF UNREGISTERED PATIENTS
    if (clinicApprovedAppointmentsUnregistered) {
      for (let i = 0; i < clinicApprovedAppointmentsUnregistered.length; i++) {
        console.log(
          "................START LOOP CLINIC APPROVED APP.............."
        );
        console.log(
          "clinicApprovedAppointmentsUnregistered...",
          clinicApprovedAppointmentsUnregistered[i].daySelected
        );
        for (let z = 0; z < foundCopy.timeSPack.length; z++) {
          console.log(
            "//////////////////START LOOP FOUND COPY APP/////////////////////"
          );
          console.log("foundCopy...", foundCopy);
          if (
            clinicApprovedAppointmentsUnregistered[i].daySelected ===
              foundCopy.date &&
            clinicApprovedAppointmentsUnregistered[i].timeSelected.starttime ===
              foundCopy.timeSPack[z].starttime &&
            clinicApprovedAppointmentsUnregistered[i].timeSelected.starttime ===
              foundCopy.timeSPack[z].starttime &&
            clinicApprovedAppointmentsUnregistered[i].isApproved
          ) {
            console.log("yes test...");
            isBooked = true;
            foundCopy.timeSPack[z].isBooked = true;
            // newObj = {...foundCopy.timeSPack[z], isBooked};
            // newArr.push(newObj);
          } else isBooked = false;
        }
      }
    }

    // console.log("foundCopy..................................", foundCopy)
    //   console.log("test...2", found)
    // console.log('newArr', newArr);

    if (foundCopy.timeSPack.length > 0) {
      console.log("found copy...");
      console.log(foundCopy);
      setCheckedDate(foundCopy.timeSPack);
    } else {
      console.log("found...");
      console.log(found);
      setCheckedDate(found.timeSPack);
    }
  };

  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth() + 1; // 👈️ months are 0-based

  useEffect(() => {
    console.log("AllDoctorInfo....", AllDoctorInfo.item.servicesList);
    // console.log('calendarTimes....', calendarTimes);
  }, [monthSelected.month]);

  return (
    <Fragment>
      <MainContainer>
        <CardSurface style={styles.containerStyle}>
          {/* <Calendar
              minDate={new Date()}
              onDayPress={handleAddDay}
              markingType={'multi-period'}
              markedDates={markedDates}
              // markedDates={}
            /> */}
          <Calendar
            minDate={_today}
            maxDate={_maxDate}
            onDayPress={onDaySelect}
            onMonthChange={(month) => {
              setMonthNumber(month.month);
              setMonthSelected(month);
            }}
            markedDates={clinicInfoChecked ? clinicInfoChecked : calendarTimes}
          />
          {/* {selectedDays ? (
            <TouchableOpacity style={styles.nextButtonStyle}>
              <H14fontRegularWhite>Schedule timings</H14fontRegularWhite>
            </TouchableOpacity>
          ) : null} */}
        </CardSurface>

        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <H14fontRegularBlue style={{ fontSize: 20, fontWeight: "bold" }}>
            {selectedDay}
          </H14fontRegularBlue>
        </View>

        <FlatList
          scrollEnabled
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            pt10,
            {
              flexDirection: "row",
              flexWrap: "wrap",
              marginHorizontal: 16,
              justifyContent: "space-between",
            },
          ]}
          data={checkedDate}
          renderItem={({ item, index }) => {
            // let color = index == selectTime ? colors.white : colors.black;
            let color = colors.black;
            let backgroundColor = colors.white;
            let bookedBgColor = colors.red;
            // index == selectTime ? colors.ligtBlue : colors.white;

            return (
              <TouchableOpacity
                // onPress={() => setSelectTime(index)}
                onPress={() => {
                  console.log(daySelected);
                  if (item.isBooked) {
                    Alert.alert(
                      i18n.translate("isBooked"),
                      i18n.translate("isBookedMessage"),
                      [{ text: "OK", onPress: () => console.log("OK Pressed") }]
                    );
                  } else {
                    handleCheckBookedCurrentPatient(
                      daySelected,
                      item,
                      AllDoctorInfo
                    );
                  }
                }}
                style={[
                  styles.timingCardContainerStyle,
                  {
                    backgroundColor: item.isBooked
                      ? bookedBgColor
                      : backgroundColor,
                  },
                ]}
              >
                <RowView
                  style={[
                    styles.timingRowStyle,
                    {
                      borderBottomColor:
                        // index == selectTime ? colors.white : colors.imageGray,
                        colors.imageGray,
                    },
                  ]}
                >
                  <H8fontMediumBlack style={{ color: color }}>
                    {item.isBooked
                      ? i18n.translate("bookedByAnotherPatient")
                      : i18n.translate("timings")}
                  </H8fontMediumBlack>
                  <Entypo name="time-slot" size={20} color="black" />
                </RowView>
                <View style={styles.timepickerRowStyle}>
                  <View>
                    <H9fontRegularGray style={{ color: color }}>
                      {i18n.translate("fromTime")}
                    </H9fontRegularGray>
                    {/* <TextInput
                      style={styles.textBoxStyle}
                      placeholder="10:00 AM"
                    /> */}
                    <Text style={styles.textBoxStyle}>{item.starttime}</Text>
                  </View>
                  <View>
                    <H9fontRegularGray style={{ color: color }}>
                      {i18n.translate("toTime")}
                    </H9fontRegularGray>

                    {/* <TextInput
                      style={styles.textBoxStyle}
                      placeholder="10:00 AM"
                    /> */}

                    <Text style={styles.textBoxStyle}>{item.endtime}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </MainContainer>
    </Fragment>
  );
};

export default TimeAndDatePatient;

const styles = StyleSheet.create({
  containerStyle: { marginHorizontal: 10, marginTop: 10 },

  container: {
    height: 50,
    backgroundColor: "#fff",
    margin: 15,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginVertical: 15,
    elevation: 3,
  },
  iconStyle: { height: 25, width: 25 },
  dayBtnStyle: {
    height: 33,
    width: 33,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  timingCardContainerStyle: {
    height: 107,
    width: Dimensions.get("window").width / 2.32,
    // marginHorizontal: 16,
    marginBottom: 15,
    padding: 10,
    // backgroundColor: index == selectTime ? '#0DD8F9' : '#fff',
    borderRadius: 10,
    elevation: 2,
  },
  timerImageStyle: {
    height: 13,
    width: 13,
  },
  timingRowStyle: {
    borderBottomWidth: 1,
    alignItems: "center",
    paddingBottom: 4,
  },
  timepickerRowStyle: {
    paddingTop: 7,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textBoxStyle: {
    borderColor: "#CFCFCF",
    borderWidth: 1,
    height: 32,
    width: 62,
    borderRadius: 5,
    backgroundColor: "#fff",
    textAlign: "center",
    justifyContent: "center",
    paddingLeft: 0,
    // top: 5,
    paddingTop: 6,
    fontSize: 12,
    alignItems: "center",
  },
});
