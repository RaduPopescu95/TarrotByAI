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
  H9fontRegularBlack,
  H9fontRegularGray,
} from '../../components/commonText';

// import {DevWidth} from '../../utils/device';
import {Dimensions} from 'react-native';

import {flexRow, mt10, ph10, pt5} from '../../common/commonStyles';
import AwesomeEye from '../../../assets/images/icon-awesome-eye.svg';
import MetroPrintor from '../../../assets/images/icon-metro-printer.svg';


import Doctor1 from '../../../assets/images/doctors/doctor-01.svg';
import Doctor2 from '../../../assets/images/doctors/doctor-02.svg';
import Doctor3 from '../../../assets/images/doctors/doctor-03.svg';
import Doctor4 from '../../../assets/images/doctors/doctor-07.svg';
import i18n from '../../../i18n';

interface Props {}

const MedicalRecords: React.FC<Props> = ({}): JSX.Element => {
  return (
    <View style={styles.container}>
      <CardSurface style={styles.cardSurface}>
        <RowView style={pt5}>
          <H14fontRegularBlackk>{'#MR-0010'}</H14fontRegularBlackk>
          <H9fontRegularGray>{'14 Nov 2019'}</H9fontRegularGray>
        </RowView>
        <CommonLineDotted />
        <RowView>
          <View style={styles.detailsContainer}>
            <View style={styles.profileImageStyle}>
              <Doctor1 height={60} width={100}/>
            </View>
            <View style={ph10}>
              <H8fontMediumBlack>{'Dr. Ruby Perrin'}</H8fontMediumBlack>
              <RowView style={{width: Dimensions.get('window').width / 1.6, paddingBottom: 5}}>
                <H9fontRegularGray>{'Dental'}</H9fontRegularGray>
                <H9fontRegularBlack>{'Dental Filling'}</H9fontRegularBlack>
              </RowView>
              <H9fontRegularBlack>{'Dental-test.pdf'}</H9fontRegularBlack>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.viewButtonStyle}>
                  <View style={[flexRow,{justifyContent: 'center', alignItems: 'center'}]}>
                    <AwesomeEye height={10} width={15} />
                    <Text style={styles.viewTextStyle}>{i18n.translate("view")}</Text>
                  </View>
                </TouchableOpacity>
                <View>
                  <TouchableOpacity style={styles.printBtnStyle}>
                    <View style={[flexRow,{justifyContent: 'center', alignItems: 'center'}]}>
                      <MetroPrintor height={13} width={13} />
                      <Text style={styles.printTextStyle}>{i18n.translate("print")}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </RowView>
      </CardSurface>

      <CardSurface style={styles.cardSurface}>
        <RowView style={pt5}>
          <H14fontRegularBlackk>{'#MR-0010'}</H14fontRegularBlackk>
          <H9fontRegularGray>{'14 Nov 2019'}</H9fontRegularGray>
        </RowView>
        <CommonLineDotted />
        <RowView>
          <View style={styles.detailsContainer}>
            <View style={{height: 60, width: 60, borderRadius: 50, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', paddingLeft: 28}}>
              <Doctor2 height={60} width={100}/>
            </View>
            <View style={ph10}>
              <H8fontMediumBlack>{'Dr. Darren Elder'}</H8fontMediumBlack>
              <RowView style={{width: DevWidth / 1.6, paddingBottom: 5}}>
                <H9fontRegularGray>{'Dental'}</H9fontRegularGray>
                <H9fontRegularBlack>{'Dental Filling'}</H9fontRegularBlack>
              </RowView>
              <H9fontRegularBlack>{'Dental-test.pdf'}</H9fontRegularBlack>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.viewButtonStyle}>
                  <View style={[flexRow,{justifyContent: 'center', alignItems: 'center'}]}>
                    <AwesomeEye height={10} width={15} />
                    <Text style={styles.viewTextStyle}>{i18n.translate("view")}</Text>
                  </View>
                </TouchableOpacity>
                <View>
                  <TouchableOpacity style={styles.printBtnStyle}>
                    <View style={[flexRow,{justifyContent: 'center', alignItems: 'center'}]}>
                      <MetroPrintor height={13} width={13} />
                      <Text style={styles.printTextStyle}>{i18n.translate("print")}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </RowView>
      </CardSurface>

      <CardSurface style={styles.cardSurface}>
        <RowView style={pt5}>
          <H14fontRegularBlackk>{'#MR-0010'}</H14fontRegularBlackk>
          <H9fontRegularGray>{'14 Nov 2019'}</H9fontRegularGray>
        </RowView>
        <CommonLineDotted />
        <RowView>
          <View style={styles.detailsContainer}>
            <View style={styles.profileImageStyle}>
              <Doctor3 height={60} width={100}/>
            </View>
            <View style={ph10}>
              <H8fontMediumBlack>{'Dr. Deborah Angel'}</H8fontMediumBlack>
              <RowView style={{width: DevWidth / 1.6, paddingBottom: 5}}>
                <H9fontRegularGray>{'Dental'}</H9fontRegularGray>
                <H9fontRegularBlack>{'Dental Filling'}</H9fontRegularBlack>
              </RowView>
              <H9fontRegularBlack>{'Dental-test.pdf'}</H9fontRegularBlack>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.viewButtonStyle}>
                  <View style={[flexRow,{justifyContent: 'center', alignItems: 'center'}]}>
                    <AwesomeEye height={10} width={15} />
                    <Text style={styles.viewTextStyle}>{i18n.translate("view")}</Text>
                  </View>
                </TouchableOpacity>
                <View>
                  <TouchableOpacity style={styles.printBtnStyle}>
                    <View style={[flexRow,{justifyContent: 'center', alignItems: 'center'}]}>
                      <MetroPrintor height={13} width={13} />
                      <Text style={styles.printTextStyle}>{i18n.translate("print")}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </RowView>
      </CardSurface>

      <CardSurface style={styles.cardSurface}>
        <RowView style={pt5}>
          <H14fontRegularBlackk>{'#MR-0010'}</H14fontRegularBlackk>
          <H9fontRegularGray>{'14 Nov 2019'}</H9fontRegularGray>
        </RowView>
        <CommonLineDotted />
        <RowView>
          <View style={styles.detailsContainer}>
            <View style={styles.profileImageStyle}>
              <Doctor4 height={60} width={100}/>
            </View>
            <View style={ph10}>
              <H8fontMediumBlack>{'Dr. Ruby Perrin'}</H8fontMediumBlack>
              <RowView style={{width: DevWidth / 1.6, paddingBottom: 5}}>
                <H9fontRegularGray>{'Dental'}</H9fontRegularGray>
                <H9fontRegularBlack>{'Dental Filling'}</H9fontRegularBlack>
              </RowView>
              <H9fontRegularBlack>{'Dental-test.pdf'}</H9fontRegularBlack>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.viewButtonStyle}>
                  <View style={[flexRow,{justifyContent: 'center', alignItems: 'center'}]}>
                    <AwesomeEye height={10} width={15} />
                    <Text style={styles.viewTextStyle}>{i18n.translate("view")}</Text>
                  </View>
                </TouchableOpacity>
                <View>
                  <TouchableOpacity style={styles.printBtnStyle}>
                    <View style={[flexRow,{justifyContent: 'center', alignItems: 'center'}]}>
                      <MetroPrintor height={13} width={13} />
                      <Text style={styles.printTextStyle}>{i18n.translate("print")}</Text>
                    </View>
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
export default MedicalRecords;

const styles = StyleSheet.create({
  container: {paddingHorizontal: 10},
  cardSurface: {
    height: 175,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10
  },
  detailsContainer: {padding: 5, flexDirection: 'row'},
  imageStyle: {height: 80, width: 80, borderRadius: 50},
  profileImageStyle: {height: 60, width: 60, borderRadius: 50, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', paddingRight: 25},
  buttonContainer: {flexDirection: 'row', paddingTop: 10},
  viewButtonStyle: {
    height: 28,
    width: 78,
    backgroundColor: 'rgba(29, 185, 170, 0.65)',
    borderRadius: 30,
    marginRight: 5,
    justifyContent: 'center'
  },
  imageContainer: {paddingTop: 10},
  viewImageStyle: {height: 10, width: 15},
  viewTextStyle: {
    paddingLeft: 5,
    color: 'white',
    fontSize: 11,
   
  },
  printBtnStyle: {
    height: 28,
    width: 78,
    backgroundColor: '#D4D4D4',
    borderRadius: 30,
    justifyContent: 'center'
  },
  printImage: {height: 13, width: 13},
  printTextStyle: {
    color: '#8B8A8A',
    fontSize: 11,

    paddingLeft: 5
  },
});
