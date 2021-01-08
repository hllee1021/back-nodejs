var admin = require("firebase-admin");
// require('dotenv').config();


var serviceAccount = require("./tect-develop-server-firebase-adminsdk-48v4m-2db47da9cc.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


module.exports = admin.auth()