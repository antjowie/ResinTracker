const firebase = require("firebase/app");

// Add the Firebase products that you want to use
const db = require("firebase/firestore");

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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// https://docs.netlify.com/functions/build-with-javascript/#synchronous-function-format
exports.handler = async (event, context) => {
    let name = event.queryStringParameters.name || "World";

    // console.log(firebase);
    
    return {
        statusCode: 200,
        body: JSON.stringify(`Hello ${name}`),
    };
};
