import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"
import { firebaseConfig } from "../config/firebase.config"

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

// Get Auth instance
export const auth = getAuth(app)

export default app