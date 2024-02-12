import React, { useEffect, useRef, useState, status } from "react";
import RootNavigation from "./navigations";
import { screenName } from "./src/utils/screenName";
import { MenuProvider } from "react-native-popup-menu";
import { Provider } from "react-redux";
import { Platform, View, ImageBackground, TextComponent } from "react-native";
import {
  ActivityIndicator,
  Button,
  Card,
  Paragraph,
  Text,
} from "react-native-paper";

import Geocoder from "react-native-geocoding";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import * as Analytics from "expo-firebase-analytics";
import { langObj } from "./src/utils/labels";
import { getGuestLoginDetails } from "./src/actions/patientActions";

// import messaging from '@react-native-firebase/messaging';

import Purchases, { PurchasesOffering } from "react-native-purchases";
import Bugsnag from "@bugsnag/expo";
import { Mode } from "react-hook-form";
import i18n from "./i18n";
import {
  NavigationContainer,
  NavigationContext,
  useNavigation,
} from "@react-navigation/native";

import { ErrorView } from "./src/components/ErrorView";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HourClockProvider } from "./src/context/HourClockContext";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { NavBarVisibilityProvider } from "./src/context/NavbarVisibilityContext";
import { NavigationProvider } from "./src/context/NavigationContext";
import { LanguageProvider } from "./src/context/LanguageContext";
import { ApiDataProvider } from "./src/context/ApiContext";
import store from "./Store";
import * as Font from "expo-font";
import { NumberProvider } from "./src/context/NumberContext";

import mobileAds from "react-native-google-mobile-ads";

mobileAds()
  .initialize()
  .then((adapterStatuses) => {
    console.log("Initialization of adds complete!");
    // Initialization complete!
  });

// AppOpenAd.createForAdRequest(TestIds.APP_OPEN);

// InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL);

// RewardedAd.createForAdRequest(TestIds.REWARDED);

// Start BugSnag first...
Bugsnag.start();

// -----------------------NOTIFICATION START-------------------------

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Can use this function below OR use Expo's Push Notification Tool from: https://expo.dev/notifications
async function sendPushNotification(expoPushToken) {
  // const message = {
  //   to: expoPushToken,
  //   sound: 'default',
  //   title: 'Original Title',
  //   body: 'And here is the body TEST YES!!',
  //   data: { someData: 'goes here' },
  // };

  // await fetch('https://exp.host/--/api/v2/push/send', {
  //   method: 'POST',
  //   headers: {
  //     Accept: 'application/json',
  //     'Accept-encoding': 'gzip, deflate',
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(message),
  // });

  await fetch("https://fcm.googleapis.com/fcm/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `AAAASNaBros:APA91bE2kVx0hmfyRDaP2XYNMzAmk8PK_1TTliRWRmpD92kZJlg4hZ6PnvddtHxgElip0cQjIjmA0MUnCh2xDJdR05Cy_-tNchnIMfLigL8OAvfWLsgxxn8_La1bmP_x5TBFOER6aG83`,
    },
    body: JSON.stringify({
      to: expoPushToken,
      priority: "normal",
      data: {
        experienceId: "@shikatedo1/styleconnect",
        scopeKey: "@shikatedo1/styleconnect",
        title: "📧 You've got mail",
        message: "Hello world! 🌐",
      },
    }),
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}
// -----------------------NOTIFICATION END-------------------------

const App = () => {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const [languageLoaded, setLanguageLoaded] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const notificationListener = useRef();
  const responseListener = useRef();

  // REVENUE CAT START -----------------------------------------------

  // const [currentOffering, setCurrentOffering] =
  // useState<PurchasesOffering | null>(null);

  // const APIKeys = {
  //   google: "goog_xdBhVfZFnrgNwtEvJFwAYfscpcu",
  // };

  // const fetchDataRevenueCat = async () => {
  //   try {
  //     const offerings = await Purchases.getOfferings();
  //     setCurrentOffering(offerings.current);
  //     console.log("our offerings...", offerings.all);
  //   } catch (error) {
  //     console.log("fetchDataRevenueCat...error....", error);
  //   }
  // };

  // const setupRevenueCat = async () => {
  //   try {
  //     Purchases.setDebugLogsEnabled(true);
  //     await Purchases.configure({ apiKey: APIKeys.google });
  //   } catch (err) {
  //     console.log("error on revenue cat config....", err);
  //   }
  // };

  // REVENUE CAT END -----------------------------------------------

  // -----------------------NOTIFICATION START---------------------------

  const handleDevicePushTokeNotification = async () => {
    try {
      const token = (await Notifications.getDevicePushTokenAsync()).data;
    } catch (e) {
      Bugsnag.notify("error on....handleDevicePushTokeNotification...", e);
      console.log("error on....handleDevicePushTokeNotification...", e);
    }
  };

  async function RemoveNotificationOnReceive(idNotification) {
    // // Cancel the received notification
    // Notifications.cancelScheduledNotificationAsync(idNotification)
    // .then(() => {
    //   console.log('Notification canceled:', notification);
    // })
    // .catch(error => {
    //   console.log('Failed to cancel notification:', error);
    // });

    console.log(
      "----------------Start Test RemoveNotificationOnReceive---------"
    );
    console.log(idNotification);
    const result = await AsyncStorage.getItem("localNotifications");
    let localNotifications = [];
    let newNotifications = [];
    let newFullNotificationArr = [];

    if (result !== null) localNotifications = JSON.parse(result);
    console.log("----localNotifications BEFORE REMOVE-----");
    console.log(localNotifications);

    for (let i = 0; i < localNotifications.length; i++) {
      console.log("----localNotifications loop-----");
      console.log(localNotifications[i].notifications);
      newFullNotificationArr = localNotifications.filter(
        (n) => n.notificationId !== idNotification
      );
    }
    console.log("----Notifications AFTER REMOVE-----");
    console.log(newFullNotificationArr);
    await AsyncStorage.setItem(
      "localNotifications",
      JSON.stringify(newFullNotificationArr)
    );
  }

  // -----------------------NOTIFICATION END---------------------------

  const handleRequestLocationPermission = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
    } catch (e) {
      Bugsnag.notify("error on handleRequestLocationPermission....", e);
      console.log("error on handleRequestLocationPermission....", e);
    }
  };

  async function loadFonts() {
    await Font.loadAsync({
      Entypo: require("./assets/fonts/Entypo.ttf"),
      Lora: require("./assets/fonts/Lora/Lora-SemiBold.ttf"), // Asigură-te că calea este corectă
      LoraBold: require("./assets/fonts/Lora/Lora-Bold.ttf"), // Asigură-te că calea este corectă
      // adaugă aici alte fonturi după necesitate
    });
    setFontsLoaded(true); // Actualizează starea după încărcarea fonturilor
  }
  useEffect(() => {
    loadFonts();

    // setupRevenueCat();
    // fetchDataRevenueCat();
    // Bugsnag.notify(new Error("Test error"));

    // COMMENTED FOR WARNING

    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem("@userLanguage");
        if (savedLanguage !== null) {
          i18n.locale = savedLanguage;
        }
      } catch (e) {
        console.error("Failed to load the language from storage");
      }
      setLanguageLoaded(true);
    };

    loadLanguage();

    // handleDevicePushTokeNotification();

    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    // COMMENTED FOR WARNING

    // handleRequestLocationPermission();

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("-------HERE 1---------");
        console.log(notification.request.identifier);
        RemoveNotificationOnReceive(notification.request.identifier);
        // setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("-------HERE 2---------");
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    // Asigură-te că evenimentul este logat numai după ce atât fonturile, cât și limba au fost încărcate
    if (languageLoaded && fontsLoaded) {
      const logScreenView = async () => {
        await Analytics.logEvent("screen_view", {
          screen_name: "App enter",
        });
      };

      logScreenView().catch((error) => console.error(error));
    }
  }, [languageLoaded, fontsLoaded]); // Dependențele efectului

  const Stack = createNativeStackNavigator();

  if (!languageLoaded || !fontsLoaded) {
    return (
      // Render a loading screen or spinner
      <ActivityIndicator />
    );
  }
  return (
    <>
      <NumberProvider>
        <ApiDataProvider>
          <LanguageProvider>
            <NavigationProvider>
              <NavBarVisibilityProvider>
                <AuthProvider>
                  <NavigationContainer>
                    <StatusBar style="light" />
                    <Provider store={store}>
                      <MenuProvider>
                        <RootNavigation />
                      </MenuProvider>
                    </Provider>
                  </NavigationContainer>
                </AuthProvider>
              </NavBarVisibilityProvider>
            </NavigationProvider>
          </LanguageProvider>
        </ApiDataProvider>
      </NumberProvider>
    </>
  );
};
export default App;
