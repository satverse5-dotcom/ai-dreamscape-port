import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCL_lGVb-eNTR_KdiGotmAwV9dUtg9h1s8",
  authDomain: "ai-dreamsacpe-port.firebaseapp.com",
  projectId: "ai-dreamsacpe-port",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);