import React, {Fragment, useState} from 'react';
import {TextInput, View, TouchableOpacity, StyleSheet} from 'react-native';
import {
  CardSurface,
  CommonInput,
  CommonLineDotted,
} from '../../components/commonViews';
import {
  H14fontRegularWhite,
  H30fontRegularLightBlack2,
  H8fontMediumBlack,
} from '../../components/commonText';
import {colors} from '../../utils/colors';
import Icon from 'react-native-vector-icons/Entypo';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import {mt15, mv20, pl10, pl15} from '../../common/commonStyles';

interface Props {}
const Awards: React.FC<Props> = ({}): JSX.Element => {
  const [show, setShow] = useState(false);
  const [showDate, setShowDate] = useState(false);
  return (
    <CardSurface style={styles.containerStyle}>
      <View style={styles.bodyStyle}>
        <H8fontMediumBlack>{'Awards'}</H8fontMediumBlack>

        <H30fontRegularLightBlack2 style={mt15}>
          {'Awards'}
        </H30fontRegularLightBlack2>
        <CommonInput style={{height: 35}}>
          <TextInput style={pl15} />
        </CommonInput>
        <H30fontRegularLightBlack2 style={mt15}>
          {'Year'}
        </H30fontRegularLightBlack2>
        <CommonInput style={{height: 35}}>
          <TextInput style={pl15} />
        </CommonInput>

        {show ? (
          <Fragment>
            <H30fontRegularLightBlack2 style={mt15}>
              {'Awards'}
            </H30fontRegularLightBlack2>
            <CommonInput style={{height: 35}}>
              <TextInput style={pl15} />
            </CommonInput>
            <H30fontRegularLightBlack2 style={mt15}>
              {'Year'}
            </H30fontRegularLightBlack2>
            <CommonInput style={{height: 35}}>
              <TextInput style={pl15} />
            </CommonInput>
            <TouchableOpacity
              onPress={() => setShow(false)}
              style={styles.deleteIconStyle}>
              <Icon1 name="trash-o" size={18} color={'white'} />
            </TouchableOpacity>
          </Fragment>
        ) : null}

        <TouchableOpacity
          onPress={() => setShow(!show)}
          style={styles.addIcons}>
          <Icon name="plus" size={24} color={'white'} />
        </TouchableOpacity>
        <View style={mv20}>
          <CommonLineDotted />
        </View>
        <H8fontMediumBlack>{'Memberships'}</H8fontMediumBlack>

        <H30fontRegularLightBlack2 style={mt15}>
          {'Memberships'}
        </H30fontRegularLightBlack2>
        <CommonInput style={{height: 35}}>
          <TextInput style={pl10} />
        </CommonInput>

        {showDate ? (
          <Fragment>
            <H30fontRegularLightBlack2 style={mt15}>
              {'Memberships'}
            </H30fontRegularLightBlack2>
            <CommonInput style={{height: 35}}>
              <TextInput style={pl10} />
            </CommonInput>

            <TouchableOpacity
              onPress={() => setShowDate(false)}
              style={styles.deleteIconStyle}>
              <Icon1 name="trash-o" size={18} color={'white'} />
            </TouchableOpacity>
          </Fragment>
        ) : null}

        <TouchableOpacity
          onPress={() => setShowDate(!showDate)}
          style={styles.addIcons}>
          <Icon name="plus" size={25} color={'white'} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.nextButtonStyle}>
        <H14fontRegularWhite>NEXT</H14fontRegularWhite>
      </TouchableOpacity>
    </CardSurface>
  );
};
export default Awards;
const styles = StyleSheet.create({
  nextButtonStyle: {
    height: 45,
    backgroundColor: '#1B5A90',
    marginVertical: 10,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginHorizontal: 10
  },
  addIcons: {
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: '#0dcaf0',
    // paddingLeft: 2,
    // paddingTop: 2,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  deleteIconStyle: {
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: colors.red,
    paddingLeft: 8,
    paddingTop: 5,
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  containerStyle: {marginHorizontal: 10},
  bodyStyle: {paddingHorizontal: 10, paddingTop: 10},
});
