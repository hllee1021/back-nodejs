var admin = require("firebase-admin");
// require('dotenv').config();


var serviceAccount = require("./admin_key.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


module.exports = admin.auth()