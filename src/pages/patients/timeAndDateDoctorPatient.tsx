import React, { Fragment, useEffect, useState } from "react";
import {
  TextInput,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { CardSurface, MainContainer, RowView } from "../components/commonViews";
import {
  H15fontMediumBlack,
  H9fontRegularGray,
  H8fontMediumBlack,
  H8fontMediumWhite,
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
import LeftArrowIcon from "../../assets/images/left-arrow-circle.svg";
import RightArrowIcon from "../../assets/images/right-arrow-circle.svg";
import TimeIcon from "../../assets/images/icon-time.svg";
import { useSelector } from "react-redux";
import { Calendar } from "react-native-calendars";
import { Text } from "react-native-paper";
import { screenName } from "../utils/screenName";
import { useNavigation } from "@react-navigation/native";
import i18n from "../../../i18n";
import { H14fontRegularBlue } from "../../components/commonText";
import { createTimeFormat } from "../../utils/convertTime24Hours";
import { useHourClockContext } from "../../context/HourClockContext";

interface Props {
  clinicInfoChecked?: any;
  allDaysForPatiet?: any;
  AllClinicInfo?: any;
  clinicApprovedAppointments?: any;
}

const TimeAndDateDoctorPatient: React.FC<Props> = ({
  clinicInfoChecked,
  allDaysForPatiet,
  AllClinicInfo,
  clinicApprovedAppointments,
}): JSX.Element => {
  const navigation = useNavigation();

  const [selectTime, setSelectTime] = useState(0);
  const [checkedDate, setCheckedDate] = useState(0);
  const [changedDays, setChangedDays] = useState(false);

  const [daySelected, setDaySelected] = useState("");
  const [monthNumber, setMonthNumber] = useState(0);
  const [monthSelected, setMonthSelected] = useState(3);

  const clinicTimeSlotsDB = useSelector((state) => state.clinicTimeSlots);
  const { allDaysDB } = clinicTimeSlotsDB;

  const clinicCalendarTimes = useSelector((state) => state.clinicCalendarTimes);
  const { calendarTimes } = clinicCalendarTimes;

  const hourClock = useHourClockContext();

  // const clinicApprovedApp = useSelector(
  //   state => state.clinicApprovedAppointments,
  // );
  // const {clinicApprovedAppointments, loading: loadingApprovedAppointments} =
  //   clinicApprovedApp;

  const [allDays, setAllDays] = useState(
    allDaysDB.allDays ? allDaysDB.allDays : []
  );

  const today = moment(new Date()).format("MMMM YYYY");

  const _format = "YYYY-MM-DD";
  const _today = moment().format(_format);
  const _maxDate = moment().add(100, "days").format(_format);

  const [_markedDates, setMarkedDates] = useState([]);

  const [selectedDates, setSelectdates] = useState([]);
  const [selectedDay, setSelectday] = useState("");

  const onDaySelect = (day) => {
    console.log("---------------BEGIN------------ss-----------");
    // console.log('Start');
    // console.log('day selected', day);
    // console.log('finalArr', finalArr);
    // console.log('monthNumber', monthNumber);
    // console.log('allDaysForPatiet', allDaysForPatiet);
    //  const setableDate = moment.utc(day.dateString).format('DD-MM-YYYY');
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

    console.log("here 1....");

    const monthIndex = monthNumber - 1;
    const dDay = day.day + 1;
    const dMonth = day.month - 1;
    const date = new Date(day.year, dMonth, dDay);
    let result;
    // const newDate = date + 1;
    const setableDate = moment.utc(date).format("DD-MM-YYYY");
    setDaySelected(setableDate);
    setSelectday(setableDate);
    // console.log('first test', date);
    // console.log('second test', setableDate);
    // date.setDate(date.getDate() + 1);
    result = `${names[date.getDay() - 1]}`;
    // console.log('result', result);
    // console.log(result);
    const found = allDaysForPatiet.find((element) => element.val === result);
    console.log(found);

    const nr = found.nr;
    const timeS = found.timeS;

    const timeSPack = found.timeSPack;

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

    for (let i = 0; i < clinicApprovedAppointments.length; i++) {
      for (let z = 0; z < foundCopy.timeSPack.length; z++) {
        if (
          clinicApprovedAppointments[i].daySelected === foundCopy.date &&
          clinicApprovedAppointments[i].timeSelected.starttime ===
            foundCopy.timeSPack[z].starttime &&
          clinicApprovedAppointments[i].timeSelected.starttime ===
            foundCopy.timeSPack[z].starttime
        ) {
          isBooked = true;
          foundCopy.timeSPack[z].isBooked = true;
          // newObj = {...foundCopy.timeSPack[z], isBooked};
          // newArr.push(newObj);
        } else isBooked = false;
      }
    }

    console.log("newArr", newArr);

    if (foundCopy.timeSPack.length > 0) {
      setCheckedDate(foundCopy.timeSPack);
    } else setCheckedDate(found.timeSPack);
  };

  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth() + 1; // 👈️ months are 0-based

  const handleCheckBookedDays = () => {
    for (const date in calendarTimes) {
      const newDate = moment(date).format("DD-MM-YYYY");

      for (
        let i = 0;
        i < clinicApprovedAppointments.approvedClinicAppointments.length;
        i++
      ) {
        if (
          newDate ===
          clinicApprovedAppointments.approvedClinicAppointments[i].daySelected
        ) {
          calendarTimes[date].selectedColor = "red";
        }
      }
    }
    setChangedDays(calendarTimes);
  };

  useEffect(() => {
    // console.log('calendarTimes for clinics', calendarTimes);
    console.log(
      "clinicInfoChecked for patient...-------------------------------------------------------------",
      clinicInfoChecked
    );
    // console.log('Use effect for calendar of patient', clinicInfoChecked);
    // let res = getDaysArray(currentYear, monthNumber);
    // for (let i = 0; i < allDays.length; i++) {
    //   arrSecond.push(allDays[i].val);
    // }
    // let tryTestArr = [];
    // tryTestArr = res.reduce(function (a, e, i) {
    //   for (let variable of arrSecond) {
    //     if (e === variable) a.push(i + 1);
    //   }
    //   return a;
    // }, []);
    // arrFinal = tryTestArr;
    // for (let i = 0; i < arrFinal.length; i++) {
    //   const date = moment(new Date(2023, monthSelected.month - 1, arrFinal[i]));
    //   const newDate = moment(date).format('YYYY-MM-DD');
    //   finalObj[newDate] = {selected: true};
    // }
    // handleSetDays(finalObj);
  }, [monthSelected.month]);

  return (
    <Fragment>
      <MainContainer>
        <CardSurface style={styles.containerStyle}>
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
                  navigation.navigate(screenName.AppointmentCheckout, {
                    daySelected,
                    item,
                    AllClinicInfo,
                  });
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
                    {i18n.translate("timings")}
                  </H8fontMediumBlack>
                  <TimeIcon height={13} width={13} />
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
                    <Text style={styles.textBoxStyle}>{`${createTimeFormat(
                      item.starttime,
                      hourClock
                    )}`}</Text>
                  </View>
                  <View>
                    <H9fontRegularGray style={{ color: color }}>
                      {i18n.translate("toTime")}
                    </H9fontRegularGray>

                    {/* <TextInput
                      style={styles.textBoxStyle}
                      placeholder="10:00 AM"
                    /> */}

                    <Text style={styles.textBoxStyle}>{`${createTimeFormat(
                      item.endtime,
                      hourClock
                    )}`}</Text>
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

export default TimeAndDateDoctorPatient;

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
