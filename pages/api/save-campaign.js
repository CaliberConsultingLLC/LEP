import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Firebase config - make sure these match your Firebase project
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { userEmail, campaign } = req.body;

  if (!userEmail || !campaign || !Array.isArray(campaign)) {
    return res.status(400).json({ error: "Invalid data. Email and campaign required." });
  }

  try {
    const userCampaignRef = doc(db, "campaigns", userEmail);

    await setDoc(userCampaignRef, {
      email: userEmail,
      campaign,
      createdAt: new Date().toISOString()
    });

    res.status(200).json({ message: "Campaign saved successfully." });
  } catch (error) {
    console.error("Error saving campaign:", error);
    res.status(500).json({ error: "Failed to save campaign", details: error.message });
  }
}
