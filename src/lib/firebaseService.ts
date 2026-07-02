import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { 
  AnnualGoal, 
  MonthlyGoal, 
  WeeklyGoal, 
  DailyTask, 
  AchievementBadge, 
  UserProgress, 
  ActivityLog 
} from '../types';

export interface CloudData {
  annualGoals: AnnualGoal[];
  monthlyGoals: MonthlyGoal[];
  weeklyGoals: WeeklyGoal[];
  dailyTasks: DailyTask[];
  badges: AchievementBadge[];
  userProgress: UserProgress;
  activityLogs: ActivityLog[];
}

/**
 * Loads the user's master document from Firestore.
 * Returns null if the user has no cloud profile yet.
 */
export async function loadUserData(userId: string): Promise<CloudData | null> {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as CloudData;
    }
    return null;
  } catch (error: any) {
    const isOffline = error?.code === 'unavailable' || error?.message?.includes('offline') || !navigator.onLine;
    if (isOffline) {
      console.warn('Firestore load failed because client is offline. Falling back to local cache.', error.message || error);
    } else {
      console.warn('Could not load cloud data from Firestore (falling back to local storage):', error.message || error);
    }
    return null; // Return null so app gracefully falls back to local data
  }
}

/**
 * Saves the entire user state to the Firestore master document
 */
export async function saveUserData(userId: string, data: CloudData): Promise<void> {
  try {
    const docRef = doc(db, 'users', userId);
    await setDoc(docRef, data);
  } catch (error: any) {
    const isOffline = error?.code === 'unavailable' || error?.message?.includes('offline') || !navigator.onLine;
    if (isOffline) {
      console.warn('Firestore save failed/deferred because client is offline. Sync will resume when online.', error.message || error);
    } else {
      console.warn('Error saving user data to Firestore:', error.message || error);
    }
  }
}
