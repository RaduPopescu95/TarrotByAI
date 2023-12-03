import React, {Fragment, useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import {GeneralProps} from '../../interfaces/generalProps';
import {Route, useNavigation} from '@react-navigation/native';
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

import {alignItemsCenter, ml10, pt5} from '../../common/commonStyles';
import {useDispatch, useSelector} from 'react-redux';
import {retrieveClinics} from '../../utils/getFirebaseData';
import CustomLoader from '../../components/customLoader';
import {ActivityIndicator, Chip, Text} from 'react-native-paper';
import {getClinics} from '../../actions/clinicActions';
import ClinicDetailsCard from '../../components/ClinicComponents';
import { Divider } from 'react-native-elements';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import i18n from '../../../i18n';
import MapModal from '../../components/MapModal';
import { _getLocationAsync } from '../../services/location-service';

interface Props extends GeneralProps {
  route: Route<string, object | undefined>;
  clinicsDoctorsDB?: any;
  setSearchList?:any;
  filterResult?:any;
  setFilterResult?:any
  selected?:any;
  setSelected?:any;
  handleCloseSearch?:any
  isLoadingSearch?:any
  clinicsForSearchMap?:any
  patientLocation?:any
}
const SearchResultPatient: React.FC<Props> = ({
 
  route,
  clinicsDoctorsDB,
  setSearchList,
  filterResult,
  setFilterResult,
  selected,
  setSelected,
  handleCloseSearch,
  isLoadingSearch,
  clinicsForSearchMap,
  patientLocation
}): JSX.Element => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const allClinicsDB = useSelector(state => state.allClinics);
  const {clinicsDB, loading} = allClinicsDB;
  const [clinicForObjectValues, setClinicForObjectValues] = useState();
 

 
  const navigation = useNavigation()
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const patientInfoDB = useSelector(state => state.patientInfoData);
  const {patientInformation} = patientInfoDB;

  const toggleModal = () => {
    setIsVisible(!isVisible);
  };


  const handleFilterSearch = (selection) => {
  
    console.log("start...")
    switch(selected) {
      case "doctors":
        if(selection === "clinics"){
          setSelected("clinics")
        } else {
          setSelected("")
        }
        break;
      case "clinics":
        if(selection === "doctors"){
          setSelected("doctors")
        } else {
          setSelected("")
        }
        break;
      case "":
        if(selection === "doctors"){
          setSelected("doctors")
        } else if (selection === "clinics") {
          setSelected("clinics")
        }
        break;
      default:
        // code block
    }

    let result = [];
    // console.log("clinicsDoctorsDB...",clinicsDoctorsDB)
    if(selection === "clinics"){
      
       result = clinicsDoctorsDB.filter(item => item.isClinic);
    }

    if(selection === "doctors"){
      
      result = clinicsDoctorsDB.filter(item => item.doctorId);
   }

    if(selection === "clinics" && selected === "clinics"){
      
      result = [];
   }

   if(selection === "doctors" && selected === "doctors"){
      
    result = [];
   
 }


    console.log(result)
    if(result.length === 0){
      setFilterResult([])

    } else {

      setFilterResult(result)
    }
    setIsLoading(false)
  } 

  useEffect(() => {

    console.log('patientLocation...', patientLocation);

    if (clinicsDB) {
      setClinicForObjectValues(clinicsDB);
    }


  }, [patientInformation]);

  if (!patientInformation || isLoadingSearch) {
    return (
      <View style={[styles.containerLoader, styles.horizontal]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

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
      {/* <View> */}
        {/* {loading && <CustomLoader isLoading={loading} />} */}
        {/* <NavBarPatient
          title={labels.yourDoctors}
          isPatient={true}
          isTermsAccepted={true}
        /> */}
        {isLoadingSearch
        ?
        <ActivityIndicator size="large" />
        :
        <View style={{height: '100%', width: '100%'}}>
          <View style={{backgroundColor: 'white', padding: 10}}>

          <View style={[styles.row, alignItemsCenter, {justifyContent:"space-between"}]}>
          <View style={styles.row}>
            <Chip mode="outlined" onPress={() => {  setIsLoading(true); handleFilterSearch("doctors")}} style={[styles.chip, {elevation: selected === "doctors" ? 7 : 0}]} >
              {i18n.translate("DoctorsSearch")}
            </Chip>
            <Chip mode="outlined" onPress={() => {  setIsLoading(true); handleFilterSearch("clinics")}} style={[styles.chip, {elevation: selected === "clinics" ? 7 : 0}]} loading>

              {i18n.translate("ClinicsSearch")}
            </Chip>
            <ActivityIndicator animating={isLoading} style={{marginLeft:5}}/>
          </View>
            <TouchableOpacity onPress={() => handleCloseSearch()}>
            <AntDesign name="closesquare" size={28} color={colors.gray} />
            </TouchableOpacity>
          </View>

          <View style={[styles.row, alignItemsCenter, {justifyContent:"space-between"}]}>
            {
            selected ?
            
            <H14fontRegularGray style={{paddingTop: 15}}>
              {`${filterResult.length} ${filterResult.length === 1 ? "match found" : "matches found"}`}
            </H14fontRegularGray>
            :
            <H14fontRegularGray style={{paddingTop: 15}}>
              {`${clinicsDoctorsDB.length} ${clinicsDoctorsDB.length === 1 ? "match found" : "matches found"}`}
            </H14fontRegularGray>
            }

          <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
            <View style={{flexDirection:"row", marginLeft:10}}>
                 <FontAwesome5 name="map" size={20} color="#616161" />
                 <H14fontRegularLightBlack style={{marginLeft:2}}>
                  {i18n.translate("map")}
                 </H14fontRegularLightBlack>
            </View>
            
          </TouchableOpacity>
            
       </View>
          </View>

          {filterResult.length === 0 && selected === "clinics" ? 
          <View style={{padding:10}}>
          <H6fontRegularBlue>
            There are no clinics in your search filter
          </H6fontRegularBlue>
        </View>
          : filterResult.length === 0 && selected === "doctors" ?
          <View style={{padding:10}}>
          <H6fontRegularBlue>
          There are no doctors in your search filter
        </H6fontRegularBlue>
            </View>
        : 
          
          clinicsDoctorsDB && filterResult.length === 0 ? (
            <FlatList
              data={Object.values(clinicsDoctorsDB)}
              renderItem={({item, index}) => {
                console.log("item...", item)
                if(item.isClinic){          
                return  (   
                  <View style={{marginHorizontal: 30, marginTop:10}}>
                <ClinicDetailsCard
                    page={'home'}
                    details={item}
                    width={330}
                    bookAnAppointment={() => {
                      navigation.navigate(screenName.ClinicDoctorsPatient, {
                        clinicDoctors: item.clinicDoctors,
                      });
                    }}
                    clinicProfileNavigation={() => {
                      navigation.navigate(screenName.ClinicProfile,{item});
                    }}
                  />
                  </View>
                  )
                } else {
                  return (
                    <View style={{marginHorizontal: 30}}>
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
                  );
                }
           
              }}
            />
          )
        : selected === "clinics" ?

        (
          <FlatList
            data={Object.values(filterResult)}
            renderItem={({item, index}) => {
              console.log("item...", item)
                 
              return  (   
                <View style={{marginHorizontal: 30, marginTop:10}}>
              <ClinicDetailsCard
                  page={'home'}
                  details={item}
                  width={330}
                  bookAnAppointment={() => {
                    navigation.navigate(screenName.ClinicDoctorsPatient, {
                      clinicDoctors: item,
                    });
                  }}
                  clinicProfileNavigation={() => {
                    navigation.navigate(screenName.ClinicProfile,{item});
                  }}
                />
                </View>
                )
            
         
            }
          }
          />
        )

        :

        (
          <FlatList
            data={Object.values(filterResult)}
            renderItem={({item, index}) => {
              console.log("item...", item)
                 
              return (
                <View style={{marginHorizontal: 30}}>
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
              );
            
         
            }
          }
          />
        )
        
}
        </View>
         }
            <MapModal isGoBack={true} isVisible={isVisible} setIsVisible={() => setIsVisible(!isVisible)} doctorsAround={clinicsForSearchMap} isDoctors={false} patientLocation={patientLocation} toggleModal={() => toggleModal()}>

        </MapModal>
        {/* <View style={styles.sortByImageStyle}>
          <FilterIcon />
        </View> */}

        {/* <DoctorFilter
          modalClose={() => {
            setModalVisible(false);
          }}
          modalVisible={isModalVisible}
        /> */}
      {/* </View> */}
    </Fragment>
  );
};
export default SearchResultPatient;
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // paddingHorizontal: 5,
  },
  chip: {
    margin: 4,
 
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
