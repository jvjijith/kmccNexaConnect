import { initializeApp, type FirebaseApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { firebaseConfig } from "./firebase.config"

const appFirebase: FirebaseApp = initializeApp(firebaseConfig)
export const auth = getAuth(appFirebase)

export default appFirebase