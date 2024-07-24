import admin from "firebase-admin";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const serviceAccount = require("../../../json/firebase-service-key.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export const fs = admin.firestore();
export const adminRef = admin;