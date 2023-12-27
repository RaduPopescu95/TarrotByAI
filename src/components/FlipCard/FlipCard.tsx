import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
  ImageBackground,
  Text,
  StyleSheet,
  View,
} from "react-native";
import i18n from "../../../i18n";
import { useFocusEffect, useNavigation } from "@react-navigation/native"; // Importă hook-ul pentru navigare
import { screenName } from "../../utils/screenName";
import { useLanguage } from "../../context/LanguageContext";
import { colors } from "../../utils/colors";
import { Image } from "react-native";
import { normalizeString } from "../../utils/stringUtils";
import { useNumberContext } from "../../context/NumberContext";
import { handleQueryFirestore } from "../../utils/firestoreUtils";

const FlipCard = ({
  item,
  style,
  shouldFlip,
  isFuture,
  categoryName,
  triggerExitAnimation,
  varianteCarti,
  conditieCategorie,
  number,
}) => {
  const flipAnim = useRef(new Animated.Value(0)).current;

  const [opacityAnim, setOpacityAnim] = useState(new Animated.Value(0));
  const navigation = useNavigation(); // Obține obiectul de navigare
  const { language, changeLanguage } = useLanguage();
  const { currentNumber, updateNumber } = useNumberContext();

  // Funcție pentru a naviga către ecranul PersonalizedReading cu parametrul item
  const navigateToPersonalizedReading = async () => {
    try {
      // console.log(item.image.finalUri);
      if (isFuture) {
        navigation.navigate(screenName.FutureReading, {
          item,
        });
      } else {
        // const cardName = item.info.ro.nume.trim().toLowerCase();
        // const categoryNameNormalized = conditieCategorie.trim().toLowerCase();
        // console.log(cardName);
        // console.log(categoryNameNormalized);

        // Filtrare cu verificare pentru undefined și normalizare pentru litere mari/mici și spații
        const cardNameNormalized = normalizeString(item.info.ro.nume);
        const categoryNameNormalized = normalizeString(conditieCategorie);
        // const filteredVariante = varianteCarti.filter((carte) => {
        //   const cardNameNormalized = normalizeString(item.info.ro.nume);
        //   const categoryNameNormalized = normalizeString(conditieCategorie);
        //   const carteNumeNormalized = normalizeString(
        //     carte.carte?.info.ro?.nume || ""
        //   );
        //   const categorieNumeNormalized = normalizeString(
        //     carte.categorie?.info.ro?.nume || ""
        //   );

        //   return (
        //     cardNameNormalized === carteNumeNormalized &&
        //     categoryNameNormalized === categorieNumeNormalized
        //   );
        // });
        const filteredVariante = await handleQueryFirestore(
          "VarianteCarti",
          cardNameNormalized,
          categoryNameNormalized
        );
        // Verificare dacă există elemente în array-ul filtrat
        if (filteredVariante.length > 0) {
          // Selectare aleatorie a unui element
          const randomIndex = Math.floor(
            Math.random() * filteredVariante.length
          );
          const selectedCard = filteredVariante[randomIndex];

          // Navigație cu cartea selectată
          navigation.navigate("PersonalizedReading", { item: selectedCard });
        } else {
          console.log(
            "Nicio carte nu a fost găsită pentru criteriile specificate."
          );
        }
      }
    } catch (err) {
      console.log("Error at navigateToPersonalizedReading...", err);
    }
  };

  const flipCard = () => {
    Animated.spring(flipAnim, {
      toValue: 180,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
  };

  // useFocusEffect(
  //   React.useCallback(() => {
  //     console.log("focus on filp card...");
  //     if (number === currentNumber) {
  //       console.log("is equal to current number", currentNumber);
  //       console.log("number", number);
  //     }
  //     return () => {
  //       console.log("Unfocus on filp card...");
  //     };
  //   }, [])
  // );

  useFocusEffect(
    React.useCallback(() => {
      console.log("currentNumber in FlipCard:", currentNumber);
      if (number === currentNumber && number !== 0) {
        console.log("is equal to current number.........", currentNumber);
        console.log("number", number);
        if (number === 8) {
          updateNumber(0);
        }
        navigateToPersonalizedReading();
      }
    }, [currentNumber])
  );

  useEffect(() => {
    if (shouldFlip) {
      flipCard();
    } else {
      flipAnim.setValue(0);
    }
  }, [shouldFlip]);

  useEffect(() => {
    if (shouldFlip) {
      // Inițiați animația de fade in
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() =>
        setTimeout(() => {
          if (number === 0) {
            navigateToPersonalizedReading();
          }
        }, 500)
      );
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
    <>
      {/* Acest Image va crea efectul de overflow */}
      <Animated.View
        style={[
          styles.shadowImage,
          {
            opacity: opacityAnim, // Aplică animația de opacitate
          },
        ]}
      >
        <Image
          source={require("../../../assets/shadowBackground.png")} // Înlocuiește cu calea corectă a imaginii tale
          resizeMode="cover"
        />
      </Animated.View>

      <TouchableWithoutFeedback onPress={flipCard}>
        <Animated.View style={[styles.container, style]}>
          <Animated.View style={[styles.flipCard, frontAnimatedStyle]}>
            <ImageBackground
              source={require("../../../assets/card-back.png")}
              style={[styles.cardImage]}
              resizeMode="cover"
            />
          </Animated.View>

          <TouchableWithoutFeedback onPress={navigateToPersonalizedReading}>
            {/* Zonele de atingere pentru a naviga la PersonalizedReading */}
            <Animated.View
              style={[styles.flipCard, backAnimatedStyle, styles.flipCardBack]}
            >
              <ImageBackground
                source={
                  item ? { uri: item.image ? item.image.finalUri : "" } : null
                }
                style={styles.fullCardImage}
                resizeMode="stretch" // Folosiți "stretch" pentru a întinde imaginea
              />
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </>
  );
};

const styles = StyleSheet.create({
  fullCardImage: {
    height: "100%", // Asigurați-vă că înălțimea și lățimea sunt setate la 100%
    width: "100%",
  },
  backgroundImage: {
    position: "relative", // Asigură-te că este absolut pentru a se extinde în exteriorul View-ului părinte
    top: 0, // Ajustează aceste valori pentru a poziționa cum dorești
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%", // Ajustează aceste valori în funcție de cât de mare dorești să fie imaginea de fundal
    height: "100%",
  },
  shadowImage: {
    position: "absolute",
    top: -180, // Ajustează aceste valori pentru a extinde imaginea în afara limitelor
    left: -195,
    width: Dimensions.get("window").width / 2.55 + 350, // Lățimea și înălțimea sunt mărite
    height: Dimensions.get("window").width / 3.8 + 350,
    zIndex: -1, // Asigură-te că imaginea este în spatele elementului Animated.View
  },

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
  },
  textStyle: {
    width: "70%",
    textAlign: "center",
    color: "white",
  },
  // Other necessary styles
});

export default FlipCard;
