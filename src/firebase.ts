import { initializeApp } from 'firebase/app';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  // Your Firebase config object here
  // apiKey: "your-api-key",
  // authDomain: "your-auth-domain",
  // etc...
};

const app = initializeApp(firebaseConfig);
export const functions = getFunctions(app); 