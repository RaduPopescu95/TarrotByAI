import React, { Fragment, useEffect, useRef, useState } from "react";
import {
  View,
  ScrollView,
  Dimensions,
  Animated,
  ActivityIndicator,
  StatusBar,
  Platform,
} from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import { useRoute } from "@react-navigation/native";

import NavBarBottom from "../../components/Navbar";
import FlipCard from "../../components/FlipCard/FlipCard";
import { styles } from "./DashboardStyle";
import { MainContainer } from "../../components/commonViews";
import { LinearGradient } from "expo-linear-gradient";
import Card from "../../components/MenuCard/Card";
import GreetingBar from "../../components/UpperGreetingBar/GreetingBar";
import { screenName } from "../../utils/screenName";
import { useNavigationState } from "../../context/NavigationContext";
import i18n from "../../../i18n";
import { useLanguage } from "../../context/LanguageContext";

const ClinicDashboard = () => {
  const [cardAnimations, setCardAnimations] = useState([]);
  const initialAnimations = useRef(Array(4).fill(null)).current; // Utilizarea useRef pentru a păstra starea inițială
  const { language, changeLanguage } = useLanguage();

  const cardData = [
    {
      text: i18n.translate("personalReading"),
      screen: screenName.PersonalReadingDashboard,
    },
    {
      text: i18n.translate("futureReading"),
      screen: "Dashboard2",
    },
    {
      text: i18n.translate("luckyNumber"),
      screen: screenName.luckyNumberColor,
    },
    {
      text: i18n.translate("luckyColor"),
      screen: screenName.luckyColor,
    },
    // Adăugați mai multe obiecte aici în funcție de câte cartonașe doriți să aveți
  ];

  useEffect(() => {
    const screenWidth = Dimensions.get("window").width;

    // Inițializarea animațiilor doar dacă nu au fost setate anterior
    if (initialAnimations.every((elem) => elem === null)) {
      initialAnimations.forEach((_, index) => {
        initialAnimations[index] = new Animated.Value(screenWidth);
      });

      setCardAnimations(initialAnimations);

      animateCard(0); // Începe animația pentru primul card
    }
  }, []);

  useEffect(() => {}, [language]);

  const animateCard = (index) => {
    if (index < initialAnimations.length) {
      Animated.timing(initialAnimations[index], {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => animateCard(index + 1));
    }
  };

  const renderCard = (card, index) => {
    return (
      <Card
        key={index}
        text={card.text}
        screen={card.screen}
        image={require("../../images/dashboardPrint.png")}
      />
    );
  };

  // Restul logicii și a codului specific aplicației...

  const screenHeight = Dimensions.get("window").height;

  return (
    <Fragment>
      <MainContainer>
        <LinearGradient
          colors={["#000000", "#434343"]} // Înlocuiește cu culorile gradientului tău
          style={{
            flex: 1,
            paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
          }}
        >
          <GreetingBar />
          <View
            style={{
              paddingTop: "23%",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              minHeight: screenHeight,
            }}
          >
            <View style={styles.cardRow}>
              {cardData.map((card, index) => renderCard(card, index))}
            </View>
          </View>
        </LinearGradient>
      </MainContainer>
    </Fragment>
  );
};

export default ClinicDashboard;
