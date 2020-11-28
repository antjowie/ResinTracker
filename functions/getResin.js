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

// https://docs.netlify.com/functions/build-with-javascript/#synchronous-function-format
// Takes discord id as id and returns resin in seconds
exports.handler = async (event, context) => {
    const name = event.queryStringParameters.name || "World";
    const id = event.queryStringParameters.discord;
    const resinCap = 160;
    const resinValue = 7 * 60;
    
    if (firebase.apps.length === 0) {
        firebase.initializeApp(firebaseConfig);
        
        // Only if local
        var local = true;
    }
    const db = firebase.firestore();

    // Only if local
    // if(local) db.useEmulator("localhost", 8080);

    // Check if id is valid
    if(!id) {
        return {
            statusCode: 400,
            body: JSON.stringify("No parameter of type discord found. Pass discord ID of user")
        };
    }
    
    const userRef = db.collection("resin").doc(id);
    
    // await userRef.set({
    //     last: Date(),
    //     resin: 50
    // });
    
    const doc = await userRef.get();
    const updateDatabaseVal = async (user, object) => await user.set(object);
    const createReturnVal = (resin) => {
        return {
            statusCode: 200,
            body: JSON.stringify(resin)
        };
    }
    
    if(doc.exists) {
        const data = doc.data();
        let {last, resin} = data;
        
        
        // console.log(last);
        // console.log(resin);
        
        
        // Calculate new resin value
        const lastTime = last;
        const currentTime = Math.floor(Date.now() / 1000);
        const deltaTime = Math.floor(currentTime - lastTime);

        // console.log(lastTime);
        // console.log(currentTime);
        // console.log(deltaTime);
        resin = Math.min(resin + deltaTime, resinCap * resinValue);
        
        // Update the resin value
        await updateDatabaseVal(userRef, {
            resin: resin,
            last: currentTime
        });
        
        return createReturnVal(resin);
    }
    else {
        // Create default resin entry
        await updateDatabaseVal(userRef, {
            resin: 0,
            last: Math.floor(Date.now() / 1000)
        });
        
        return createReturnVal(0);
        // return {
        //     statusCode: 406,
        //     body: `Dev error. ${name} does not exist`
        // };  
    }
}