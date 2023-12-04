import React, { Fragment, useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Animated,
} from "react-native";
import { GeneralProps } from "../../interfaces/generalProps";
import { Route } from "@react-navigation/native";
import { NavBarPatient } from "../../common/commonComponents";
import { SmallButtonSuccess } from "../../components/commonButton";
import { labels } from "../../utils/labels";
import { colors } from "../../utils/colors";
import Modal from "react-native-modal";
import Icon2 from "react-native-vector-icons/FontAwesome";
import Icon3 from "react-native-vector-icons/AntDesign";
import {
  CardSurface,
  CommonLineDotted,
  CommonLineView,
  MainContainer,
  RowView,
} from "../../components/commonViews";
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
} from "../../components/commonText";
import Icon1 from "react-native-vector-icons/AntDesign";
import { screenName } from "../../utils/screenName";
import { DevWidth } from "../../utils/device";
import { searchMenuOptions } from "../../utils/constant";
import { _testDoctorDetails } from "../../utils/mockDetails";
import DoctorDetailsCard from "../../components/doctorComponents";
import DoctorFilter from "../../components/doctorFilter";
import FilterIcon from "../../assets/images/filter.svg";
import { ml10, pt5 } from "../../common/commonStyles";
import { useDispatch, useSelector } from "react-redux";
import { retrieveClinics } from "../../utils/getFirebaseData";
import CustomLoader from "../../components/customLoader";
import {
  ActivityIndicator,
  DefaultTheme,
  Divider,
  Text,
  TextInput,
} from "react-native-paper";
import { Slider } from "react-native-elements";
import { getClinics } from "../../actions/clinicActions";
import { getPatientClinicsDoctorsAround } from "../../actions/patientActions";
import ClinicDetailsCard from "../../components/ClinicComponents";
import { FontAwesome5 } from "@expo/vector-icons";
import MapModal from "../../components/MapModal";
import { _getLocationAsync } from "../../services/location-service";
import i18n from "../../../i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import { remappedClinics } from "../../utils/RemapClinicsArray";
import { getRating } from "../../utils/ratingCalc";

interface Props extends GeneralProps {
  route: Route<string, object | undefined>;
}
const ClinicHistoryPatient: React.FC<Props> = ({
  navigation,
  route,
}): JSX.Element => {
  const [isModalVisible, setModalVisible] = useState(false);

  const dispatch = useDispatch();

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: colors.facebook, // Set the primary color to the desired color
    },
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [clinicsHistory, setClinicsHistory] = useState([]);
  const [searchedClinics, setSearchedClinics] = useState([]);

  const handleSearch = (query) => {
    setSearchQuery(query);

    // Convert the search query to lowercase for case-insensitive search
    const searchQuery = query.toLowerCase().trim();

    // Filter the clinics array based on the clinicname property
    const searchResults = clinicsHistory.filter((clinic) => {
      const clinicname = clinic.clinicInfoData.clinicname.toLowerCase();
      return clinicname.includes(searchQuery);
    });

    console.log("result ........... //////////// ---------");
    console.log(searchResults);

    setSearchedClinics(searchResults);
  };

  const aroundPatientData = useSelector((state) => state.aroundPatientData);
  const { aroundPatient, loading: loadingAroundPatient } = aroundPatientData;

  const loadClinicHistory = async () => {
    try {
      setIsLoading(true);
      console.log("Start----------------");
      const clinics = [];
      const jsonValue = await AsyncStorage.getItem("guestLoginDetails");

      if (jsonValue !== null) {
        const data = JSON.parse(jsonValue);

        const q = query(
          collectionGroup(db, "clinicsPatientsUnregistered"),
          where("phoneNumber", "==", data.phoneNumberCountry)
        );

        const querySnapshot = await getDocs(q);

        await Promise.all(
          querySnapshot.docs.map(async (docLoop) => {
            let patientUnregistered = docLoop.data();
            let clinic;
            let clinicDoctors = [];

            const docRefClinic = doc(db, "Users", patientUnregistered.clinicId);
            const docSnapClinic = await getDoc(docRefClinic);

            if (docSnapClinic.exists()) {
              clinic = docSnapClinic.data();
            } else {
              console.log("No such clinic document!");
            }

            if (clinic.isClinic) {
              let ratingMedia = getRating(clinic.clinicReviews);

              clinic.ratingMedia = ratingMedia;
              clinic.numberOfReviews = clinic.clinicReviews.length;

              // Query a reference to a subcollection for unregistered appointments
              const clinicAppointmentsUnregistered = [];
              const subcollectionQuerySnapshot = await getDocs(
                collection(db, "Users", patientUnregistered.clinicId, "Doctors")
              );

              for (const subdoc of subcollectionQuerySnapshot.docs) {
                const data = subdoc.data();
                let ratingMedia = getRating(data.doctorReviews);

                data.ratingMedia = ratingMedia;
                data.numberOfReviews = data.doctorReviews.length;

                // Query a reference to a subcollection for unregistered appointments
                const clinicAppointmentsUnregisteredSub = [];
                const subcollectionQuerySnapshotSub = await getDocs(
                  collection(
                    db,
                    "Doctors",
                    subdoc.id,
                    "clinicAppointmentsUnregisteredDocCol"
                  )
                );

                for (const subsubdoc of subcollectionQuerySnapshotSub.docs) {
                  clinicAppointmentsUnregisteredSub.push(subsubdoc.data());
                }

                data.clinicAppointmentsUnregistered = [
                  ...clinicAppointmentsUnregisteredSub,
                ];

                clinicDoctors.push(data);
              }

              clinic.clinicDoctors = clinicDoctors;
              clinics.push(clinic);
            }
          })
        );

        console.log("clinics..............");
        let newClinics = remappedClinics(clinics);
        console.log(newClinics[0].numberOfReviews);
        setClinicsHistory(newClinics);
      }
    } catch (error) {
      console.error("Error loading guest details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadClinicHistory(); // Call the function to populate clinicsHistory
  }, []);

  return (
    <Fragment>
      <MainContainer>
        <NavBarPatient
          title={i18n.translate("ClinicHistoryPatient")}
          isPatient={true}
          isTermsAccepted={true}
        />
        <View
          style={{
            backgroundColor: "white",

            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            height: "auto",
            width: "auto",
            paddingHorizontal: 20,
            paddingTop: 10,
          }}
        >
          <TextInput
            label={i18n.translate("search")}
            value={searchQuery}
            onChangeText={handleSearch}
            style={{ width: "100%" }}
            theme={theme}
          />
        </View>
        {!isLoading && clinicsHistory.length > 0 && searchQuery.length === 0 ? (
          <FlatList
            data={clinicsHistory}
            contentContainerStyle={{
              paddingTop: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
            renderItem={({ item, index }) => {
              return (
                <ClinicDetailsCard
                  page={"home"}
                  details={item}
                  bookAnAppointment={() => {
                    navigation.navigate(screenName.ClinicDoctorsPatient, {
                      clinicDoctors: item.clinicDoctors,
                    });
                  }}
                  clinicProfileNavigation={() => {
                    navigation.navigate(screenName.ClinicProfile, { item });
                    console.log("asdasda");
                  }}
                />
              );
            }}
          />
        ) : searchQuery.length > 0 ? (
          <FlatList
            data={searchedClinics}
            contentContainerStyle={{
              paddingTop: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
            renderItem={({ item, index }) => {
              return (
                <ClinicDetailsCard
                  page={"home"}
                  details={item}
                  bookAnAppointment={() => {
                    navigation.navigate(screenName.ClinicDoctorsPatient, {
                      clinicDoctors: item.clinicDoctors,
                    });
                  }}
                  clinicProfileNavigation={() => {
                    navigation.navigate(screenName.ClinicProfile, { item });
                    console.log("asdasda");
                  }}
                />
              );
            }}
          />
        ) : (
          <CustomLoader
            isLoading={isLoading}
            opacity={0}
            backgroundColor={"transparent"}
          />
        )}
      </MainContainer>
    </Fragment>
  );
};
export default ClinicHistoryPatient;
const styles = StyleSheet.create({
  containerStyle: {
    height: "auto",
    // marginRight: 15,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 15,
    paddingHorizontal: 15,
    width: "75%",
    padding: 10,
    // opacity:0.7
    // padding: 10,
  },
  containerLoader: {
    flex: 1,
    justifyContent: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 10,
    width: "100%",
  },
  datePickerStyle: {
    width: 230,
  },
  sortByImageStyle: {
    height: 100,
    width: 100,
    alignSelf: "flex-end",
    marginRight: 10,
    position: "absolute",
    bottom: 0,
  },
});
