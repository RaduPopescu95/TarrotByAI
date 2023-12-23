import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  StatusBar,
  Dimensions,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MainContainer } from "../../components/commonViews";
import GreetingBar from "../../components/UpperGreetingBar/GreetingBar";
import { colors } from "../../utils/colors";
import { TouchableWithoutFeedback } from "react-native";
import { Video } from "expo-av";

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
import { useLanguage } from "../../context/LanguageContext";
import { ScrollView } from "react-native";
import { ActivityIndicator } from "react-native-paper";

const PersonalizedReading = ({ route }) => {
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const { language, changeLanguage } = useLanguage();
  const { item } = route.params;
  const onPressHandler = () => {
    console.log("Pressed");
  };

  const { setIsNavBarVisible } = useNavBarVisibility();

  React.useEffect(() => {
    setIsNavBarVisible(false);
    return () => setIsNavBarVisible(true); // Restabilește vizibilitatea la ieșirea din componentă
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <MainContainer style={{ flex: 1 }}>
        <LinearGradient colors={["#000000", "#434343"]} style={styles.gradient}>
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

            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                source={{ uri: item.carte.image.finalUri }}
                resizeMode="stretch" // Folosiți "stretch" pentru a întinde imaginea
              />
            </View>

            <View style={styles.secondImageContainer}>
              {isVideoLoading && (
                <ActivityIndicator
                  size="large"
                  color={colors.primary2}
                  style={{ position: "relative", top: "40%" }}
                /> // Spinner de încărcare
              )}
              <Video
                source={{
                  uri:
                    language === "hi"
                      ? item.info.hu.url
                      : language === "id"
                        ? item.info.ru.url
                        : item.info[language].url,
                }}
                resizeMode="cover"
                style={[
                  styles.secondImage,
                  { height: isVideoLoading ? 0 : 250 },
                ]}
                shouldPlay={true}
                useNativeControls
                onLoadStart={() => setIsVideoLoading(true)} // Începe afișarea spinner-ului
                onLoad={() => setIsVideoLoading(false)} // Ascunde spinner-ul când videoclipul este încărcat
              />
            </View>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
              <View
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  height: "auto",
                  // marginTop: "10%",
                  paddingHorizontal: "5%",
                  // bottom: "10%",
                }}
              >
                <H6fontBoldPrimary
                  style={{ alignSelf: "center", marginBottom: "5%" }}
                >
                  {language === "hi"
                    ? item.carte.info.hu.nume
                    : language === "id"
                      ? item.carte.info.ru.nume
                      : item.carte.info[language].nume}
                </H6fontBoldPrimary>

                <H8fontMediumWhite style={{ textAlign: "justify" }}>
                  {language === "hi"
                    ? item.info.hu.descriere
                    : language === "id"
                      ? item.info.ru.descriere
                      : item.info[language].descriere}
                </H8fontMediumWhite>
              </View>
            </ScrollView>
          </ImageBackground>
        </LinearGradient>
      </MainContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    alignSelf: "center",
    // marginTop: 20,
    marginBottom: 20,
    width: "auto",
    height: "auto",
  },
  scrollViewContainer: {
    // flexGrow: 1, // Asigură că ScrollView se extinde pe tot spațiul disponibil
    justifyContent: "flex-start",
    alignItems: "center",
    // backgroundColor: "red",
    paddingTop: "5%",
    paddingBottom: "5%",
    // paddingBottom: 20, // Ajustați această valoare după cum este necesar
  },
  image: {
    width: 125,
    height: 170,
    // resizeMode: "contain",
    // borderWidth: 3,
    // borderColor: colors.primary2,
    // borderRadius: 10,
  },
  secondImageContainer: {
    alignSelf: "center",

    position: "relative",

    height: 250,
    width: "auto",
  },
  secondImage: {
    width: 350,
    height: 250,
  },

  gradient: {
    flex: 1,
    width: "100%",
    height: "100%",
    // paddingBottom: 100,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    // Alte stiluri necesare pentru a pozitiona gradientul după cum este necesar
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    backgroundColor: "100%", // Adaugă un overlay pentru a spori lizibilitatea textului
    borderRadius: 10, // Rotunjirea colțurilor
    padding: 20, // Spațiu în interiorul containerului
    height: "100%",
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

export default PersonalizedReading;
