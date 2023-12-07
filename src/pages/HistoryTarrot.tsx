import React, { Fragment, useState } from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { H6fontBoldPrimary, H7fontMediumWhite } from "../components/commonText";
import i18n from "../../i18n";
import { MainContainer } from "../components/commonViews";
import CustomLoader from "../components/customLoader";
import { LinearGradient } from "expo-linear-gradient";
import GreetingBar from "../components/UpperGreetingBar/GreetingBar";
import ImageRow from "../components/HistoryRow/HistoryRow";

export default function HistoryTarrot() {
  const [isLoading, setIsLoading] = useState(false);
  const route = useRoute<RouteProp<ParamList, "HistoryTarrot">>();
  const { historyType } = route.params;

  // Creați un array bidimensional pentru rânduri de imagini
  const rowsOfImages = new Array(3).fill(null).map(() => new Array(7).fill({}));

  return (
    <TouchableWithoutFeedback onPress={() => console.log("Pressed")}>
      <Fragment>
        <MainContainer>
          <CustomLoader isLoading={isLoading} />
          <LinearGradient
            colors={["#000000", "#434343"]}
            style={styles.gradient}
          >
            <GreetingBar isGoBack={true} />
            <View
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <H6fontBoldPrimary>History</H6fontBoldPrimary>
              <H7fontMediumWhite style={{ marginTop: 10 }}>
                {historyType}
              </H7fontMediumWhite>
            </View>
            {rowsOfImages.map((images, index) => (
              <ImageRow key={index} images={images} />
            ))}
          </LinearGradient>
        </MainContainer>
      </Fragment>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    width: "100%",
    height: "100%",
    paddingBottom: 100,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
