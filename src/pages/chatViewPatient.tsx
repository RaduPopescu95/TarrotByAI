import React, {
  Fragment,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from 'react';
import {
  ScrollView,
  TextInput,
  View,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {GeneralProps} from '../interfaces/generalProps';
import {Route, useIsFocused, useNavigation} from '@react-navigation/native';
import {NavBar, NavBarPatient} from '../common/commonComponents';
import {
  CardSurface,
  CommonInput,
  CommonLineDotted,
  CommonSearch,
  MainContainer,
  RowView,
} from '../components/commonViews';
import {
  H15fontMediumBlack,
  H30fontRegularLightBlack,
  H9fontRegularGray,
  H30fontRegularLightRed,
  H8fontRegularWhite,
  H8fontMediumBlack,
  H8fontRegularBlack,
} from '../components/commonText';
import {colors} from '../utils/colors';
import Icon from 'react-native-vector-icons/FontAwesome';
// import {DevWidth} from '../utils/device';
import {Dimensions} from 'react-native';

import {alignItemsRight, pl15, pv20, pv5} from '../common/commonStyles';
import SendIcon from '../../assets/images/send.svg';
import GreenTick from '../../assets/images/green-tick.svg';
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
} from 'firebase/firestore';
import {db, authentication} from '../../firebase';
import {GiftedChat} from 'react-native-gifted-chat';
import * as Notifications from 'expo-notifications';
import { useSelector } from 'react-redux';

interface Props extends GeneralProps {
  route: Route<string, object | undefined>;
}
const ChatViewPatient: React.FC<Props> = ({navigation, route}): JSX.Element => {
  const [focus, setFocus] = useState(false);
  const [messages, setMessages] = useState([]);
  const patientInfoDB = useSelector(state => state.patientInfoData);
  const {patientInformation} = patientInfoDB;
  const auth = authentication;
  const clinicInfo = route.params;

  async function schedulePushNotification(user, text) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: user,
        body: text,
        data: { data: 'goes here' },
      },
      trigger: { seconds: 2 },
    });
  }

  useLayoutEffect(() => {
    // console.log(clinicInfo.item.clinic_uid);
    const collectionRef = collection(
      db,
      'Chats',
      `${clinicInfo.item.clinic_uid}-${auth.currentUser.uid}`,
      'Messages',
    );
    const q = query(collectionRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, snapshot => {
      // console.log('snapshot');
 
      setMessages(
        snapshot.docs.map(doc => ({
          _id: doc.id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user,
        })),
      );
    });
    return () => unsubscribe();
  }, []);

  const onSend = useCallback((messages = []) => {
    console.log("asda")
    const isSeen = false;
    const isSent = false;
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
    const {_id, createdAt, text, user} = messages[0];
    addDoc(
      collection(
        db,
        'Chats',
        `${clinicInfo.item.clinic_uid}-${auth.currentUser.uid}`,
        'Messages',
      ),
      {
        _id,
        createdAt,
        text,
        user,
        isSeen,
        isSent,
        clinicId: clinicInfo.item.clinic_uid,
        patientId: auth.currentUser.uid,
        userName: `${patientInformation.basicInfoData.firstname} ${patientInformation.basicInfoData.lastname}`,
        userType: "patient"
      },
    );
  }, []);

  const recivedMessage = () => {
    return (
      <View style={pv20}>
        <View style={styles.receivedMsgContainer}>
          <H8fontMediumBlack style={pl15}>
            Hai I am Meera, am from Delhi{' '}
          </H8fontMediumBlack>
        </View>
        <H9fontRegularGray style={pv5}>Mar 26, 08:03 PM </H9fontRegularGray>
      </View>
    );
  };

  const sentMessage = () => {
    return (
      <View style={styles.sentMsgContainer}>
        <View style={styles.sentMsgTxtContainer}>
          <H8fontRegularWhite style={pl15}>
            Lorem Ipsum, you need to 4 be sure there{' '}
          </H8fontRegularWhite>
        </View>
        <View style={styles.sentmsgViewdate}>
          <H9fontRegularGray style={pv5}>Mar 26, 08:03 PM </H9fontRegularGray>
          <GreenTick height={12} width={12} />
        </View>
      </View>
    );
  };

  const dayDetails = () => {
    return (
      <>
        <View style={styles.dayDashStyle}></View>
        <View style={styles.dayStyle}>
          <H8fontMediumBlack style={styles.dayFontStyle}>
            Today
          </H8fontMediumBlack>
        </View>
      </>
    );
  };

  useEffect(() => {
    // console.log(`${clinicInfo.item.owner_uid}-${auth.currentUser.uid}`);
    Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
    console.log('patientInformation...', patientInformation.basicInfoData.firstname);

    return () => {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });
    }
  }, []);

  return (
    <Fragment>
      <MainContainer style={{backgroundColor: colors.background}}>
        <NavBarPatient
          title={`${clinicInfo.item.clinicInfoData.clinicname}`}
          isPatient={true}
          isTermsAccepted={true}
          navHeight={50}
        />
        <GiftedChat
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{
            _id: auth?.currentUser?.uid,
            avatar: `https://ui-avatars.com/api/?background=2F5597&color=FFF&name=${Array.from(patientInformation.basicInfoData.firstname)[0]} ${Array.from(patientInformation.basicInfoData.lastname)[0]}`,
          }}
        />
      </MainContainer>
    </Fragment>
  );
};

export default ChatViewPatient;

const styles = StyleSheet.create({
  constainer: {
    marginTop: -100,
    flex: 1,
  },
  sentMsgContainer: {
    alignItems: 'flex-end',
  },

  sentMsgTxtContainer: {
    backgroundColor: '#1A568C',
    width: Dimensions.get('window').width / 1.5,
    paddingVertical: 12,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderBottomLeftRadius: 14,
  },
  sentmsgViewdate: {
    width: Dimensions.get('window').width / 1.5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconsStyle: {
    height: 12,
    width: 12,
  },
  receivedMsgContainer: {
    backgroundColor: '#fff',
    width: Dimensions.get('window').width / 1.5,
    paddingVertical: 12,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderBottomRightRadius: 14,
  },
  dayDashStyle: {
    borderWidth: 0.3,
    borderStyle: 'dashed',
    borderRadius: 1,
    borderColor: 'black',
    marginTop: 40,
  },
  dayStyle: {alignItems: 'center', marginTop: -17},
  dayFontStyle: {
    paddingVertical: 5,
    paddingHorizontal: 22,
    backgroundColor: '#fff',
    borderRadius: 30,
  },
  scrollContainer: {
    backgroundColor: colors.background,
    borderRadius: 30,
    padding: 20,
    flex: 1,
  },
  footerStyle: {
    bottom: 5,
    height: 45,
    backgroundColor: '#fff',
    borderRadius: 50,
    flexDirection: 'row',
    // borderColor: focus ? '#1A568C' : '#fff',
    borderColor: '#fff',
    borderWidth: 2,
  },
  textBoxStyle: {
    paddingLeft: 25,
    width: Dimensions.get('window').width / 1.15,
  },
  sendMsgBtnContailer: {
    alignItems: 'flex-end',
    paddingRight: 12,
    paddingTop: 1.5,
  },
  sendMsgBtn: {
    backgroundColor: colors.seaBlue,
    height: 38,
    width: 38,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendMsgBtnImageStyle: {
    height: 18,
    width: 18,
  },
});
