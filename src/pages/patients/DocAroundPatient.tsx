import React, {Fragment, useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Animated,
} from 'react-native';
import {GeneralProps} from '../../interfaces/generalProps';
import {Route} from '@react-navigation/native';
import {NavBarPatient} from '../../common/commonComponents';
import {SmallButtonSuccess} from '../../components/commonButton';
import {labels} from '../../utils/labels';
import {colors} from '../../utils/colors';
import Modal from 'react-native-modal';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import Icon3 from 'react-native-vector-icons/AntDesign';
import {
  CardSurface,
  CommonLineDotted,
  CommonLineView,
  MainContainer,
  RowView,
} from '../../components/commonViews';
import {
  H9fontMediumBlack,
  H15fontMediumBlack,
  H14fontRegularBlackk,
  H14fontRegularBlack,
  H14fontRegularBlue,
  H14fontRegularGray,
  H14fontRegularWhite,
  H7fontRegularWhite,
  H8fontRegularWhite,
  H8fontRegularBlack,
  H9fontMediumBlue,
  H6fontRegularBlue,
  H14fontRegularImage,
  H14fontRegularLightBlack,
  H14fontMediumBlack,
} from '../../components/commonText';
import Icon1 from 'react-native-vector-icons/AntDesign';
import {screenName} from '../../utils/screenName';
import {DevWidth} from '../../utils/device';
import {searchMenuOptions} from '../../utils/constant';
import {_testDoctorDetails} from '../../utils/mockDetails';
import DoctorDetailsCard from '../../components/doctorComponents';
import DoctorFilter from '../../components/doctorFilter';
import FilterIcon from '../../assets/images/filter.svg';
import {ml10, pt5} from '../../common/commonStyles';
import {useDispatch, useSelector} from 'react-redux';
import {retrieveClinics} from '../../utils/getFirebaseData';
import CustomLoader from '../../components/customLoader';
import {ActivityIndicator, Divider, Text} from 'react-native-paper';
import {Slider} from 'react-native-elements';
import {getClinics} from '../../actions/clinicActions';

import { FontAwesome5 } from '@expo/vector-icons';
import MapModal from '../../components/MapModal';
import { _getLocationAsync } from '../../services/location-service';
import i18n from '../../../i18n';
import { getPatientClinicsDoctorsAround } from '../../actions/patientActions';

interface Props extends GeneralProps {
  route: Route<string, object | undefined>;
}
const DocAroundPatient: React.FC<Props> = ({
  navigation,
  route,
}): JSX.Element => {
  const [isModalVisible, setModalVisible] = useState(false);

  const [clinicForObjectValues, setClinicForObjectValues] = useState();

  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [sliderValue, setSliderValue] = useState(10000);
  const [isVisible, setIsVisible] = useState(false);
  const [patientLocation, setPatientLocation] = useState({});



  const aroundPatientData = useSelector(state => state.aroundPatientData);
  const {aroundPatient, loading: loadingAroundPatient} = aroundPatientData;

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleSliderValue = value => {
    // setSliderValue(slider);
    console.log('value...', value);
    dispatch(getPatientClinicsDoctorsAround(value));
  };

  const handlePatientLocation = async () => {
    // console.log("asdasda")
    const location = await _getLocationAsync()
    setPatientLocation(location)
  }

  useEffect(() => {
  
    handlePatientLocation()
    // console.log("patientLocation...", patientLocation.coords)
    // console.log("patientLocation...", aroundPatient.doctorsAroundPatient)
    // handleSliderValue(sliderValue);
    // console.log("-----------------------asda--",aroundPatient.doctorsAroundPatient[0].clinicAddressLocation.clinicCoords.lat);
  }, []);

  // if (loadingAroundPatient) {
  //   return (
  //     <View style={[styles.containerLoader, styles.horizontal]}>
  //       <ActivityIndicator size="large" />
  //     </View>
  //   );
  // }

  // if (patientInformation) {
  //   if (!patientInformation.basicInfoData) {
  //     // if (isLoading || !patientInformation.basicInfoData) {
  //     return (
  //       <View style={[styles.containerLoader, styles.horizontal]}>
  //         <ActivityIndicator size="large" />
  //       </View>
  //     );
  //   }
  // }

  return (
    <Fragment>
      <MainContainer>
        <NavBarPatient
          title={i18n.translate("doctorsAroundU")}
          isPatient={true}
          isTermsAccepted={true}
        />
        <View   style={{
            backgroundColor: 'white',
            // padding: 10,
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            // height: 100,
          }}>
        <View
          style={{
            backgroundColor: 'white',
            padding: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottomWidth:0.1,
            elevation:5
            // height: 100,
          }}>
          {!loadingAroundPatient ? (
            <>
              <View
                style={{
                  width: '50%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  { aroundPatient &&

                    <H15fontMediumBlack>
                {aroundPatient &&
                  !loadingAroundPatient &&
                  aroundPatient.doctorsAroundPatient.length}{' '}
                {aroundPatient &&
                !loadingAroundPatient &&
                aroundPatient.doctorsAroundPatient.length === 1
                  ? i18n.translate("doctorAroundYou") 
                  : aroundPatient &&
                    aroundPatient.doctorsAroundPatient.length === 0
                  ? i18n.translate("doctorsAroundYou")
                  : i18n.translate("doctorsAroundYou") 
}
              </H15fontMediumBlack>
                }
           
              </View>
              <View
                style={{
                  width: '50%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                          <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
            <View style={{flexDirection:"row", marginLeft:10}}>
                 <FontAwesome5 name="map" size={20} color="#616161" />
                 <H14fontRegularLightBlack style={{marginLeft:2}}>
                  {i18n.translate("map")}
                 </H14fontRegularLightBlack>
            </View>
            
          </TouchableOpacity>
              {/* <H14fontRegularLightBlack>
                  {i18n.translate("maxDistance")}
                  {sliderValue < 999 ? sliderValue : sliderValue / 1000}{' '}
                  {sliderValue < 999 ? i18n.translate("meters") : 'KM'}
                </H14fontRegularLightBlack> */}
                </View>
            </>
          ) : (
            <View style={{width:"100%"}}>
            <H6fontRegularBlue>
              {' '}
  
             { i18n.translate("searchingDoctors")}
            </H6fontRegularBlue>
            </View>
          )}
           
          </View>
          {/* <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-around", width:"100%", paddingHorizontal:10, height:40, borderBottomWidth:0.1,}}>
          <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
            <View style={{flexDirection:"row", marginLeft:10}}>
                 <FontAwesome5 name="map" size={20} color="#616161" />
                 <H14fontRegularLightBlack style={{marginLeft:2}}>
                  {i18n.translate("map")}
                 </H14fontRegularLightBlack>
            </View>
            
          </TouchableOpacity>
            <View
                style={{
                  width: '50%',
                  alignItems: 'stretch',
                  justifyContent: 'center',
                  left:20
                }}>
                <Slider
                  value={sliderValue}
                  onSlidingComplete={value => {
                    handleSliderValue(value);
                  }}
                  onValueChange={value => setSliderValue(value)}
                  maximumValue={15000}
                  minimumValue={100}
                  step={100}
                  thumbStyle={{
                    height: 20,
                    width: 20,
                    backgroundColor: colors.blue,
                  }}
        
                />
 
          
            </View>
          </View> */}
          {/* <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {searchMenuOptions.map(({Img, name}) => {
              return (
                <TouchableOpacity
                  style={{
                    margin: 3,
                    height: 37,
                    borderWidth: 1,
                    borderColor: '#D5D5D5D5',
                    backgroundColor: '#fff',
                    borderRadius: 30,
                    paddingRight: 10,
                    flexDirection: 'row',
                  }}
                  onPress={() => {
                    toggleModal();
                  }}>
                  <CardSurface
                    style={{
                      borderRadius: 25,
                      height: 25,
                      width: 25,
                      backgroundColor: colors.white,
                      marginLeft: 7,
                      marginVertical: 5,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Img height={15} width={16} />
                  </CardSurface>
                  <H14fontRegularGray
                    style={{alignSelf: 'center', marginLeft: 5}}>
                    {name}
                  </H14fontRegularGray>
                </TouchableOpacity>
              );
            })}
          </ScrollView> */}
          {/* <H14fontRegularGray style={{paddingTop: 15}}>
            {'16525 matches found for : '}
          </H14fontRegularGray> */}
        </View>
        {!loadingAroundPatient && aroundPatient ? (
          <FlatList
            data={Object.values(aroundPatient && aroundPatient.doctorsAroundPatient)}
            contentContainerStyle={{paddingHorizontal:25, paddingTop:10}}
            renderItem={({item, index}) => {
              return (
                <DoctorDetailsCard
                  page={'search'}
                  details={item}
                  bookAnAppointment={() => {
                    navigation.navigate(screenName.DoctorCalendarTimePatient, {
                      item,
                    });
                  }}
                  drProfileNavigation={() => {
                    navigation.navigate(screenName.DoctorProfile, {
                      item,
                    });
                  }}
                />
              );
            }}
          />
        ) : (
          <CustomLoader
            isLoading={loadingAroundPatient}
            opacity={0}
            backgroundColor={'transparent'}
          />
        )}
        {/* <View style={styles.sortByImageStyle}>
          <FilterIcon />
        </View> */}

        {/* <DoctorFilter
          modalClose={() => {
            setModalVisible(false);
          }}
          modalVisible={isModalVisible}
        /> */}
        { aroundPatient && 
       ( patientLocation.coords && aroundPatient.doctorsAroundPatient &&
        <MapModal isVisible={isVisible} setIsVisible={() => setIsVisible(!isVisible)} doctorsAround={aroundPatient.clinicsAroundPatient} isDoctors={true} patientLocation={patientLocation}>

{/* <View style={styles.containerStyle}>
           <Slider
                  value={sliderValue}
                  onSlidingComplete={value => {
                    handleSliderValue(value);
                  }}
                  onValueChange={value => setSliderValue(value)}
                  maximumValue={15000}
                  minimumValue={100}
                  step={100}
                  thumbStyle={{
                    height: 20,
                    width: 20,
                    backgroundColor: colors.blue,
                  }}
                  
                />  
                    <View
                style={{
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor:"transparent"
                }}>
              <H14fontRegularLightBlack>
                  {i18n.translate("maxDistance")}:{' '}
                  {sliderValue < 999 ? sliderValue : sliderValue / 1000}{' '}
                  {sliderValue < 999 ? 'meters' : 'KM'}
                </H14fontRegularLightBlack>
                </View>
                </View> */}
        </MapModal>)
        
      }
      </MainContainer>
    </Fragment>
  );
};
export default DocAroundPatient;
const styles = StyleSheet.create({
  containerStyle: {
    height: "auto",
    // marginRight: 15,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 15,
    paddingHorizontal: 15,
    width:"75%",
    padding:10
    // opacity:0.7
    // padding: 10,
  },
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
  datePickerStyle: {
    width: 230,
  },
  sortByImageStyle: {
    height: 100,
    width: 100,
    alignSelf: 'flex-end',
    marginRight: 10,
    position: 'absolute',
    bottom: 0,
  },
});
