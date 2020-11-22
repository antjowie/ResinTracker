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

// For some reason subsequent calls have firebase already initialized, if that is the case, we won't init agin
try {
    firebase.app()   
}
catch {
    firebase.initializeApp(firebaseConfig);
}

// https://docs.netlify.com/functions/build-with-javascript/#synchronous-function-format
exports.handler = async (event, context) => {
    const name = event.queryStringParameters.name || "World";
    const db = firebase.firestore();
    const userRef = db.collection("users").doc(name);

    let doc = await userRef.get();
    // console.log(doc.exists);
    
    if(doc.exists) {
        return {
            statusCode: 200,
            body: JSON.stringify(doc.data())
        };        
    }
    else {
        return {
            statusCode: 406,
            body: `Document ${name} does not exist`
        };  
    }
    
};
