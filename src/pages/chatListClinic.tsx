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
  H6fontRegularBlue,
  H14fontRegularGray,
  H10fontRegularBlack,
  H6fontRegularBlack,
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

import { useDispatch, useSelector } from "react-redux";
import { labels } from "../utils/labels";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db, authentication } from "../../firebase";
import { retrieveClinicMessages } from "../utils/getFirebaseData";
import { ActivityIndicator, Text } from "react-native-paper";
import { Entypo } from "@expo/vector-icons";

import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import { getPatientsOfClinic } from "../actions/clinicActions";
import i18n from "../../i18n";

interface Props extends GeneralProps {
  route: Route<string, object | undefined>;
}
const ChatListClinic: React.FC<Props> = ({
  navigation,
  route,
}): JSX.Element => {
  // const allClinicsDB = useSelector(state => state.allClinics);
  // const {clinicsDB, loading} = allClinicsDB;

  const [patientsInfo, setPatientsInfo] = useState([]);
  const [messages, setMessages] = useState([]);
  const [receivedMessage, setReceivedMessage] = useState(false);

  const allClinicsPatients = useSelector((state) => state.clinicsPatients);
  const { clinicsPatients, loading } = allClinicsPatients;

  const [search, setSearch] = useState("");
  const [TextInputValue, setTextInputValue] = useState("");
  const [searchList, setSearchList] = useState([]);
  const [searching, setSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const auth = authentication;
  const messagesArr = [];

  const handleSetKeyword = (key) => {
    // Check if searched text is not blank
    setTextInputValue(key);
    // console.log(patientsInfo);
    if (key) {
      // Inserted text is not blank
      const newData = patientsInfo.filter(function (item) {
        let fullName = `${item.basicInfoData.firstname} ${item.basicInfoData.lastname}`;

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
      // console.log(newData.length);

      setSearching(true);
      setSearchList(newData);
    } else {
      // Inserted text is blank

      setSearching(false);
    }
  };

  const handleGetClinicMessages = (messages, nrUnseenMsg) => {
    console.log("here");
    console.log(messages);
    if (messages == undefined) {
      return;
    }
    console.log(nrUnseenMsg.length);
    let mess = [];
    for (let i = 0; i < clinicsPatients.length; i++) {
      console.log("--------------------", clinicsPatients[i].owner_uid);
      if (
        messages.user._id === clinicsPatients[i].owner_uid ||
        messages.user._id === auth.currentUser.uid
      ) {
        // console.log("messages.......Test", messages)
        clinicsPatients[i].messages = {
          uid_toCheck: clinicsPatients[i].owner_uid,
          messages,
          nrUnseenMsg: nrUnseenMsg.length,
        };
      } else {
        console.log(clinicsPatients[i].basicInfoData.firstname);
        clinicsPatients[i].messages = {};
      }
      clinicsPatients[i].isOnline = false;
      if (clinicsPatients[i].messages) {
        mess.push({
          uid_toCheck: clinicsPatients[i].messages.uid_toCheck,
          messages: clinicsPatients[i].messages.messages,
        });
      }
    }

    setMessages(mess);
    setPatientsInfo(clinicsPatients);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    console.log("patientsInfo...", patientsInfo);
    try {
      console.log("clinicsPatients...", clinicsPatients[1]);

      setIsLoading(true);
      // dispatch(getPatientsOfClinic());
      // console.log("----------Chat list clinicsPatients----------",patientsInfo[0].messages.messages.text)
      if (!loading) {
        if (clinicsPatients.length === 0 || clinicsPatients[0] === undefined) {
          console.log("aaa");
          return;
        }
      }
      if (clinicsPatients[0]) {
        if (clinicsPatients[0].owner_uid) {
          console.log("clinicsPatients...", clinicsPatients);
          console.log("yes");
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
              // console.log(doc.data());
              messages = {
                _id: doc.id,
                createdAt: doc.data().createdAt.toDate(),
                text: doc.data().text,
                user: doc.data().user,
                isSent: doc.data().isSent,
                isSeen: doc.data().isSeen,
              };
            });
            console.log("asdasdsd");
            if (messages == undefined) {
              console.log("yes");
              setPatientsInfo(clinicsPatients);

              setIsLoading(false);
            } else handleGetClinicMessages(messages, unseenMsg);
            setIsLoading(false);
          });
          setIsLoading(false);
          return () => unsubscribe();
        }
      }
    } catch (err) {
      console.log("error....", err);
    }
  }, [loading]);

  // return(
  //   <View>
  //     <Text>
  //       asdasd
  //     </Text>
  //   </View>
  // )

  return (
    <Fragment>
      <MainContainer>
        <NavBar title={"Chat"} isTermsAccepted={true} navHeight={80} />
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
                    {searchList.length === 1
                      ? i18n.translate("patient")
                      : i18n.translate("patients")}
                  </H8fontRegularBlack>
                ) : (
                  <H8fontRegularBlack>
                    {patientsInfo.length}{" "}
                    {patientsInfo.length === 1
                      ? i18n.translate("patient")
                      : i18n.translate("patients")}
                  </H8fontRegularBlack>
                )}
              </RowView>
              <CommonLineDotted />
              <CommonSearch style={styles.searchContainer}>
                <TextInput
                  value={TextInputValue}
                  onChangeText={(text) => handleSetKeyword(text)}
                  style={{}}
                  placeholder={i18n.translate("patientsSearch")}
                />
              </CommonSearch>
              {loading ? (
                <ActivityIndicator />
              ) : patientsInfo && !searching && patientsInfo.length > 0 ? (
                patientsInfo.map((item, index) => {
                  return (
                    <CardSurface
                      style={[styles.cardTouchableStyle, { height: 70 }]}
                      key={index}
                    >
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate(
                            screenName.ChatViewClinic as any,
                            {
                              item,
                            }
                          )
                        }
                      >
                        <RowView style={{ width: "100%" }}>
                          <View style={[styles.cardStyle, { width: "20%" }]}>
                            <View
                              style={[
                                styles.profileImageStyle,
                                { backgroundColor: colors.facebook },
                              ]}
                            >
                              {/* <Patient1 height={50} width={50} />/ */}
                              <H6fontRegularWhite
                                style={{ letterSpacing: 2, fontSize: 20 }}
                              >
                                {Array.from(item.basicInfoData.firstname)[0]}
                                {Array.from(item.basicInfoData.lastname)[0]}
                              </H6fontRegularWhite>
                            </View>
                          </View>
                          <RowView
                            style={[styles.detailsView, { width: "80%" }]}
                          >
                            <View style={[{ width: "60%" }]}>
                              <H15fontMediumBlack numberOfLines={1}>
                                {item.basicInfoData.firstname}{" "}
                                {item.basicInfoData.lastname}
                              </H15fontMediumBlack>
                              <RowView
                                style={[alignItemsCenter, { width: "100%" }]}
                              >
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
                            </View>
                          </RowView>
                        </RowView>
                      </TouchableOpacity>
                    </CardSurface>
                  );
                })
              ) : searchList.length > 0 ? (
                searchList.map((item, index) => {
                  return (
                    <CardSurface
                      style={[styles.cardTouchableStyle, { height: 70 }]}
                      key={index}
                    >
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate(
                            screenName.ChatViewClinic as any,
                            {
                              item,
                            }
                          )
                        }
                      >
                        <RowView style={{ width: "100%" }}>
                          <View style={[styles.cardStyle, { width: "20%" }]}>
                            <View
                              style={[
                                styles.profileImageStyle,
                                { backgroundColor: colors.facebook },
                              ]}
                            >
                              {/* <Patient1 height={50} width={50} />/ */}
                              <H6fontRegularWhite
                                style={{ letterSpacing: 2, fontSize: 20 }}
                              >
                                {Array.from(item.basicInfoData.firstname)[0]}
                                {Array.from(item.basicInfoData.lastname)[0]}
                              </H6fontRegularWhite>
                            </View>
                          </View>
                          <RowView
                            style={[styles.detailsView, { width: "80%" }]}
                          >
                            <View style={[{ width: "60%" }]}>
                              <H15fontMediumBlack numberOfLines={1}>
                                {item.basicInfoData.firstname}{" "}
                                {item.basicInfoData.lastname}
                              </H15fontMediumBlack>
                              <RowView
                                style={[alignItemsCenter, { width: "100%" }]}
                              >
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
                            </View>
                          </RowView>
                        </RowView>
                      </TouchableOpacity>
                    </CardSurface>
                  );
                })
              ) : (
                <View>
                  <H6fontRegularBlue>
                    {i18n.translate("noPatientsChat")}
                  </H6fontRegularBlue>
                  <H14fontRegularGray>
                    {i18n.translate("noPatientsNeedToBook")}
                  </H14fontRegularGray>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </MainContainer>
    </Fragment>
  );
};
export default ChatListClinic;

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
