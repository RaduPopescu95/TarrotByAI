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

import {ph10, pl5, pt5} from '../../common/commonStyles';
import AwesomeEye from '../../../assets/images/icon-awesome-eye.svg';
import MetroPrintor from '../../../assets/images/icon-metro-printer.svg';

import Doctor1 from '../../../assets/images/doctors/doctor-01.svg';
import Doctor2 from '../../../assets/images/doctors/doctor-02.svg';
import Doctor3 from '../../../assets/images/doctors/doctor-03.svg';
import Doctor4 from '../../../assets/images/doctors/doctor-07.svg';
import i18n from '../../../i18n';

interface Props {}

const Billing: React.FC<Props> = ({}): JSX.Element => {
  return (
    <View style={styles.container}>
      <CardSurface style={styles.cardStyle}>
        <RowView style={pt5}>
          <H14fontRegularBlackk>{'#MR-0010'}</H14fontRegularBlackk>
          <View style={{flexDirection: 'row'}}>
            <H9fontRegularGray>{i18n.translate("paidOn")}</H9fontRegularGray>
            <H9fontRegularGray>{' - 14 Nov 2019'}</H9fontRegularGray>
          </View>
        </RowView>
        <CommonLineDotted />
        <RowView>
          <View style={[styles.bodyStyle]}>
            <View style={styles.profileImageStyle}>
              <Doctor1 height={60} width={100}/>
            </View>
            <View style={{}}>
              <H8fontMediumBlack>{'Dr. Ruby Perrin'}</H8fontMediumBlack>
              <RowView style={{width: Dimensions.get('window').width/1.55}}>
                <H9fontRegularGray>{'Dental'}</H9fontRegularGray>
                <H9fontRegularBlack>{'$450'}</H9fontRegularBlack>
              </RowView>
              <View style={styles.buttonRowStyle}>
                <TouchableOpacity style={styles.viewBtnStyle}>
                  <AwesomeEye height={10} width={15} />
                  <Text style={styles.viewTextStyle}>{i18n.translate("view")}</Text>
                </TouchableOpacity>
                <View style={pl5}>
                  <TouchableOpacity style={styles.printButtonStyle}>
                    <MetroPrintor height={13} width={13} />
                    <Text style={styles.printTextStyle}>{i18n.translate("print")}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </RowView>
      </CardSurface>

      <CardSurface style={styles.cardStyle}>
        <RowView style={pt5}>
          <H14fontRegularBlackk>{'#MR-0010'}</H14fontRegularBlackk>
          <View style={{flexDirection: 'row'}}>
            <H9fontRegularGray>{i18n.translate("paidOn")}</H9fontRegularGray>
            <H9fontRegularGray>{' - 14 Nov 2019'}</H9fontRegularGray>
          </View>
        </RowView>
        <CommonLineDotted />
        <RowView>
          <View style={[styles.bodyStyle]}>
            <View style={{height: 60, width: 60, borderRadius: 50, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', paddingLeft: 28}}>
              <Doctor2 height={60} width={100}/>
            </View>
            <View style={ph10}>
              <H8fontMediumBlack>{'Dr. Darren Elder'}</H8fontMediumBlack>
              <RowView style={{width: DevWidth/1.55}}>
                <H9fontRegularGray>{'Dental'}</H9fontRegularGray>
                <H9fontRegularBlack>{'$450'}</H9fontRegularBlack>
              </RowView>
              <View style={styles.buttonRowStyle}>
                <TouchableOpacity style={styles.viewBtnStyle}>
                  <AwesomeEye height={10} width={15} />
                  <Text style={styles.viewTextStyle}>{i18n.translate("view")}</Text>
                </TouchableOpacity>
                <View style={pl5}>
                  <TouchableOpacity style={styles.printButtonStyle}>
                    <MetroPrintor height={13} width={13} />
                    <Text style={styles.printTextStyle}>{i18n.translate("print")}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </RowView>
      </CardSurface>

      <CardSurface style={styles.cardStyle}>
        <RowView style={pt5}>
          <H14fontRegularBlackk>{'#MR-0010'}</H14fontRegularBlackk>
          <View style={{flexDirection: 'row'}}>
            <H9fontRegularGray>{i18n.translate("paidOn")}</H9fontRegularGray>
            <H9fontRegularGray>{' - 14 Nov 2019'}</H9fontRegularGray>
          </View>
        </RowView>
        <CommonLineDotted />
        <RowView>
          <View style={[styles.bodyStyle]}>
            <View style={styles.profileImageStyle}>
              <Doctor3 height={60} width={100}/>
            </View>
            <View style={{}}>
              <H8fontMediumBlack>{'Dr. Deborah Angel'}</H8fontMediumBlack>
              <RowView style={{width: DevWidth/1.55}}>
                <H9fontRegularGray>{'Dental'}</H9fontRegularGray>
                <H9fontRegularBlack>{'$450'}</H9fontRegularBlack>
              </RowView>
              <View style={styles.buttonRowStyle}>
                <TouchableOpacity style={styles.viewBtnStyle}>
                  <AwesomeEye height={10} width={15} />
                  <Text style={styles.viewTextStyle}>{i18n.translate("view")}</Text>
                </TouchableOpacity>
                <View style={pl5}>
                  <TouchableOpacity style={styles.printButtonStyle}>
                    <MetroPrintor height={13} width={13} />
                    <Text style={styles.printTextStyle}>{i18n.translate("print")}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </RowView>
      </CardSurface>

      <CardSurface style={styles.cardStyle}>
        <RowView style={pt5}>
          <H14fontRegularBlackk>{'#MR-0010'}</H14fontRegularBlackk>
          <View style={{flexDirection: 'row'}}>
            <H9fontRegularGray>{i18n.translate("paidOn")}</H9fontRegularGray>
            <H9fontRegularGray>{' - 14 Nov 2019'}</H9fontRegularGray>
          </View>
        </RowView>
        <CommonLineDotted />
        <RowView>
          <View style={[styles.bodyStyle]}>
            <View style={styles.profileImageStyle}>
              <Doctor4 height={60} width={100}/>
            </View>
            <View style={{}}>
              <H8fontMediumBlack>{'Dr. Ruby Perrin'}</H8fontMediumBlack>
              <RowView style={{width: DevWidth/1.55}}>
                <H9fontRegularGray>{'Dental'}</H9fontRegularGray>
                <H9fontRegularBlack>{'$450'}</H9fontRegularBlack>
              </RowView>
              <View style={styles.buttonRowStyle}>
                <TouchableOpacity style={styles.viewBtnStyle}>
                  <AwesomeEye height={10} width={15} />
                  <Text style={styles.viewTextStyle}>{i18n.translate("view")}</Text>
                </TouchableOpacity>
                <View style={pl5}>
                  <TouchableOpacity style={styles.printButtonStyle}>
                    <MetroPrintor height={13} width={13} />
                    <Text style={styles.printTextStyle}>{i18n.translate("print")}</Text>
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
export default Billing;

const styles = StyleSheet.create({
  container: {paddingHorizontal: 10},
  cardStyle: {
    height: 155,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10
  },
  bodyStyle: {padding: 5, paddingTop: 10, flexDirection: 'row'},
  profileImageStyle: {height: 60, width: 60, borderRadius: 50, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', paddingRight: 25, marginRight: 15},
  buttonRowStyle: {flexDirection: 'row', paddingTop: 10},
  viewBtnStyle: {
    height: 28,
    width: 78,
    backgroundColor: 'rgba(29, 185, 170, 0.65)',
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewImage: {height: 10, width: 15},
  viewTextStyle: {
    paddingLeft: 5,
    color: 'white',
    fontSize: 11,

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
  printImageStyle: {height: 13, width: 13},
  printTextStyle: {
    paddingLeft: 5,
    color: '#8B8A8A',
    fontSize: 11,
  
  },
});
