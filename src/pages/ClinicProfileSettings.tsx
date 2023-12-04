import React, { Fragment, useState, useEffect } from "react";
import { Alert, ScrollView, View } from "react-native";
import { GeneralProps } from "../interfaces/generalProps";
import { Route, useIsFocused, useRoute } from "@react-navigation/native";
import { NavBar, NavBarPatient } from "../common/commonComponents";
import { MainContainer } from "../components/commonViews";
import { SegmentControl } from "../components/segmentControl";
import BasicInfo from "./profileSettings/basicInfo";
import AboutMe from "./profileSettings/aboutMe";
import ClinicInfo from "./profileSettings/clinicInfo";
import ContactDetails from "./profileSettings/contactDetails";
import Pricing from "./profileSettings/pricing";
import Education from "./profileSettings/education";
import Awards from "./profileSettings/awards";
import Registrations from "./profileSettings/registraction";
import {
  clinicprofilesegments,
  data,
  profilesegments,
} from "../utils/constant";
import { colors } from "../utils/colors";
import { retrieveClinicData } from "../utils/getFirebaseData";
import * as Location from "expo-location";
import Permissions from "expo-permissions";

import * as Yup from "yup";
import { uploadClinicProfile } from "../utils/UploadFirebaseData";
import { screenName } from "../utils/screenName";
import { useDispatch, useSelector } from "react-redux";
import { getClinicInfo } from "../actions/clinicActions";
import { ref, uploadBytes } from "firebase/storage";
import { authentication, db, storage } from "../../firebase";
import CustomLoader from "../components/customLoader";
import { uploadImage } from "../utils/uploadFirebaseStorage";
import { labels } from "../utils/labels";
import { doc, updateDoc } from "firebase/firestore";
import i18n from "../../i18n";

interface Props extends GeneralProps {
  route: Route<string, object | undefined>;
}
const ClinicProfileSettings: React.FC<Props> = ({
  navigation,
  route,
}): JSX.Element => {
  const clinicInfoDB = useSelector((state) => state.clinicInfoData);
  const { clinicInformation } = clinicInfoDB;
  const [selectedTab, setSelectedTab] = useState<
    | "Basic Info"
    | "About Clinic"
    | "Clinic Info"
    | "Contact Details"
    | "Pricing & Services"
    | "Education & Experience"
    | "Awards & Memberships"
    | "Registrations"
  >(i18n.translate("clinicInfo"));
  const [dataInfo, setDataInfo] = useState<any>({});
  const [basicInfoData, setBasicInfoData] = useState<any>(
    clinicInformation &&
      (clinicInformation.basicInfoData ? clinicInformation.basicInfoData : {})
  );
  const [aboutClinicData, setAboutClinicData] = useState<any>(
    clinicInformation &&
      (clinicInformation.aboutClinicData
        ? clinicInformation.aboutClinicData
        : {})
  );
  const [clinicInfoData, setClinicInfoData] = useState<any>(
    clinicInformation &&
      (clinicInformation.clinicInfoData
        ? {
            ...clinicInformation.clinicInfoData,
            ...clinicInformation.clinicAddressLocation,
          }
        : {})
  );
  const [contactData, setContactData] = useState<any>(
    clinicInformation &&
      (clinicInformation.contactData ? clinicInformation.contactData : {})
  );
  const [newTab, setNewTab] = useState("");
  const [clinicCoords, setClinicCoords] = useState(
    clinicInformation &&
      (clinicInformation.clinicAddressLocation
        ? clinicInformation.clinicAddressLocation.clinicCoords
        : {})
  );
  const [clinicImages, setClinicImages] = useState(
    clinicInformation &&
      (clinicInformation.clinicImages ? clinicInformation.clinicImages : [])
  );
  const [clinicCity, setClinicCity] = useState(
    clinicInformation &&
      (clinicInformation.clinicCity ? clinicInformation.clinicCity : "")
  );
  const [clinicAddress, setClinicAddress] = useState(
    clinicInformation &&
      (clinicInformation.clinicAddressLocation
        ? clinicInformation.clinicAddressLocation.clinicAddress
        : "")
  );
  const [uploadVisible, setUploadVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [noCoordsSelected, setNoCoordsSelected] = useState(false);

  let fileNamesArray = [];

  const auth = authentication;
  const params = route.params;
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const handleGetData = async () => {
    try {
      const response = await retrieveClinicData();
      console.log("response....", response);
      setDataInfo(response);
      return response;
    } catch (error) {
      console.log("Error retrieving clinic data:", error);
      // Handle the error accordingly (e.g., show an error message, fallback data, etc.)
    }
  };

  //ADD IMAGES TO STORAGE AND DATA TO FIRESTORE
  const handleAddSubmit = async (info) => {
    try {
      if (!clinicCoords.lat) {
        Alert.alert(
          i18n.translate("noClinicCoords"),
          i18n.translate("noClinicCoordsMessage"),
          [
            {
              text: i18n.translate("cancel"),
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            {
              text: i18n.translate("addClinicCoords"),
              onPress: () => {
                setNoCoordsSelected(true);
                setSelectedTab("Clinic Info");
              },
            },
          ]
        );
        return;
      }

      if (info.firstname) {
        setBasicInfoData(info);
        let tab = i18n.translate("aboutClinic");
        setSelectedTab(tab);
      } else if (info.biography) {
        setAboutClinicData(info);
        let tab = i18n.translate("contactDetails");
        setSelectedTab(tab);
      } else if (info.clinicname) {
        setClinicInfoData(info);
        let tab = i18n.translate("aboutClinic");
        setSelectedTab(tab);
      } else if (info.addressone) {
        setLoading(true);
        setContactData(info);

        let clinicAddressLocation = { clinicCoords, clinicAddress };
        let clinicImag = [];
        let clinicImagesURI = [];

        if (clinicInformation && clinicInformation.oldClinicImages.length > 0) {
          let clinicImg = {};
          clinicImg = await uploadImage(
            clinicImages,
            clinicInformation.oldClinicImages
          );
          clinicImag = clinicImg.clinicImag || [];
          clinicImagesURI = clinicImg.clinicImagesURI || [];
        } else {
          let clinicImg = { clinicImag, clinicImagesURI };
          console.log("cliniicImages");
          console.log(clinicImages);
          clinicImg = await uploadImage(clinicImages, []);
          clinicImag = clinicImg.clinicImag || [];
          clinicImagesURI = clinicImg.clinicImagesURI || [];
        }

        const clinicAddressArray = clinicAddress.split(", ");

        await uploadClinicProfile(
          aboutClinicData,
          clinicInfoData,
          info,
          clinicAddressLocation,
          clinicImag,
          clinicImagesURI,
          clinicCity,
          clinicAddressArray,
          clinicAddress
        );

        dispatch(getClinicInfo());
        navigation.navigate(screenName.ClinicDashBoard);
      }
    } catch (err) {
      console.log("error on handleAddSubmit...clinic profile settings...", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("----clinicImages----");
    console.log(clinicImages);
    // if(!dataInfo.clinicAddressLocation && !clinicAddress){
    if (!dataInfo.clinicAddressLocation) {
      setIsLoadingData(true);
      handleGetData().then(() => {
        setIsLoadingData(false);
      });
    }

    // console.log(clinicInformation.clinicAddressLocation)
    // console.log(clinicInformation)
  }, [isFocused, selectedTab]);

  return (
    <Fragment>
      <MainContainer style={{ backgroundColor: colors.background }}>
        <CustomLoader
          isLoading={loading || isLoadingData}
          backgroundSet={loading || isLoadingData}
          text={
            isLoadingData
              ? i18n.translate("loadingProfile")
              : loading
              ? i18n.translate("creatingProfile")
              : ""
          }
        />

        <View>
          {/* <View> */}
          <ScrollView horizontal={true}>
            <SegmentControl
              tabs={clinicprofilesegments}
              defaultTab={selectedTab}
              newTab={newTab}
              onTabChanged={(
                tab: "Clinic Info" | "Contact Details" | "About Clinic"
                // | 'Basic Info'
                // | 'Pricing & Services',
                // | 'Education & Experience'
                // | 'Awards & Memberships'
                // | 'Registrations',
              ) => {
                setSelectedTab(tab);
              }}
            />
          </ScrollView>
          {/* {selectedTab == 'Basic Info' ? (
            <BasicInfo
              dataInfo={basicInfoData}
              handleAddSubmit={handleAddSubmit}
            />
          ) : null} */}
          {selectedTab == i18n.translate("aboutClinic") ? (
            <AboutMe
              dataInfoAboutMe={{ aboutClinicData }}
              handleAddSubmit={handleAddSubmit}
              title={i18n.translate("aboutClinic")}
            />
          ) : null}

          {selectedTab == i18n.translate("clinicInfo") && dataInfo.isClinic ? (
            <ClinicInfo
              dataInfoClinicInfo={clinicInfoData}
              handleAddSubmit={handleAddSubmit}
              setClinicAddress={setClinicAddress}
              setClinicCoords={setClinicCoords}
              setClinicImages={setClinicImages}
              setClinicCity={setClinicCity}
              clinicImages={clinicImages}
              clinicAddress={clinicAddress}
              clinicCoords={clinicCoords}
              noCoordsSelected={noCoordsSelected}
              setNoCoordsSelected={setNoCoordsSelected}
            />
          ) : null}

          {selectedTab == i18n.translate("contactDetails") ? (
            <ContactDetails
              dataInfoContactDetails={contactData}
              dataInfoClinicInfo={clinicInfoData}
              handleAddSubmit={handleAddSubmit}
              setClinicAddress={setClinicAddress}
              setClinicCoords={setClinicCoords}
              setClinicImages={setClinicImages}
              setClinicCity={setClinicCity}
              clinicAddress={clinicAddress}
              clinicCoords={clinicCoords}
              noCoordsSelected={noCoordsSelected}
              setNoCoordsSelected={setNoCoordsSelected}
            />
          ) : null}

          {/* {selectedTab == 'Pricing & Services' ? <Pricing /> : null} */}
          {/* {selectedTab == 'Education & Experience' ? <Education /> : null}
          {selectedTab == 'Awards & Memberships' ? <Awards /> : null}
          {selectedTab == 'Registrations' ? <Registrations /> : null} */}
          {/* </View> */}
        </View>
      </MainContainer>
    </Fragment>
  );
};
export default ClinicProfileSettings;
