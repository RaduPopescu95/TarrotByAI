import React, { useEffect, useState } from "react";
import { View, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { CommonButton, RowView } from "../components/commonViews";
import {
  H15fontMediumBlack,
  H9fontRegularGray,
  H8fontMediumLightBlack,
  H8fontMediumBlack,
  H9fontMediumLightBlack,
  H6fontRegularBlack,
  H14fontMediumBlack,
  H14fontRegularWhite,
} from "../components/commonText";
import { Fontisto } from "@expo/vector-icons";
import {
  alignItemsCenter,
  flexRow,
  justyfyCenter,
  pb10,
  pb5,
  pl5,
  pv10,
  spaceBetween,
} from "../common/commonStyles";

import { colors } from "../utils/colors";

// import Icon from 'react-native-vector-icons/FontAwesome';
import { NavBar, NavBarPatient } from "../common/commonComponents";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import {
  uploadAppointmentDataToClinic,
  uploadAppointmentDataToPatient,
  uploadApprovedAppointment,
  uploadApprovedUnregisteredAppointment,
} from "../utils/UploadFirebaseData";
import { screenName } from "../utils/screenName";
import {
  getClinicAppointments,
  getClinicApprovedAppointments,
} from "../actions/clinicActions";
import { ActivityIndicator, Snackbar, Text } from "react-native-paper";
import { labels } from "../utils/labels";
import i18n from "../../i18n";
import { useAppSelector } from "../hooks/hooks";
import {
  initiateSMSAppointmentCancelNotification,
  initiateSMSAppointmentConfirmedNotification,
} from "../utils/initiateSms";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableWithoutFeedback } from "react-native";
import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { authentication, db } from "../../firebase";
import {
  convertTimeTo12Hours,
  createTimeFormat,
  hourClock,
} from "../utils/convertTime24Hours";
import { useHourClockContext } from "../context/HourClockContext";
import useRevenueCat from "../hooks/useRevenueCat";

interface Props {
  onpress: CallableFunction;
}

const CheckAppointmentClinic: React.FC<Props> = ({ onpress }): JSX.Element => {
  const { currentOffering, customerInfo, isProMember } = useRevenueCat();
  const route = useRoute();
  const appointmentInfo = route.params;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const auth = authentication;
  const hourClock = useHourClockContext();
  const [showSnackBar, setShowSnackback] = useState(false);

  const clinicApprovedApp = useAppSelector(
    (state) => state.clinicApprovedAppointments
  );
  const { clinicApprovedAppointments, loading: loadingApprovedAppointments } =
    clinicApprovedApp;

  const cAppointments = useAppSelector((state) => state.clinicAppointments);
  const { clinicAppointments, loading } = cAppointments;

  const handleTimeOut = (patientData) => {
    setTimeout(() => {
      setIsLoading(false);
      if (appointmentInfo.item.isApproved) {
        navigation.navigate(screenName.BookingCanceledClinic, { patientData });
      } else
        navigation.navigate(screenName.BookingSuccessClinic, { patientData });
    }, 1400);
  };

  const toggleApprovedAppointment = (patientData) => {
    let approvedDays = [];
    // console.log(patientData.item.owner_uid)
    setIsLoading(true);
    console.log("------------toggleApprovedAppointment-------------");

    for (
      let i = 0;
      i < clinicApprovedAppointments.approvedClinicAppointments.length;
      i++
    ) {
      approvedDays.push({
        daySelected:
          clinicApprovedAppointments.approvedClinicAppointments[i].daySelected,
        timeSelected:
          clinicApprovedAppointments.approvedClinicAppointments[i].timeSelected,
        appointmentId:
          clinicApprovedAppointments.approvedClinicAppointments[i]
            .appointmentId,
      });
    }

    if (patientData.item.patientId) {
      for (let i = 0; i < approvedDays.length; i++) {
        if (
          patientData.item.daySelected === approvedDays[i].daySelected &&
          patientData.item.appointmentId != approvedDays[i].appointmentId
        ) {
          console.log("APPOINTMENT IS IN DAY");
          if (
            patientData.item.timeSelected.starttime ===
              approvedDays[i].timeSelected.starttime &&
            patientData.item.timeSelected.endtime ===
              approvedDays[i].timeSelected.endtime
          ) {
            setIsLoading(false);
            Alert.alert(
              i18n.translate("haveAnAppointmentApprovedWithDateAndTime"),
              i18n.translate("haveAnAppointmentApprovedWithDateAndTimeMessage"),
              [{ text: "OK", onPress: () => console.log("OK Pressed") }]
            );
            console.log("APPOINTMENT IS IN DAY AND IN TIME ");
            return;
          }
        }
      }
      console.log("APPOINTMENT --NOT-- IN DAY AND IN TIME ");

      // uploadApprovedAppointment(patientData.item, true).then(() => {
      //   setIsLoading(false);
      //   // if (appointmentInfo.item.isApproved) {
      //   //   navigation.navigate(screenName.BookingCanceledClinic, {
      //   //     patientData,
      //   //   });
      //   // } else
      //   //   navigation.navigate(screenName.BookingSuccessClinic, { patientData });
      // });
    } else if (patientData.item.isUnregistered) {
      console.log("phone here");
      console.log(patientData.item.patientInfo.phoneNumber);

      for (let i = 0; i < approvedDays.length; i++) {
        if (
          patientData.item.daySelected === approvedDays[i].daySelected &&
          patientData.item.appointmentId != approvedDays[i].appointmentId
        ) {
          console.log("APPOINTMENT IS IN DAY");
          if (
            patientData.item.timeSelected.starttime ===
              approvedDays[i].timeSelected.starttime &&
            patientData.item.timeSelected.endtime ===
              approvedDays[i].timeSelected.endtime
          ) {
            setIsLoading(false);
            Alert.alert(
              i18n.translate("haveAnAppointmentApprovedWithDateAndTime"),
              i18n.translate("haveAnAppointmentApprovedWithDateAndTimeMessage"),
              [{ text: "OK", onPress: () => console.log("OK Pressed") }]
            );
            console.log("APPOINTMENT IS IN DAY AND IN TIME ");

            return;
          }
        }
      }
      console.log("APPOINTMENT --NOT-- IN DAY AND IN TIME ");

      uploadApprovedUnregisteredAppointment(patientData.item).then(() => {
        setIsLoading(false);
        if (appointmentInfo.item.isApproved) {
          Alert.alert(i18n.translate("appointmentCancelNotification"), "", [
            {
              text: i18n.translate("cancel"),
              onPress: () => {
                console.log("Cancel Pressed");

                dispatch(getClinicAppointments()).then(() => {
                  dispatch(getClinicApprovedAppointments()).then(() => {
                    if (appointmentInfo.item.isApproved) {
                      navigation.navigate(screenName.BookingCanceledClinic, {
                        patientData,
                      });
                    } else
                      navigation.navigate(screenName.BookingSuccessClinic, {
                        patientData,
                      });
                  });
                });
              },

              style: "cancel",
            },
            {
              text: i18n.translate("sendReminder"),
              onPress: () => {
                initiateSMSAppointmentCancelNotification(
                  patientData.item.daySelected,
                  patientData.item.timeSelected.starttime,
                  patientData.item.timeSelected.endtime,
                  patientData.item.patientInfo.phoneNumber,
                  patientData.item.doctorInfo.doctorInfoData.firstname,
                  patientData.item.doctorInfo.doctorInfoData.lastname
                ).then(() => {
                  dispatch(getClinicAppointments()).then(() => {
                    dispatch(getClinicApprovedAppointments()).then(() => {
                      if (appointmentInfo.item.isApproved) {
                        navigation.navigate(screenName.BookingCanceledClinic, {
                          patientData,
                        });
                      } else
                        navigation.navigate(screenName.BookingSuccessClinic, {
                          patientData,
                        });
                    });
                  });
                });

                console.log("OK Pressed");
              },
            },
          ]);
        } else {
          dispatch(getClinicAppointments()).then(() => {
            dispatch(getClinicApprovedAppointments()).then(() => {
              Alert.alert(
                i18n.translate("appointmentApprovalNotification"),
                "",
                [
                  {
                    text: i18n.translate("cancel"),
                    onPress: () => {
                      if (appointmentInfo.item.isApproved) {
                        navigation.navigate(screenName.BookingCanceledClinic, {
                          patientData,
                        });
                      } else
                        navigation.navigate(screenName.BookingSuccessClinic, {
                          patientData,
                        });
                    },
                    style: "cancel",
                  },
                  {
                    text: i18n.translate("sendReminder"),
                    onPress: () => {
                      initiateSMSAppointmentConfirmedNotification(
                        patientData.item.daySelected,
                        patientData.item.timeSelected.starttime,
                        patientData.item.timeSelected.endtime,
                        patientData.item.patientInfo.phoneNumber,
                        patientData.item.doctorInfo.doctorInfoData.firstname,
                        patientData.item.doctorInfo.doctorInfoData.lastname
                      ).then(() => {
                        if (appointmentInfo.item.isApproved) {
                          navigation.navigate(
                            screenName.BookingCanceledClinic,
                            {
                              patientData,
                            }
                          );
                        } else
                          navigation.navigate(screenName.BookingSuccessClinic, {
                            patientData,
                          });
                      });

                      console.log("OK Pressed");
                    },
                  },
                ]
              );
            });
          });

          console.log("Adas---------------------------");
        }
      });
    } else {
      for (let i = 0; i < approvedDays.length; i++) {
        if (
          patientData.item.daySelected === approvedDays[i].daySelected &&
          patientData.item.appointmentId != approvedDays[i].appointmentId
        ) {
          console.log("APPOINTMENT IS IN DAY");
          if (
            patientData.item.timeSelected.starttime ===
              approvedDays[i].timeSelected.starttime &&
            patientData.item.timeSelected.endtime ===
              approvedDays[i].timeSelected.endtime
          ) {
            setIsLoading(false);
            Alert.alert(
              i18n.translate("haveAnAppointmentApprovedWithDateAndTime"),
              i18n.translate("haveAnAppointmentApprovedWithDateAndTimeMessage"),
              [{ text: "OK", onPress: () => console.log("OK Pressed") }]
            );
            console.log("APPOINTMENT IS IN DAY AND IN TIME ");
            return;
          }
        }
      }
      console.log("APPOINTMENT --NOT-- IN DAY AND IN TIME ");

      // uploadApprovedAppointment(patientData.item, false).then(() => {
      //   setIsLoading(false);
      //   // if (appointmentInfo.item.isApproved) {
      //   //   navigation.navigate(screenName.BookingCanceledClinic, {
      //   //     patientData,
      //   //   });
      //   // } else
      //   //   navigation.navigate(screenName.BookingSuccessClinic, { patientData });
      // });
    }
  };

  useEffect(() => {
    // setIsLoading(false);
    console.log("Check appointment for CLINIC....", appointmentInfo);
  }, []);

  const otherDetailsRow = (label: string, value: any) => {
    return (
      <RowView style={pb5}>
        <H8fontMediumLightBlack>{label}</H8fontMediumLightBlack>
        <H9fontRegularGray>{value}</H9fontRegularGray>
      </RowView>
    );
  };

  const handleDeleteAppointment = async (appointmentInfo) => {
    setIsLoading(true);
    try {
      console.log("-------------------------------------=========");
      console.log(appointmentInfo.item.isUnregistered);
      let appointmentId = appointmentInfo.item.appointmentId.toString();
      if (appointmentInfo.item.isUnregistered) {
        await deleteDoc(
          doc(
            db,
            "Users",
            auth.currentUser.uid,
            "Doctors",
            appointmentInfo.item.doctorId,
            "clinicAppointmentsUnregistered",
            appointmentId
          )
        );
        await deleteDoc(
          doc(
            db,
            "Doctors",
            appointmentInfo.item.doctorId,
            "clinicAppointmentsUnregisteredDocCol",
            appointmentId
          )
        );
      } else {
        await deleteDoc(
          doc(
            db,
            "Users",
            auth.currentUser.uid,
            "Doctors",
            appointmentInfo.item.doctorId,
            "clinicAppointments"
          )
        );
        await deleteDoc(
          doc(
            db,
            "Doctors",
            appointmentInfo.item.doctorId,
            "clinicAppointments",
            appointmentId
          )
        );
      }

      dispatch(getClinicAppointments())
        .then(() => {
          dispatch(getClinicApprovedAppointments());
        })
        .then(() => {
          setIsLoading(false);
          setShowSnackback(true);
        });
    } catch (err) {
      console.log("error..on delete app....", err);
    }
  };

  // return(
  //   <View>
  //     <Text>
  //       asdasd
  //     </Text>
  //   </View>
  // )

  return (
    <>
      <NavBar
        isGoBack={true}
        isdelete={true}
        navHeight={80}
        handleDeleteAppointment={() => {
          Alert.alert(
            i18n.translate("deleteAppointmentMsg1"),
            i18n.translate("deleteAppointmentMsg2"),
            [
              {
                text: i18n.translate("cancel"),
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
              },
              {
                text: i18n.translate("deleteAppointment"),
                onPress: () => {
                  handleDeleteAppointment(appointmentInfo).then(() => {
                    // toggleApprovedAppointment(appointmentInfo);
                  });
                },
              },
            ]
          );
        }}
      />
      <View style={styles.container}>
        <View
          style={{
            marginBottom: 10,
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <H6fontRegularBlack>
              {i18n.translate("bookingSummary")}
            </H6fontRegularBlack>
          </View>
        </View>
        <TouchableOpacity onPress={() => onpress} style={styles.drSelection}>
          <View style={styles.drImageStyle}>
            {appointmentInfo.item.patientInfo.patientImg ? (
              <Image
                source={{ uri: appointmentInfo.item.patientInfo.patientImg }}
                style={{ height: "100%", width: "100%" }}
              />
            ) : (
              <Image
                style={{ height: "100%", width: "100%" }}
                source={require("../images/clients.png")}
              />
            )}
          </View>
          <View style={styles.drDetailsStyle}>
            <View style={[pl5, spaceBetween]}>
              <H15fontMediumBlack numberOfLines={2}>
                {appointmentInfo.item.patientInfo.basicInfoData.firstName}{" "}
                {appointmentInfo.item.patientInfo.basicInfoData.lastName}
              </H15fontMediumBlack>
              <H15fontMediumBlack numberOfLines={2}>
                {appointmentInfo.item.patientInfo.basicInfoData.gender}
              </H15fontMediumBlack>
              {/* <View style={[flexRow, alignItemsCenter]}>
              {startImage()}
              {startImage()}
              {startImage()}
              {startImage()}
              {startImage()}
              <H9fontMediumLightBlack>{'(47)'}</H9fontMediumLightBlack>
            </View> */}
              {appointmentInfo.item.doctorInfo && (
                <View style={[flexRow, alignItemsCenter]}>
                  {/* <H8fontMediumLightBlack>{'('}</H8fontMediumLightBlack> */}
                  {/* <Icon name="map-marker" size={14} color={'black'} /> */}
                  <H8fontMediumLightBlack numberOfLines={2}>
                    {i18n.translate("doctor")}
                    {": "}
                    {
                      appointmentInfo.item.doctorInfo.doctorInfoData.firstname
                    }{" "}
                    {appointmentInfo.item.doctorInfo.doctorInfoData.lastname}
                  </H8fontMediumLightBlack>
                </View>
              )}
              {/* <View style={[flexRow, alignItemsCenter]}>
            
                <H8fontMediumLightBlack numberOfLines={2}>
                  {appointmentInfo.item.patientInfo.basicInfoData.town}
                  {', '}
                  {appointmentInfo.item.patientInfo.basicInfoData.country}
                </H8fontMediumLightBlack>
              </View> */}
            </View>
            {/* <View style={styles.typeofDrImageContainer}>
              <Specialities5 height={12} width={12} />
            </View> */}
          </View>
        </TouchableOpacity>

        <View style={styles.cardContainerStyles}>
          {otherDetailsRow(
            i18n.translate("date"),
            appointmentInfo.item.daySelected
          )}
          {otherDetailsRow(
            i18n.translate("startTime"),
            createTimeFormat(
              appointmentInfo.item.timeSelected.starttime,
              hourClock
            )
          )}
          {otherDetailsRow(
            i18n.translate("endTime"),
            createTimeFormat(
              appointmentInfo.item.timeSelected.endtime,
              hourClock
            )
          )}
          {/* {otherDetailsRow('Consulting', 'Fee$100')} */}
          {/* {otherDetailsRow('Slot Timing Fees', '$10')} */}
        </View>
        {/* 
        <View style={styles.cardContainerStyles}>
          {otherDetailsRow('Date', '16 Nov 2019')}
          {otherDetailsRow('Consulting', 'Fee$100')}
          {otherDetailsRow('Slot Timing Fees', '$10')}
        </View> */}

        <TouchableOpacity
          style={styles.nextButtonStyle}
          onPress={() => toggleApprovedAppointment(appointmentInfo)}
          title="Submit"
        >
          {appointmentInfo.item.isApproved ? (
            <H14fontRegularWhite>
              {i18n.translate("cancelAppointment")}
            </H14fontRegularWhite>
          ) : (
            <H14fontRegularWhite>
              {i18n.translate("confirmAppointment")}
            </H14fontRegularWhite>
          )}
        </TouchableOpacity>
        {isLoading || loading ? <ActivityIndicator /> : null}
      </View>
      <View
        style={{
          position: "absolute",
          width: 300,
          height: 100,
          bottom: "0%",
          left: "10%",
        }}
      >
        <Snackbar
          visible={showSnackBar}
          onDismiss={() => setShowSnackback(false)}
          action={{
            label: "OK",
            onPress: () => {
              // Do something
              setShowSnackback(false);
              navigation.navigate(screenName.ClinicDashBoard);
            },
          }}
          // duration={2000}
        >
          {i18n.translate("appointmentDeleted")}
        </Snackbar>
      </View>
    </>
  );
};

export default CheckAppointmentClinic;

const styles = StyleSheet.create({
  nextButtonStyle: {
    height: 45,
    backgroundColor: colors.primary2,
    marginVertical: 15,
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  container: {
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  drSelection: {
    height: "auto",
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
    flexDirection: "row",
  },
  drImageStyle: {
    height: 80,
    width: 80,
    borderRadius: 40,
    borderWidth: 5,
    borderColor: "#f7f7f7",
    overflow: "hidden",
  },
  drDetailsStyle: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  starImageStyle: { height: 12, width: 12 },
  typeofDrImageContainer: {
    height: 24,
    width: 24,
    borderRadius: 14,
    elevation: 3,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  typeofDrImageStyle: {
    height: 12,
    width: 12,
  },
  cardContainerStyles: {
    backgroundColor: colors.white,
    //   height: 145,
    borderRadius: 10,
    elevation: 3,
    padding: 12,
    justifyContent: "space-between",
    marginTop: 10,
  },
});
