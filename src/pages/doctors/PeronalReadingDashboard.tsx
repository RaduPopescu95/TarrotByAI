import React, { Fragment, useEffect, useRef, useState } from "react";
import {
  ScrollView,
  Dimensions,
  Animated,
  StatusBar,
  Platform,
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
  const { fetchData, data, loading, triggerExitAnimation } = useApiData();

  const [shouldFlip, setShouldFlip] = useState(false);

  // Initialize card animations and animate cards on mount and data change
  useEffect(() => {
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
          console.log("test");
          setShouldFlip(true);
        }
      });
    });
  }, [data]);

  // Animate cards into view
  //   const animateCards = () => {
  //     cardAnimations.forEach((anim, index) => {
  //       Animated.timing(anim, {
  //         toValue: 0,
  //         duration: 300,
  //         useNativeDriver: true,
  //         delay: index * 100, // Delay each card animation for sequential entry
  //       }).start(() => {
  //         if (index === cardAnimations.length - 1) {
  //           setShouldFlip(true); // Trigger flip when all cards have entered
  //         }
  //       });
  //     });
  //   };

  // Animate cards out of view
  useEffect(() => {
    if (triggerExitAnimation) {
      cardAnimations.forEach((anim, index) => {
        Animated.timing(anim, {
          toValue: -Dimensions.get("window").width,
          duration: 300,
          useNativeDriver: true,
          delay: index * 100, // Delay each card animation for sequential exit
        }).start(() => {
          if (index === cardAnimations.length - 1) {
            console.log("multiple here...triggerExitAnimation");
            fetchData(); // Fetch new data when all cards have exited
          }
        });
      });
    }
  }, [triggerExitAnimation, cardAnimations]);

  // Reset flip state after fetching new data
  useEffect(() => {
    if (!loading && data) {
      setShouldFlip(false);
    }
  }, [data, loading]);

  const renderFlipCard = (item, index) => {
    if (!cardAnimations[index]) return null;
    const animatedStyle = {
      transform: [{ translateX: cardAnimations[index] }],
    };
    return (
      <FlipCard
        item={item}
        key={index}
        style={animatedStyle}
        shouldFlip={shouldFlip}
      />
    );
  };

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
                minHeight: Dimensions.get("window").height,
              }}
            >
              <CardLayout title="Titlul Secțiunii">
                {data && data.map(renderFlipCard)}
              </CardLayout>
            </ScrollView>
          )}
        </LinearGradient>
      </MainContainer>
    </Fragment>
  );
};

export default PersonalReadingDashboard;
