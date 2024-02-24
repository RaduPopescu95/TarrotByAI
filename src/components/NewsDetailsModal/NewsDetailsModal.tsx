import React, { useState, useCallback } from "react";
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

export const NewsDetailsModal: React.FC<{
  visible: boolean;
  article: {
    author: string;
    title: string;
    urlToImage: string;
    publishedAt: string;
    url: string;
    content: string;
  };
  articleIndex: number;
  onClose: () => void;
}> = ({ visible, article, articleIndex, onClose }) => {
  const backgroundColor = useColorScheme() === "dark" ? "#000" : "#fff";
  const color = useColorScheme() === "dark" ? "#fff" : "#000";
  const contentColor = useColorScheme() === "dark" ? "#bbb" : "#444";
  const readMoreBgColor = useColorScheme() === "dark" ? "#222" : "#ddd";

  //   const handleURLPress = useCallback(() => {
  //     Linking.openURL(article?.url);
  //   }, [article]);

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <>
        <TouchableOpacity style={styles.crossContainer} onPress={onClose}>
          <View style={styles.backContainer}>
            <Ionicons
              name="arrow-back"
              size={24}
              color="black"
              //   style={styles.cross}
            />
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
