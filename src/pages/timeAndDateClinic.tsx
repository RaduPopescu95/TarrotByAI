import React, {Fragment, useEffect, useState} from 'react';
import {
  TextInput,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {CardSurface, MainContainer, RowView} from '../components/commonViews';
import {
  H15fontMediumBlack,
  H9fontRegularGray,
  H8fontMediumBlack,
  H8fontMediumWhite,
  H14fontRegularBlue,
} from '../components/commonText';
// import {DevWidth} from '../utils/device';
import {Dimensions} from 'react-native';

import {dayOptions} from '../utils/constant';
import moment from 'moment';
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
} from '../common/commonStyles';
import {colors} from '../utils/colors';
import {labels} from '../utils/labels';
import LeftArrowIcon from '../../assets/images/left-arrow-circle.svg';
import RightArrowIcon from '../../assets/images/right-arrow-circle.svg';
import TimeIcon from '../../assets/images/icon-time.svg';
import {useSelector} from 'react-redux';
import {Calendar} from 'react-native-calendars';
import {ActivityIndicator, Text} from 'react-native-paper';
import {screenName} from '../utils/screenName';
import {useNavigation} from '@react-navigation/native';
import {retrieveClinicCalendarTimes} from '../utils/getFirebaseData';
import i18n from '../../i18n';

interface Props {}

const TimeAndDateClinic: React.FC<Props> = ({}): JSX.Element => {
  const navigation = useNavigation();

  const [selectTime, setSelectTime] = useState(0);
  const [checkedDate, setCheckedDate] = useState(0);
  const [changedDays, setChangedDays] = useState(false);

  const [finalArr, setFinalArr] = useState([]);
  const [monthNumber, setMonthNumber] = useState(0);
  const [monthSelected, setMonthSelected] = useState(3);

  const clinicTimeSlotsDB = useSelector(state => state.clinicTimeSlots);
  const {allDaysDB} = clinicTimeSlotsDB;

  const clinicCalendarTimes = useSelector(state => state.clinicCalendarTimes);
  const {calendarTimes, loading} = clinicCalendarTimes;

  const clinicApprovedApp = useSelector(
    state => state.clinicApprovedAppointments,
  );
  const {clinicApprovedAppointments, loading: loadingApprovedAppointments} =
    clinicApprovedApp;

  const [allDays, setAllDays] = useState(allDaysDB ? allDaysDB.allDays : []);

  const today = moment(new Date()).format('MMMM YYYY');

  const _format = 'YYYY-MM-DD';
  const _today = moment().format(_format);
  const _maxDate = moment().add(100, 'days').format(_format);

  const [_markedDates, setMarkedDates] = useState([]);

  const [selectedDay, setSelectday] = useState('');

  const onDaySelect = day => {
    console.log('---------------BEGIN-----------------------');
    if (allDays.length === 0) {
      Alert.alert(
        'No scheduled timings for selected day',
        'Do you want to create scheduled times for this day?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => navigation.navigate(screenName.ScheduleTimings),
          },
        ],
      );
      return;
    }

    const dateFirst = new Date();
    const currentYear = dateFirst.getFullYear();
    const currentMonth = dateFirst.getMonth() + 1; // 👈️ months are 0-based

    const setableDate = moment.utc(day.dateString).format('DD-MM-YYYY');
    setSelectday(setableDate);

    const names = Object.freeze([
      'Sun',
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat',
    ]);
    const monthIndex = monthNumber - 1;
    const dDay = day.day + 1;
    const dMonth = day.month - 1;
    const date = new Date(day.year, dMonth, dDay);
    let result;

    result = `${names[date.getDay() - 1]}`;

    let copyAllDays = [];
    allDays.forEach(item => {
      console.log('----------------');
      // console.log(item);
      let cloneItem = {}; // the new empty object

      // let's copy all user properties into it
      for (let key in item) {
        cloneItem[key] = item[key];
      }
      // console.log(cloneItem);
      copyAllDays.push(cloneItem);
    });

    const found = copyAllDays.find(element => element.val === result);
    if (found == undefined) {
      Alert.alert(
        'No scheduled timings for selected day',
        'Do you want to create scheduled times for this day?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => navigation.navigate(screenName.ScheduleTimings),
          },
        ],
      );
      return;
    }

    const nr = found.nr;
    const timeS = found.timeS;

    const timeSPack = found.timeSPack;

    // console.log('fist test...', timeSPack);
    let newTimeSPack = [];
    for (let i = 0; i < timeSPack.length; i++) {
      let timeSPackClone = {};
      // let's copy all user properties into it
      for (let key in timeSPack[i]) {
        // console.log(timeSPackkey);
        timeSPackClone[key] = timeSPack[i][key];
      }
      newTimeSPack.push(timeSPackClone);
    }
    console.log('timeSPack', timeSPack);
    let newar = timeSPack;
    console.log('timeSPackClone', newTimeSPack);
    if (newTimeSPack == timeSPack) {
      console.log('yes');
    }

    const val = found.val;

    const foundCopy = {
      date: setableDate,
      nr: nr,
      timeS: timeS,
      // timeSPack: timeSPack,
      timeSPack: newTimeSPack,
      val: val,
    };

    let isBooked = false;
    const newArr = [];
    let newObj = {};
    for (
      let i = 0;
      i < clinicApprovedAppointments.approvedClinicAppointments.length;
      i++
    ) {
      for (let z = 0; z < foundCopy.timeSPack.length; z++) {
        if (
          clinicApprovedAppointments.approvedClinicAppointments[i]
            .daySelected === foundCopy.date &&
          clinicApprovedAppointments.approvedClinicAppointments[i].timeSelected
            .starttime === foundCopy.timeSPack[z].starttime &&
          clinicApprovedAppointments.approvedClinicAppointments[i].timeSelected
            .starttime === foundCopy.timeSPack[z].starttime
        ) {
          isBooked = true;

          foundCopy.timeSPack[z].isBooked = true;
          // newObj = {...foundCopy.timeSPack[z], isBooked};
          // newObj = foundCopy.timeSPack;

          newArr.push(newObj);
        } else isBooked = false;
      }
    }

    if (foundCopy.timeSPack.length > 0) {
      // newArr has always only one element
      setCheckedDate(foundCopy.timeSPack);
    } else {
      console.log('no');
      setCheckedDate(found.timeSPack);
    }
  };

  const handleCheckBookedDays = () => {
    for (const date in calendarTimes) {
      const newDate = moment(date).format('DD-MM-YYYY');

      for (
        let i = 0;
        i < clinicApprovedAppointments.approvedClinicAppointments.length;
        i++
      ) {
        if (
          newDate ===
          clinicApprovedAppointments.approvedClinicAppointments[i].daySelected
        ) {
          calendarTimes[date].selectedColor = 'red';
        }
      }
    }
    setChangedDays(calendarTimes);
  };

  useEffect(() => {
    console.log('-----------------------------------');
    console.log(loading);
    // console.log(changedDays);
    handleCheckBookedDays();
  }, []);

  if (loading || loadingApprovedAppointments) {
    return (
      <View style={[styles.containerLoader, styles.horizontal]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Fragment>
      <MainContainer>
        <CardSurface style={styles.containerStyle}>
          <Calendar
            minDate={_today}
            // maxDate={_maxDate}
            onDayPress={onDaySelect}
            onMonthChange={month => {
              setMonthNumber(month.month);
              setMonthSelected(month);
            }}
            markedDates={changedDays ? changedDays : calendarTimes}
          />
        </CardSurface>
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <H14fontRegularBlue style={{fontSize: 20, fontWeight: 'bold'}}>
            {selectedDay}
          </H14fontRegularBlue>
        </View>
        <FlatList
          scrollEnabled
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            pt10,
            {
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginHorizontal: 16,
              justifyContent: 'space-between',
            },
          ]}
          data={checkedDate}
          renderItem={({item, index}) => {
            // let color = index == selectTime ? colors.white : colors.black;
            let color = colors.black;
            let backgroundColor = colors.white;
            let bookedBgColor = colors.seaBlue;
            // index == selectTime ? colors.ligtBlue : colors.white;

            return (
              <TouchableOpacity
                // onPress={() => setSelectTime(index)}
                onPress={() => {
                  navigation.navigate(screenName.clinicAppointmentsDay, {
                    selectedAppointmentDayTime: item,
                    selectedDay,
                  });
                }}
                style={[
                  styles.timingCardContainerStyle,
                  {
                    backgroundColor: item.isBooked
                      ? bookedBgColor
                      : backgroundColor,
                  },
                ]}>
                <RowView
                  style={[
                    styles.timingRowStyle,
                    {
                      borderBottomColor:
                        // index == selectTime ? colors.white : colors.imageGray,
                        colors.imageGray,
                    },
                  ]}>
                  {item.isBooked ? (
                    <H8fontMediumBlack style={{color: color}}>
                      {i18n.translate("isBooked")}
                    </H8fontMediumBlack>
                  ) : (
                    <>
                      <H8fontMediumBlack style={{color: color}}>
                        {i18n.translate("timings")}
                      </H8fontMediumBlack>
                      <TimeIcon height={13} width={13} />
                    </>
                  )}
                </RowView>
                <View style={styles.timepickerRowStyle}>
                  <View>
                    <H9fontRegularGray style={{color: color}}>
                      {i18n.translate("fromTime")}
                    </H9fontRegularGray>

                    <Text style={styles.textBoxStyle}>{item.starttime}</Text>
                  </View>
                  <View>
                    <H9fontRegularGray style={{color: color}}>
                      {i18n.translate("toTime")}
                    </H9fontRegularGray>

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

export default TimeAndDateClinic;

const styles = StyleSheet.create({
  containerLoader: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    width: '100%',
  },
  containerStyle: {marginHorizontal: 10, marginTop: 10},

  container: {
    height: 50,
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginVertical: 15,
    elevation: 3,
  },
  iconStyle: {height: 25, width: 25},
  dayBtnStyle: {
    height: 33,
    width: 33,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timingCardContainerStyle: {
    height: 107,
    width: Dimensions.get('window').width / 2.32,
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
    alignItems: 'center',
    paddingBottom: 4,
  },
  timepickerRowStyle: {
    paddingTop: 7,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textBoxStyle: {
    borderColor: '#CFCFCF',
    borderWidth: 1,
    height: 32,
    width: 62,
    borderRadius: 5,
    backgroundColor: '#fff',
    textAlign: 'center',
    justifyContent: 'center',
    paddingLeft: 0,
    // top: 5,
    paddingTop: 6,
    fontSize: 12,
    alignItems: 'center',
  },
});
