import React, { useState, useEffect } from "react";
import { TextInput, useColorScheme } from "react-native";
import { useDispatch } from "react-redux";

import styles from "./styles";

export const SearchInput: React.FC<{
  searchText: string;
  setSearchText: Function;
  setIsLoading: Function;
}> = ({ searchText, setSearchText, setIsLoading }) => {
  const backgroundColor = useColorScheme() === "dark" ? "#333" : "#ddd";
  const placeholderColor = useColorScheme() === "dark" ? "#eee" : "#111";
  const color = useColorScheme() === "dark" ? "#fff" : "#000";
  const dispatch = useDispatch();

  // Crearea unei funcții debounce personalizate
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const searchForText = debounce((text) => {
    if (text?.trim().length > 0) {
      // Functie pentru setare search result
      console.log("Searching for:", text); // Exemplu de implementare
    } else {
      // Functie pentru resetare search result
      console.log("Reset search results"); // Exemplu de implementare
    }
  }, 1000);

  return (
    <TextInput
      placeholder={"Search"}
      placeholderTextColor={placeholderColor}
      style={[styles.container, { backgroundColor, color }]}
      value={searchText}
      onChangeText={(text: string) => {
        setSearchText(text);
        searchForText(text);
      }}
      maxLength={40}
      returnKeyType={"search"}
    />
  );
};
