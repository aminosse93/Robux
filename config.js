// Configuration Firebase pour le frontend
// À placer dans public/js/config.js

const firebaseConfig = {
  apiKey: "AIzaSyB35lFaWhO0NOVuQmD1gKKm9VcbXKy3v2U",
  authDomain: "galaxyrbx-516d9.firebaseapp.com",
  projectId: "galaxyrbx-516d9",
  storageBucket: "galaxyrbx-516d9.firebasestorage.app",
  messagingSenderId: "203542463763",
  appId: "1:203542463763:web:76149c03c7a980f055c6e6"
};

// Initialiser Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// URLs des Cloud Functions
const FUNCTIONS_BASE_URL = "https://us-central1-galaxyrbx-516d9.cloudfunctions.net";

const API_ENDPOINTS = {
  getCoins: `${FUNCTIONS_BASE_URL}/getCoins`,
  savePhone: `${FUNCTIONS_BASE_URL}/savePhone`,
  api: `${FUNCTIONS_BASE_URL}/api`,
  postback: `${FUNCTIONS_BASE_URL}/postback`,
  userProfile: `${FUNCTIONS_BASE_URL}/userProfile`,
  withdraw: `${FUNCTIONS_BASE_URL}/withdraw`,
  checkSubscription: `${FUNCTIONS_BASE_URL}/checkSubscription`,
  claimSocialReward: `${FUNCTIONS_BASE_URL}/claimSocialReward`,
  adminWithdrawals: `${FUNCTIONS_BASE_URL}/adminWithdrawals`
};

// Exemple d'utilisation des fonctions

// Récupérer les coins d'un utilisateur
async function getUserCoins(userId) {
  try {
    const response = await fetch(`${API_ENDPOINTS.getCoins}?userid=${userId}`);
    const data = await response.json();
    
    if (data.success) {
      console.log('Coins:', data.coins);
      return data.coins;
    } else {
      console.error('Error:', data.error);
      return null;
    }
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
}

// Sauvegarder un numéro de téléphone
async function savePhoneNumber(userId, phoneNumber) {
  try {
    const response = await fetch(API_ENDPOINTS.savePhone, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userid: userId,
        phone: phoneNumber
      })
    });
    
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Save phone error:', error);
    return false;
  }
}

// Vérifier/Créer un utilisateur Roblox
async function checkRobloxUser(username, confirm = false) {
  try {
    const response = await fetch(
      `${API_ENDPOINTS.api}?username=${username}&confirm=${confirm}`
    );
    const data = await response.json();
    
    if (data.success) {
      return {
        id: data.id,
        username: data.username,
        avatar: data.avatar,
        coins: data.coins,
        profileUrl: data.profileUrl
      };
    }
    return null;
  } catch (error) {
    console.error('Roblox user check error:', error);
    return null;
  }
}

// Effectuer un retrait
async function withdrawCoins(userId, coins) {
  try {
    const response = await fetch(API_ENDPOINTS.withdraw, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userid: userId,
        coins: coins
      })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Withdraw error:', error);
    return { success: false, error: error.message };
  }
}

// Récupérer le profil utilisateur
async function getUserProfile(userId) {
  try {
    const response = await fetch(API_ENDPOINTS.userProfile, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userid: userId
      })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Profile error:', error);
    return null;
  }
}

// Vérifier le statut d'un abonnement social
async function checkSocialSubscription(userId, network) {
  try {
    const response = await fetch(
      `${API_ENDPOINTS.checkSubscription}?userid=${userId}&network=${network}`
    );
    const data = await response.json();
    return data.claimed;
  } catch (error) {
    console.error('Check subscription error:', error);
    return false;
  }
}

// Réclamer une récompense sociale
async function claimSocialReward(userId, network, coins) {
  try {
    const response = await fetch(API_ENDPOINTS.claimSocialReward, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userid: userId,
        network: network,
        coins: coins
      })
    });
    
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Claim reward error:', error);
    return false;
  }
}

// Écouter les changements en temps réel (Firestore)
function listenToUserCoins(userId, callback) {
  return db.collection('user_coins').doc(userId).onSnapshot((doc) => {
    if (doc.exists) {
      callback(doc.data().coins);
    }
  });
}

// Exemple d'utilisation avec un listener
// const unsubscribe = listenToUserCoins('123456', (coins) => {
//   console.log('Coins mis à jour:', coins);
//   document.getElementById('coinsDisplay').textContent = coins;
// });
// Pour arrêter d'écouter : unsubscribe();

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    API_ENDPOINTS,
    getUserCoins,
    savePhoneNumber,
    checkRobloxUser,
    withdrawCoins,
    getUserProfile,
    checkSocialSubscription,
    claimSocialReward,
    listenToUserCoins
  };
}