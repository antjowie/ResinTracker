const firebase = require("firebase/app");
require("firebase/firestore");

const firebaseConfig = {
    apiKey: "AIzaSyC-tTn_e21KcyN3x3w2HMAVPLiOWxuKyR4",
    authDomain: "resintracker.firebaseapp.com",
    databaseURL: "https://resintracker.firebaseio.com",
    projectId: "resintracker",
    storageBucket: "resintracker.appspot.com",
    messagingSenderId: "426338056942",
    appId: "1:426338056942:web:bfabd85984b3c7138791ff",
    measurementId: "G-EV0BFJR8EQ",
};
let db;

const initialize = (useEmulator) => {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    if (useEmulator) db.useEmulator("localhost", 8080);
};

// Creates and updates the fields of a document in a database
const set = async (collection, document, data) => {
    try {
        await db.collection(collection).doc(document).update(data);
    } catch (error) {
        console.log(`Creating new document in ${collection}/${document}`);
        try {
            await db.collection(collection).doc(document).set(data);
        } catch (e) {
            console.log(`Database set failed with ${error.code}`);
        }
    }
};

// Gets the data of an document in the database
const get = async (collection, document) => {
    try {
        const doc = await db.collection(collection).doc(document).get();
        return doc.data();
    } catch (error) {
        console.log(`Database get failed with ${error}`);
    }
};

/**
 * Query: {
 * key: value
 * op: ==
 * val: value
 * }
 * https://firebase.google.com/docs/firestore/query-data/get-data?authuser=0#get_multiple_documents_from_a_collection
 */
const getDocuments = async (collection, query) => {
    try {
        const collRef = db.collection(collection);
        let snapshot;
        if(query && "key" in query) snapshot = await collRef.where(query.key, query.op, query.val).get();
        else snapshot = await collRef.get();
        
        let docs = {};
        snapshot.forEach((doc) => {
            docs[doc.id] = doc.data();
            
            // console.log(doc.id, "=>", doc.data());
        });
        
        return docs;
    } catch (error) {
        console.log(`Database getDocuments failed with ${error}`);
    }
};
// Removes a document from the database
const remove = async (collection, document) => {
    try {
        await db.collection(collection).doc(document).delete();
    } catch (error) {
        console.log(`Database delete failed with ${error}`);
    }
};

let count = 0;
module.exports = {
    initialize,
    set,
    get,
    getDocuments,
    remove,
};

// Test code
if (require.main !== module) return;

// return;
const data = {
    chars: ["keqing", "keqing"],
    user: "antjowie",
    talent: "gold",
};

initialize(true);
const test = async () => {
    await set("Hello", "I am", data);
    await set("Hello", "I am", { chars: ["Keqing", "Keqing"] });
    await set("Hello", "I am2", { chars: ["Keqing", "Keqing"] });

    console.log(await get("Hello", "I am"));
    // await remove("Hello", "I am");
    console.log(await getDocuments("Hello"));
};

test();
