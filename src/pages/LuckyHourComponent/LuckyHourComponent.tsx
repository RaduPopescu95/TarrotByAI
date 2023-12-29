import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  StatusBar,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MainContainer } from "../../components/commonViews";
import GreetingBar from "../../components/UpperGreetingBar/GreetingBar";
import { colors } from "../../utils/colors";
import { TouchableWithoutFeedback } from "react-native";
import {
  H15fontMediumWhite,
  H6fontBoldPrimary,
  H6fontMediumWhite,
  H7fontBoldPrimary,
  H7fontBoldWhite,
  H7fontMediumPrimary,
  H8fontMediumPrimary,
  H8fontMediumWhite,
} from "../../components/commonText";
import { useNavBarVisibility } from "../../context/NavbarVisibilityContext";
import { useApiData } from "../../context/ApiContext";
import { useLanguage } from "../../context/LanguageContext";

const LuckyHour = () => {
  const {
    zilnicCitateMotivationale,
    zilnicCuloriNorocoase,

    citateMotivationale,
    culoriNorocoase,

    oreNorocoase,
  } = useApiData();
  const { language, changeLanguage } = useLanguage();
  const onPressHandler = () => {
    console.log("Pressed");
  };
  const [zilnicOreNorocoase, setZilnicOreNorocoase] = React.useState({});

  const { setIsNavBarVisible } = useNavBarVisibility();

  React.useEffect(() => {
    if (oreNorocoase && oreNorocoase.length > 0) {
      const randomIndex = Math.floor(Math.random() * oreNorocoase.length);
      setZilnicOreNorocoase(oreNorocoase[randomIndex]);
    }
  }, [oreNorocoase]);

  React.useEffect(() => {
    console.log(zilnicOreNorocoase);
    setIsNavBarVisible(false);
    return () => setIsNavBarVisible(true); // Restabilește vizibilitatea la ieșirea din componentă
  }, []);

  return (
    <TouchableWithoutFeedback onPress={onPressHandler}>
      <MainContainer>
        <LinearGradient
          colors={[
            colors.gradientLogin1,
            colors.gradientLogin2,
            colors.gradientLogin2,
          ]}
          style={styles.gradient}
        >
          <ImageBackground
            source={require("../../../assets/shadowBg.png")}
            resizeMode="cover"
            style={{
              flex: 1,
              width: null,
              height: null,
              // alignItems: 'flex-end',
            }}
          >
            <GreetingBar isGoBack={true} />
            <View style={styles.overlay}>
              <View style={styles.numberContainer}>
                <Text style={styles.number}>
                  {" "}
                  {zilnicOreNorocoase.ora ? zilnicOreNorocoase.ora : ""}
                </Text>
              </View>
              <View style={styles.secondImageContainer}>
                <Image
                  source={require("../../../assets/headerIcon.png")}
                  style={styles.secondImage}
                  resizeMode="contain"
                />
              </View>
              <View
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  height: "auto",
                  bottom: "10%",
                }}
              >
                {/* <H7fontBoldWhite style={{ alignSelf: "center" }}>
                {zilnicOreNorocoase.info[language].nume}
              </H7fontBoldWhite> */}
                {zilnicOreNorocoase.info ? (
                  <H7fontMediumPrimary style={{ textAlign: "justify" }}>
                    {language === "hi"
                      ? zilnicOreNorocoase.info.hu.descriere
                      : language === "id"
                        ? zilnicOreNorocoase.info.ru.descriere
                        : zilnicOreNorocoase.info[language].descriere}
                  </H7fontMediumPrimary>
                ) : null}
              </View>
            </View>
          </ImageBackground>
        </LinearGradient>
      </MainContainer>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  numberContainer: {
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 20,
    width: 130, // Dimensiunea containerului
    height: 130, // Dimensiunea containerului
    borderRadius: 65, // Jumătate din width/height pentru a face cerc perfect
    backgroundColor: colors.primary3, // Culoarea de fundal
    justifyContent: "center", // Centrează conținutul vertical
    alignItems: "center", // Centrează conținutul orizontal
    // Stiluri pentru efect 3D
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  number: {
    fontSize: 40, // Mărimea fontului pentru număr
    color: "white", // Culoarea textului
    textAlign: "center",
    // Adaugă alte stiluri pentru text dacă este necesar
  },
  imageContainer: {
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 20,
    width: "auto",
    height: "auto",
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    borderWidth: 3,
    borderColor: colors.primary2,
    borderRadius: 10,
  },
  secondImageContainer: {
    alignSelf: "center",

    position: "relative",
    bottom: "12%",
    height: "auto",
    width: "auto",
  },
  secondImage: {
    width: 250,
    height: 150,
  },

  gradient: {
    flex: 1,
    width: "100%",
    height: "100%",
    paddingBottom: 100,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    // Alte stiluri necesare pentru a pozitiona gradientul după cum este necesar
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    backgroundColor: "transparent", // Adaugă un overlay pentru a spori lizibilitatea textului
    borderRadius: 10, // Rotunjirea colțurilor
    padding: 20, // Spațiu în interiorul containerului
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10, // Spațiu sub titlu
  },
  colorName: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10, // Spațiu sub numele culorii
  },
  description: {
    color: "white",
    fontSize: 18,
    textAlign: "center", // Aliniere text la centru
  },
});

export default LuckyHour;
