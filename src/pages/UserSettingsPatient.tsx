import React, {Fragment, useState, useEffect, useRef} from 'react';
import {Dimensions, Platform, ScrollView, StyleSheet, TouchableHighlight, TouchableOpacity, View} from 'react-native';
import {GeneralProps} from '../interfaces/generalProps';
import {Route, useIsFocused} from '@react-navigation/native';
import {NavBarPatient} from '../common/commonComponents';
import {CardSurface, MainContainer} from '../components/commonViews';
import {SegmentControl} from '../components/segmentControl';
import BasicInfo from './profileSettings/basicInfo';
import AboutMe from './profileSettings/aboutMe';
import ClinicInfo from './profileSettings/clinicInfo';
import ContactDetails from './profileSettings/contactDetails';
import Pricing from './profileSettings/pricing';
import Education from './profileSettings/education';
import Awards from './profileSettings/awards';
import Registrations from './profileSettings/registraction';
import {data, profilesegments, profilesegmentsPatient} from '../utils/constant';
import {colors} from '../utils/colors';
import {retrieveClinicData} from '../utils/getFirebaseData';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LeftArrow from '../../assets/images/left-arrow-big-black.svg';


import * as Yup from 'yup';
import {
  uploadClinicProfile,
  uploadPatientProfile,
} from '../utils/UploadFirebaseData';
import {screenName} from '../utils/screenName';
import {useDispatch, useSelector} from 'react-redux';
import {getClinicInfo} from '../actions/clinicActions';
import {getPatientInfo} from '../actions/patientActions';
import BasicInfoPatient from './profileSettings/basicInfoPatient';
import CustomLoader from '../components/customLoader';
import { Divider, Switch, Text, Modal, Portal, Button, Provider, RadioButton, TextInput, Dialog, TouchableRipple } from 'react-native-paper';

import { scheduleLocalNotification, uploadScheduledNotifications } from '../utils/Notification/scheduleLocalNotification';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import moment from 'moment';
import { H6fontRegularBlack, H6fontRegularBlue, H8fontMediumBlue, H9fontMediumBlue, H9fontRegularBlack, H9fontRegularGray } from '../components/commonText';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Props extends GeneralProps {
  route: Route<string, object | undefined>;
}
const UserSettingsPatient: React.FC<Props> = ({
  navigation,
  route,
}): JSX.Element => {
  const patientInfoDB = useSelector(state => state.patientInfoData);
  const {patientInformation} = patientInfoDB;

  const ptAppointments = useSelector(state => state.patientAppointments);
  const {myAppointments, loading} = ptAppointments;

  const [text, setText] = React.useState("10");

  const [isSwitchOn, setIsSwitchOn] = React.useState(false);
  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  const [isSwitchOn2, setIsSwitchOn2] = React.useState(false);
  const onToggleSwitch2 = () => setIsSwitchOn2(!isSwitchOn2);

  const [checked, setChecked] = React.useState('minutes');
  const [timeNotifications, setTimeNotifications] = React.useState([]);
  const [notificationsDB, setNotificationsDB] = React.useState([]);

  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {backgroundColor: 'white', marginHorizontal: 10, borderRadius:20};

  const [visibleDialog, setVisibleDialog] = React.useState(false);

  const showDialog = () => setVisibleDialog(true);

  const hideDialog = () => setVisibleDialog(false);


  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();



  
  async function RemoveNotificationOnReceive(idNotification) {
    console.log("----------------Start Test---------");
    console.log(idNotification);
    const result = await AsyncStorage.getItem("localNotifications");
    let localNotifications = [];
    let newNotifications = [];
    let newFullNotificationArr = []

    if (result !== null) localNotifications = JSON.parse(result);
    console.log("----localNotifications BEFORE REMOVE-----")
    console.log(localNotifications)

    for(let i = 0 ; i < localNotifications.length; i ++){
      console.log("----localNotifications loop-----")
      console.log(localNotifications[i].notifications)
      if(localNotifications[i].notifications.length === 0){
        
         newFullNotificationArr = localNotifications.filter((n) => n.notifications.length !== 0)
      } else {

        let newLocalNotification = localNotifications[i].notifications.filter((n) => n.idNotification !== idNotification)


        localNotifications[i].notifications = newLocalNotification
        
        if(localNotifications[i].notifications.length === 0){
          newFullNotificationArr = localNotifications.filter((n) => n.notifications.length !== 0)
        } else {
          
          newFullNotificationArr = localNotifications
        }
        // newNotifications = newLocalNotification
      }
    }
    console.log("----Notifications AFTER REMOVE-----")
    console.log(newFullNotificationArr)
    await AsyncStorage.setItem("localNotifications", JSON.stringify(newFullNotificationArr));

  }
  
  
  const handleRemoveNotification = async (txt) => {
    console.log("----------------Start Test---------");
    console.log(txt);
    const result = await AsyncStorage.getItem("localNotifications");
    let localNotifications = [];
    let newNotifications = [];
    let newFullNotificationArr = []
    if (result !== null) localNotifications = JSON.parse(result);
    console.log("----localNotifications BEFORE REMOVE-----")
    console.log(localNotifications)
    for(let i = 0 ; i < localNotifications.length; i ++){
      console.log("----localNotifications loop-----")
      console.log(localNotifications[i].notifications)
      if(localNotifications[i].notifications.length === 0){
        
         newFullNotificationArr = localNotifications.filter((n) => n.notifications.length !== 0)
      } else {

        let newLocalNotification = localNotifications[i].notifications.filter((n) => n.text !== txt)

        for(let y = 0; y < localNotifications[i].notifications; y++){
          if(localNotifications[i].notifications[y].txt === txt){
            await Notifications.cancelScheduledNotificationAsync(localNotifications[i].notifications[y].idNotification);
          }
        }

        localNotifications[i].notifications = newLocalNotification
        
        if(localNotifications[i].notifications.length === 0){
          newFullNotificationArr = localNotifications.filter((n) => n.notifications.length !== 0)
        } else {
          
          newFullNotificationArr = localNotifications
        }
        // newNotifications = newLocalNotification
      }
    }
    console.log("----Notifications AFTER REMOVE-----")
    // console.log(newFullNotificationArr[0])
    await AsyncStorage.setItem("localNotifications", JSON.stringify(newFullNotificationArr));
    
    // CHANGE THE STATE OF NOTIFICATIONS 
    let newNotificationState = timeNotifications.filter((n) => n.text !== txt)
    // console.log(newNotificationState)
    setTimeNotifications(newNotificationState)
    await AsyncStorage.setItem("localNotificationStateUI", JSON.stringify(newNotificationState));
    
  }


  async function uploadScheduledNotifications() {
    console.log("-----------------uploadScheduledNotifications------------------")
  
  // }
  if(timeNotifications.length === 0) {
    // console.log("length 0")
    let id = Date.now();
    const newState = [...timeNotifications, {text:`${text} ${checked} before`, idNotification:id}]
    setTimeNotifications(newState)
    console.log(".............BEFORE AsyncStorage.setItem............")
    await AsyncStorage.setItem("localNotificationStateUI", JSON.stringify(newState));
    // console.log(myAppointments[i])
  
  
    hideModal()
  
  } else {
  
    console.log(timeNotifications.length)
  for(let z = 0; z < timeNotifications.length; z ++){
    // console.log(`${text} ${checked} before`)
    if(timeNotifications[z].text === `${text} ${checked} before`){
      showDialog()
      break;
    } else if(z + 1 === timeNotifications.length) {
      // console.log(`${text} ${checked} before`)
      let id = Date.now();
      const newState = [...timeNotifications, {text:`${text} ${checked} before`, idNotification:id}]
      setTimeNotifications(newState)
      await AsyncStorage.setItem("localNotificationStateUI", JSON.stringify(newState));
      console.log("appointment.....timeNotifications.length >>>>>>> 0")
      // console.log(myAppointments[i])
  
  
      hideModal()
    }
    }
  }
  
  
  
  }
  



  
  async function registerForPushNotificationsAsync() {
    let token;
  
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    return token;
  }
  

  const handleCheck = async () => {
    console.log("Start Test");
    const result = await AsyncStorage.getItem("localNotifications");
    let localNotifications = [];
    if (result !== null) localNotifications = JSON.parse(result);
    console.log("----localNotifications ON CHECK USE EFFECT-----")
    console.log(localNotifications)
    // // setNotificationsDB(localNotifications)

    const resultState = await AsyncStorage.getItem("localNotificationStateUI");
    let localNotificationStateUI = [];
    if (resultState !== null) localNotificationStateUI = JSON.parse(resultState);
    console.log("------localNotificationState---UI-----")
    console.log(localNotificationStateUI)
    setTimeNotifications(localNotificationStateUI)

    // await AsyncStorage.setItem("localNotifications", JSON.stringify([]));
  }

  useEffect(() => {
    console.log("----------Appointments-------")
    // console.log(myAppointments[0].isApproved)
    // console.log(myAppointments[1].isApproved)
    // console.log(myAppointments[2].isApproved)

    handleCheck()

    // setNotificationsDB([])
    // console.log(typeof text)
    // console.log(myAppointments)
    // console.log(timeNotifications)
    // handleGetData();
    // selectedTab == 'Basic Info';

    
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log("-------HERE 1---------")
      console.log(notification.request.identifier)
      RemoveNotificationOnReceive(notification.request.identifier)
      setNotification(notification);
    });
    
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log("-------HERE 2---------")
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [isFocused]);

  return (
    <>
      <View style={{ height: "85%"}}>
        <NavBarPatient
          title={'Notifications'}
          isGoBack={true}
          navHeight={80}
          isPatient={true}
          isTermsAccepted={
            patientInformation.hasProfile
              ? patientInformation.hasProfile
              : false
          }
        />
        {/* <CustomLoader isLoading={isLoading} /> */}
        <CardSurface style={styles.containerStyle}>
 

          {/* <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
          
            <Text>
            <Text style={{color:colors.blue}}>
               {isSwitchOn ? "Disable " : "Enable "} 
            </Text>
             message notifications
            </Text>
            <Switch value={isSwitchOn} onValueChange={onToggleSwitch} color={colors.blue} />

          </View>
        <Divider/>
        
        <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
        <Text>
            <Text style={{color:colors.blue}}>
               {isSwitchOn2 ? "Disable " : "Enable "} 
            </Text>
             message notifications
            </Text>
        <Switch value={isSwitchOn2} onValueChange={onToggleSwitch2} color={colors.blue}/>
        </View>
        
        <Divider/> */}
       
      <View style={{backgroundColor:"red", height:"auto", width:"auto"}}>

      </View>
        <H6fontRegularBlack>
          NOTIFICATIONS 
        </H6fontRegularBlack>
        <H9fontRegularGray>You will be notified before each appointment</H9fontRegularGray>
        <Provider >
      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
          <View style={{flexDirection:"row", justifyContent:"center", marginTop:10}}>
          <H6fontRegularBlack>Custom Notification</H6fontRegularBlack>
          <MaterialCommunityIcons name="calendar-clock-outline" size={30} color="black" />
          </View>
          <TextInput
          // label="Email"
          theme={{ colors: { primary: colors.bookBlue}}}
          keyboardType = 'numeric'
          value={text}
          onChangeText={text => setText(text)}
          style={{backgroundColor:"transparent"}}
          mode={"outlined"}
          style={{marginHorizontal:5}}
          />
          <View style={{flexDirection:"column", paddingHorizontal:10}}>
          <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
          <Text>Minutes before</Text>
          <RadioButton 
          value="minutes"
        status={ checked === 'minutes' ? 'checked' : 'unchecked' }
        onPress={() => setChecked('minutes')}
        color={colors.bookBlue}
        />
          </View>
          <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
          <Text>Hours</Text>
          <RadioButton 
            value="hours"
            status={ checked === 'hours' ? 'checked' : 'unchecked' }
            onPress={() => setChecked('hours')}
            color={colors.bookBlue}
          />
          </View>
          <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
          <Text>Days</Text>
          <RadioButton     
          value="days"
            status={ checked === 'days' ? 'checked' : 'unchecked' }
            onPress={() => setChecked('days')}
            color={colors.bookBlue}
            />
          </View>
          <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
          <Text>Weeks</Text>
          <RadioButton 
                value="weeks"
                status={ checked === 'weeks' ? 'checked' : 'unchecked' }
                onPress={() => setChecked('weeks')}
                color={colors.bookBlue}
          />
          </View>
          </View>
          <Divider/>
          <Button color={colors.bookBlue} mode="text" onPress={async () => {
            // cancelNotification()
          // await schedulePushNotification();
          await uploadScheduledNotifications()
        }}>
    Add Notification
  </Button>
        </Modal>
      </Portal>
      {timeNotifications.map((item, index) => (
        <View key={index} style={{flexDirection:"row", justifyContent:"space-between", marginTop:10}}>
          <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
          <MaterialCommunityIcons name="bell-outline" size={24} color="black" />
          <H9fontRegularBlack style={{marginLeft:10}}>
            {item.text}
          </H9fontRegularBlack>
          </View>
          <TouchableRipple  onPress={() => handleRemoveNotification(item.text)}     rippleColor="rgba(0, 0, 0, .32)" >
          <MaterialCommunityIcons name="close" size={24} color="black"/>
          </TouchableRipple> 
        </View>
      ))}
      {timeNotifications.length < 5 ?
      <Button color={colors.bookBlue} style={{marginTop: 10}} onPress={showModal}>
        Add Notification
      </Button>
      : null
      }
    <Divider/>
    </Provider>


        <Provider>
    <Portal>
          <Dialog visible={visibleDialog} onDismiss={hideDialog}>
            <Dialog.Title>Notification already set</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">You already have a notification set for {`${text} ${checked} before`} all appointments</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>Done</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        </Provider>
   
        </CardSurface>
        {/* <ScrollView>
          {selectedTab == 'Basic Info' ? (
            <BasicInfoPatient
              dataInfo={basicInfoData}
              handleAddSubmit={handleAddSubmit}
            />
          ) : null}
        </ScrollView> */}
      </View>
    </>
  );
};
export default UserSettingsPatient;

const styles = StyleSheet.create({
  dropdown: {
    // height: 38,
    // paddingTop: 20,
    paddingLeft: 10,
    // paddingRight: 5,
    backgroundColor: '#FFF',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  containerStyle: {marginHorizontal: 10, marginTop: 10, height: "100%"},
  bodyStyle: {paddingHorizontal: 10, paddingTop: 10},
  bodyContainerStyle: {
    borderRadius: 50,
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginVertical: 10,
  },
  profileImageUploadStyle: {borderRadius: 50, width: 100, height: 100},
  profileImage: {
    width: 30,
    height: 30,
    backgroundColor: 'white',
    position: 'absolute',
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 20,
    borderTopLeftRadius: 20,
  },
  profileImageStyle: {
    height: 100,
    width: 100,
    borderRadius: 50,
    borderWidth: 5,
    borderColor: '#f7f7f7',
    overflow: 'hidden',
  },
  dropDownStyle: {
    // height: 40,
    width: Dimensions.get('window').width / 2.7,
    borderColor: '#CFCFCF',
    borderRadius: 5,
    borderWidth: 1,
    marginTop: 5,
    marginBottom: 10,
    backgroundColor: '#CFCFCF',
  },
  fromStyle: {
    height: 35,
    width: Dimensions.get('window').width / 2.8,
    borderColor: '#CFCFCF',
    borderRadius: 5,
    borderWidth: 1,
    marginTop: 5,
    marginBottom: 10,
    marginLeft: 20,
  },
  calenderIconStyle: {height: 18, width: 16},
  nextButtonStyle: {
    height: 45,
    backgroundColor: '#1B5A90',
    marginVertical: 15,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
});
