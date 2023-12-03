import React, { useEffect, useState } from "react";
import {
  TextInput,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
} from "react-native";

import * as Yup from "yup";
import { Formik, useFormikContext } from "formik";

import { CardSurface, CommonInput } from "../../components/commonViews";
import { labels } from "../../utils/labels";
import { Feather } from "@expo/vector-icons";
import {
  H14fontRegularWhite,
  H14fontRegularImage,
  H30fontRegularLightBlack2,
  H8fontMediumBlack,
  H9fontRegularBlack,
  H9fontRegularGray,
  H9fontMediumBlue,
  H6fontRegularBlue,
  H15fontMediumBlack,
} from "../../components/commonText";
// import * as ImagePicker from 'react-native-image-picker';
import * as ImagePicker from "expo-image-picker";
import { colors } from "../../utils/colors";
import { mt10, mt15, mt20, pl10, pt10 } from "../../common/commonStyles";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import Geocoder from "react-native-geocoding";
import SpecialitiesList from "../../components/SpecialitiesList";
import SearchableDropdown from "react-native-searchable-dropdown";
import { specialistList } from "../../utils/constant";
import SearchableDropdownSelect from "../../components/SearchableDropdown";
import MapContainer from "../../containers/MapContainer";
import MapView from "react-native-maps";
import { MyMapView } from "../../components/MyMapView";
import { reverseGeocode } from "../../services/location-service";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import i18n from "../../../i18n";

interface Props {
  dataInfoClinicInfo?: any;
  handleAddSubmit?: any;
  setClinicCoords?: any;
  setClinicAddress?: any;
  setClinicImages?: any;
  clinicAddress?: any;
  clinicCoords?: any;
}

interface MyFormValues {
  clinicname: string;
  // clinicaddress: string;
}

const ClinicInfo: React.FC<Props> = ({
  dataInfoClinicInfo,
  handleAddSubmit,
  setClinicCoords,
  setClinicAddress,
  setClinicCity,
  setClinicImages,
  clinicImages,
  clinicAddress,
  clinicCoords,
  noCoordsSelected,
  setNoCoordsSelected,
}): JSX.Element => {
  const [selectedImages, setSelectedImages] = useState<any>(clinicImages);
  const [selectedImg, setSelectedImg] = useState<any>({});
  const [isModalVisible, setIsModalVisible] = useState<any>(false);
  const [clinicName, setClinicName] = useState(
    dataInfoClinicInfo.clinicname ? dataInfoClinicInfo.clinicname : ""
  );
  const [image, setImage] = useState(null);
  const [selectedItems, setSelectedItems] = useState<any>([
    {
      id: 1,
      name: "Urology",
    },
    {
      id: 2,
      name: "Cardiology",
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenModal = () => {
    if (clinicName.length === 0) {
      Alert.alert(
        i18n.translate("noClinicName"),
        i18n.translate("noClinicNameMessage"),
        [{ text: "OK", onPress: () => console.log("OK Pressed") }]
      );
    } else if (clinicImages.length === 0) {
      Alert.alert(
        i18n.translate("noClinicImages"),
        i18n.translate("noClinicImagesMessage"),
        [{ text: "OK", onPress: () => console.log("OK Pressed") }]
      );
    } else {
      setModalVisible(true);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };
  // const [location, setLocation] = useState<any>({});

  // const validationSchema = Yup.object().shape({
  //   biography: Yup.string()
  //     .min(10, 'Biography has to have at least 10 characters')
  //     .max(500, 'Biography has to have a maximum of 700 characters')
  //     .label('biography'),
  // });

  const initialValues: MyFormValues = {
    clinicname: dataInfoClinicInfo.clinicname
      ? dataInfoClinicInfo.clinicname
      : "",
    // clinicaddress: dataInfoClinicInfo.clinicaddress
    //   ? dataInfoClinicInfo.clinicaddress
    //   : '',
  };

  const cameraOpt = () => {
    launchCamera();
  };

  const launchCamera = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.2,
    });

    console.log("-----------result---uriii-----");
    console.log(result);
    let image = {};
    if (selectedImages.length === 0) {
      image = { img: result.assets[0].uri, isMainImg: true };
      console.log(image);
    } else {
      image = { img: result.assets[0].uri, isMainImg: false };
      console.log(image);
    }
    const images = [...selectedImages];
    if (!result.canceled) {
      images.push(image);
      setSelectedImages(images);
      setClinicImages(images);
    }
  };

  const _getLocationAsync = async () => {
    console.log("get location");
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      console.log("Permission not granted");
    }
    let location = await Location.getCurrentPositionAsync({});
    const address = await reverseGeocode(location);
    // setLocation(location);
    // console.log(address);
  };

  const handleRequestLocationPermission = async () => {
    // console.log('start');
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      console.log("status-----------------------------", status);
    } catch (err) {
      console.log(err);
    }
  };

  // FOR GETTING STRING ADDRESS TO COORDONATES
  const geocode = async (text) => {
    console.log("e.targe.value", text);
    const geocodedLocation = await Location.geocodeAsync(text);
    console.log("Geocoded Address");
    console.log(geocodedLocation);

    // let location = await Location.getCurrentPositionAsync({});
    const address = await reverseGeocode(
      geocodedLocation[0].longitude,
      geocodedLocation[0].latitude
    );
    // setLocation(location);
    console.log(address);
  };

  const handleClinicAddress = (coordinates, clinicAddress, city) => {
    console.log("---------------------Address----------------------");
    console.log(coordinates);
    console.log(clinicAddress);
    console.log(city);

    if (coordinates.lat) {
      setNoCoordsSelected(false);
    }
    console.log("coordinates---");
    console.log(coordinates);
    setClinicCoords(coordinates);
    setClinicAddress(clinicAddress);
    setClinicCity(city);
  };

  const handleRemoveImg = (image) => {
    const images = [...selectedImages];
    let filteredImg;
    console.log(image.img);
    console.log(images);
    if (image.isMainImg && images.length > 1) {
      images[1].isMainImg = true;
      filteredImg = images.filter((img) => img.img !== image.img);
    } else {
      filteredImg = images.filter((img) => img.img !== image.img);
    }
    setSelectedImages(filteredImg);
    setClinicImages(filteredImg);
  };

  const handleMapPress = async (e) => {
    console.log("MAP PRESSEDDD....");
    // Handle map touch here
    const { latitude, longitude } = e.nativeEvent.coordinate;
    let coordinates = { lat: latitude, lng: longitude };

    // Use reverse geocoding to get the city name
    const address = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });
    let city = address[0].city;
    setClinicCoords(coordinates);
    setClinicAddress(city);
    setClinicCity(city);
    console.log("adress....");
    console.log(clinicCoords);
    console.log(address);
    console.log(latitude);
    console.log(longitude);
  };

  const handleMainImg = (img) => {
    // console.log(img)
    const images = [...selectedImages];
    const mainImg = [];
    const newImages = [];
    // console.log(images)
    // console.log(img)
    for (let i = 0; i < images.length; i++) {
      console.log(images[i].isMainImg);
      if (images[i].img === img.img) {
        images[i].isMainImg = true;
        mainImg.push(images[i]);
      } else {
        images[i].isMainImg = false;
        newImages.push(images[i]);
      }
    }
    const allImg = [...mainImg, ...newImages];
    setSelectedImages(allImg);
    setClinicImages(allImg);
    setIsModalVisible(false);
  };

  useEffect(() => {
    console.log("clinicCoords---------");
    console.log(clinicCoords);
    console.log(clinicAddress);
  }, []);

  return (
    <CardSurface style={styles.container}>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => handleAddSubmit(values, selectedImages)}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          isValid,
        }) => (
          <>
            <View style={styles.bodyStyle}>
              <H8fontMediumBlack>
                {i18n.translate("clinicInfo")}
              </H8fontMediumBlack>
              <H30fontRegularLightBlack2 style={mt15}>
                {i18n.translate("clinicImage")}
              </H30fontRegularLightBlack2>
              {selectedImages.length > 0 && (
                <H9fontRegularGray style={{ marginTop: 10 }}>
                  <H9fontMediumBlue style={{ fontWeight: "bold" }}>
                    {i18n.translate("this")}
                  </H9fontMediumBlue>{" "}
                  {i18n.translate("willMainImage")}
                </H9fontRegularGray>
              )}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  width: "100%",
                  flexWrap: "wrap",
                  marginTop: 5,
                }}
              >
                {selectedImages.map((img, index) => (
                  <View key={index}>
                    <TouchableOpacity
                      style={{
                        position: "absolute",
                        zIndex: 3,
                        right: 1,
                        bottom: 1,
                      }}
                      onPress={() => handleRemoveImg(img)}
                    >
                      <View
                        style={{
                          backgroundColor: "white",
                          width: 25,
                          height: 25,
                          borderRadius: 10,
                          alignItems: "center",
                          justifyContent: "center",
                          elevation: 10,
                        }}
                      >
                        <MaterialIcons name="close" size={24} color="red" />
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedImg(img), setIsModalVisible(true);
                      }}
                    >
                      <Image
                        source={{ uri: img.img }}
                        style={[
                          styles.clicnicImageStyle,
                          {
                            borderWidth: img.isMainImg ? 3 : 0,
                            borderColor: img.isMainImg
                              ? colors.facebook
                              : "transparent",
                          },
                        ]}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
                {selectedImages.length < 8 && (
                  <TouchableOpacity
                    style={[styles.imageContainer, styles.clinicImageContainer]}
                    onPress={() => {
                      cameraOpt();
                    }}
                  >
                    <H14fontRegularImage style={{ fontSize: 10 }}>
                      {i18n.translate("clickHereAddPhotos")}
                    </H14fontRegularImage>
                  </TouchableOpacity>
                )}
              </View>
              {/* {image && <Image source={{uri:image}} style={{flex:1,width:600}} />}  */}
              <H30fontRegularLightBlack2 style={mt20}>
                {i18n.translate("clinicName")}
              </H30fontRegularLightBlack2>
              <CommonInput style={{ height: 35 }}>
                <TextInput
                  style={pl10}
                  onChange={(event) => {
                    const { eventCount, target, text } = event.nativeEvent;
                    setClinicName(text);
                  }}
                  onChangeText={handleChange("clinicname")}
                  onBlur={handleBlur("clinicname")}
                  value={values.clinicname}
                />
              </CommonInput>
              {/* <H30fontRegularLightBlack2 style={mt15}>
                {i18n.translate("clinicAddress")}
              </H30fontRegularLightBlack2>
              
              <MapContainer
              notEditable={true}
                handleClinicAddress={handleClinicAddress}
                clinicAddressLocation={{
                  clinicAddress: dataInfoClinicInfo.clinicAddress  ? dataInfoClinicInfo.clinicAddress  : clinicAddress.length > 0 ? clinicAddress : "",
                  clinicCoords: dataInfoClinicInfo.clinicCoords  ? dataInfoClinicInfo.clinicCoords  : clinicCoords.length > 0 ? clinicCoords : "",
                }}
                noCoordsSelected={noCoordsSelected}
              /> */}

              <TouchableOpacity
                style={[styles.nextButtonStyle, { marginTop: 20 }]}
                onPress={handleOpenModal}
              >
                <H14fontRegularWhite>
                  {i18n.translate("addAddress")}
                </H14fontRegularWhite>
              </TouchableOpacity>
            </View>

            <Modal visible={modalVisible} animationType="slide">
              <View style={{ flex: 1 }}>
                <MapContainer
                  notEditable={true}
                  handleClinicAddress={handleClinicAddress}
                  clinicAddressLocation={{
                    clinicAddress: clinicAddress,
                    clinicCoords: clinicCoords,
                  }}
                  clinicAddress={clinicAddress}
                  clinicCoords={clinicCoords}
                  setClinicAddress={setClinicAddress}
                  noCoordsSelected={noCoordsSelected}
                  handleMapPress={handleMapPress}
                >
                  <View
                    style={{
                      position: "absolute",
                      top: "1.5%",
                      left: 0,
                      right: 0,
                      zIndex: 1,
                      paddingRight: "20%",
                      paddingLeft: "5%",
                    }}
                  >
                    <TouchableOpacity onPress={handleCloseModal} style={pt10}>
                      {/* Optionally, you can add a close button or icon */}
                      <Feather name="arrow-left" size={24} color="black" />
                    </TouchableOpacity>
                  </View>
                </MapContainer>
                <TouchableOpacity
                  style={[
                    styles.nextButtonStyle,
                    { position: "absolute", bottom: 20, left: 0, right: 0 },
                  ]}
                  onPress={handleSubmit}
                >
                  <H14fontRegularWhite>
                    {i18n.translate("next")}
                  </H14fontRegularWhite>
                </TouchableOpacity>
              </View>
            </Modal>
          </>
        )}
      </Formik>
      <Modal animationType="fade" transparent={true} visible={isModalVisible}>
        <View style={styles.centeredView}>
          <View
            style={{
              width: "100%",
              height: "10%",
              top: "9%",
              left: "-2%",
              zIndex: 2,
            }}
          >
            <TouchableOpacity
              style={styles.modalView}
              onPress={() => setIsModalVisible(false)}
            >
              <Ionicons name="chevron-back" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View style={{ width: "100%", height: "40%" }}>
            <Image
              source={{ uri: selectedImg.img }}
              style={{ width: "100%", height: "100%" }}
            />
          </View>
          <View
            style={{
              width: "100%",
              height: "7%",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(239, 239, 240, 1)",
            }}
          >
            <TouchableOpacity
              style={[
                styles.modalView,
                { width: "98%", height: "80%", borderRadius: 10 },
              ]}
              onPress={() => handleMainImg(selectedImg)}
            >
              <View>
                <H15fontMediumBlack
                  style={{ fontSize: 20, fontWeight: "bold" }}
                >
                  {i18n.translate("setMainImage")}
                </H15fontMediumBlack>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </CardSurface>
  );
};
export default ClinicInfo;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 22,
    backgroundColor: "rgba(239, 239, 240, 0.3)",
  },
  modalView: {
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    // padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "15%",
    height: "40%",
  },
  sideMenuStyle: {
    margin: 0,
    width: 100,
  },
  nextButtonStyle: {
    height: 45,
    backgroundColor: colors.primary2,
    // marginTop: 100,
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    // marginTop: 30,
    zIndex: 10,
  },
  clinicImageContainer: {
    height: 70,
    width: 70,
    borderStyle: "dashed",
    borderColor: "#CFCFCF",
    borderRadius: 15,
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 5,
    backgroundColor: colors.background,
  },
  clicnicImageStyle: { height: 70, width: 70, borderRadius: 20, margin: 5 },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  container: { marginHorizontal: 10 },
  bodyStyle: { paddingHorizontal: 10, paddingTop: 10, zIndex: 10 },
  // containerMap: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   // paddingTop: Constants.statusBarHeight,
  //   // paddingTop: 20,
  // },
});
