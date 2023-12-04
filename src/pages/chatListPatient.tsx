import React, { Fragment, useEffect, useState, useLayoutEffect } from "react";
import {
  ScrollView,
  TextInput,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { GeneralProps } from "../interfaces/generalProps";
import { Route } from "@react-navigation/native";
import { NavBar, NavBarPatient } from "../common/commonComponents";
import { Entypo } from "@expo/vector-icons";
import {
  CardSurface,
  CommonLineDotted,
  CommonSearch,
  MainContainer,
  RowView,
} from "../components/commonViews";
import {
  H15fontMediumBlack,
  H9fontRegularGray,
  H8fontRegularBlack,
  H6fontMediumWhite,
  H14fontMediumBlack,
  H7fontMediumWhite,
  H9fontMediumBlue,
  H6fontRegularWhite,
} from "../components/commonText";
import { colors } from "../utils/colors";
import Patient1 from "../../assets/images/patients/patient1.svg";
// import Icon from 'react-native-vector-icons/FontAwesome';
import { screenName } from "../utils/screenName";
import { chatArray } from "../utils/constant";
import {
  alignItemsCenter,
  alignItemsRight,
  alignSelfCenter,
  flexRow,
  justyfyCenter,
  pl10,
  pl30,
  pt5,
} from "../common/commonStyles";
import ChatIcon from "../../assets/images/chat-icon.svg";
import Chat from "../../assets/images/chat.svg";
import GreenTick from "../../assets/images/green-tick.svg";
import GrayTick from "../../assets/images/gray-tick.svg";
import { useSelector } from "react-redux";
import { labels } from "../utils/labels";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db, authentication } from "../../firebase";
import { retrieveClinicMessages } from "../utils/getFirebaseData";
import { ActivityIndicator, Text } from "react-native-paper";

import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import i18n from "../../i18n";

interface Props extends GeneralProps {
  route: Route<string, object | undefined>;
}
const ChatListPatient: React.FC<Props> = ({
  navigation,
  route,
}): JSX.Element => {
  const allClinicsDB = useSelector((state) => state.allClinics);
  const { clinicsDB, loading } = allClinicsDB;

  const clinicsOfPatient = useSelector((state) => state.clinicsOfPatient);
  const { clinicsAppointed, loading: loadingClinicsAppointed } =
    clinicsOfPatient;

  const [clinicsInfo, setClinicInfo] = useState([]);
  const [messages, setMessages] = useState([]);
  const [receivedMessage, setReceivedMessage] = useState(false);

  const allClinicsPatients = useSelector((state) => state.clinicsPatients);
  const { clinicsPatients, loading: loadingClinicsDB } = allClinicsPatients;

  const [search, setSearch] = useState("");
  const [TextInputValue, setTextInputValue] = useState("");
  const [searchList, setSearchList] = useState([]);
  const [searching, setSearching] = useState(false);
  const [mainClinicImage, setMainClinicImage] = useState("");

  const auth = authentication;
  const messagesArr = [];

  const handleSetKeyword = (key) => {
    // Check if searched text is not blank
    setTextInputValue(key);
    // console.log(patientsInfo);
    if (key) {
      // Inserted text is not blank
      const newData = clinicsInfo.filter(function (item) {
        // console.log(item.basicInfoData);
        let fullName = `${item.clinicInfoData.clinicname}`;
        const itemData = fullName ? fullName.toUpperCase() : "".toUpperCase();
        const textData = key.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });

      // CONTINUE WITH HIGHLIGHT TEXT

      // for (let i = 0; i < newData.length; i++) {
      //   console.log(newData[i]);

      //   const firstNameData = newData[i].basicInfoData.firstname ? newData[i].basicInfoData.firstname.toUpperCase() : ''.toUpperCase();
      //   const firstNameKey = key.toUpperCase();

      //   const lastNameData = newData[i].basicInfoData.lastname ? newData[i].basicInfoData.lastname.toUpperCase() : ''.toUpperCase();
      //   const lastNameKey = key.toUpperCase();

      // }
      console.log(newData);

      setSearching(true);
      setSearchList(newData);
    } else {
      // Inserted text is blank

      setSearching(false);
    }
  };

  const handleGetClinicMessages = (messages, nrUnseenMsg) => {
    // console.log("asdasd");
    for (let i = 0; i < clinicsAppointed.length; i++) {
      for (let z = 0; z < clinicsAppointed[i].clinicImages.length; z++) {
        if (clinicsAppointed[i].clinicImages[z].isMainImg) {
          clinicsAppointed[i].clinicMainImage =
            clinicsAppointed[i].clinicImages[z].img;
        }
      }
    }
    if (messages == undefined) {
      return;
    }
    console.log(nrUnseenMsg.length);
    let mess = [];
    for (let i = 0; i < clinicsAppointed.length; i++) {
      console.log("--------------------", clinicsAppointed[i].owner_uid);
      if (
        messages.user._id === clinicsAppointed[i].clinic_uid ||
        messages.user._id === auth.currentUser.uid
      ) {
        console.log("Test", messages);
        clinicsAppointed[i].messages = {
          uid_toCheck: clinicsAppointed[i].owner_uid,
          messages,
          nrUnseenMsg: nrUnseenMsg.length,
        };
        console.log(clinicsAppointed[i].clinicInfoData.clinicname);
      } else {
        console.log(clinicsAppointed[i].clinicInfoData.clinicname);
        clinicsAppointed[i].messages = {};
      }
      clinicsAppointed[i].isOnline = false;
      if (clinicsAppointed[i].messages) {
        mess.push({
          uid_toCheck: clinicsAppointed[i].messages.uid_toCheck,
          messages: clinicsAppointed[i].messages.messages,
        });
      }
    }
    setMessages(mess);
    setClinicInfo(clinicsAppointed);
  };

  useEffect(() => {
    console.log("....................START..........");
    console.log("clinicsAppointed..........", clinicsAppointed);
    for (let i = 0; i < clinicsAppointed.length; i++) {
      for (let z = 0; z < clinicsAppointed[i].clinicImages.length; z++) {
        if (clinicsAppointed[i].clinicImages[z].isMainImg) {
          clinicsAppointed[i].clinicMainImage =
            clinicsAppointed[i].clinicImages[z].img;
        }
      }
    }
    if (clinicsAppointed.length === 0 || clinicsAppointed[0] === undefined) {
      return;
    }
    // console.log(clinicsDB[0].owner_uid);
    // console.log(clinicsDB[0]);
    const collectionRef = collection(
      db,
      "Users",
      `${auth.currentUser.uid}`,
      "Chats"
    );
    const q = query(collectionRef, orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let messages;

      let unseenMsg = [];
      snapshot.docs.map((doc) => {
        if (!doc.data().isSeen) {
          unseenMsg.push(doc.data());
        }
        messages = {
          _id: doc.id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user,
          isSent: doc.data().isSent,
          isSeen: doc.data().isSeen,
        };
      });
      if (messages == undefined) {
        console.log("yes");
        setClinicInfo(clinicsAppointed);
      } else handleGetClinicMessages(messages, unseenMsg);
    });
    console.log(clinicsInfo);
    return () => unsubscribe();
  }, [loading]);

  //  return(
  //   <View>
  //     <Text>
  //       asdasda
  //     </Text>
  //   </View>
  //  )
  return (
    <Fragment>
      <MainContainer>
        <NavBarPatient title={"Chat"} isPatient={true} isTermsAccepted={true} />
        <ScrollView>
          <View style={styles.chatBodyContainer}>
            <View style={styles.chatBody}>
              <RowView>
                <View style={flexRow}>
                  <Entypo name="chat" size={24} color={colors.facebook} />
                  <H8fontRegularBlack style={pl10}>
                    {i18n.translate("chatList")}
                  </H8fontRegularBlack>
                </View>
                {searching ? (
                  <H8fontRegularBlack>
                    {searchList.length}{" "}
                    {searchList.length === 1 ? "User" : "Users"}
                  </H8fontRegularBlack>
                ) : (
                  <H8fontRegularBlack>
                    {clinicsInfo.length}{" "}
                    {clinicsInfo.length === 1 ? "User" : "Users"}
                  </H8fontRegularBlack>
                )}
              </RowView>
              <CommonLineDotted />
              <CommonSearch style={styles.searchContainer}>
                {/* <Icon name="search" size={17} color={'black'} style={{}} /> */}
                <TextInput
                  value={TextInputValue}
                  onChangeText={(text) => handleSetKeyword(text)}
                  style={{}}
                  placeholder="Search users..."
                />
              </CommonSearch>
              {loading && <ActivityIndicator />}
              {!searching
                ? clinicsInfo.map((item, index) => {
                    console.log("-----------");
                    console.log(item);
                    return (
                      <CardSurface
                        style={[styles.cardTouchableStyle, { height: 70 }]}
                        key={index}
                      >
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate(
                              screenName.ChatViewPatient as any,
                              {
                                item,
                              }
                            )
                          }
                        >
                          <RowView style={{ width: "100%" }}>
                            <View style={[styles.cardStyle, { width: "20%" }]}>
                              {/* <View style={styles.profileImageStyle}>
                                {
                                  item.clinicMainImage
                                  ?
                                  <Image source={{uri:item.clinicMainImage}} style={{height:"100%", width:"100%"}}/>
                                  :
                                  
                                  <Patient1 height={50} width={50} />
                                }
                                
                              </View> */}
                              <View
                                style={[
                                  styles.profileImageStyle,
                                  { backgroundColor: colors.facebook },
                                ]}
                              >
                                <H6fontRegularWhite
                                  style={{ letterSpacing: 2, fontSize: 30 }}
                                >
                                  {
                                    Array.from(
                                      item.clinicInfoData.clinicname
                                    )[0]
                                  }
                                </H6fontRegularWhite>
                              </View>
                              {/* <View
                              style={[
                                {
                                  // check if person is active
                                  backgroundColor: false
                                    ? '#858585'
                                    : '#20c997',
                                },
                                styles.status,
                              ]}></View> */}
                            </View>
                            <RowView
                              style={[styles.detailsView, { width: "80%" }]}
                            >
                              <View
                                style={[
                                  // justyfyCenter,
                                  { width: "60%" },
                                ]}
                              >
                                <H15fontMediumBlack numberOfLines={1}>
                                  {item.clinicInfoData.clinicname}
                                </H15fontMediumBlack>
                                <RowView
                                  style={[alignItemsCenter, { width: "100%" }]}
                                >
                                  {/* Check if last message was read */}
                                  {/* {item.messages &&
                                  item.messages.messages &&
                                  (item.messages.messages.isSeen ? (
                                    <Ionicons
                                      name="checkmark-done"
                                      size={20}
                                      color="#20c997"
                                    />
                                  ) : true ? (
                                    <Ionicons
                                      name="checkmark"
                                      size={20}
                                      color="black"
                                    />
                                  ) : null)} */}
                                  {/* {messages &&
                                  messages.map((m, i) => {
                                    <Text>asdasds</Text>;
                                    item.messages &&
                                      item.owner_uid === m.uit_toCheck && (
                                        <H9fontRegularGray
                                          style={styles.msgTxtSytyle}>
                                          {m.text}
                                        </H9fontRegularGray>
                                      );
                                  })} */}
                                  <H9fontRegularGray
                                    style={{ maxWidth: "100%" }}
                                    numberOfLines={2}
                                  >
                                    <H9fontMediumBlue>
                                      {item.messages &&
                                      item.messages.messages &&
                                      item.messages.messages.text.length === 0
                                        ? "No messages"
                                        : "Last message: "}
                                    </H9fontMediumBlue>
                                    {item.messages &&
                                      item.messages.messages &&
                                      item.messages.messages.text &&
                                      item.messages.messages.text}
                                  </H9fontRegularGray>
                                  {/* <Text>
                                  {messages[0].messages &&
                                    messages[0].messages.text &&
                                    messages[0].messages.text}
                                </Text> */}
                                  {/* {Icon != null && <Icon height={10} width={10} />} */}
                                </RowView>
                              </View>
                              <View
                                style={[
                                  alignItemsRight,
                                  {
                                    width: "40%",
                                    alignItems: "flex-end",
                                    justifyContent: "flex-start",

                                    height: "100%",
                                  },
                                ]}
                              >
                                <View
                                  style={[
                                    alignItemsRight,
                                    {
                                      flexDirection: "row",
                                    },
                                  ]}
                                >
                                  {/* {item.messages &&
                                item.messages.messages &&
                                item.messages.messages.createdAt && (
                                  <H9fontRegularGray
                                    style={{
                                      fontWeight: 'bold',
                                      fontSize: 10,
                                    }}>
                                    Last message:{' '}
                                  </H9fontRegularGray>
                                )} */}
                                  <H9fontRegularGray
                                    style={{
                                      fontSize: 9,
                                    }}
                                  >
                                    {item.messages &&
                                      item.messages.messages &&
                                      item.messages.messages.createdAt &&
                                      moment(
                                        item.messages.messages.createdAt
                                      ).format("DD-MM-YYYY")}
                                  </H9fontRegularGray>
                                </View>
                                {/* Number of messages not seen */}
                                {/* {item.messages && item.messages.nrUnseenMsg ? (
                                <View style={styles.countStyle}>
                                  <H7fontMediumWhite>
                                    {item.messages.nrUnseenMsg}
                                  </H7fontMediumWhite>
                                </View>
                              ) : null} */}
                              </View>
                            </RowView>
                          </RowView>
                        </TouchableOpacity>
                      </CardSurface>
                    );
                  })
                : searchList.map((item, index) => {
                    return (
                      <CardSurface
                        style={[styles.cardTouchableStyle, { height: 70 }]}
                        key={index}
                      >
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate(
                              screenName.ChatViewPatient as any,
                              {
                                item,
                              }
                            )
                          }
                        >
                          <RowView style={{ width: "100%" }}>
                            <View style={[styles.cardStyle, { width: "20%" }]}>
                              {/* <View style={styles.profileImageStyle}>
                              {     
                               item.mainClinicImage
                                  ?
                                  <Image source={{uri:item.mainClinicImage}} style={{height:"100%", width:"100%"}}/>
                                  :
                                  
                                  <Patient1 height={50} width={50} />
                                  }
                              </View> */}
                              <View
                                style={[
                                  styles.profileImageStyle,
                                  { backgroundColor: colors.facebook },
                                ]}
                              >
                                <H6fontRegularWhite
                                  style={{ letterSpacing: 2, fontSize: 20 }}
                                >
                                  {
                                    Array.from(
                                      item.clinicInfoData.clinicname
                                    )[0]
                                  }
                                </H6fontRegularWhite>
                              </View>
                              {/* <View
                                  style={[
                                    {
                                      // check if person is active
                                      backgroundColor: false
                                        ? '#858585'
                                        : '#20c997',
                                    },
                                    styles.status,
                                  ]}></View> */}
                            </View>
                            <RowView
                              style={[styles.detailsView, { width: "80%" }]}
                            >
                              <View
                                style={[
                                  // justyfyCenter,
                                  { width: "60%" },
                                ]}
                              >
                                <H15fontMediumBlack numberOfLines={1}>
                                  {item.clinicInfoData.clinicname}
                                </H15fontMediumBlack>
                                <RowView
                                  style={[alignItemsCenter, { width: "100%" }]}
                                >
                                  {/* Check if last message was read */}
                                  {/* {item.messages &&
                                      item.messages.messages &&
                                      (item.messages.messages.isSeen ? (
                                        <Ionicons
                                          name="checkmark-done"
                                          size={20}
                                          color="#20c997"
                                        />
                                      ) : true ? (
                                        <Ionicons
                                          name="checkmark"
                                          size={20}
                                          color="black"
                                        />
                                      ) : null)} */}
                                  {/* {messages &&
                                      messages.map((m, i) => {
                                        <Text>asdasds</Text>;
                                        item.messages &&
                                          item.owner_uid === m.uit_toCheck && (
                                            <H9fontRegularGray
                                              style={styles.msgTxtSytyle}>
                                              {m.text}
                                            </H9fontRegularGray>
                                          );
                                      })} */}
                                  <H9fontRegularGray
                                    style={{ maxWidth: "100%" }}
                                    numberOfLines={2}
                                  >
                                    <H9fontMediumBlue>
                                      {item.messages &&
                                      item.messages.messages &&
                                      item.messages.messages.text.length === 0
                                        ? "No messages"
                                        : "Last message: "}
                                    </H9fontMediumBlue>
                                    {item.messages &&
                                      item.messages.messages &&
                                      item.messages.messages.text &&
                                      item.messages.messages.text}
                                  </H9fontRegularGray>
                                  {/* <Text>
                                      {messages[0].messages &&
                                        messages[0].messages.text &&
                                        messages[0].messages.text}
                                    </Text> */}
                                  {/* {Icon != null && <Icon height={10} width={10} />} */}
                                </RowView>
                              </View>
                              <View
                                style={[
                                  alignItemsRight,
                                  {
                                    width: "40%",
                                    alignItems: "flex-end",
                                    justifyContent: "flex-start",

                                    height: "100%",
                                  },
                                ]}
                              >
                                <View
                                  style={[
                                    alignItemsRight,
                                    {
                                      flexDirection: "row",
                                    },
                                  ]}
                                >
                                  {/* {item.messages &&
                                    item.messages.messages &&
                                    item.messages.messages.createdAt && (
                                      <H9fontRegularGray
                                        style={{
                                          fontWeight: 'bold',
                                          fontSize: 10,
                                        }}>
                                        Last message:{' '}
                                      </H9fontRegularGray>
                                    )} */}
                                  <H9fontRegularGray
                                    style={{
                                      fontSize: 9,
                                    }}
                                  >
                                    {item.messages &&
                                      item.messages.messages &&
                                      item.messages.messages.createdAt &&
                                      moment(
                                        item.messages.messages.createdAt
                                      ).format("DD-MM-YYYY")}
                                  </H9fontRegularGray>
                                </View>
                                {/* Number of messages not seen */}
                                {/* {item.messages && item.messages.nrUnseenMsg ? (
                                    <View style={styles.countStyle}>
                                      <H7fontMediumWhite>
                                        {item.messages.nrUnseenMsg}
                                      </H7fontMediumWhite>
                                    </View>
                                  ) : null} */}
                              </View>
                            </RowView>
                          </RowView>
                        </TouchableOpacity>
                      </CardSurface>
                    );
                  })}
            </View>
          </View>
        </ScrollView>
        {/* <TouchableOpacity style={styles.messageIconsBtnStyle}>
          <ChatIcon height={80} width={80} />
        </TouchableOpacity> */}
      </MainContainer>
    </Fragment>
  );
};
export default ChatListPatient;

const styles = StyleSheet.create({
  chatBodyContainer: {
    // marginTop: 100,
  },
  chatBody: {
    backgroundColor: colors.background,
    height: 500,
    borderRadius: 30,
    padding: 20,
  },
  chatListIcon: {
    height: 20,
    width: 20,
  },
  searchContainer: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  cardStyle: {
    borderRadius: 50,
    alignSelf: "center",
  },
  profileImageStyle: {
    height: 50,
    width: 50,
    borderRadius: 50,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  status: {
    borderWidth: 2,
    borderColor: colors.white,
    position: "absolute",
    bottom: 3,
    right: -3,
    height: 15,
    width: 15,
    borderRadius: 10,
    elevation: 3,
  },
  detailsView: {
    flex: 1,
    justifyContent: "space-between",
    paddingLeft: 8,
    alignItems: "center",
  },
  msgReadImageStyle: {
    height: 10,
    width: 10,
  },
  msgTxtSytyle: {
    fontSize: 11,
    paddingHorizontal: 4,
  },
  messageIconsBtnStyle: {
    bottom: 0,
    right: 0,
    position: "absolute",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  msgBtnStyle: {
    height: 80,
    width: 80,
  },
  dateTxtStyle: {
    fontSize: 8,
    // paddingBottom:
    //   item.noofmessage != null ? 5 : 25,
  },
  countStyle: {
    height: 23,
    width: 23,
    backgroundColor: "#00DCB7",
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
  },
  countTxt: {
    color: "white",
    fontSize: 10,
  },
  cardTouchableStyle: {
    marginTop: 10,
  },
});
