import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  Text,
  Image,
  StyleSheet,
  Linking,
  Platform,
} from 'react-native';
import {GeneralProps} from '../../interfaces/generalProps';
import {Route, useNavigation} from '@react-navigation/native';
import {labels} from '../../utils/labels';
import { Ionicons } from '@expo/vector-icons';
import {
  CardSurface,
  CommonLineDotted,
  RowView,
} from '../../components/commonViews';
import {
  H14fontRegularBlackk,
  H14fontRegularBlue,
  H8fontMediumBlack,
  H9fontRegularGray,
  H6fontRegularBlue,
  H14fontRegularGray,
} from '../../components/commonText';

import {flexRow, pt10, pt5} from '../../common/commonStyles';
import CheckMarkIcon from '../../../assets/images/icon-checkmark.svg';
import AwesomeEye from '../../../assets/images/icon-awesome-eye.svg';
import MetroPrintor from '../../../assets/images/icon-metro-printer.svg';
import {patientAppointments} from '../../utils/constant';

import Doctor1 from '../../../assets/images/blank-profile.svg';
import { EvilIcons } from '@expo/vector-icons';
import Doctor2 from '../../../assets/images/doctors/doctor-02.svg';
import Doctor3 from '../../../assets/images/doctors/doctor-03.svg';
import {NavBarPatient} from '../../common/commonComponents';
import {useDispatch, useSelector} from 'react-redux';
import {getPatientAppointments} from '../../actions/patientActions';
import {screenName} from '../../utils/screenName';
import {
  filterPastAppointments,
  filterUpcomingAppointments,
  sortByDate,
} from '../../utils/sortAppPatient';
import moment from 'moment';
import {ActivityIndicator, Searchbar} from 'react-native-paper';
import { ref } from 'firebase/storage';
import { storage } from '../../../firebase';
import { colors } from '../../utils/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { handleNavigate } from '../../utils/handleNavigate';
import i18n from '../../../i18n';

import { extendMoment } from 'moment-range';
import Moment from 'moment';
import AppointmentFilters from '../../components/Filters/AppointmentFilters';
import AppointmentFiltersPatient from '../../components/Filters/AppointmentFiltersPatient';

interface Props {
  showAllUpcomming: any, 
  setShowAllUpcomming: any, 
  handleToggleShowAllAppointments: any
}

const UpCommingAppointmentsPatient: React.FC<Props> = ({setShowAllUpcomming, showAllUpcomming, handleToggleShowAllAppointments}): JSX.Element => {
  const [sortedAppointments, setSortedAppointments] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [thirdQuery, setThirdQuery] = React.useState<string>('');
  const [isApproved, setIsApproved] = React.useState(false);
  const [isNotApproved, setIsNotApproved] = React.useState(false);
  const [showDateRangeSelector, setShowDateRangeSelector] = React.useState(false);
  // const [unisApproved, setUnisApproved] = React.useState(false);
  const [selectedRange, setRange] = React.useState({});
  const [sortBy, setSortBy] = React.useState("");
  const [isDescending, setIsDescending] = useState(false);


  const momentExtended = extendMoment(Moment)

  // const [isLoading, setIsLoading] = useState(true);

  const ptAppointments = useSelector(state => state.patientAppointments);
  const {myAppointments, loading} = ptAppointments;

  const [appointments, setAppointments] = useState();
  const [searchedApp, setSearchedApp] = useState([]);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  

  const initiateSMS = async (values) => {
    console.log
    const bodySMS = `Hello, ${values.patientInfo.basicInfoData.firstname} ${values.patientInfo.basicInfoData.lastname}! We created an appointment for you on ${values.daySelected}, between ${values.timeSelected.starttime} and ${values.timeSelected.endtime}. Please download the app at this link https://play.google.com/store/apps/details?id=com.style.connect.saloon&pli=1 for you to manage your appointment and chat with us. Thank you for choosing us!`
          const isAvailable = await SMS.isAvailableAsync();
      if (isAvailable) {
        console.log(bodySMS)
        // do your SMS stuff here
        const { result } = await SMS.sendSMSAsync(
          [`${values.phoneNumber}`],
          bodySMS,
          // {
          //   attachments: {
          //     uri: 'path/myfile.png',
          //     mimeType: 'image/png',
          //     filename: 'myfile.png',
          //   },
          // }
        );
      } else {
        // misfortune... there's no SMS available on this device

        console.log("misfortune... there's no SMS available on this device")
      }

  };

  const handleFirstSort = () => {
    const filteredPastApp = filterUpcomingAppointments(myAppointments.upcommingAppointments);
    const sortedApp = sortByDate(filteredPastApp);
  
    setSortedAppointments(sortedApp);


  }

  useEffect(() => {
    // dispatch(getPatientAppointments());
    // console.log("----------hereeee----------");
    // console.log(myAppointments[0].doctorInfo);

    handleFirstSort()
    console.log("thirdQuery////////", thirdQuery);
    // console.log("searchedApp////////", searchedApp);
    // console.log("sortedAppointments////////", sortedAppointments);


  }, []);

  
  const handleApplyFilter = (isDescending?) =>{
    // console.log(sortBy)
    let appointments = []
    let newArrApp = []
    let filteredNewApp = [];
    let finalNewFilteredApp = [];

    let startApp
    if(thirdQuery.length > 0){
 
      startApp = searchedApp

    } else {
      const filteredPastApp = filterUpcomingAppointments(myAppointments.upcommingAppointments);
      startApp = sortByDate(filteredPastApp);

    }
    
    // setSortedAppointments(startApp);

 
    console.log("-----sortBy---")
    console.log(sortBy)
    console.log(isApproved)
    console.log(isNotApproved)
    //START SORT
   
    if(sortBy === i18n.translate("doctorName")){
   
      newArrApp = startApp.sort((a, b) => 
        {
          if(isDescending){

            return a.doctorInfo.doctorInfoData.firstname.localeCompare(b.doctorInfo.doctorInfoData.firstname)
          } else {
            
            return b.doctorInfo.doctorInfoData.firstname.localeCompare(a.doctorInfo.doctorInfoData.firstname)
          }
        }
      )
      
    } else if(sortBy === i18n.translate("date")){
    
      newArrApp = startApp.sort((a, b) => 
      
     
      {
        if(isDescending){

          return a.daySelected.localeCompare(b.daySelected)
        } else {
          
          return b.daySelected.localeCompare(a.daySelected)
        }
      }

      )
      
    } else {
      newArrApp = startApp
    }

    // START FILTER BY REGISTERED/UNREGISTERED
    if( isApproved && isNotApproved){

      let firstNewArr =  newArrApp.filter((app) => {
        return app.isApproved})
      let secondNewArr =  newArrApp.filter((app) => {
        return !app.isApproved})
        filteredNewApp = [...firstNewArr, ...secondNewArr]

    }  else if (isApproved){
        console.log("yes")
        filteredNewApp = newArrApp.filter((app) => {
          return app.isApproved;
      });
    } else if (isNotApproved) {
      
      filteredNewApp = newArrApp.filter((app) => {
        return !app.isApproved;
    });
    } else {
        filteredNewApp = newArrApp
      }
  
      // STAR FILTER BY DATE RANGE
      console.log(selectedRange)
    if(selectedRange.firstDate){
      console.log("selected...date")

      const start = selectedRange.firstDate.split("-").reverse().join("-");
      const end = selectedRange.secondDate.split("-").reverse().join("-");
      const startDate = Moment.utc(start);
      const endDate = Moment.utc(end);
 
      const range = momentExtended().range(startDate, endDate)

      finalNewFilteredApp = filteredNewApp.filter((app) => {
        const dateToFind = app.daySelected.split("-").reverse().join("-")
        const dateToCheck = Moment.utc(dateToFind);
        return range.contains(dateToCheck)
      });

    } else {
      finalNewFilteredApp = filteredNewApp
    }
    console.log("final")
    console.log(finalNewFilteredApp)
    if(thirdQuery.length > 0 ){
      console.log("set to searched")
      setSearchedApp(finalNewFilteredApp)
    } else{

      setSortedAppointments(finalNewFilteredApp)
    }
  }



  const handleSearchApp = (txt) => {
    console.log("-------------Searching.......-------------")
    let newApp
    try{

      newApp = sortedAppointments.filter(
        app => {
          let fullDocName = app.doctorInfo.doctorInfoData.firstname + " " + app.doctorInfo.doctorInfoData.lastname
          return (
            fullDocName
            .toLowerCase()
            .includes(txt.toLowerCase()) 
            )
        }
      );

      // if(thirdQuery.length > 0){
      //   filteredPersons = sortedAppointments.filter(
      //     app => {
      //       return (
      //         app
      //         .doctorInfo.doctorInfoData.firstname
      //         .toLowerCase()
      //         .includes(txt.toLowerCase()) ||
      //         app
      //         .doctorInfo.doctorInfoData.lastname
      //         .toLowerCase()
      //         .includes(txt.toLowerCase()) 
      //         )
      //     }
      //   );
      // } else {
      //   filteredPersons = searchedApp.filter(
      //     app => {
      //       return (
      //         app
      //         .doctorInfo.doctorInfoData.firstname
      //         .toLowerCase()
      //         .includes(txt.toLowerCase()) ||
      //         app
      //         .doctorInfo.doctorInfoData.lastname
      //         .toLowerCase()
      //         .includes(txt.toLowerCase()) 
      //         )
      //     }
      //   );
      // }

        
    if(txt.length === 0){
      
      setSearchedApp([])
    }else{

      setSearchedApp(newApp)
    }
  }catch(err){
    console.log("error...searching appointemnts in handle search....", err)
  }
  }


  


  return (
    <>
      {/* <NavBarPatient title={'Appointment Calendar'} /> */}
      {
    
        <View style={styles.container}>

        <View style={{flexDirection:"row", justifyContent:"space-around", alignItems:"center", marginBottom:10}}>
          <View style={{flexDirection:"column", width:"100%", alignItems:"center"}}>
              <Searchbar
          placeholder="Search"
          onChangeText={(query: string) => {
            setThirdQuery(query)
            handleSearchApp(query)
          }}
          value={thirdQuery}
          icon="filter"
          onIconPress={() => setModalVisible(!modalVisible)}
          style={{margin:4, width:"85%"}}
        />
  

        </View>
          {
        selectedRange.firstdate || sortBy.length > 0 || isApproved ?
          <TouchableOpacity onPress={() =>{
            handleApplyFilter(!isDescending)
            setIsDescending(!isDescending)
          }}>
            {
              isDescending
              ?
              <MaterialCommunityIcons name="sort-descending" size={24} color="black" />
              :
              <MaterialCommunityIcons name="sort-ascending" size={24} color="black" />
            }
          </TouchableOpacity>
          : null
          }
        </View>
        <AppointmentFiltersPatient handleResetSort = {handleFirstSort} setShowDateRangeSelector={setShowDateRangeSelector} showDateRangeSelector={showDateRangeSelector} sortBy={sortBy} handleApplyFilter={handleApplyFilter} selectedRange={selectedRange} setModalVisible={setModalVisible} modalVisible={ modalVisible} setSortBy={setSortBy} setRange={setRange} isNotApproved={isNotApproved} setIsNotApproved = {setIsNotApproved} setIsApproved={setIsApproved} isApproved = {isApproved}/>
          <View style={{flexDirection:"column", width:"100%", alignItems:"center", marginBottom:10}}>
        {
          showAllUpcomming 
          ?
        <TouchableOpacity onPress={() => {
          handleToggleShowAllAppointments(false, false)
          setShowAllUpcomming(!showAllUpcomming)
          }}>
          <H14fontRegularGray>
            Don't show all upcomming appointments
          </H14fontRegularGray>
        </TouchableOpacity>
        :
          <TouchableOpacity onPress={() => {
            handleToggleShowAllAppointments(true, false)
            setShowAllUpcomming(!showAllUpcomming)
          }}>
          <H14fontRegularGray>
            Show all upcomming appointments
          </H14fontRegularGray>
        </TouchableOpacity>
        }
        </View>
  
          {
          searchedApp.length > 0 ? (
            searchedApp.map((item, index) => (
              <CardSurface style={styles.cardStyle} key={index}>
                <RowView style={pt5}>
                  <View style={flexRow}>
                    <H14fontRegularBlackk>
                      {i18n.translate("bookingDate")}
                    </H14fontRegularBlackk>
                    <H14fontRegularBlackk>
                      {' - '}
                      {item.daySelected}
                    </H14fontRegularBlackk>
                  </View>
  
                  <View
                    style={[
                      styles.confirmButtonStyle,
                      {
                        backgroundColor: !item.isApproved
                          ? '#FF0000'
                          : 'rgba(29, 185, 71, 0.65)',
                      },
                    ]}>
                    <View style={styles.buttonRow}>
                     {item.isApproved && <CheckMarkIcon height={12} width={12} />}
                      <Text style={styles.buttonTextStyle}>
                        {item.isApproved ? i18n.translate("confirm") : i18n.translate("notConfirmed")}
                      </Text>
                    </View>
                  </View>
                  {/* <H9fontRegularGray>{'Dental'}</H9fontRegularGray> */}
                </RowView>
                <CommonLineDotted />
                <RowView>
                  <View style={styles.detailsStyles}>
                    <View style={styles.profileImageStyle}>
                      {item.doctorInfo.doctorImg
                      ?
                        <Image source={{uri: item.doctorInfo.doctorImgURI}} style={{height:"100%", width:"100%"}}/>
                      :
                        <Doctor1 height={"100%"} width={"100%"} />
                      }
                    </View>
                    <View style={styles.basicDetails}>
                      <H8fontMediumBlack>
                        {item.doctorInfo.doctorInfoData.firstname}{' '}
                        {item.doctorInfo.doctorInfoData.lastname}
                      </H8fontMediumBlack>
                      <View style={flexRow}>
                        <H9fontRegularGray>{i18n.translate("startTime")}: </H9fontRegularGray>
                        <H9fontRegularGray>
                          {item.timeSelected.starttime}
                        </H9fontRegularGray>
                      </View>
                      <View style={flexRow}>
                        <H9fontRegularGray>{i18n.translate("endTime")}: </H9fontRegularGray>
                        <H9fontRegularGray>
                          {item.timeSelected.endtime}
                        </H9fontRegularGray>
                      </View>
  
                      
                      {/* <H8fontMediumBlack style={pt5}>{'$150'}</H8fontMediumBlack> */}
                    </View>
                  </View>
                </RowView>
                <View style={styles.cardButtonRow}>
           
  
                  <TouchableOpacity
                    style={[styles.viewButtonStyle, {width:"auto"}]}
                    onPress={() =>
                      navigation.navigate(screenName.CheckAppointmentPatient, {
                        item,
                      })
                    }>
                    <View style={styles.buttonRow}>
                      <AwesomeEye height={10} width={15} />
                      <Text style={styles.buttonTextStyle}>{i18n.translate("view")}</Text>
                    </View>
                  </TouchableOpacity>
  
                  <TouchableOpacity
                    style={[styles.viewButtonStyle, {backgroundColor:colors.facebook, width:"auto"}]}
                    onPress={() =>
                      handleNavigate(item.clinicInfo.clinicAddressLocation)
                    }>
                    <View style={styles.buttonRow}>
                    <Ionicons name="location" size={20} color="white" />
                      <Text style={styles.buttonTextStyle}>{i18n.translate("getDirections")}</Text>
                    </View>
                  </TouchableOpacity>
  
                  <TouchableOpacity
                    style={[styles.viewButtonStyle, {backgroundColor:colors.darkblack}]}
                    onPress={() =>
  
                      Linking.openURL(`tel:${item.clinicInfo.phoneNumber}`)
                    }>
                    <View style={styles.buttonRow}>
                      <MaterialCommunityIcons name="phone" size={20} color="white" />
                      <Text style={styles.buttonTextStyle}>{i18n.translate("callPatient")}</Text>
                    </View>
                  </TouchableOpacity>
  
                  {/* <TouchableOpacity style={styles.printButtonStyle}>
                  <View style={styles.buttonRow}>
                    <MetroPrintor height={13} width={13} />
                    <Text style={styles.printButtonTextStyle}>{labels.view}</Text>
                  </View>
                </TouchableOpacity> */}
                </View>
              </CardSurface>
            ))
          ) : 
          sortedAppointments.length > 0 && thirdQuery.length === 0 ? (
            sortedAppointments.map((item, index) => (
              <CardSurface style={styles.cardStyle} key={index}>
                <RowView style={pt5}>
                  <View style={flexRow}>
                    <H14fontRegularBlackk>
                      {i18n.translate("bookingDate")}
                    </H14fontRegularBlackk>
                    <H14fontRegularBlackk>
                      {' - '}
                      {item.daySelected}
                    </H14fontRegularBlackk>
                  </View>
  
                  <View
                    style={[
                      styles.confirmButtonStyle,
                      {
                        backgroundColor: !item.isApproved
                          ? '#FF0000'
                          : 'rgba(29, 185, 71, 0.65)',
                      },
                    ]}>
                    <View style={styles.buttonRow}>
                     {item.isApproved && <CheckMarkIcon height={12} width={12} />}
                      <Text style={styles.buttonTextStyle}>
                        {item.isApproved ? i18n.translate("confirm") : i18n.translate("notConfirmed")}
                      </Text>
                    </View>
                  </View>
                  {/* <H9fontRegularGray>{'Dental'}</H9fontRegularGray> */}
                </RowView>
                <CommonLineDotted />
                <RowView>
                  <View style={styles.detailsStyles}>
                    <View style={styles.profileImageStyle}>
                      {item.doctorInfo.doctorImg
                      ?
                        <Image source={{uri: item.doctorInfo.doctorImgURI}} style={{height:"100%", width:"100%"}}/>
                      :
                        <Doctor1 height={"100%"} width={"100%"} />
                      }
                    </View>
                    <View style={styles.basicDetails}>
                      <H8fontMediumBlack>
                        {item.doctorInfo.doctorInfoData.firstname}{' '}
                        {item.doctorInfo.doctorInfoData.lastname}
                      </H8fontMediumBlack>
                      <View style={flexRow}>
                        <H9fontRegularGray>{i18n.translate("startTime")}: </H9fontRegularGray>
                        <H9fontRegularGray>
                          {item.timeSelected.starttime}
                        </H9fontRegularGray>
                      </View>
                      <View style={flexRow}>
                        <H9fontRegularGray>{i18n.translate("endTime")}: </H9fontRegularGray>
                        <H9fontRegularGray>
                          {item.timeSelected.endtime}
                        </H9fontRegularGray>
                      </View>
  
                      
                      {/* <H8fontMediumBlack style={pt5}>{'$150'}</H8fontMediumBlack> */}
                    </View>
                  </View>
                </RowView>
                <View style={styles.cardButtonRow}>
           
  
                  <TouchableOpacity
                    style={[styles.viewButtonStyle, {width:"auto"}]}
                    onPress={() =>
                      navigation.navigate(screenName.CheckAppointmentPatient, {
                        item,
                      })
                    }>
                    <View style={styles.buttonRow}>
                      <AwesomeEye height={10} width={15} />
                      <Text style={styles.buttonTextStyle}>{i18n.translate("view")}</Text>
                    </View>
                  </TouchableOpacity>
  
                  <TouchableOpacity
                    style={[styles.viewButtonStyle, {backgroundColor:colors.facebook, width:"auto"}]}
                    onPress={() =>
                      handleNavigate(item.clinicInfo.clinicAddressLocation)
                    }>
                    <View style={styles.buttonRow}>
                    <Ionicons name="location" size={20} color="white" />
                      <Text style={styles.buttonTextStyle}>{i18n.translate("getDirections")}</Text>
                    </View>
                  </TouchableOpacity>
  
                  <TouchableOpacity
                    style={[styles.viewButtonStyle, {backgroundColor:colors.darkblack}]}
                    onPress={() =>
  
                      Linking.openURL(`tel:${item.clinicInfo.phoneNumber}`)
                    }>
                    <View style={styles.buttonRow}>
                      <MaterialCommunityIcons name="phone" size={20} color="white" />
                      <Text style={styles.buttonTextStyle}>{i18n.translate("callPatient")}</Text>
                    </View>
                  </TouchableOpacity>
  
                  {/* <TouchableOpacity style={styles.printButtonStyle}>
                  <View style={styles.buttonRow}>
                    <MetroPrintor height={13} width={13} />
                    <Text style={styles.printButtonTextStyle}>{labels.view}</Text>
                  </View>
                </TouchableOpacity> */}
                </View>
              </CardSurface>
            ))
          ) : (
            <H6fontRegularBlue>{i18n.translate("noAppointemntsForPatient")}</H6fontRegularBlue>
          )}
        </View>
      }
  
    </>
  );
};
export default UpCommingAppointmentsPatient;

const styles = StyleSheet.create({
  cardStyle: {
    height: "auto",
    backgroundColor: 'white',
    borderRadius: 10,
    // padding: 15,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  detailsStyles: {padding: 5, paddingTop: 10, flexDirection: 'row'},
  profileImageStyle: {
    height: 80,
    width: 80,
    borderRadius: 50,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    // paddingRight: 25,
  },
  basicDetails: {paddingLeft: 10,  justifyContent:"space-around"},
  cardButtonRow: {
    flexDirection: 'row',
    // paddingTop: 10,
    justifyContent: 'center',
    marginRight: 0,
    paddingLeft:10,
    marginTop: 5,
  },
  confirmButtonStyle: {
    height: 28,
    // width: 80,

    borderRadius: 30,
    justifyContent: 'center',
  },
  confirmImageStyle: {height: 10, width: 10, marginRight: 3},
  buttonTextStyle: {
    paddingLeft: 5,
    // paddingTop: 5,
    color: 'white',
    fontSize: 11,
 
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  viewButtonStyle: {
    height: 28,
    width: "auto",
    backgroundColor: 'rgba(29, 185, 170, 0.65)',
    borderRadius: 30,
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  viewImageStyle: {height: 10, width: 15},
  printButtonStyle: {
    height: 28,
    width: 78,
    backgroundColor: '#D4D4D4',
    borderRadius: 30,
    justifyContent: 'center',
  },
  printImageStyle: {height: 13, width: 13},
  printButtonTextStyle: {
    paddingLeft: 5,
    // paddingTop: 5,
    color: '#8B8A8A',
    fontSize: 11,
   
  },
  container: {paddingHorizontal: 10},
});
