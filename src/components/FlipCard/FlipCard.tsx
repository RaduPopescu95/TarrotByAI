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
import { useNavigation } from "@react-navigation/native"; // Importă hook-ul pentru navigare
import { screenName } from "../../utils/screenName";

const FlipCard = ({ item, style, shouldFlip, isFuture, categoryName }) => {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation(); // Obține obiectul de navigare

  const flipCard = () => {
    Animated.spring(flipAnim, {
      toValue: 180,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (shouldFlip) {
      flipCard();
    } else {
      flipAnim.setValue(0); // Reset the flip animation
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

  // Funcție pentru a naviga către ecranul PersonalizedReading cu parametrul item
  const navigateToPersonalizedReading = () => {
    console.log(item.image.finalUri);
    if (isFuture) {
      navigation.navigate(screenName.FutureReading, {
        item,
      });
    } else {
      navigation.navigate("PersonalizedReading", { item: { url: item.url } });
    }
    console.log(item.url);
  };

  return (
    <TouchableWithoutFeedback onPress={flipCard}>
      <Animated.View style={[styles.container, style]}>
        <Animated.View style={[styles.flipCard, frontAnimatedStyle]}>
          <ImageBackground
            source={require("../../../assets/card-back.png")}
            style={styles.cardImage}
            resizeMode="cover"
          />
        </Animated.View>
        <TouchableWithoutFeedback onPress={navigateToPersonalizedReading}>
          {/* Zonele de atingere pentru a naviga la PersonalizedReading */}
          <Animated.View
            style={[styles.flipCard, backAnimatedStyle, styles.flipCardBack]}
          >
            <ImageBackground
              source={item.image.finalUri ? { uri: item.image.finalUri } : null}
              style={styles.cardImage}
              resizeMode="cover"
            />
          </Animated.View>
        </TouchableWithoutFeedback>
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
  cardImage: {
    height: "100%",
    width: "100%", // Asigurați-vă că acesta este 100% pentru a acoperi întreaga suprafață a cartonașului
    justifyContent: "center",
    alignItems: "center",
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
  // Other necessary styles
});

export default FlipCard;
