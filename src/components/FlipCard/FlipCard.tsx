import React, { useEffect, useRef } from "react";
import {
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
  ImageBackground,
  Text,
  StyleSheet,
} from "react-native";
import i18n from "../../../i18n";

const FlipCard = ({ item, style, shouldFlip }) => {
  const flipAnim = useRef(new Animated.Value(0)).current;
  let flipped = false;

  const flipCard = () => {
    if (!flipped) {
      Animated.spring(flipAnim, {
        toValue: 180,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
      flipped = true;
    }
  };

  useEffect(() => {
    if (shouldFlip) {
      flipCard();
    }
  }, [shouldFlip]);

  const frontAnimatedStyle = {
    transform: [
      {
        rotateY: flipAnim.interpolate({
          inputRange: [0, 180],
          outputRange: ["0deg", "180deg"],
        }),
      },
    ],
  };

  const backAnimatedStyle = {
    transform: [
      {
        rotateY: flipAnim.interpolate({
          inputRange: [0, 180],
          outputRange: ["180deg", "360deg"],
        }),
      },
    ],
  };

  return (
    <TouchableWithoutFeedback onPress={flipCard}>
      <Animated.View style={[styles.container, style]}>
        <Animated.View style={[styles.flipCard, frontAnimatedStyle]}>
          <ImageBackground
            source={require("../../images/dashboardPrint.png")}
            style={styles.buttonStyle}
          />
          <Text style={styles.textStyle}>
            {i18n.translate("upcomingAppointments")}
          </Text>
        </Animated.View>
        <Animated.View
          style={[styles.flipCard, backAnimatedStyle, styles.flipCardBack]}
        >
          {/* Conținutul din spatele cardului */}
        </Animated.View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get("window").width / 2.55,
    width: Dimensions.get("window").width / 3.8,
    borderRadius: 5,
    overflow: "hidden",
    elevation: 4,
    marginRight: 10,
    marginBottom: 10,
  },
  buttonStyle: {
    height: "100%",
    width: Dimensions.get("window").width / 2.25,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    position: "absolute",
  },
  flipCard: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backfaceVisibility: "hidden",
  },
  flipCardBack: {
    position: "absolute",
    top: 0,
    backgroundColor: "red",
  },
  textStyle: {
    width: "70%",
    textAlign: "center",
    color: "white",
  },
  // Alte stiluri necesare
});

export default FlipCard;
