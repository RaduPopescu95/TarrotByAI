const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch");

admin.initializeApp();

exports.checkAndSendNotifications = functions.pubsub.schedule("every 5 minutes")
    .timeZone("Europe/Bucharest")
    .onRun(async (context) => {
      const now = new Date();
      const offset = 2;
      now.setHours(now.getHours() + offset);

      const parts = now.toISOString().split("T")[0].split("-");
      const dateString = `${parts[2]}-${parts[1]}-${parts[0]}`;
      let article = {};

      const hours = now.getHours().toString().padStart(2, "0");
      // Rotunjește minutele în jos la cel mai apropiat multiplu de 5
      const minutes = Math.floor(now.getMinutes() / 5) * 5;
      const timeString = `${hours}:${minutes.toString().padStart(2, "0")}`;

      console.log("timeString.....", timeString);
      console.log("dateString.....", dateString);
      const b = "BlogArticole";
      const articlesSnapshot = await admin.firestore().collection(b)
          .where("firstUploadDate", "==", dateString)
          .where("firstUploadtime", "==", timeString)
          .get();

      if (articlesSnapshot.empty) {
        console.log("Niciun articol programat pentru acum.");
        return;
      }

      articlesSnapshot.forEach((doc) => article = doc.data());

      console.log("articol primit...", article);

      const tokens = [];
      const u = "userTokens";
      const userTokensSnap = await admin.firestore().collection(u).get();
      userTokensSnap.forEach((doc) => tokens.push(doc.data()));

      // Impărțirea tokenurilor în batch-uri
      const BATCH_SIZE = 100;
      for (let i = 0; i < tokens.length; i += BATCH_SIZE) {
        const batch = tokens.slice(i, i + BATCH_SIZE);

        const messages = batch.map((token) => {
          // Determină limbajul în funcție de condițiile specificate
          let languageKey;
          if (token.language === "hi") {
            languageKey = "hu";
          } else if (token.language === "id") {
            languageKey = "ru";
          } else {
            languageKey = token.language;
          }
          console.log("language key from userTokens...", languageKey);
          console.log("articole info with lang...", article.info[languageKey]);
          return {
            to: token.token,
            sound: "default",
            title: article.info[languageKey].nume,
            body: article.info[languageKey].descriere,
          };
        });
        // Trimite un batch de notificări
        try {
          const response = await fetch("https://exp.host/--/api/v2/push/send", {
            method: "POST",
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(messages),
          });

          const responseData = await response.json();
          console.log("Success pentru batch:", responseData);
        } catch (error) {
          console.error("Eroare:", error);
        }
      }
    });

exports.sendRandomNotification = functions.pubsub.schedule("every 120 minutes")
    .timeZone("Europe/Bucharest")
    .onRun(async (context) => {
      const loc = "RegularNotifications";
      const nS = await admin.firestore().collection(loc).get();
      const notifications = [];
      nS.forEach((doc) => notifications.push(doc.data()));

      if (notifications.length === 0) {
        console.log("Nici o notificare disponibilă în baza de date.");
        return;
      }

      // Selectează o notificare aleatorie
      const randomIndex = Math.floor(Math.random() * notifications.length);
      const selectedNotification = notifications[randomIndex];

      // Obține toate tokenurile de utilizator
      const tS = await admin.firestore().collection("userTokens").get();
      const tokens = [];
      tS.forEach((doc) => tokens.push(doc.data()));

      // Imparte tokenurile în batch-uri dacă este necesar
      const BATCH_SIZE = 100;
      for (let i = 0; i < tokens.length; i += BATCH_SIZE) {
        const batch = tokens.slice(i, i + BATCH_SIZE);

        const messages = batch.map((token) => ({
          to: token.token,
          sound: "default",
          title: selectedNotification.info[token.language].nume,
          body: selectedNotification.info[token.language].descriere,
        }));

        // Trimite un batch de notificări
        try {
          const response = await fetch("https://exp.host/--/api/v2/push/send", {
            method: "POST",
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(messages),
          });

          const responseData = await response.json();
          console.log("Notificări trimise cu succes:", responseData);
        } catch (error) {
          console.error("Eroare la trimiterea notificărilor:", error);
        }
      }
    });
