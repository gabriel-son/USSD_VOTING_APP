const queries = require('./config');
const getCollection = queries.setCollection;
const db = queries.database;
//retrieving a document from the database
function getDoc(collection,document){
    let doc = getCollection(collection,document);
    let getDoc = doc.get()
        .then(doc => {
            if (!doc.exists) {
            return ('No such document!');
            } else {
            return ('Document data:', doc.data());
            }
        })
        .catch(err => {
            return ('Error getting document', err);
        });
    return getDoc;
}
module.exports = {
    getDoc: getDoc,
    db: db,
};
