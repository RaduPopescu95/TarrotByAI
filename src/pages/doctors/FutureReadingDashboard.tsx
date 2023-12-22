import React, { Fragment, useEffect, useRef, useState } from "react";
import {
  ScrollView,
  Dimensions,
  Animated,
  StatusBar,
  Platform,
  View,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import FlipCard from "../../components/FlipCard/FlipCard";
import GreetingBar from "../../components/UpperGreetingBar/GreetingBar";
import CardLayout from "../../components/CardLayout/CardLayout";
import CustomSpinner from "../../components/CustomSpinner/CustomSpinner";
import { colors } from "../../utils/colors";
import { useApiData } from "../../context/ApiContext";
import { MainContainer } from "../../components/commonViews";
import i18n, { languageCode } from "../../../i18n";
import CardLayoutViitor from "../../components/CardLayout/CardLayoutViitor";
import {
  H6fontRegularBlack,
  H7fontBoldPrimary,
  H8fontMediumBlack,
} from "../../components/commonText";
import { useLanguage } from "../../context/LanguageContext";

const FutureReadingDashboard = () => {
  const [cardAnimations, setCardAnimations] = useState([]);

  const [opacityAnim, setOpacityAnim] = useState(new Animated.Value(0));

  const initialAnimations = useRef(Array(9).fill(null)).current;
  const {
    oreNorocoase,
    numereNorocoase,
    culoriNorocoase,
    citateMotivationale,
    categoriiViitor,
    cartiViitor,
    varianteCarti,
    categoriiPersonalizate,
    cartiPersonalizate,
    loading,
    error,
    fetchData,
    triggerExitAnimation,
    startExitAnimation,
    resetExitAnimation,
    shuffleCartiViitor,
    shuffledCartiViitor,
    setShuffledCartiViitor,
  } = useApiData();
  const { language, changeLanguage } = useLanguage();

  const [shouldFlip, setShouldFlip] = useState(false);

  // Initialize card animations and animate cards on mount and categoriiViitor change
  useEffect(() => {
    if (shuffledCartiViitor.length === 0 || triggerExitAnimation) return;

    const screenWidth = Dimensions.get("window").width;
    const newAnimations = initialAnimations.map(
      () => new Animated.Value(-screenWidth)
    );
    setCardAnimations(newAnimations);

    // Sequentially animate cards into view
    newAnimations.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        delay: index * 100,
      }).start(() => {
        if (index === newAnimations.length - 1) {
          setShouldFlip(true);
        }
      });
    });
  }, [shuffledCartiViitor, triggerExitAnimation]); // Depend on shuffledCartiViitor and triggerExitAnimation

  useEffect(() => {
    console.log("language...", language);
  }, [language]);

  // Animate cards out of view
  useEffect(() => {
    if (triggerExitAnimation) {
      cardAnimations.forEach((anim, index) => {
        Animated.timing(anim, {
          toValue: -Dimensions.get("window").width,
          duration: 300,
          useNativeDriver: true,
          delay: index * 100,
        }).start(() => {
          if (index === cardAnimations.length - 1) {
            fetchData();
            resetExitAnimation();
            setShouldFlip(false); // Resetați aici
          }
        });
      });
    }
  }, [triggerExitAnimation, cardAnimations]);

  // Reset flip state after fetching new categoriiViitor
  useEffect(() => {
    if (!loading && categoriiViitor) {
      setShouldFlip(false);
    }
  }, [categoriiViitor, loading]);

  useEffect(() => {
    if (shouldFlip) {
      // Inițiați animația de fade in
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      // Inițiați animația de fade out
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [shouldFlip]);

  useEffect(() => {
    // Acest useEffect va fi activat când `triggerExitAnimation` se schimbă
    if (triggerExitAnimation) {
      // Inițiați animația de fade out
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [triggerExitAnimation, opacityAnim]); // Dependențe: triggerExitAnimation și opacityAnim

  const renderFlipCard = (category, index) => {
    if (!cardAnimations[index]) return null;

    // Asociază fiecare categorie cu o carte, repetând cărțile dacă este necesar
    const card = shuffledCartiViitor[index % shuffledCartiViitor.length];
    const animatedStyle = {
      transform: [{ translateX: cardAnimations[index] }],
    };

    return (
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FlipCard
          item={card}
          key={index}
          style={animatedStyle}
          shouldFlip={shouldFlip}
          isFuture={true}
          categoryName={category.info[language].nume}
          triggerExitAnimation={triggerExitAnimation}
        />

        {shouldFlip && (
          <Animated.View
            style={{
              opacity: opacityAnim, // Aplică animația de opacitate
              backgroundColor: colors.primary2,
              borderRadius: 5,
              display: "flex",
              width: "auto",
              alignItems: "center",
              marginTop: 10,
              padding: 5,
            }}
          >
            <H8fontMediumBlack>
              {category.info[language].nume}
            </H8fontMediumBlack>
          </Animated.View>
        )}
      </View>
    );
  };

  return (
    <Fragment>
      <MainContainer>
        <LinearGradient
          colors={[
            colors.gradientLogin2,
            colors.gradientLogin2,
            colors.gradientLogin1,
          ]}
          style={{
            flex: 1,
            paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
          }}
        >
          <Image
            source={require("../../../assets/bg-inner.png")}
            style={{
              position: "absolute",
              width: "100%",
              height: 200,
              top: 0, // Ajustează dacă este necesar
            }}
          />
          {/* <GreetingBar isGoBack={true} /> */}
          {loading ? (
            <CustomSpinner size={74} color={colors.primary2} />
          ) : (
            <ScrollView
              contentContainerStyle={{
                paddingBottom: 20,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "transparent",
                minHeight: Dimensions.get("window").height,
              }}
            >
              <CardLayoutViitor title={i18n.translate("futureReading")}>
                {categoriiViitor &&
                  categoriiViitor.map((category, index) =>
                    renderFlipCard(category, index)
                  )}
              </CardLayoutViitor>
            </ScrollView>
          )}
        </LinearGradient>
      </MainContainer>
    </Fragment>
  );
};

export default FutureReadingDashboard;
