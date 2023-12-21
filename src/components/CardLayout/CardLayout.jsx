// CardLayout.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const CardLayout = ({ title, children }) => {
  // Transformă children într-un array dacă nu este deja
  const childArray = React.Children.toArray(children);

  // Așezăm cartonașele în ordinea specificată și aplicăm stiluri diferite cartonașului central
  const cardsWithStyle = childArray.map((card, index) => {
    let style = {};
    // Pentru fiecare al treilea cartonaș, care ar trebui să fie în centru, aplicăm un stil diferit
    if ((index + 1) % 3 === 0) {
      style = { ...styles.centerCard, ...card.props.style };
    }
    return React.cloneElement(card, { style: style, key: index });
  });

  // Creăm o structură de date pentru a menține ordinea cardurilor
  const orderedChildren = childArray.reduce((acc, child, index) => {
    // Calculăm poziția cardului în rând (stânga, dreapta, centru)
    const position = index % 3;
    // Stânga sau dreapta merg direct în rând
    if (position !== 2) {
      acc.push(child);
    } else {
      // Centrul este plasat înaintea celui din stânga în rândul său
      acc.splice(acc.length - 1, 0, child);
    }
    return acc;
  }, []);

  // Grupăm cartonașele nou ordonate câte trei pentru a crea rânduri
  const rows = orderedChildren.reduce((rows, child, index) => {
    if (index % 3 === 0) {
      rows.push([child]);
    } else {
      rows[rows.length - 1].push(child);
    }
    return rows;
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {rows.map((row, index) => (
        <View key={index} style={styles.cardRow}>
          {row.map((card, cardIndex) => (
            <View
              key={cardIndex}
              style={[
                styles.cardColumn,
                {
                  marginTop: cardIndex == 1 ? -40 : 40,
                  marginHorizontal: cardIndex == 1 ? 10 : 0,
                },
              ]}
            >
              {card}
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
  centerCard: {
    // Acest stil va ridica cardul central în sus
    marginTop: -50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "white",
    textAlign: "center",
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginTop: 50,
  },
  cardColumn: {
    marginTop: 30,
    // Ajustează stilurile conform nevoilor tale
  },
  // Stilurile pentru carduri și text ar trebui să fie definite în componenta copil
});

export default CardLayout;
