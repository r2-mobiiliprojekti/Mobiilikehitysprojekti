import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged as firebaseOnAuthStateChanged, //vanha paska ei toiminu
  User as FirebaseUser
} from 'firebase/auth';
import { firebaseConfig } from '../firebaseConfig';

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

  constructor() {
    try {
      const app = initializeApp(firebaseConfig);
      this.auth = getAuth(app);
      
      firebaseOnAuthStateChanged(this.auth, (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          this.currentUser = {
            email: firebaseUser.email || 'Unknown',
            isGuest: false,
            uid: firebaseUser.uid
          };
        } else {
          this.currentUser = null;
        }
        this.authStateListeners.forEach(listener => {
          listener(this.currentUser);
        });
      });
      
      console.log("Firebase OK");
    } catch (error) {
      console.error("Firebase errored:", error);
      throw new Error("Failed Firebase");
    }
  }

  // sposti ja salasana kirjautuminen
  async loginWithEmail(email: string, password: string): Promise<AppUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      
      return {
        email: user.email || email,
        isGuest: false,
        uid: user.uid
      };
    } catch (error: any) {
      let errorMessage = "Kirjautuminen epäonnistui";
      
      if (error.code === 'auth/invalid-email') {
        errorMessage = "Virheellinen sähköpostiosoiteo";
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = "Käyttäjää ei löydy";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Väärä salasana";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Liikaa yrityksiö";
      }
      
      throw new Error(errorMessage);
    }
  }

  // singuppi sposti ja salasana
  async signupWithEmail(email: string, password: string): Promise<AppUser> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      
      return {
        email: user.email || email,
        isGuest: false,
        uid: user.uid
      };
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
  setGuestUser(): AppUser {
    this.currentUser = {
      email: 'Guest@guest.com',
      isGuest: true,
      uid: 'guest-user-id'
    };
    return this.currentUser;
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.currentUser = null;
    } catch (error) {
      console.error("Logout error:", error);
      throw new Error("Uloskirjautuminen epäonnistui");
    }
  }

  // hanki data
  getCurrentUser(): AppUser | null {
    return this.currentUser;
  }

  // Lister
  onAuthStateChanged(listener: (user: AppUser | null) => void) {
    this.authStateListeners.push(listener);
    

    return () => {
      const index = this.authStateListeners.indexOf(listener);
      if (index > -1) {
        this.authStateListeners.splice(index, 1);
      }
    };
  }
}

// kiitos intialainen tästä
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