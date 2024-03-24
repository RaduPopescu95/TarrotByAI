import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  useColorScheme,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../utils/colors';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { collection, query, orderBy, startAfter, limit, getDocs, where } from 'firebase/firestore';
import styles from './styles';
import { NewsCard } from '../../components/NewsCard/NewsCard';
import { NewsDetailsModal } from '../../components/NewsDetailsModal/NewsDetailsModal';
import { SearchInput } from '../../components/SearchInput/SearchInput';
import { NewsTags } from '../../components/NewsTags/NewsTags';
import { db } from '../../../firebase';
import { useLanguage } from '../../context/LanguageContext';
import { handleQueryFirestoreGeneral } from '../../utils/firestoreUtils';
import { filterArticlesBeforeCurrentTime } from '../../utils/commonUtils';

import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';

// Înlocuiți cu ID-ul real al unității de anunțuri pentru producție
const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-9577714849380446/7080054250';
const interstitialAd = InterstitialAd.createForAdRequest(adUnitId);


const PAGE_SIZE = 5; // Definește câte articole să fie încărcate odată

const News = () => {
  const [articles, setArticles] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const { language, changeLanguage } = useLanguage();
  const [interstitialLoaded, setInterstitialLoaded] = useState(false);

  const fetchArticles = async (refresh = false) => {
    console.log("Start fetch...")
    setIsLoading(true);
    let articlesRef = collection(db, 'BlogArticole');
    let q = query(articlesRef, orderBy('firstUploadDate', 'desc'), orderBy('firstUploadtime', 'desc'), limit(PAGE_SIZE));

    if (!refresh && lastVisible) {
      q = query(articlesRef, orderBy('firstUploadDate', 'desc'), orderBy('firstUploadtime', 'desc'), startAfter(lastVisible), limit(PAGE_SIZE));
    }

    const documentSnapshots = await getDocs(q);
    const moreArticles = documentSnapshots.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setArticles(refresh ? moreArticles : [...articles, ...moreArticles]);
    setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
    setIsLoading(false);
  };

  const handleQueryData = async () => {
    console.log("query....")
    let dataArt = await handleQueryFirestoreGeneral(
      "BlogArticole",
      "categorie",
      selectedCategory
      );
      console.log("articles data...query...", dataArt);
      console.log("query....2")


    let articlesData  = filterArticlesBeforeCurrentTime(dataArt)
    console.log("Articole...aici...", articlesData)


    let articles = {};
    if (articlesData.length > 0) {
      // Sortarea articolelor după data și ora lor
      const sortedArticles = articlesData.sort((a, b) => {
        // Combină data și ora într-un singur string și convertește-le în obiecte de tip Date
        const dateTimeA = new Date(`${a.firstUploadDate} ${a.firstUploadtime}`);
        const dateTimeB = new Date(`${b.firstUploadDate} ${b.firstUploadtime}`);

        // Compară obiectele de tip Date
        return dateTimeB - dateTimeA;
      });

      // Selectarea celor mai noi două articole
      const latestArticles = sortedArticles.slice(0, 2);

      // Selectarea celor mai noi cinci articole
      const latestFiveArticles = sortedArticles.slice(0, 5);

      // Selectarea celui mai nou articol
      const lastArticle = sortedArticles[0]; // Primul articol din lista sortată este cel mai recent

      // Returnarea datelor către componenta Next.js
      articles = articlesData
    } else {
      articles = articlesData
    }
    setArticles(articles);
  };

  useEffect(() => {
    // function to query firestore by category
    console.log("filter by category", selectedCategory);
    if (selectedCategory === "All") {
      fetchArticles(true);
    } else {
      handleQueryData();
    }
  }, [selectedCategory]);

  // useEffect(() => {
  //   fetchArticles(true);
  // }, [selectedCategory]);

  const handleRefresh = useCallback(() => {
    fetchArticles(true);
  }, [selectedCategory]);

  const openModalWithArticle = async (article) => {
    await interstitialAd.show();
    setTimeout(() => {
      setSelectedArticle(article);
      setModalVisible(true);
    }, 500); // Ajustează întârzierea după necesități
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleSearch = async (text) => {
    setSelectedCategory("All")
    if (text.trim() === '') {
      // Dacă caseta de căutare este goală, reîncarcă toate articolele
      fetchArticles(true);
      return;
    }
  
    setIsLoading(true);
    const searchTextLower = text.toLowerCase();
  
    let articles = []; // Inițializează un array gol pentru rezultatele căutării
  
    // Obține toate documentele din colecția BlogArticole
    const querySnapshot = await getDocs(collection(db, 'BlogArticole'));
  
    querySnapshot.forEach((doc) => {
      const data = doc.data();
  
      // Determină câmpul specific în care să cauți bazat pe limbajul selectat și îl convertește la minuscule
      let articleName = '';
      switch (language) {
        case 'hi':
          articleName = data.info?.hu?.nume?.toLowerCase() || '';
          break;
        case 'id':
          articleName = data.info?.ru?.nume?.toLowerCase() || '';
          break;
        default:
          articleName = data.info?.[language]?.nume?.toLowerCase() || '';
          break;
      }
  
      // Verifică dacă textul de căutare convertit la minuscule este prezent în numele articolului
      if (articleName.includes(searchTextLower)) {
        articles.push({ id: doc.id, ...data });
      }
    });
    console.log("Articles...legnth", articles.length)
    // Actualizează starea cu rezultatele căutării
    setArticles(articles);
    setIsLoading(false);
  };

  const saveArticle = async (article) => {
    try {
      // Obține lista curentă de articole salvate
      const savedArticlesJSON = await AsyncStorage.getItem("savedArticles");
      let savedArticles = savedArticlesJSON
        ? JSON.parse(savedArticlesJSON)
        : [];

      // Verifică dacă articolul există deja în listă
      const existingIndex = savedArticles.findIndex(
        (a) => a.documentId === article.documentId
      );

      if (existingIndex !== -1) {
        // Dacă articolul există deja, îl ștergem
        savedArticles.splice(existingIndex, 1);
        console.log("Article removed successfully");
      } else {
        // Dacă articolul nu există, îl adăugăm
        savedArticles.push(article);
        console.log("Article added successfully");
      }

      // Salvează lista actualizată înapoi în AsyncStorage
      await AsyncStorage.setItem(
        "savedArticles",
        JSON.stringify(savedArticles)
      );
    } catch (error) {
      console.error("Failed to save or remove the article", error);
    }
  };

  useEffect(() => {
    // Ascultător pentru evenimentul de încărcare a interstitialului
    const loadListener = interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
      setInterstitialLoaded(true);
    });

    // Ascultător pentru evenimentul de închidere a interstitialului
    const closeListener = interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
      // Navigația se face după închiderea interstitialului
      // if (isFuture) {
      //   navigation.navigate(screenName.FutureReading, {
      //     item,
      //   });
      // }
      // Reîncărcați interstitialul pentru utilizări ulterioare
      setInterstitialLoaded(false);
      interstitialAd.load();
    });

    const errorListener = interstitialAd.addAdEventListener(
      AdEventType.ERROR,
      (error) => {
        console.error(error);
      }
    );




    // Încărcați interstitialul
    interstitialAd.load();

    return () => {
      // Curățare la demontare
      loadListener();
      closeListener();
      errorListener();
    };
  }, []);

  
  const renderArticle = ({ item }) => (
    <NewsCard post={item} onPress={() => openModalWithArticle(item)} />
  );

  return (
    <View style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' }]}>
      <LinearGradient
        colors={[
          colors.gradientLogin1,
          colors.gradientLogin2,
          colors.gradientLogin2,
        ]} // Înlocuiește cu culorile gradientului tău
        style={{
          flex: 1,
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }}
      >
        
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 10,
          }}
        >
          <View style={{ width: "90%" }}>
            <SearchInput
              searchText={searchText}
              setSearchText={setSearchText}
              setIsLoading={setIsLoading}
              handleSearchData={handleSearch}
            />
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("SavedNews")}
            style={{ width: "10%", alignItems: "flex-start" }}
          >
            <FontAwesome name="heart" size={24} color={colors.gradientLogin3} />
          </TouchableOpacity>
        </View>
        {!searchText?.trim() && (
          <NewsTags
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        )}
              {articles?.length === 0 &&
        <Text style={{color:"white", padding:5}}>
        We're brewing some fresh content! Check back soon to read our latest articles. In the meantime, explore our existing resources.
        </Text>
        }
        <FlatList
          data={articles}
          renderItem={renderArticle}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />}
          onEndReached={() => selectedCategory === "All" && searchText.length === 0 ? fetchArticles(false) : console.log("with category or search text length > 0")}
          onEndReachedThreshold={0.5}
          contentContainerStyle={{
            paddingBottom: "25%",
            paddingTop:"5%"
          }} // Asigură-te că există spațiu la marginea inferioară
        />
        
        {modalVisible && (
          <NewsDetailsModal
            visible={modalVisible}
            article={selectedArticle}
            onClose={handleCloseModal}
            saveArticle={saveArticle}
          />
        )}
      </LinearGradient>
    </View>

    
  );
};

export default News;
