import { FIRESTORE_KEY } from "../../constants/firestoreKey.js";
import { log } from "../../helper/logger.js";
import { adminRef, fs } from "./firebaseConfig.js";

export async function fetchConversation(channelId) {
    try {
        const docRef = fs.collection(FIRESTORE_KEY.conversation).doc(channelId)
        const snapshot = await docRef.get();
  
        if (!snapshot.exists) {
            log(["FIREBASE", "FIRESTORE"], `Can't find conversation of ${channelId}`, true);
            return []
        }

        const messages = snapshot.data().messages || [];
        log(["FIREBASE", "FIRESTORE"], `Loaded message of ${channelId}`);
        return messages;
    } catch (error) {
        log(["FIREBASE", "FIRESTORE"], `fetchConversation ${error}`, true);
    }
};

export async function saveMessage(channelId, messageObject) {
    try {
        const docRef = fs.collection(FIRESTORE_KEY.conversation).doc(channelId)
        await docRef.update({ messages: adminRef.firestore.FieldValue.arrayUnion(messageObject) });

        log(["FIREBASE", "FIRESTORE"], `Saved message ${messageObject.content} to ${channelId}`);
    } catch (error) {
        log(["FIREBASE", "FIRESTORE"], `saveMessage ${error}`, true);
    }
};

export async function saveNewConversation(channelId, conversation) {
    try {
        const docRef = fs.collection(FIRESTORE_KEY.conversation).doc(channelId)
        await docRef.set({
            messages: conversation
        });

        log(["FIREBASE", "FIRESTORE"], `Saved new conversation to ${channelId}`,);
    } catch (error) {
        log(["FIREBASE", "FIRESTORE"], `saveNewConversation ${error}`, true);
    }
};

export async function testFirestoreAccess() {
    try {
        const testDocRef = fs.collection('testCollection').doc('testDoc');
        await testDocRef.set({ test: 'testValue' });
        const doc = await testDocRef.get();
        
        if (doc) {
            log(["START", "FIREBASE", "FIRESTORE"], "Firestore is ready and fully accessible.");
        } else {
            throw Error(`Data wasn't retrieved properly.`)
        }
    } catch (error) {
        log(["START", "FIREBASE", "FIRESTORE"], `Error accessing Firestore: ${error}`, true);
    }
}