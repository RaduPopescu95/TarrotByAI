import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import "moment-timezone";
import moment from "moment";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Button,
  TextInput,
  List,
  Avatar,
  IconButton,
  Provider,
  Portal,
  Dialog,
  RadioButton,
  DefaultTheme,
  Divider,
  Card,
} from "react-native-paper";
import { NavBarPatient } from "../../common/commonComponents";
import i18n, { getTimeZoneFromPhoneSettings } from "../../../i18n";
import {
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { colors } from "../../utils/colors";
import { Image } from "react-native";
import { Icon } from "react-native-elements";
import { makePhoneCall } from "../../utils/makePhoneCall";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { createNotification } from "../../utils/Notification/createNotificationGuest";
import { GuestCardApp } from "../../components/GuestCardApp";
import { Calendar } from "react-native-calendars";
import { useAppSelector } from "../../hooks/hooks";
import { createTimeFormat } from "../../utils/convertTime24Hours";
import { useHourClockContext } from "../../context/HourClockContext";
import { getNextAppointment } from "../../utils/getNextAppointment";
import { GuestCardNextApp } from "../../components/GuestCardNextApp";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.facebook, // Set the primary color to the desired color
  },
};

const GuestAppointments = () => {
  const [guestDetails, setGuestDetails] = useState({ myAppointments: [] });
  const [guestAppointments, setGuestAppointments] = useState([]);
  const [nextAppointmentGuest, setNextAppointmentGuest] = useState(null);
  const [originalApp, setOriginalApp] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrderDate, setSortOrderDate] = useState("asc");
  const [sortOrderDoctor, setSortOrderDoctor] = useState("asc");
  const [modalVisible, setModalVisible] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [modalVisibleCalendar, setModalVisibleCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const hourClock = useHourClockContext();

  const handleDateSelect = (date) => {
    console.log("day....");
    console.log(date);
    // console.log(date.dateString)
    setModalVisibleCalendar(true);
    setSelectedDate(moment(date, "DD-MM-YYYY").format("YYYY-MM-DD"));
    // setSelectedDate(date);
  };

  const loadGuestDetails = async () => {
    try {
      setIsLoading(true);
      console.log("Start----------------");
      const appointments = [];
      const jsonValue = await AsyncStorage.getItem("guestLoginDetails");
      if (jsonValue !== null) {
        const data = JSON.parse(jsonValue);
        console.log(data.phoneNumberCountry);

        const q = query(
          collectionGroup(db, "clinicAppointmentsUnregisteredDocCol"),
          where("phoneNumber", "==", data.phoneNumberCountry)
        );
        const querySnapshot = await getDocs(q);

        await Promise.all(
          querySnapshot.docs.map(async (docLoop) => {
            let appointment = docLoop.data();

            const docRef = doc(db, "Doctors", appointment.doctorId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
              console.log("Doctor Document data:", docSnap.data());
              appointment.doctorData = docSnap.data();
            } else {
              console.log("No such doctor document!");
            }

            const docRefClinic = doc(db, "Users", appointment.clinicId);
            const docSnapClinic = await getDoc(docRefClinic);

            if (docSnapClinic.exists()) {
              console.log("Clinic Document data:", docSnapClinic.data());
              appointment.clinicData = docSnapClinic.data();
            } else {
              console.log("No such clinic document!");
            }

            // console.log(docLoop.id, " ==========> ", appointment.doctorData);
            appointments.push(appointment);
          })
        );

        setGuestDetails(data);

        const originalApp = handleFinalFilterSort(appointments);
        setGuestAppointments(originalApp);
        let nextAppointment = getNextAppointment(originalApp);
        console.log("NEXT appointment....test");
        console.log(nextAppointment);
        setNextAppointmentGuest(nextAppointment);
        console.log("appointments....test");
        console.log(originalApp[0]);

        console.log("sss");
        // console.log(originalApp[0].daySelected)

        // Loop through each appointment to create notification expo
        originalApp.forEach((appointment) => {
          // console.log(appointment.timeSelected.starttime)
          if (appointment.isApproved) {
            console.log("is approved...creating an appointmnet...");
            createNotification(appointment);
          }
        });

        setOriginalApp(originalApp);
      }
    } catch (error) {
      console.error("Error loading guest details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalFilterSort = (appointments) => {
    const filteredAppointments = filterAppointments(appointments);
    const sortedAppointments = sortAppointments(filteredAppointments);
    console.log("Final sorted appointments:");
    console.log(sortedAppointments);

    return sortedAppointments;
  };

  useEffect(() => {
    loadGuestDetails();

    console.log("test....---------------------------------------------------");
    console.log(hourClock);

    // Call the function to clear all scheduled notifications
    // clearAllScheduledNotifications();

    // console.log(sortOrderDate)
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    filterAppointments(originalApp, query);
  };

  const handleSortBy = (sortByValue) => {
    setSortBy(sortByValue);
    setModalVisible(false);
    handleSortOrder();
  };

  const handleCallClinic = (item) => {
    makePhoneCall(item.clinicData.phoneNumber);
    // console.log(guestAppointments[0].clinicData.phoneNumber)
  };

  const handleSortOrder = () => {
    if (sortBy === "date") {
      console.log("date....");
      setSortOrderDate(sortOrderDate === "asc" ? "desc" : "asc");
    } else if (sortBy === "doctorName") {
      console.log("doctorName....");
      console.log(sortOrderDoctor);
      console.log("doctorName....");

      setSortOrderDoctor(sortOrderDoctor === "asc" ? "desc" : "asc");
    }

    let sortedApp = sortAppointments(originalApp);
    setGuestAppointments(sortedApp);
  };

  const filterAppointments = (appointments, query?) => {
    if (query) {
      const query = searchQuery.toLowerCase();
      appointments = appointments.filter(
        (appointment) =>
          appointment.doctorData.doctorInfoData.firstname
            .toLowerCase()
            .includes(query) ||
          appointment.clinicData.clinicInfoData.clinicname
            .toLowerCase()
            .includes(query)
      );
      setGuestAppointments(appointments);
    } else {
      setGuestAppointments(originalApp);
    }
    return appointments;
  };

  const sortAppointments = (appointments) => {
    if (sortBy === "date") {
      return appointments.sort((a, b) => {
        const dateA = new Date(
          (a.daySelected || "").split("-").reverse().join("-")
        );
        const dateB = new Date(
          (b.daySelected || "").split("-").reverse().join("-")
        );
        const sortOrderMultiplier = sortOrderDate === "asc" ? 1 : -1;
        return sortOrderMultiplier * (dateA - dateB);
      });
    } else if (sortBy === "doctorName") {
      console.log("Second...");
      return appointments.sort((a, b) => {
        const sortOrderMultiplier = sortOrderDoctor === "asc" ? 1 : -1;
        return (
          sortOrderMultiplier *
          a.doctorData.doctorInfoData.firstname.localeCompare(
            b.doctorData.doctorInfoData.firstname
          )
        );
      });
    }
    return appointments;
  };

  const openModal = (appointment) => {
    setSelectedAppointment(appointment);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedAppointment(null);
    setModalVisible(false);
  };

  const renderNextAppointmentItem = () => {
    try {
      let appointmentInterval;
      if (nextAppointmentGuest.timeSelected.starttime) {
        appointmentInterval = `${createTimeFormat(
          nextAppointmentGuest.timeSelected.starttime,
          hourClock
        )} - ${createTimeFormat(
          nextAppointmentGuest.timeSelected.endtime,
          hourClock
        )}`;
      }
      console.log("nextAppointmentGuest....");
      console.log(nextAppointmentGuest.timeSelected);

      // <Text>asdas</Text>
      if (nextAppointmentGuest.doctorData) {
        return (
          <>
            <GuestCardNextApp
              info={{
                doctorName: `${nextAppointmentGuest.doctorData.doctorInfoData.firstname} ${nextAppointmentGuest.doctorData.doctorInfoData.lastname}`,
                daySelected: nextAppointmentGuest.daySelected,
                appointmentInterval,
                clinicAddress:
                  nextAppointmentGuest.clinicData.clinicAddressLocation
                    .clinicAddress,
                clinicName:
                  nextAppointmentGuest.clinicData.clinicInfoData.clinicname,
                isApproved: nextAppointmentGuest.isApproved,
                phoneNumber: nextAppointmentGuest.clinicData.phoneNumber,
                clinicCoords:
                  nextAppointmentGuest.clinicData.clinicAddressLocation
                    .clinicCoords,
              }}
              handleDateSelect={(daySelected) => handleDateSelect(daySelected)}
              imgUri={nextAppointmentGuest.doctorData.doctorImgURI}
            />
          </>
        );
      } else {
        return null;
      }
    } catch (err) {
      console.log("Error at renderNextAppointment guest...", err);
    }
  };

  const renderAppointmentItem = ({ item }) => {
    const appointmentInterval = `${createTimeFormat(
      item.timeSelected.starttime,
      hourClock
    )} - ${createTimeFormat(item.timeSelected.endtime, hourClock)}`;

    console.log("item....");
    console.log(item.doctorData);

    // <Text>asdas</Text>
    if (item.doctorData) {
      return (
        <>
          <GuestCardApp
            info={{
              doctorName: `${item.doctorData.doctorInfoData.firstname} ${item.doctorData.doctorInfoData.lastname}`,
              daySelected: item.daySelected,
              appointmentInterval,
              clinicAddress:
                item.clinicData.clinicAddressLocation.clinicAddress,
              clinicName: item.clinicData.clinicInfoData.clinicname,
              isApproved: item.isApproved,
              phoneNumber: item.clinicData.phoneNumber,
              clinicCoords: item.clinicData.clinicAddressLocation.clinicCoords,
            }}
            handleDateSelect={(daySelected) => handleDateSelect(daySelected)}
            imgUri={item.doctorData.doctorImgURI}
          />
        </>
      );
    } else {
      return null;
    }
  };

  return (
    <Provider>
      <>
        <NavBarPatient
          title={i18n.translate("findDocAndClinics")}
          isPatient={true}
          isTermsAccepted={true}
          navHeight={"10%"}
          // userTitle={patientInformation && patientInformation.basicInfoData && `${patientInformation.basicInfoData.firstname} ${patientInformation.basicInfoData.lastname}`}
        />
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="blue" />
          </View>
        ) : (
          <View style={{ flex: 1, padding: 0 }}>
            {renderNextAppointmentItem()}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                // marginBottom: 10,
              }}
            >
              <View style={{ padding: 10, width: "80%", height: 80 }}>
                <TextInput
                  label="Search..."
                  value={searchQuery}
                  onChangeText={handleSearch}
                  style={{ flex: 1 }}
                  theme={theme}
                />
              </View>
              <IconButton
                icon="sort"
                color={colors.facebook}
                size={20}
                onPress={() => setSortModalVisible(true)}
              />
              {sortBy.length > 0 && (
                <IconButton
                  icon={
                    sortBy === "doctorName"
                      ? sortOrderDoctor === "asc"
                        ? "arrow-down"
                        : "arrow-up"
                      : sortOrderDate === "asc"
                      ? "arrow-down"
                      : "arrow-up"
                  }
                  color={colors.facebook}
                  size={20}
                  onPress={handleSortOrder}
                />
              )}
            </View>

            <FlatList
              data={guestAppointments}
              renderItem={renderAppointmentItem}
              keyExtractor={(item, index) => index.toString()}
            />

            <Portal>
              <Modal
                visible={sortModalVisible}
                onRequestClose={() => setSortModalVisible(false)}
                transparent
              >
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>
                      {i18n.translate("sortBy")}
                    </Text>
                    <RadioButton.Group
                      onValueChange={handleSortBy}
                      value={sortBy}
                    >
                      <RadioButton.Item
                        label={i18n.translate("date")}
                        value="date"
                      />
                      <RadioButton.Item
                        label={i18n.translate("doctorName")}
                        value="doctorName"
                      />
                    </RadioButton.Group>
                    <Button
                      mode="contained"
                      onPress={() => setSortModalVisible(false)}
                      style={styles.modalButton}
                      theme={theme}
                    >
                      {i18n.translate("cancel")}
                    </Button>
                  </View>
                </View>
              </Modal>
            </Portal>
            <Portal>
              <Modal
                visible={modalVisibleCalendar}
                animationType="slide"
                transparent={true}
              >
                <View
                  style={{
                    justifyContent: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    flex: 1,
                  }}
                >
                  <Card style={{ margin: 10 }}>
                    <TouchableOpacity
                      onPress={() => setModalVisibleCalendar(false)}
                    >
                      <View style={styles.cardGroupIcon}>
                        <AntDesign
                          name="close"
                          size={32}
                          color={colors.facebook}
                        />
                      </View>
                    </TouchableOpacity>
                    <View style={{ margin: 10 }}>
                      <Calendar
                        markedDates={
                          selectedDate
                            ? { [selectedDate]: { selected: true } }
                            : {}
                        }
                      />
                    </View>
                  </Card>
                </View>
              </Modal>
            </Portal>
          </View>
        )}
      </>
    </Provider>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardGroupIcon: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    margin: 10,
  },
  approvedIcon: {
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalButtonIcon: {
    // marginRight: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",

    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 8,
    marginLeft: 10,
  },
  modalButton: {
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "200",
    color: "#333333",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#777777",
  },
  modalDoctorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  modalDoctorImage: {
    marginRight: 10,
  },
  modalDoctorInfo: {
    flex: 1,
  },
});

export default GuestAppointments;
