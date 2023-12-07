import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../utils/colors";
import {
  H7fontBoldPrimary,
  H8fontMediumPrimary,
} from "../components/commonText";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "../utils/screenName";
import { handleLanguagei18n } from "../utils/handleLanguageGeneral";

const LanguageSelectScreen = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    console.log(`${language} Selected`);
    handleLanguagei18n(language);
  };

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#000000", "#434343"]} style={styles.gradient}>
        <View style={styles.headerContainer}>
          <Image
            source={require("../images/tarotbyai1.png")}
            style={styles.headerImage}
            resizeMode="contain"
          />
          <H7fontBoldPrimary style={{ marginTop: "2%" }}>
            Selectează limba
          </H7fontBoldPrimary>
        </View>

        <View style={styles.buttonContainer}>
          <LanguageButton
            language="Romanian"
            flagSource={require("../../assets/flags/romania.png")}
            onSelect={() => handleLanguageSelect("Romanian")}
            isSelected={selectedLanguage === "Romanian"}
          />

          <LanguageButton
            language="English"
            flagSource={require("../../assets/flags/english.png")}
            onSelect={() => handleLanguageSelect("English")}
            isSelected={selectedLanguage === "English"}
          />

          <LanguageButton
            language="Spanish"
            flagSource={require("../../assets/flags/spanish.png")}
            onSelect={() => handleLanguageSelect("Spanish")}
            isSelected={selectedLanguage === "Spanish"}
          />
        </View>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => navigation.navigate(screenName.SignInScreenClinic)}
        >
          <Text style={styles.continueButtonText}>Continuă</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const LanguageButton = ({ language, flagSource, onSelect, isSelected }) => (
  <TouchableOpacity
    style={[styles.button, isSelected ? styles.selectedButton : null]}
    onPress={onSelect}
  >
    <Text style={styles.buttonText}>{language}</Text>
    <Image style={styles.image} source={flagSource} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  headerContainer: {
    position: "absolute",
    top: 50,
    alignItems: "center",
    width: "100%",
  },

  headerImage: {
    width: 380,
    height: 230,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: "20%",
  },
  continueButton: {
    position: "absolute",
    bottom: 50,
    backgroundColor: colors.primary2,
    padding: 20,
    width: 250,
    borderRadius: 10,
    alignItems: "center",
  },
  image: {
    width: 30,
    height: 30,
    borderRadius: 20, // Face imaginea rotundă
    borderWidth: 1,
    borderColor: "#000", // Sau orice altă culoare pentru border
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  gradient: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    color: colors.primary2,
    fontSize: 24,
    marginBottom: 30,
  },
  button: {
    backgroundColor: colors.darkSelect,
    paddingHorizontal: 10,
    marginVertical: 10,
    width: "90%",
    maxHeight: "8%",
    borderRadius: 10,
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
  },
  selectedButton: {
    backgroundColor: colors.lightSelect,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },

  continueButtonText: {
    color: "black",
    fontSize: 18,
  },
});

export default LanguageSelectScreen;
