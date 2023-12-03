import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "../utils/screenName";

const NavBarBottom = () => {
  const navigation = useNavigation();
  const [selected, setSelected] = useState(0);
  const animatedValues = useRef(
    Array.from({ length: 3 }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    // Animate each value when 'selected' changes
    animatedValues.forEach((value, i) => {
      Animated.spring(value, {
        toValue: i === selected ? 1 : 0,
        friction: 5,
        useNativeDriver: true, // Set this to true for better performance
      }).start();
    });
  }, [selected, animatedValues]);

  const handlePress = (screen, index) => {
    setSelected(index);
    navigation.navigate(screen);
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
    backgroundColor: selected === index ? "#6e6e6e" : "transparent",
    borderRadius: 20,
    marginBottom: 10,
  });

  return (
    <View style={styles.navbar}>
      {[screenName.ClinicDashBoard, "Dashboard2", "TarrotSettings"].map(
        (screen, index) => (
          <Animated.View
            key={screen}
            style={[styles.iconWrap, animatedStyle(index)]}
          >
            <TouchableOpacity onPress={() => handlePress(screen, index)}>
              <Ionicons
                name={
                  "ios-" +
                  (index === 0 ? "home" : index === 1 ? "bookmark" : "settings")
                }
                size={24}
                color="#d4af37"
              />
              <Text style={styles.iconText}>
                {index === 0
                  ? "Dashboard"
                  : index === 1
                    ? "Bookmarks"
                    : "Settings"}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )
      )}
    </View>
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
  },
  iconWrap: {
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 10,
  },
  iconText: {
    color: "#AB8D60",
    fontSize: 10,
  },
});

export default NavBarBottom;
