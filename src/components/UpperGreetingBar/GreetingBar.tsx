import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Octicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../utils/colors";
import { handleLanguagei18n } from "../../utils/handleLanguageGeneral";
import { useAuth } from "../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "../../../i18n";
import { useLanguage } from "../../context/LanguageContext";

const GreetingBar = ({ isGoBack }) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("Romanian"); // Inițializează cu limba implicită
  const { currentUser, userData } = useAuth();
  const { language, changeLanguage } = useLanguage();

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const languageHandle = (language) => {
    switch (currentLanguage) {
      case "Romanian":
        return "ro";
      case "English":
        return "en";
      case "Spanish":
        return "es";
      default:
        return "en";
    }
  };

  const handleLanguageSelect = (language) => {
    const lang = languageHandle(language);
    setCurrentLanguage(lang);
    console.log(`${language} Selected`);
    const l = handleLanguagei18n(language);
    changeLanguage(l);
    closeModal();
  };

  useEffect(() => {
    console.log("useEffect..");
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem("@userLanguage");
        if (savedLanguage) {
          setCurrentLanguage(savedLanguage);
        }
      } catch (e) {
        console.error("Failed to load the language from storage");
      }
    };

    loadLanguage();
  }, [currentLanguage]);

  // Alege imaginea în funcție de limba curentă
  const flagImageSource = () => {
    switch (currentLanguage) {
      case "en":
        return require("../../../assets/flags/english.png");
      case "es":
        return require("../../../assets/flags/spanish.png");
      case "ro":
      default:
        return require("../../../assets/flags/romania.png");
    }
  };

  return (
    <View style={styles.navbar}>
      {isGoBack ? (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Octicons
            name="chevron-left"
            size={29}
            color={colors.primary2}
            style={{ marginLeft: 15 }}
          />
        </TouchableOpacity>
      ) : (
        <Text style={styles.text}>
          {i18n.translate("helloUser")},{" "}
          <Text style={styles.boldText}>
            {userData.lastName} {userData.firstName}
          </Text>
        </Text>
      )}
      <TouchableOpacity onPress={openModal}>
        <Image
          style={styles.image}
          source={flagImageSource()} // Schimbă sursa imaginii în funcție de limba selectată
        />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={closeModal}
        >
          <SafeAreaView style={{ flex: 0, backgroundColor: colors.secondary2 }}>
            <View style={styles.modal}>
              <Text
                style={[
                  styles.modalText,
                  { color: colors.primary2, marginBottom: 15 },
                ]}
              >
                Schimbă limba
              </Text>
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  /* Handle language change to Romanian */
                  handleLanguageSelect("Romanian");
                }}
              >
                <Text style={styles.modalText}>Română</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  /* Handle language change to English */
                  handleLanguageSelect("English");
                }}
              >
                <Text style={styles.modalText}>English</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  /* Handle language change to Spanish */
                  handleLanguageSelect("Spanish");
                }}
              >
                <Text style={styles.modalText}>Español</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalItemCancel}
                onPress={closeModal}
              >
                <Text style={styles.modalTextCancel}>Renunță</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: colors.secondary2,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 35,
    height: "32%",
    justifyContent: "flex-start",

    alignItems: "flex-start",
  },
  modalItem: {
    paddingVertical: 10,
    alignItems: "center",
  },
  modalItemCancel: {
    paddingVertical: 10,
    alignItems: "center",
    // marginTop: 10,
  },
  modalText: {
    fontSize: 18,
    color: colors.white,
  },
  modalTextCancel: {
    fontSize: 18,
    color: colors.white,
  },
  // ... rest of your styles
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: "transparent",
  },
  text: {
    fontSize: 18,
    color: "white", // Sau orice altă culoare dorită
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20, // Face imaginea rotundă
    borderWidth: 1,
    borderColor: "#000", // Sau orice altă culoare pentru border
  },
  boldText: {
    fontWeight: "bold",
    // poți adăuga aici și alte stiluri specifice pentru textul bolduit
  },
});

export default GreetingBar;
