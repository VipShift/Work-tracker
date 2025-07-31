import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyA_Lwhcwyf8yedWLjU_vDgtsGZNd1DpG5I',
  authDomain: 'work-tracker-316be.firebaseapp.com',
  projectId: 'work-tracker-316be',
  storageBucket: 'work-tracker-316be.firebasestorage.app',
  messagingSenderId: '809563938410',
  appId: '1:809563938410:web:ff49f5493f2b0449a37413',
  databaseURL:
    'https://work-tracker-316be-default-rtdb.europe-west1.firebasedatabase.app/',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
