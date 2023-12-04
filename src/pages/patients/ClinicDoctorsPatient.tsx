import React, {Fragment, useEffect} from 'react';
import {
  ScrollView,
  Image,
  View,
  TouchableOpacity,
  Linking,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import {GeneralProps} from '../../interfaces/generalProps';
import {Route} from '@react-navigation/native';
import {NavBar, NavBarPatient} from '../../common/commonComponents';
import {
  CardSurface,
  CommonLineDotted,
  MainContainer,
  RowView,
} from '../../components/commonViews';
import {Feather} from '@expo/vector-icons';
// import Icon from 'react-native-vector-icons/FontAwesome';
import {
  H10fontRegularBlack,
  H14fontRegularBlackk,
  H6fontMediumWhite,
  H6fontRegularBlack,
  H6fontRegularBlue,
  H7fontMediumBlack,
  H7fontMediumWhite,
  H8fontMediumBlack,
  H8fontMediumBlue,
  H8fontMediumLightBlack,
  H9fontMediumBlack,
  H9fontMediumBlue,
  H9fontRegularGray,
} from '../../components/commonText';
import {colors} from '../../utils/colors';
import { Fontisto } from '@expo/vector-icons';
import {screenName} from '../../utils/screenName';
// import {DevWidth} from '../../utils/device';
import {Dimensions} from 'react-native';


import {
  retrieveClinicDoctors,
  retrieveClinicPatients,
} from '../../utils/getFirebaseData';
import {useDispatch, useSelector} from 'react-redux';
import {ActivityIndicator, Text} from 'react-native-paper';
import {labels} from '../../utils/labels';
import {getClinicDoctors} from '../../actions/clinicActions';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {deleteDoctorFromClinic} from '../../utils/deleteFirebaseData';
import DoctorDetailsCard from '../../components/doctorComponents';
import i18n from '../../../i18n';

interface Props extends GeneralProps {
  route: Route<string, object | undefined>;
}

const ClinicDoctorsPatient: React.FC<Props> = ({
  navigation,
  route,
}): JSX.Element => {
  // const allClinicDoctors = useSelector(state => state.clinicDoctors);
  // const {clinicDoctorsInfo, loading} = allClinicDoctors;

  const dispatch = useDispatch();
  // const params = route();

  useEffect(() => {
    console.log("test...",route.params.clinicDoctors);
  }, []);

  const dialContact = number => {
    if (Platform.OS === 'ios') {
      number = `telprompt:${number}`;
      console.log('IOS...');
    } else {
      console.log('ANDROID...');
      number = `tel:${number}`;
    }
    Linking.openURL(number);
  };

  // if (loading) {
  //   return (
  //     <View style={[styles.containerLoader, styles.horizontal]}>
  //       <ActivityIndicator size="large" />
  //     </View>
  //   );
  // }

  // return (
  //   <View>
  //     <Text>
  //       asdasd
  //     </Text>
  //   </View>
  // )

  return (
    <Fragment>
      <MainContainer>
      <NavBarPatient
          title={i18n.translate("clinicDoctors")}
          isPatient={true}
          isTermsAccepted={true}
          isGoBack={route.params.isGoBack}
        />
        <ScrollView>
          <View
            style={{
              height: 85,
              backgroundColor: 'white',
              padding: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              // alignItems: 'center',
              width: '100%',
            }}>
            <View
              style={{
                height: '100%',
                width: '60%',
                backgroundColor: 'white',
                // padding: 10,
                // alignItems: 'center',
                flexDirection: 'row',
              }}>
              <CardSurface
                style={{
                  borderRadius: 40,
                  height: 60,
                  width: 60,
                  backgroundColor: 'white',
                }}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Fontisto name="person" size={36} color={colors.facebook} />
                </View>
              </CardSurface>
              <View style={{paddingLeft: 10, paddingTop: 5}}>
                <H8fontMediumBlack>{i18n.translate("clinicDoctorsList")}</H8fontMediumBlack>
                <H9fontRegularGray>
                  {route.params.clinicDoctors.length}
                </H9fontRegularGray>
              </View>
            </View>
            
          </View>
          {route.params.clinicDoctors.length !== 0 &&
          route.params.clinicDoctors ? (
            <View style={{paddingHorizontal: 10}}>
              {route.params.clinicDoctors.map((item, index) => (
                     <View style={{ justifyContent:"center", alignItems:"center"}}>
                     <DoctorDetailsCard
                       page={'home'}
                       details={item}
                       bookAnAppointment={() => {
                         navigation.navigate(
                           screenName.DoctorCalendarTimePatient,
                           {
                             item,
                           },
                         );
                       }}
                       drProfileNavigation={() => {
                         navigation.navigate(screenName.DoctorProfile, {item});
                       }}
                     />
                   </View>
              ))}
            </View>
          ) : (
            <View style={{paddingHorizontal: 10, paddingTop: 20}}>
              <H6fontRegularBlue>{i18n.translate("noDoctorsAdded")}</H6fontRegularBlue>
            </View>
          )}
        </ScrollView>
      </MainContainer>
    </Fragment>
  );
};
export default ClinicDoctorsPatient;

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
});
