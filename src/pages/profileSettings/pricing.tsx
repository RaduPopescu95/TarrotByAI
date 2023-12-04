import React, {useState} from 'react';
import {TextInput, View, TouchableOpacity, StyleSheet} from 'react-native';
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
import Icon1 from 'react-native-vector-icons/AntDesign';
import {
  alignItemsCenter,
  flex048,
  flex050,
  flexRow,
  justyfyCenter,
  mh10,
  mh15,
  mt15,
  mv10,
  ph15,
  pl10,
  pt10,
  spaceBetween,
} from '../../common/commonStyles';

interface Props {}

const options = [
  {name: 'Male', value: 'male', isSeleted: false},
  {name: 'Custom Price (per hour)', value: 'custome', isSeleted: false},
];

const Pricing: React.FC<Props> = ({}): JSX.Element => {
  const [priceOptions, setOptions] = useState(options);
  const [price, setPrice] = useState('');

  const textBoxField = (label: string, showAdd: boolean) => {
    return (
      <View>
        {label ? (
          <H30fontRegularLightBlack2 style={mt15}>
            {label}
          </H30fontRegularLightBlack2>
        ) : null}
        <CommonInput style={{height: 35}}>
          <TextInput style={styles.inputStyle} />

          {showAdd ? (
            <TouchableOpacity onPress={() => {}} style={[styles.addIconsStyle]}>
              <Icon name="plus" size={24} color={'white'} />
            </TouchableOpacity>
          ) : null}
        </CommonInput>
      </View>
    );
  };

  return (
    <CardSurface style={[mh10, ph15]}>
      <H8fontMediumBlack style={{paddingTop: 10, paddingBottom: 5}}>{'Pricing'}</H8fontMediumBlack>
      {priceOptions.map((item, index) => {
        return (
          <TouchableOpacity
            style={styles.optionsStyle}
            onPress={() => setPrice(item.value)}>
            <View
              style={[
                styles.iconStyle,
                price === item.value ? {backgroundColor: colors.ligtBlue} : {},
              ]}>
              <Icon1 name="check" size={15} color={colors.white} />
            </View>
            <H30fontRegularLightBlack2 style={{fontSize: 12}}>{item.name}</H30fontRegularLightBlack2>
          </TouchableOpacity>
        );
      })}
      <View style={{paddingTop: 20}}/>
      {textBoxField('', false)}
      <CommonLineDotted style={mv10} />

      {textBoxField('Services', true)}
      {textBoxField('Specialization', true)}
      <TouchableOpacity style={styles.nextButtonStyle}>
        <H14fontRegularWhite>NEXT</H14fontRegularWhite>
      </TouchableOpacity>
    </CardSurface>
  );
};
export default Pricing;

const styles = StyleSheet.create({
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
  iconStyle: {
    height: 20,
    width: 20,
    borderRadius: 50,
    borderColor: colors.borderTextColor,
    borderWidth: 1,
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsStyle: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  inputStyle: {paddingLeft: 10, width: '100%'},
  addIconsStyle: {
    flex: 1,
    // height: 28,
    // width: 28,
    borderRadius: 15,
    backgroundColor: '#0dcaf0',
    // paddingLeft: 2,
    // paddingTop: 2,
    // marginTop: 10,
    position: 'absolute',
    // justifyContent: 'flex-end'
    right: 5,
    top: 5
    // top: -5,
  },
});
