import React, { Fragment, useEffect, useRef, useState } from "react";
import {
  View,
  ScrollView,
  Dimensions,
  Animated,
  Platform,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import FlipCard from "../../components/FlipCard/FlipCard";
import GreetingBar from "../../components/UpperGreetingBar/GreetingBar";
import CardLayout from "../../components/CardLayout/CardLayout";
import CustomSpinner from "../../components/CustomSpinner/CustomSpinner";
import { colors } from "../../utils/colors";
import { useApiData } from "../../context/ApiContext";
import { MainContainer } from "../../components/commonViews";

const PersonalReadingDashboard = () => {
  const [cardAnimations, setCardAnimations] = useState([]);
  const initialAnimations = useRef(Array(9).fill(null)).current;
  const { fetchData, data, loading, error } = useApiData();
  const [areCardsFlipped, setAreCardsFlipped] = useState(false);
  const [completedEntryAnimations, setCompletedEntryAnimations] = useState(0);

  useEffect(() => {
    const screenWidth = Dimensions.get("window").width;
    if (initialAnimations.every((elem) => elem === null)) {
      initialAnimations.forEach((_, index) => {
        initialAnimations[index] = new Animated.Value(screenWidth);
      });
      setCardAnimations(initialAnimations);
      animateCard(0);
    }
  }, []);

  useEffect(() => {
    if (completedEntryAnimations === initialAnimations.length) {
      // Toate animațiile de intrare sunt completate, declanșează flip-ul
      setAreCardsFlipped(true);
    }
  }, [completedEntryAnimations]);

  const animateCard = (index) => {
    if (index < initialAnimations.length) {
      Animated.timing(initialAnimations[index], {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setCompletedEntryAnimations((count) => count + 1);
        animateCard(index + 1);
      });
    }
  };

  const renderFlipCard = (item, index) => {
    if (!cardAnimations[index]) {
      return null;
    }

    const animatedStyle = {
      transform: [{ translateX: cardAnimations[index] }],
    };

    return (
      <FlipCard
        item={item}
        key={index}
        style={animatedStyle}
        shouldFlip={areCardsFlipped}
      />
    );
  };

  const screenHeight = Dimensions.get("window").height;

  return (
    <Fragment>
      <MainContainer>
        <LinearGradient
          colors={["#000000", "#434343"]}
          style={{
            flex: 1,
            paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
          }}
        >
          <GreetingBar />
          {loading || !cardAnimations.length ? (
            <CustomSpinner size={74} color={colors.primary2} />
          ) : (
            <ScrollView
              contentContainerStyle={{
                paddingBottom: 20,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "transparent",
                minHeight: screenHeight,
              }}
            >
              <CardLayout title="Titlul Secțiunii">
                {data && data.map((item, index) => renderFlipCard(item, index))}
              </CardLayout>
            </ScrollView>
          )}
        </LinearGradient>
      </MainContainer>
    </Fragment>
  );
};

export default PersonalReadingDashboard;
