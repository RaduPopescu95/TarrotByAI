import React, { Fragment, useEffect, useState } from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import {
  H6fontBoldWhite,
  H7fontBoldPrimary,
  H7fontMediumWhite,
} from "../components/commonText";
import i18n from "../../i18n";
import { MainContainer } from "../components/commonViews";
import CustomLoader from "../components/customLoader";
import { LinearGradient } from "expo-linear-gradient";
import GreetingBar from "../components/UpperGreetingBar/GreetingBar";
import ImageRow from "../components/HistoryRow/HistoryRow";
import { colors } from "../utils/colors";
import {
  collection,
  query,
  orderBy,
  startAfter,
  endBefore,
  limit,
  getDocs,
} from "firebase/firestore";
import { authentication, db } from "../../firebase";
import { Ionicons } from "@expo/vector-icons";

const ITEMS_PER_PAGE = 4;

export default function HistoryTarrot() {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [lastDocOfEachPage, setLastDocOfEachPage] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const route = useRoute();
  const { historyType } = route.params;

  const location =
    historyType === i18n.translate("historyTypeFuture")
      ? "FutureReading"
      : "PersonalReading";

  const loadImages = async (page) => {
    setIsLoading(true);

    try {
      let queryConstraints = [
        query(
          collection(db, "Users", authentication.currentUser.uid, location),
          orderBy("date"),
          limit(ITEMS_PER_PAGE)
        ),
      ];

      if (page > 1) {
        const startAfterDoc = lastDocOfEachPage[page - 1];
        if (startAfterDoc) {
          queryConstraints.push(startAfter(startAfterDoc));
        }
      }

      const newQuery = query(...queryConstraints);
      const querySnapshot = await getDocs(newQuery);

      if (!querySnapshot.empty) {
        const newImages = querySnapshot.docs.map((doc) => doc.data());
        console.log("new images...", newImages[0].data.length);
        setImages(newImages);

        const lastVisibleDoc =
          querySnapshot.docs[querySnapshot.docs.length - 1];
        setLastDocOfEachPage({ ...lastDocOfEachPage, [page]: lastVisibleDoc });
      }
    } catch (error) {
      console.error("Error fetching images: ", error);
    }

    setIsLoading(false);
  };

  const fetchTotalPages = async () => {
    const totalDocs = await getDocs(
      collection(db, "Users", authentication.currentUser.uid, location)
    );
    setTotalPages(Math.ceil(totalDocs.size / ITEMS_PER_PAGE));
  };

  useEffect(() => {
    fetchTotalPages();
  }, []);

  useEffect(() => {
    loadImages(currentPage);
  }, [currentPage]);

  const renderPageNumbers = () => {
    let pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <Text
          key={i}
          onPress={() => setCurrentPage(i)}
          style={currentPage === i ? styles.activePage : styles.pageNumber}
        >
          {i}
        </Text>
      );
    }
    return pageNumbers;
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => console.log("Pressed")}>
      <Fragment>
        <MainContainer>
          <CustomLoader isLoading={isLoading} />
          <LinearGradient
            colors={[
              colors.gradientLogin1,
              colors.gradientLogin2,
              colors.gradientLogin3,
            ]}
            style={styles.gradient}
          >
            <GreetingBar isGoBack={true} />
            <View style={styles.historyHeader}>
              <H6fontBoldWhite>{i18n.translate("history")}</H6fontBoldWhite>
              <H7fontMediumWhite style={{ marginTop: 10 }}>
                {historyType}
              </H7fontMediumWhite>
            </View>
            {images.map((imageData, index) => (
              <ImageRow
                key={index}
                data={imageData.data}
                date={imageData.date}
                id={imageData.id}
                historyType={location}
              />
            ))}
            <View style={styles.paginationContainer}>
              <TouchableOpacity
                onPress={goToPreviousPage}
                disabled={currentPage === 1}
              >
                <Ionicons
                  name="chevron-back"
                  size={34}
                  color={currentPage === 1 ? "grey" : "blue"}
                />
              </TouchableOpacity>
              <H7fontBoldPrimary style={{ marginLeft: 10, marginRight: 10 }}>
                {currentPage}
              </H7fontBoldPrimary>
              <TouchableOpacity
                onPress={goToNextPage}
                disabled={currentPage === totalPages}
              >
                <Ionicons
                  name="chevron-forward"
                  size={34}
                  color={currentPage === totalPages ? "grey" : "blue"}
                />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </MainContainer>
      </Fragment>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  gradient: {
    flex: 1,
    width: "100%",
    height: "100%",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  historyHeader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  pageNumber: {
    margin: 5,
    padding: 5,
  },
  activePage: {
    margin: 5,
    padding: 5,
    color: "blue",
  },
});
