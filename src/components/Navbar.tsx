import React, { useState, useEffect, useRef } from "react";
import { View, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "../utils/screenName";
import { colors } from "../utils/colors";
import {
  H6fontBoldPrimary,
  H7fontBoldPrimary,
  H7fontMediumPrimary,
} from "./commonText";

const NavBarBottom = () => {
  const navigation = useNavigation();
  const [selected, setSelected] = useState(0);
  const animatedValues = useRef(
    Array.from({ length: 3 }, () => new Animated.Value(0))
  ).current;
  const chevronAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    animatedValues.forEach((value, i) => {
      Animated.spring(value, {
        toValue: i === selected ? 1 : 0,
        friction: 5,
        useNativeDriver: true,
      }).start();
    });

    // Pornirea animației cu repetiții
    Animated.loop(
      Animated.sequence([
        Animated.timing(chevronAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(chevronAnimation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      {
        iterations: 3, // Setează numărul de repetiții aici
      }
    ).start();
  }, [selected, animatedValues, chevronAnimation]);

  const handlePress = (screen, index) => {
    if (index === 1 && selected === 1) {
      console.log("Shuffling...");
    } else {
      setSelected(index);
      navigation.navigate(screen);
    }
  };

  const animatedStyle = (index) => ({
    transform: [
      {
        translateY: animatedValues[index].interpolate({
          inputRange: [0, 1],
          outputRange: [0, -10],
        }),
      },
      {
        scale: animatedValues[index].interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.1],
        }),
      },
    ],
    backgroundColor: selected === index ? colors.primary2 : "transparent",
    borderRadius: 20,
    marginBottom: 10,
  });

  const chevronStyle = {
    transform: [
      {
        translateY: chevronAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -10],
        }),
      },
    ],
  };

  return (
    <>
      {selected === 1 && (
        <View style={styles.shuffleTextContainer}>
          <H7fontBoldPrimary style={{ marginBottom: 10 }}>
            Touch to shuffle
          </H7fontBoldPrimary>
          <Animated.View style={chevronStyle}>
            <MaterialCommunityIcons
              name="chevron-down"
              size={34}
              color={colors.primary2}
            />
          </Animated.View>
        </View>
      )}
      <View style={styles.navbar}>
        {[screenName.ClinicDashBoard, "Dashboard2", "TarrotSettings"].map(
          (screen, index) => (
            <Animated.View
              key={screen}
              style={[styles.iconWrap, animatedStyle(index)]}
            >
              <TouchableOpacity
                onPress={() => handlePress(screen, index)}
                style={{ zIndex: 1 }}
              >
                {index === 1 ? (
                  <MaterialCommunityIcons
                    name={"cards-outline"}
                    size={selected === index ? 34 : 24}
                    color={selected === index ? "#434343" : colors.primary2}
                  />
                ) : (
                  <Ionicons
                    name={
                      "ios-" +
                      (index === 0
                        ? "star"
                        : index === 1
                          ? "bookmark"
                          : "person")
                    }
                    size={selected === index ? 34 : 24}
                    color={selected === index ? "#434343" : colors.primary2}
                  />
                )}
              </TouchableOpacity>
            </Animated.View>
          )
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    height: 60,
    backgroundColor: "transparent",
    position: "absolute",
    bottom: 10,
    width: "100%",
    zIndex: 1,
  },
  iconWrap: {
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 10,
    zIndex: 1,
  },
  shuffleTextContainer: {
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "transparent",
    position: "relative",
    bottom: "12%",
  },
  shuffleText: {
    color: colors.primary2,
    fontSize: 16,
    fontWeight: "bold",
    backgroundColor: "transparent",
  },
});

export default NavBarBottom;
