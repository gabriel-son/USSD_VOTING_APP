const admin = require('firebase-admin');

//seting environment variables
const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS;
//initializing my firebase app
admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(serviceAccount)),
});
const database=admin.firestore();
//retrieving a collection of documents
function setCollection(collection,document){
    return database.collection(collection).doc(document);
}

module.exports = {
    setCollection: setCollection,
    database: database
};
