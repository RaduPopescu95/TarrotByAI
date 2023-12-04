import React, {Fragment, useState} from 'react';
import {
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';
import {GeneralProps} from '../interfaces/generalProps';
import {Route} from '@react-navigation/native';
import {NavBarPatient} from '../common/commonComponents';
import {MainContainer, SubContainer} from '../components/commonViews';
import {H14fontRegularWhite, H8fontMediumBlack} from '../components/commonText';
import TimeAndDate from './timeAndDate';
import Checkout from './checkout';
import Payment from './payment';
import {screenName} from '../utils/screenName';
import {tab} from '../utils/constant';
import {p0, ph1, ph10, pt0, pt10} from '../common/commonStyles';
import { colors } from '../utils/colors';

interface Props extends GeneralProps {
  route: Route<string, object | undefined>;
}
const BookAppointment: React.FC<Props> = ({navigation, route}): JSX.Element => {
  const [selectedtab, setSelectedTab] = useState('Time and Date');
  return (
    <Fragment>
      <MainContainer>
        <ScrollView>
        <NavBarPatient title={'Time and Date'} />
        <SubContainer style={[p0, ph1, {backgroundColor: colors.background}]}>
          <View>
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[pt10, ph10, {backgroundColor: colors.background}]}
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
          </View>

          {selectedtab == 'Time and Date' ? (
            <TimeAndDate />
          ) : selectedtab == 'Checkout' ? (
            <Checkout
              onpress={() =>
                navigation.navigate(screenName.DoctorProfile as any)
              }
            />
          ) : (
            <Payment />
          )}
        </SubContainer>
        <TouchableOpacity
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
        </TouchableOpacity>
        </ScrollView>
      </MainContainer>
    </Fragment>
  );
};

export default BookAppointment;

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
