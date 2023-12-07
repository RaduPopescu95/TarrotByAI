import React from "react";
import { View, Image, StyleSheet, FlatList } from "react-native";
import { H7fontMediumWhite } from "../commonText";

// Props ar putea include un array de imagini și orice altceva ai nevoie
const ImageRow = ({ images }) => {
  return (
    <View style={{ backgroundColor: "#21202E", margin: 10 }}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 10,
          paddingTop: 5,
        }}
      >
        <H7fontMediumWhite>#1231231</H7fontMediumWhite>
        <H7fontMediumWhite>05.11.2023</H7fontMediumWhite>
      </View>
      <FlatList
        horizontal
        data={images}
        renderItem={({ item }) => (
          //   <Image source={{ uri: item.uri }} style={styles.image} />
          <Image
            source={require("../../images/dashboardPrint.png")}
            style={styles.image}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        style={styles.row}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    padding: 10,
    // Adaugă aici alte stiluri pentru rând dacă este necesar
  },
  image: {
    width: 40, // Aici poți face dimensiunea dinamică
    height: 60,
    marginRight: 10,
    // Adaugă aici alte stiluri pentru imagini dacă este necesar
  },
});

export default ImageRow;
