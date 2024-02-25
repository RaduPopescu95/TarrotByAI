import React, { useState, useCallback, useEffect } from "react";
import {
  Modal,
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import styles from "./styles";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { colors } from "../../utils/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const NewsDetailsModal: React.FC<{
  visible: boolean;
  article: {
    author: string;
    title: string;
    urlToImage: string;
    publishedAt: string;
    url: string;
    content: string;
    documentId: string;
  };
  articleIndex: number;
  onClose: () => void;
  saveArticle: Function;
}> = ({ visible, article, articleIndex, onClose, saveArticle }) => {
  const backgroundColor = useColorScheme() === "dark" ? "#000" : "#fff";
  const color = useColorScheme() === "dark" ? "#fff" : "#000";
  const contentColor = useColorScheme() === "dark" ? "#bbb" : "#444";
  const readMoreBgColor = useColorScheme() === "dark" ? "#222" : "#ddd";
  const [isSaved, setIsSaved] = useState(false);

  //   const handleURLPress = useCallback(() => {
  //     Linking.openURL(article?.url);
  //   }, [article]);
  useEffect(() => {
    const checkIfArticleIsSaved = async () => {
      try {
        const savedArticlesJSON = await AsyncStorage.getItem("savedArticles");
        const savedArticles = savedArticlesJSON
          ? JSON.parse(savedArticlesJSON)
          : [];
        const isArticleSaved = savedArticles.some(
          (a) => a.documentId === article.documentId
        );
        console.log("is saved...", isArticleSaved);
        setIsSaved(isArticleSaved);
      } catch (error) {
        console.error("Failed to check if the article is saved", error);
      }
    };

    if (visible) {
      checkIfArticleIsSaved();
    }
  }, [article, visible]);

  const handleSaveArticle = (article) => {
    setIsSaved(!isSaved);
    saveArticle(article);
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <>
        <TouchableOpacity style={[styles.crossContainer]} onPress={onClose}>
          <View style={[styles.backArrowContainer]}>
            <Ionicons
              name="arrow-back"
              size={24}
              color="black"
              //   style={styles.cross}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bookmarkContainer}
          onPress={() => handleSaveArticle(article)}
        >
          <View style={styles.backContainer}>
            {isSaved ? (
              <FontAwesome name="bookmark" size={33} color={colors.primary3} />
            ) : (
              <FontAwesome
                name="bookmark-o"
                size={33}
                color={colors.primary3}
              />
            )}
          </View>
        </TouchableOpacity>

        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          style={[styles.container, { backgroundColor }]}
          contentContainerStyle={styles.contentContainer}
        >
          <Image
            style={styles.image}
            source={{
              uri: article?.image?.finalUri ?? "https://picsum.photos/1000",
            }}
            resizeMode={"cover"}
          />

          <Text style={[styles.title, { color }]}>
            {article?.info?.ro.nume}
          </Text>
          <Text style={[styles.content, { color: contentColor }]}>
            {article?.info?.ro.content}
          </Text>
        </ScrollView>
        {/* <View
          style={[
            styles.readMoreContainer,
            { backgroundColor: readMoreBgColor },
          ]}
        >
          <Text style={[styles.readMoreText, { color }]} numberOfLines={2}>
            Read more at{" "}
            <Text style={styles.link} onPress={handleURLPress}>
              {article?.url}
            </Text>
          </Text>
        </View> */}
      </>
    </Modal>
  );
};
