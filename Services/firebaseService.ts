import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseConfig } from '../example_firebaseConfig';

//storage keys
const USER_STORAGE_KEY = '@user_data';
const GUEST_STORAGE_KEY = '@guest_user';

//data
export type AppUser = {
  email: string;
  isGuest: boolean;
  uid: string;
};

class FirebaseService {
  private auth;
  private currentUser: AppUser | null = null;
  private authStateListeners: ((user: AppUser | null) => void)[] = [];
  private isInitialized = false;
  private initPromise: Promise<void>;

  constructor() {
    this.initPromise = this.initialize();
  }

  private async initialize() {
    try {
      const app = initializeApp(firebaseConfig);
      this.auth = getAuth(app);
      
      console.log("Firebase initialized");
      
      //Load stored user EKANA
      await this.loadStoredUser();
      
      //firebase listeneri
      firebaseOnAuthStateChanged(this.auth, async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          const user: AppUser = {
            email: firebaseUser.email || 'Unknown',
            isGuest: false,
            uid: firebaseUser.uid
          };
          
          this.currentUser = user;
          await this.saveUserToStorage(user);
        } else {

          if (!this.currentUser) {

            const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
            const storedGuest = await AsyncStorage.getItem(GUEST_STORAGE_KEY);
            
            if (storedUser) {
              this.currentUser = JSON.parse(storedUser);
            } else if (storedGuest) {
              this.currentUser = JSON.parse(storedGuest);
            } else {
              this.currentUser = null;
            }
          }
        }
        this.isInitialized = true;
        this.notifyListeners();
      });
      
    } catch (error) {
      console.error("Firebase initialization error:", error);
      throw new Error("Failed Firebase");
    }
  }

  async waitForInit() {
    await this.initPromise;
  }

  //load
  private async loadStoredUser() {
    try {

      const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
        console.log("Loaded stored user:", this.currentUser.email);
        return;
      }
      

      const storedGuest = await AsyncStorage.getItem(GUEST_STORAGE_KEY);
      if (storedGuest) {
        this.currentUser = JSON.parse(storedGuest);
        console.log("Loaded stored guest:", this.currentUser.email);
      } else {
        console.log("No stored user found");
      }
    } catch (error) {
      console.error("Error loading stored user:", error);
    }
  }

  //save
  private async saveUserToStorage(user: AppUser) {
    try {
      if (user.isGuest) {
        await AsyncStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(user));
        await AsyncStorage.removeItem(USER_STORAGE_KEY);
      } else {
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        await AsyncStorage.removeItem(GUEST_STORAGE_KEY);
      }
      console.log("User saved to storage:", user.email);
    } catch (error) {
      console.error("Error saving user to storage:", error);
    }
  }


  private async clearUserStorage() {
    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      await AsyncStorage.removeItem(GUEST_STORAGE_KEY);
      console.log("User storage cleared");
    } catch (error) {
      console.error("Error clearing user storage:", error);
    }
  }


  private notifyListeners() {
    this.authStateListeners.forEach(listener => {
      listener(this.currentUser);
    });
  }

  // sposti ja salasana kirjautuminen
  async loginWithEmail(email: string, password: string): Promise<AppUser> {
    await this.waitForInit();
    
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      
      const appUser: AppUser = {
        email: user.email || email,
        isGuest: false,
        uid: user.uid
      };
      
      this.currentUser = appUser;
      await this.saveUserToStorage(appUser);
      this.notifyListeners();
      return appUser;
    } catch (error: any) {
      let errorMessage = "Kirjautuminen epäonnistui";
      
      if (error.code === 'auth/invalid-email') {
        errorMessage = "Virheellinen sähköpostiosoite";
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = "Käyttäjää ei löydy";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Väärä salasana";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Liikaa yrityksiä";
      }
      
      throw new Error(errorMessage);
    }
  }

  // singuppi sposti ja salasana
  async signupWithEmail(email: string, password: string): Promise<AppUser> {
    await this.waitForInit();
    
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      
      const appUser: AppUser = {
        email: user.email || email,
        isGuest: false,
        uid: user.uid
      };
      
      this.currentUser = appUser;
      await this.saveUserToStorage(appUser);
      this.notifyListeners();
      return appUser;
    } catch (error: any) {
      let errorMessage = "Tilin luonti epäonnistui";
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Sähköpostiosoite on jo käytössä";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Virheellinen sähköpostiosoite";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Salasanan tulee olla vähintään 6 merkkiä";
      }
      
      throw new Error(errorMessage);
    }
  }

  // guesti useri
  async setGuestUser(): Promise<AppUser> {
    await this.waitForInit();
    
    const guestUser: AppUser = {
      email: 'guest@example.com',
      isGuest: true,
      uid: 'guest-user-id-' + Date.now()
    };
    
    this.currentUser = guestUser;
    await this.saveUserToStorage(guestUser);
    this.notifyListeners();
    
    console.log("Guest user set and saved:", guestUser.email);
    return guestUser;
  }

  //logout
  async logout(): Promise<void> {
    await this.waitForInit();
    
    try {
      //vain firebase!
      if (!this.currentUser?.isGuest) {
        await signOut(this.auth);
      }
      
      this.currentUser = null;
      await this.clearUserStorage();
      this.notifyListeners();
    } catch (error) {
      console.error("Logout error:", error);
      throw new Error("Uloskirjautuminen epäonnistui");
    }
  }

  //get data
  async getStoredUser(): Promise<AppUser | null> {
    await this.waitForInit();
    return this.currentUser;
  }

  //hanki data
  getCurrentUser(): AppUser | null {
    return this.currentUser;
  }

  //listener
  onAuthStateChanged(listener: (user: AppUser | null) => void) {
    this.authStateListeners.push(listener);
    

    if (this.isInitialized) {
      listener(this.currentUser);
    }
    
    return () => {
      const index = this.authStateListeners.indexOf(listener);
      if (index > -1) {
        this.authStateListeners.splice(index, 1);
      }
    };
  }
}


export const firebaseService = new FirebaseService();

export const initializeFirebase = () => {
  return Promise.resolve(true);
};

export const loginWithEmail = (email: string, password: string) => {
  return firebaseService.loginWithEmail(email, password);
};

export const signupWithEmail = (email: string, password: string) => {
  return firebaseService.signupWithEmail(email, password);
};

export const logout = () => {
  return firebaseService.logout();
};

export const getCurrentUser = () => {
  return firebaseService.getCurrentUser();
};

export const setGuestMode = () => {
  return firebaseService.setGuestUser();
};

export const onAuthStateChange = (listener: (user: AppUser | null) => void) => {
  return firebaseService.onAuthStateChanged(listener);
};

//uusi roska22
export const getStoredUser = () => {
  return firebaseService.getStoredUser();
};