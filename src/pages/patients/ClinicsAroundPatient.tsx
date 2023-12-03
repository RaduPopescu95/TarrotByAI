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
  H14fontRegularLightBlack,
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
import {getPatientClinicsDoctorsAround} from '../../actions/patientActions';
import ClinicDetailsCard from '../../components/ClinicComponents';
import { FontAwesome5 } from '@expo/vector-icons';
import MapModal from '../../components/MapModal';
import { _getLocationAsync } from '../../services/location-service';
import i18n from '../../../i18n';

interface Props extends GeneralProps {
  route: Route<string, object | undefined>;
}
const ClinicsAroundPatient: React.FC<Props> = ({
  navigation,
  route,
}): JSX.Element => {
  const [isModalVisible, setModalVisible] = useState(false);

  const [clinicForObjectValues, setClinicForObjectValues] = useState();

  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [sliderValue, setSliderValue] = useState(5000);
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
    dispatch(getPatientClinicsDoctorsAround( value));
  };

  const handlePatientLocation = async () => {
    // console.log("asdasda")
    const location = await _getLocationAsync()
    setPatientLocation(location)
  }

  useEffect(() => {
    
    handlePatientLocation()
    console.log(
     "aroundPatient.clinicsAroundPatient...",aroundPatient.clinicsAroundPatient[0].distanceToPatient 
    );
  }, []);

 

  return (
    <Fragment>
      <MainContainer>
        <NavBarPatient
          title={i18n.translate("clinicsAroundU")}
          isPatient={true}
          isTermsAccepted={true}
        />
           <View   style={{
            backgroundColor: 'white',
      
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
          
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
              <H15fontMediumBlack>
                {aroundPatient &&
                  !loadingAroundPatient &&
                  aroundPatient.clinicsAroundPatient.length}{' '}
                {aroundPatient &&
                !loadingAroundPatient &&
                aroundPatient.clinicsAroundPatient.length === 1
                  ? i18n.translate("clinicAroundPatient")
                  : aroundPatient &&
                    aroundPatient.clinicsAroundPatient.length === 0
                  ? i18n.translate("clinicsAroundPatient")
                  : i18n.translate("clinicsAroundPatient")}
                
              </H15fontMediumBlack>
           
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
                  {i18n.translate("maxDistance")}{' '}
                  {sliderValue < 999 ? sliderValue : sliderValue / 1000}{' '}
                  {sliderValue < 999 ? 'meters' : 'KM'}
                </H14fontRegularLightBlack> */}
                </View>
            </>
          ) : (
            <View style={{width:"100%"}}>
            <H6fontRegularBlue>
              {' '}
              {i18n.translate("searchingClinicsAroundU")}
            </H6fontRegularBlue>
            </View>
          )}
           
          </View>
    
        </View>
        {!loadingAroundPatient && aroundPatient ? (
          <FlatList
            data={Object.values(aroundPatient.clinicsAroundPatient)}
            contentContainerStyle={{ paddingTop:10, justifyContent:"center",  alignItems:"center"}}
            renderItem={({item, index}) => {
              return (
                <ClinicDetailsCard
                  page={'home'}
                  details={item}
                  bookAnAppointment={() => {
                    navigation.navigate(screenName.ClinicDoctorsPatient, {
                      clinicDoctors: item.clinicDoctors,
                    });
                  }}
                  clinicProfileNavigation={() => {
                    navigation.navigate(screenName.ClinicProfile, {item});
                    console.log("asdasda")
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

           {patientLocation.coords && aroundPatient.clinicsAroundPatient &&
        <MapModal isVisible={isVisible} setIsVisible={() => setIsVisible(!isVisible)} doctorsAround={aroundPatient.clinicsAroundPatient} isDoctors={false} patientLocation={patientLocation}>
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
        </MapModal>
        }
      </MainContainer>
    </Fragment>
  );
};
export default ClinicsAroundPatient;
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
