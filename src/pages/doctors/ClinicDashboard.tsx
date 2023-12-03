import React, { Fragment, useEffect, useRef, useState } from "react";
import {
  View,
  ScrollView,
  Dimensions,
  Animated,
  ActivityIndicator,
} from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import { useRoute } from "@react-navigation/native";

import NavBarBottom from "../../components/Navbar";
import FlipCard from "../../components/FlipCard/FlipCard";
import { styles } from "./DashboardStyle";
import { MainContainer } from "../../components/commonViews";
import { LinearGradient } from "expo-linear-gradient";

const ClinicDashboard = () => {
  const [cardAnimations, setCardAnimations] = useState([]);
  const initialAnimations = useRef(Array(4).fill(null)).current; // Utilizarea useRef pentru a păstra starea inițială

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

  const animateCard = (index) => {
    if (index < initialAnimations.length) {
      Animated.timing(initialAnimations[index], {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => animateCard(index + 1));
    }
  };

  const renderFlipCard = (index) => {
    const animatedStyle = {
      transform: [{ translateX: cardAnimations[index] }],
    };

    return <FlipCard key={index} style={animatedStyle} />;
  };

  // Restul logicii și a codului specific aplicației...

  const screenHeight = Dimensions.get("window").height;

  return (
    <Fragment>
      <MainContainer>
      <LinearGradient
    colors={["#000000", "#434343"]} // Înlocuiește cu culorile gradientului tău
    style={{flex:1}}
  >
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 20,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            // backgroundColor: "#1F2628",
            minHeight: screenHeight,
          }}
        >
          <View style={styles.cardRow}>
            {cardAnimations.map((_, index) => renderFlipCard(index))}
          </View>
        </ScrollView>
        </LinearGradient>
      </MainContainer>
    </Fragment>
  );
};

export default ClinicDashboard;
