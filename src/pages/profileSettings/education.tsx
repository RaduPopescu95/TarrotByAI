import React, {Fragment, useState} from 'react';
import {
  TextInput,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import {
  CardSurface,
  CommonInput,
  CommonLineDotted,
  RowView,
} from '../../components/commonViews';
import {
  H14fontRegularWhite,
  H30fontRegularLightBlack2,
  H8fontMediumBlack,
} from '../../components/commonText';
import {colors} from '../../utils/colors';
import Icon from 'react-native-vector-icons/Entypo';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import {DevWidth} from '../../utils/device';
import {
  alignItemsCenter,
  flex048,
  flex050,
  flexRow,
  justyfyCenter,
  mh10,
  mh15,
  mt10,
  mt15,
  mv10,
  mv15,
  ph10,
  ph15,
  pl10,
  pt10,
  spaceBetween,
} from '../../common/commonStyles';
import {DatePicker} from '../../components/dateAndTimePicker';
import moment from 'moment';
import CalendarIcon from '../../../assets/images/icon-metro-calendar-big.svg';

interface Props {}
const Education: React.FC<Props> = ({}): JSX.Element => {
  // const [male, setmale] = useState(false)
  // const [price, setPrice] = useState(false)
  // const [show, setShow] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentPicker, setCurrentPicker] = useState('');
  const [fromDate, setFromdate] = useState('');
  const [toDate, setTodate] = useState('');

  const textBoxField = (label: string) => {
    return (
      <View>
        <H30fontRegularLightBlack2 style={mt15}>
          {label}
        </H30fontRegularLightBlack2>
        <CommonInput style={{height: 35}}>
          <TextInput style={styles.inputStyle} />
        </CommonInput>
      </View>
    );
  };
  const datePickerField = (label: string, value: string, type: string) => {
    return (
      <View>
        <H30fontRegularLightBlack2 style={mt15}>
          {label}
        </H30fontRegularLightBlack2>

        <TouchableOpacity
          onPress={() => {
            setShowDatePicker(true);
            setCurrentPicker(type);
          }}
          style={styles.datePickerStyle}>
          {/* <Text>{value ? value : 'Date'}</Text> */}
          <CalendarIcon />
        </TouchableOpacity>
      </View>
    );
  };

  const today = moment(new Date()).format('DD-MM-YYYY');

  return (
    <CardSurface style={[mh10, ph15]}>
      <H8fontMediumBlack style={mt10}>{'Education'}</H8fontMediumBlack>
      <View>
        <View style={[flexRow, spaceBetween]}>
          <View style={flex048}>{textBoxField('Degree')}</View>
          <View style={flex048}>{textBoxField('Year of completion')}</View>
        </View>
        {textBoxField('College / Institute')}
      </View>

      <TouchableOpacity onPress={() => {}} style={styles.addIconsStyle}>
        <Icon name="plus" size={22} color={'white'} />
      </TouchableOpacity>

      <CommonLineDotted style={mv15} />

      <H8fontMediumBlack>{'Experience'}</H8fontMediumBlack>
      <View>
        {textBoxField('Hospital Name')}
        <View style={[flexRow, spaceBetween]}>
          <View style={flex048}>
            {datePickerField('From', fromDate, 'from')}
          </View>
          <View style={flex048}>{datePickerField('To', toDate, 'to')}</View>
        </View>
      </View>

      <TouchableOpacity onPress={() => {}} style={styles.addIconsStyle}>
        <Icon name="plus" size={22} color={'white'} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.nextButtonStyle}>
        <H14fontRegularWhite>NEXT</H14fontRegularWhite>
      </TouchableOpacity>

      {showDatePicker ? (
        <DatePicker
          date={today}
          selectedDate={(date: string) => {
            currentPicker == 'from' ? setFromdate(date) : setTodate(date);
            setShowDatePicker(false);
            setCurrentPicker('');
          }}
        />
      ) : null}
    </CardSurface>
  );
};
export default Education;

const styles = StyleSheet.create({
  addIconsStyle: {
    height: 24,
    width: 24,
    borderRadius: 15,
    backgroundColor: '#0dcaf0',
    // paddingLeft: 2,
    // paddingTop: 2,
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  datePickerStyle: {
    height: 35,
    borderColor: '#CFCFCF',
    borderRadius: 5,
    borderWidth: 1,
    marginTop: 5,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
  },
  nextButtonStyle: {
    height: 45,
    backgroundColor: '#1B5A90',
    marginVertical: 10,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30
  },
  inputStyle: {paddingLeft: 10, width: '100%'},
});
