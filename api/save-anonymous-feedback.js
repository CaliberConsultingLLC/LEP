import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Firebase Config - Make sure these match your Firebase project settings
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase (prevents reinitialization if already initialized)
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const feedbackArray = req.body;  // Expecting an array of feedback entries

        if (!Array.isArray(feedbackArray)) {
            return res.status(400).json({ error: "Invalid data format. Expected an array." });
        }

        const feedbackCollection = collection(db, "anonymous-feedback");

        for (const feedback of feedbackArray) {
            await addDoc(feedbackCollection, {
                trait: feedback.trait,
                statement: feedback.statement,
                focus: feedback.focus,
                effectiveness: feedback.effectiveness,
                submittedAt: feedback.submittedAt || new Date().toISOString()
            });
        }

        res.status(200).json({ message: "Feedback saved successfully" });

    } catch (error) {
        console.error("Error saving anonymous feedback:", error);
        res.status(500).json({ error: "Failed to save anonymous feedback", details: error.message });
    }
}
