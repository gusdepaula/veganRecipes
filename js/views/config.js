import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const config = {
  apiKey: "AIzaSyDF3DS6NdYxslX_7RaqLGg025GFCAdWiU8",
  authDomain: "veganrecipes-7314c-default-rtdb.firebaseio.com/",
  databaseURL: "https://veganrecipes-7314c-default-rtdb.firebaseio.com/",
  projectId: "veganrecipes-7314c",
};

const app = initializeApp(config);
export const db = getDatabase(app);