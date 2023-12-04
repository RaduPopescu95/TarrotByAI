import React, {
  Fragment,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import {
  ScrollView,
  TextInput,
  View,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { GeneralProps } from "../interfaces/generalProps";
import {
  Route,
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import { NavBar, NavBarPatient } from "../common/commonComponents";
import {
  CardSurface,
  CommonInput,
  CommonLineDotted,
  CommonSearch,
  MainContainer,
  RowView,
} from "../components/commonViews";
import {
  H15fontMediumBlack,
  H30fontRegularLightBlack,
  H9fontRegularGray,
  H30fontRegularLightRed,
  H8fontRegularWhite,
  H8fontMediumBlack,
  H8fontRegularBlack,
} from "../components/commonText";
import { colors } from "../utils/colors";
import Icon from "react-native-vector-icons/FontAwesome";
// import {DevWidth} from '../utils/device';
import { Dimensions } from "react-native";
import * as Notifications from "expo-notifications";

import { alignItemsRight, pl15, pv20, pv5 } from "../common/commonStyles";

import { Feather } from "@expo/vector-icons";
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, authentication } from "../../firebase";
import { GiftedChat } from "react-native-gifted-chat";
import { useSelector } from "react-redux";

interface Props extends GeneralProps {
  route: Route<string, object | undefined>;
}
const ChatViewClinic: React.FC<Props> = ({
  navigation,
  route,
}): JSX.Element => {
  const [focus, setFocus] = useState(false);
  const [messages, setMessages] = useState([]);
  const clinicInfoDB = useSelector((state) => state.clinicInfoData);
  const { clinicInformation } = clinicInfoDB;
  const auth = authentication;
  const patientInfo = route.params;

  const handleUpdateIsSeen = async (collectionRef, docId) => {
    try {
      const docRef = doc(collectionRef, docId);
      await updateDoc(docRef, {
        isSeen: true,
      });
    } catch (err) {
      console.log("error uploading is SEEN ", err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      // console.log('focus....', patientInfo.item);
      const collectionRef = collection(
        db,
        "Chats",
        `${auth.currentUser.uid}-${patientInfo.item.owner_uid}`,
        "Messages"
      );
      const q = query(collectionRef, orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        // const messages = snapshot.docs.map(doc => ({
        //   _id: doc.id,
        //   createdAt: doc.data().createdAt.toDate(),
        //   text: doc.data().text,
        //   user: doc.data().user,
        //   isSeen: doc.data().isSeen,
        //   isSent: doc.data().isSent,
        // }));

        console.log("---------------");
        // console.log('basicInfoData', basicInfoData);

        const messages = snapshot.docs.map((doc) => {
          handleUpdateIsSeen(collectionRef, doc.id);

          const obj = {
            _id: doc.id,
            createdAt: doc.data().createdAt.toDate(),
            text: doc.data().text,
            user: doc.data().user,
            isSeen: doc.data().isSeen,
            isSent: doc.data().isSent,
          };
          console.log(obj);
        });
        // console.log(messages);
      });
      return () => unsubscribe();
    }, [])
  );

  useLayoutEffect(() => {
    console.log(
      "clinicInformation...------------",
      clinicInformation.clinicInfoData.clinicname
    );
    console.log("patientInfo...------------", patientInfo);
    const collectionRef = collection(
      db,
      "Chats",
      `${auth.currentUser.uid}-${patientInfo.item.owner_uid}`,
      "Messages"
    );
    const q = query(collectionRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log("snapshot");
      setMessages(
        snapshot.docs.map((doc) => ({
          _id: doc.id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user,
        }))
      );
    });
    return () => unsubscribe();
  }, []);

  const onSend = useCallback((messages = []) => {
    const isSeen = false;
    const isSent = false;
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    const { _id, createdAt, text, user } = messages[0];
    addDoc(
      collection(
        db,
        "Chats",
        `${auth.currentUser.uid}-${patientInfo.item.owner_uid}`,
        "Messages"
      ),
      {
        _id,
        createdAt,
        text,
        user,
        isSeen,
        isSent,
        clinicId: auth.currentUser.uid,
        patientId: patientInfo.item.owner_uid,
        userName: clinicInformation.clinicInfoData.clinicname,
        userType: "clinic",
      }
    );
  }, []);

  const recivedMessage = () => {
    return (
      <View style={pv20}>
        <View style={styles.receivedMsgContainer}>
          <H8fontMediumBlack style={pl15}>
            Hai I am Meera, am from Delhi{" "}
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
            Lorem Ipsum, you need to 4 be sure there{" "}
          </H8fontRegularWhite>
        </View>
        <View style={styles.sentmsgViewdate}>
          <H9fontRegularGray style={pv5}>Mar 26, 08:03 PM </H9fontRegularGray>

          <Feather name="check" size={24} color="green" />
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
    //SET NOTIFICATIONS OFF WHEN ON SCREEN
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: false,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });

    //SET NOTIFICATIONS ON WHEN OFF SCREEN
    return () => {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });
    };
  }, []);

  return (
    <>
      <Fragment>
        <MainContainer style={{ backgroundColor: colors.background }}>
          <NavBar
            title={`${patientInfo.item.basicInfoData.firstname} ${patientInfo.item.basicInfoData.lastname}`}
            navHeight={80}
            isTermsAccepted={true}
          />
          <GiftedChat
            messages={messages}
            onSend={(messages) => onSend(messages)}
            user={{
              _id: auth?.currentUser?.uid,
              avatar: `https://ui-avatars.com/api/?background=2f9771&color=FFF&name=${
                Array.from(clinicInformation.clinicInfoData.clinicname)[0]
              }`,
            }}
          />
        </MainContainer>
      </Fragment>
    </>
  );
};

export default ChatViewClinic;

const styles = StyleSheet.create({
  constainer: {
    marginTop: -100,
    flex: 1,
  },
  sentMsgContainer: {
    alignItems: "flex-end",
  },

  sentMsgTxtContainer: {
    backgroundColor: "#1A568C",
    width: Dimensions.get("window").width / 1.5,
    paddingVertical: 12,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderBottomLeftRadius: 14,
  },
  sentmsgViewdate: {
    width: Dimensions.get("window").width / 1.5,
    flexDirection: "row",
    alignItems: "center",
  },
  iconsStyle: {
    height: 12,
    width: 12,
  },
  receivedMsgContainer: {
    backgroundColor: "#fff",
    width: Dimensions.get("window").width / 1.5,
    paddingVertical: 12,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderBottomRightRadius: 14,
  },
  dayDashStyle: {
    borderWidth: 0.3,
    borderStyle: "dashed",
    borderRadius: 1,
    borderColor: "black",
    marginTop: 40,
  },
  dayStyle: { alignItems: "center", marginTop: -17 },
  dayFontStyle: {
    paddingVertical: 5,
    paddingHorizontal: 22,
    backgroundColor: "#fff",
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
    backgroundColor: "#fff",
    borderRadius: 50,
    flexDirection: "row",
    // borderColor: focus ? '#1A568C' : '#fff',
    borderColor: "#fff",
    borderWidth: 2,
  },
  textBoxStyle: {
    paddingLeft: 25,
    width: Dimensions.get("window").width / 1.15,
  },
  sendMsgBtnContailer: {
    alignItems: "flex-end",
    paddingRight: 12,
    paddingTop: 1.5,
  },
  sendMsgBtn: {
    backgroundColor: colors.seaBlue,
    height: 38,
    width: 38,
    borderRadius: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  sendMsgBtnImageStyle: {
    height: 18,
    width: 18,
  },
});
