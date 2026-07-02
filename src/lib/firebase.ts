import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  deleteDoc,
  writeBatch
} from 'firebase/firestore';

const firebaseConfig = {
  projectId: "gen-lang-client-0527426690",
  appId: "1:249176942327:web:4d5e905194170f4b5b55f2",
  apiKey: "AIzaSyBzC_gCyAA-OVs9gpZrAhZraaSYaztvPdg",
  authDomain: "gen-lang-client-0527426690.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-74bf631a-8ad0-4f43-b689-935cbbb481e3",
  storageBucket: "gen-lang-client-0527426690.firebasestorage.app",
  messagingSenderId: "249176942327",
  measurementId: ""
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Attempt to enable offline persistence (IndexedDB) safely
import { enableIndexedDbPersistence } from 'firebase/firestore';

if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Firestore persistence failed-precondition (multiple tabs open).');
    } else if (err.code === 'unimplemented') {
      console.warn('Firestore persistence is unimplemented in this browser/environment.');
    } else {
      console.warn('Firestore persistence could not be enabled:', err.message);
    }
  });
}

// Helper to get or create a stable User ID for cloud syncing
export function getOrCreateUserId(): string {
  let userId = localStorage.getItem('ahdafi_cloud_user_id');
  if (!userId) {
    userId = `usr-${Math.random().toString(36).substring(2, 11)}`;
    localStorage.setItem('ahdafi_cloud_user_id', userId);
  }
  return userId;
}
