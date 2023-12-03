import React from 'react';
import {View, TouchableOpacity, Text, Image, StyleSheet} from 'react-native';
import {labels} from '../../utils/labels';
import {
  CardSurface,
  CommonLineDotted,
  RowView,
} from '../../components/commonViews';
import {
  H14fontRegularBlackk,
  H8fontMediumBlack,
  H9fontRegularGray,
  H9fontRegularBlack
} from '../../components/commonText';

import {
  alignItemsCenter,
  flexRow,
  pl10,
  pl5,
  pt10,
  pt5,
  spaceBetween,
} from '../../common/commonStyles';
import AwesomeEye from '../../../assets/images/icon-awesome-eye.svg';
import MetroPrintor from '../../../assets/images/icon-metro-printer.svg';


import Doctor1 from '../../../assets/images/doctors/doctor-01.svg';
import Doctor2 from '../../../assets/images/doctors/doctor-02.svg';
import Doctor3 from '../../../assets/images/doctors/doctor-03.svg';
import Doctor4 from '../../../assets/images/doctors/doctor-07.svg';
import i18n from '../../../i18n';

interface Props {}

const PrescriptionList: React.FC<Props> = ({}): JSX.Element => {
  return (
    <View style={styles.container}>
      <CardSurface style={styles.cardSurface}>
        <RowView style={pt5}>
          <View style={flexRow}>
            <H14fontRegularBlackk>{i18n.translate("prescriptions")}</H14fontRegularBlackk>
            <H14fontRegularBlackk>{' 1'}</H14fontRegularBlackk>
          </View>
          <H9fontRegularGray>{'14 Nov 2019'}</H9fontRegularGray>
        </RowView>
        <CommonLineDotted />
        <RowView>
          <View style={styles.prescriptionDetials}>
            <View style={styles.profileImageStyle}>
              <Doctor1 height={60} width={100}/>
            </View>
            <View style={pl10}>
              <H8fontMediumBlack>{'Dr. Ruby Perrin'}</H8fontMediumBlack>
              <H9fontRegularGray>{'Dental'}</H9fontRegularGray>
              <View style={styles.buttonDetails}>
                <TouchableOpacity style={styles.viewButtonStyle}>
                  <AwesomeEye height={10} width={15} />
                  <Text style={styles.viewBtnStyle}>{i18n.translate("view")}</Text>
                </TouchableOpacity>
                <View style={pl5}>
                  <TouchableOpacity style={styles.printButtonStyle}>
                    <MetroPrintor height={13} width={13} />
                    <Text style={styles.printBtnText}>{i18n.translate("print")}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </RowView>
      </CardSurface>

      <CardSurface style={styles.cardSurface}>
        <RowView style={pt5}>
          <View style={flexRow}>
            <H14fontRegularBlackk>{i18n.translate("prescriptions")}</H14fontRegularBlackk>
            <H14fontRegularBlackk>{' 2'}</H14fontRegularBlackk>
          </View>
          <H9fontRegularGray>{'14 Nov 2019'}</H9fontRegularGray>
        </RowView>
        <CommonLineDotted />
        <RowView>
          <View style={styles.prescriptionDetials}>
            <View style={{height: 60, width: 60, borderRadius: 50, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', paddingLeft: 28}}>
              <Doctor2 height={60} width={100}/>
            </View>
            <View style={pl10}>
              <H8fontMediumBlack>{'Dr. Darren Elder'}</H8fontMediumBlack>
              <H9fontRegularGray>{'Dental'}</H9fontRegularGray>
              <View style={styles.buttonDetails}>
                <TouchableOpacity style={styles.viewButtonStyle}>
                  <AwesomeEye height={10} width={15} />
                  <Text style={styles.viewBtnStyle}>{i18n.translate("view")}</Text>
                </TouchableOpacity>
                <View style={pl5}>
                  <TouchableOpacity style={styles.printButtonStyle}>
                    <MetroPrintor height={13} width={13} />
                    <Text style={styles.printBtnText}>{i18n.translate("print")}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </RowView>
      </CardSurface>

      <CardSurface style={styles.cardSurface}>
        <RowView style={pt5}>
          <View style={flexRow}>
            <H14fontRegularBlackk>{i18n.translate("prescriptions")}</H14fontRegularBlackk>
            <H14fontRegularBlackk>{' 3'}</H14fontRegularBlackk>
          </View>
          <H9fontRegularGray>{'14 Nov 2019'}</H9fontRegularGray>
        </RowView>
        <CommonLineDotted />
        <RowView>
          <View style={styles.prescriptionDetials}>
            <View style={styles.profileImageStyle}>
              <Doctor3 height={60} width={100}/>
            </View>
            <View style={pl10}>
              <H8fontMediumBlack>{'Dr. Deborah Angel'}</H8fontMediumBlack>
              <H9fontRegularGray>{'Dental'}</H9fontRegularGray>
              <View style={styles.buttonDetails}>
                <TouchableOpacity style={styles.viewButtonStyle}>
                  <AwesomeEye height={10} width={15} />
                  <Text style={styles.viewBtnStyle}>{i18n.translate("view")}</Text>
                </TouchableOpacity>
                <View style={pl5}>
                  <TouchableOpacity style={styles.printButtonStyle}>
                    <MetroPrintor height={13} width={13} />
                    <Text style={styles.printBtnText}>{i18n.translate("print")}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </RowView>
      </CardSurface>

      <CardSurface style={styles.cardSurface}>
        <RowView style={pt5}>
          <View style={flexRow}>
            <H14fontRegularBlackk>{i18n.translate("prescriptions")}</H14fontRegularBlackk>
            <H14fontRegularBlackk>{' 4'}</H14fontRegularBlackk>
          </View>
          <H9fontRegularGray>{'14 Nov 2019'}</H9fontRegularGray>
        </RowView>
        <CommonLineDotted />
        <RowView>
          <View style={styles.prescriptionDetials}>
            <View style={styles.profileImageStyle}>
              <Doctor4 height={60} width={100}/>
            </View>
            <View style={pl10}>
              <H8fontMediumBlack>{'Dr. Ruby Perrin'}</H8fontMediumBlack>
              <H9fontRegularGray>{'Dental'}</H9fontRegularGray>
              <View style={styles.buttonDetails}>
                <TouchableOpacity style={styles.viewButtonStyle}>
                  <AwesomeEye height={10} width={15} />
                  <Text style={styles.viewBtnStyle}>{i18n.translate("view")}</Text>
                </TouchableOpacity>
                <View style={pl5}>
                  <TouchableOpacity style={styles.printButtonStyle}>
                    <MetroPrintor height={13} width={13} />
                    <Text style={styles.printBtnText}>{i18n.translate("print")}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </RowView>
      </CardSurface>
    </View>
  );
};
export default PrescriptionList;
const styles = StyleSheet.create({
  container: {paddingHorizontal: 10},
  cardSurface: {
    height: 150,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10
  },
  profileImageStyle: {height: 60, width: 60, borderRadius: 50, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', paddingRight: 25},
  prescriptionDetials: {padding: 5, paddingTop: 10, flexDirection: 'row'},
  imageStyle: {height: 80, width: 80, borderRadius: 50},
  buttonDetails: {flexDirection: 'row', paddingTop: 5},
  viewButtonStyle: {
    height: 28,
    width: 78,
    backgroundColor: 'rgba(29, 185, 170, 0.65)',
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPadding: {paddingLeft: 15, paddingTop: 10},
  eyeImageStyle: {height: 10, width: 15},
  viewBtnStyle: {
    color: 'white',
    fontSize: 11,
    paddingLeft: 5,
  
  },
  printButtonStyle: {
    height: 28,
    width: 78,
    backgroundColor: '#D4D4D4',
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  printBtnImage: {height: 13, width: 13},
  printBtnText: {
    color: '#8B8A8A',
    fontSize: 11,
    paddingLeft: 5,

  },
});
