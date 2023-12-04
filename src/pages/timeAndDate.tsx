import React, {Fragment, useState} from 'react';
import {
  TextInput,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {MainContainer, RowView} from '../components/commonViews';
import {
  H15fontMediumBlack,
  H9fontRegularGray,
  H8fontMediumBlack,
  H8fontMediumWhite,
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
import i18n from '../../i18n';


interface Props {}

const TimeAndDate: React.FC<Props> = ({}): JSX.Element => {
  const [selectTime, setSelectTime] = useState(0);
  const [selectedDay, setSelectedDay] = useState('Th');
  const today = moment(new Date()).format('MMMM YYYY');
  return (
    <Fragment>
      <MainContainer>
        <View style={styles.container}>
          <TouchableOpacity>
            <LeftArrowIcon height={25} width={25} fill="#000"/>
          </TouchableOpacity>
          <H15fontMediumBlack>{today}</H15fontMediumBlack>
          <TouchableOpacity>
            <RightArrowIcon height={25} width={25} fill="#000"/>
          </TouchableOpacity>
        </View>

        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{marginLeft: 20}}
          data={dayOptions}
          renderItem={({item, index}) => (
            <TouchableOpacity
              onPress={() => setSelectedDay(item.name)}
              style={[alignItemsCenter, mr25, pb10]}>
              <View
                style={[
                  styles.dayBtnStyle,
                  {
                    backgroundColor:
                      selectedDay == item.name ? colors.blue : colors.ligtBlue,
                  },
                ]}>
                <H8fontMediumWhite>{item.no}</H8fontMediumWhite>
              </View>
              <H8fontMediumBlack>{item.name}</H8fontMediumBlack>
            </TouchableOpacity>
          )}
        />

        <FlatList
          scrollEnabled
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[pt10,{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: 16, justifyContent: 'space-between'}]}
          data={[{}, {}, {}, {}, {}, {}]}
          renderItem={({item, index}) => {
            let color = index == selectTime ? colors.white : colors.black;
            let backgroundColor =
              index == selectTime ? colors.ligtBlue : colors.white;

            return (
              <TouchableOpacity
                onPress={() => setSelectTime(index)}
                style={[
                  styles.timingCardContainerStyle,
                  {
                    backgroundColor: backgroundColor,
                  },
                ]}>
                <RowView
                  style={[
                    styles.timingRowStyle,
                    {
                      borderBottomColor:
                        index == selectTime ? colors.white : colors.imageGray,
                    },
                  ]}>
                  <H8fontMediumBlack style={{color: color}}>
                    {i18n.translate("timings")}
                  </H8fontMediumBlack>
                  <TimeIcon height={13} width={13} />
                </RowView>
                <View style={styles.timepickerRowStyle}>
                  <View>
                    <H9fontRegularGray style={{color: color}}>
                      {i18n.translate("fromTime")}
                    </H9fontRegularGray>
                    <TextInput
                      style={styles.textBoxStyle}
                      placeholder="10:00 AM"
                    />
                  </View>
                  <View>
                    <H9fontRegularGray style={{color: color}}>
                      {i18n.translate("toTime")}
                    </H9fontRegularGray>

                    <TextInput
                      style={styles.textBoxStyle}
                      placeholder="10:00 AM"
                    />
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

export default TimeAndDate;

const styles = StyleSheet.create({
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
    elevation: 3
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
    width: Dimensions.get('window').width/2.32,
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
    paddingBottom: 4
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

    paddingLeft: 5,
    // top: 5,
    paddingTop: 5,
    fontSize: 12,
    alignItems: 'center',
  },
});
