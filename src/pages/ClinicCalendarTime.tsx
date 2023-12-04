import React, {Fragment, useEffect, useState} from 'react';
import {
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';
import {GeneralProps} from '../interfaces/generalProps';
import {Route} from '@react-navigation/native';
import {NavBar, NavBarPatient} from '../common/commonComponents';
import {MainContainer, SubContainer} from '../components/commonViews';
import {H14fontRegularWhite, H8fontMediumBlack} from '../components/commonText';
import TimeAndDate from './timeAndDate';
import Checkout from './checkout';
import Payment from './payment';
import {screenName} from '../utils/screenName';
import {tab} from '../utils/constant';
import {p0, ph1, ph10, pt0, pt10} from '../common/commonStyles';
import {colors} from '../utils/colors';
import TimeAndDateClinic from './timeAndDateClinic';
import TimeAndDatePatient from './timeAndDatePatient';
import {handleCreateCalendarForPatient} from '../utils/createDatesClinic';

interface Props extends GeneralProps {
  route: Route<string, object | undefined>;
}
const ClinicCalendarTime: React.FC<Props> = ({
  navigation,
  route,
}): JSX.Element => {
  // const [selectedtab, setSelectedTab] = useState('Time and Date');
  // const [datesForPatient, setDatesForPatient] = useState([]);
  // const clinicBookableInfo = route.params;
  // let dates;

  useEffect(() => {
    console.log('ClinicCalendarTime...');

    // console.log('test here', clinicBookableInfo.clinicAllInfo.allDays);
  }, []);

  return (
    <Fragment>
      <MainContainer>
        <NavBar
          title={'Appointment Calendar'}
          navHeight={80}
          isModal={false}
          isTermsAccepted={true}
        />
        <ScrollView>
          <SubContainer style={[p0, ph1, {backgroundColor: colors.background}]}>
            {/* <View>
              <FlatList
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[
                  pt10,
                  ph10,
                  {backgroundColor: colors.background},
                ]}
                data={tab}
                renderItem={({item, index}) => (
                  <TouchableOpacity
                    onPress={() => setSelectedTab(item.name)}
                    style={{}}>
                    <H8fontMediumBlack
                      style={[
                        styles.tabButtonStyle,
                        {
                          backgroundColor:
                            selectedtab == item.name ? '#0DD8F9' : null,
                          color: selectedtab == item.name ? '#fff' : '#000',
                        },
                      ]}>
                      {item.name}
                    </H8fontMediumBlack>
                  </TouchableOpacity>
                )}
              />
            </View> */}

            {/* {selectedtab == 'Time and Date' ? (
              <TimeAndDate />
              ) : selectedtab == 'Checkout' ? (
                <Checkout
                onpress={() =>
                  navigation.navigate(screenName.DoctorProfile as any)
                }
              />
            ) : (
              <Payment />
              )} */}

            <TimeAndDateClinic />
          </SubContainer>
          {/* <TouchableOpacity
            style={[
              styles.footerButtonStyle,
              {
                justifyContent:
                  selectedtab != 'Checkout' ? 'center' : 'space-between',
                alignItems: 'center',
              },
            ]}>
            {selectedtab == 'Checkout' && (
              <H14fontRegularWhite>Total - $75</H14fontRegularWhite>
            )}
            <H14fontRegularWhite>
              {selectedtab == 'Payment' ? 'Confirm and Pay' : 'CONTINUE'}
            </H14fontRegularWhite>
          </TouchableOpacity> */}
          {/* <TouchableOpacity
            style={[
              styles.footerButtonStyle,
              {
                justifyContent:
                  selectedtab != 'Checkout' ? 'center' : 'space-between',
                alignItems: 'center',
              },
            ]}>
            <H14fontRegularWhite>EDIT TIME SLOTS</H14fontRegularWhite>
          </TouchableOpacity> */}
        </ScrollView>
      </MainContainer>
    </Fragment>
  );
};

export default ClinicCalendarTime;

const styles = StyleSheet.create({
  tabButtonStyle: {
    paddingVertical: 8,
    paddingHorizontal: 15,

    borderRadius: 20,
    marginRight: 10,
  },
  footerButtonStyle: {
    marginTop: 15,
    bottom: 10,
    height: 45,
    backgroundColor: '#1B5A90',
    marginHorizontal: 12,
    borderRadius: 30,
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
});
