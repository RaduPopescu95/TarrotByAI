import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "../../i18n";

// ... codul existent ...

export const handleLanguagei18n = async (language) => {
  console.log(`${language} Selected in i18n`);

  // Setează locale-ul i18n
  let newLocale;
  switch (language) {
    case "Romanian":
      newLocale = "ro";
      break;
    case "English":
      newLocale = "en";
      break;
    case "Spanish":
      newLocale = "es"; // Presupunând că aveți traduceri pentru spaniolă
      break;
    // Adăugați aici și alte limbi dacă este cazul
  }

  i18n.locale = newLocale;

  // Salvarea preferinței în AsyncStorage pentru persistență
  try {
    await AsyncStorage.setItem("@userLanguage", newLocale);
  } catch (e) {
    console.error("Failed to save the language to storage");
  }
  return newLocale;
};

// ... restul codului LanguageSelectScreen ...
