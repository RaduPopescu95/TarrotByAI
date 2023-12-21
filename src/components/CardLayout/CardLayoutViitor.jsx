import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { H6fontRegularBlack } from "../commonText";
import { colors } from "../../utils/colors";

const CardLayoutViitor = ({ title, children }) => {
  const childArray = React.Children.toArray(children);

  // Distribuim cartonașele pe rânduri
  const rows = childArray.reduce((acc, child, index) => {
    let rowIndex;
    if (index < 3) {
      rowIndex = 0; // Primul rând
    } else {
      rowIndex = Math.floor((index + 1) / 3); // Rândurile următoare
    }

    if (!acc[rowIndex]) {
      acc[rowIndex] = [];
    }

    // Adăugăm spațiu gol pentru mijloc în rândurile următoare
    if (rowIndex > 0 && acc[rowIndex].length === 1) {
      acc[rowIndex].push(
        <View key={`empty-${rowIndex}`} style={styles.emptySpace} />
      );
    }

    acc[rowIndex].push(child);
    return acc;
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {rows.map((row, rowIndex) => (
        <View
          key={rowIndex}
          style={[styles.cardRow, { marginTop: rowIndex === 0 ? 20 : null }]}
        >
          {row.map((card, cardIndex) => (
            <View
              key={cardIndex}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <View
                style={[
                  styles.cardColumn,
                  (cardIndex === 0 || cardIndex === 2) && styles.lowerCard,
                ]}
              >
                {card}
              </View>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "flex-start",
    height: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 1,
    color: "white",
    textAlign: "center",
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  cardColumn: {
    marginHorizontal: Dimensions.get("window").width * 0.02,
  },
  lowerCard: {
    marginTop: 20, // Ajustează această valoare pentru a poziționa mai jos cartonașele laterale
  },
  emptySpace: {
    width: Dimensions.get("window").width / 3.8,
  },
});

export default CardLayoutViitor;
