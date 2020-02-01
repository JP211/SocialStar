const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

// To get the shoutouts from firebase
exports.getShoutouts = functions.https.onRequest((req, res) => {
  admin.firestore().collection('shoutouts').get()
    .then(data => {
        let shoutouts = [];
        data.forEach(doc => {
          shoutouts.push(doc.data());
        });
        return res.json(shoutouts);
    })
      .catch((err) => console.error(err));
});

// To create a new shoutout and push to firebase
exports.createShoutout = functions.https.onRequest((req, res) => {
  if(req.method !== 'POST') {
    return res.status(400).json({ error: 'Method not allowed.'});
  }
  const newShoutout = {
      body: req.body.body,
      userHandle: req.body.userHandle,
      createdAt: admin.firestore.Timestamp.fromDate(new Date())
  };

  admin.firestore()
    .collection('shoutouts')
    .add(newShoutout)
    .then(doc => {
      res.json({ message: `document ${doc.id} created successfully`});
    })
    .catch(err => {
      res.status(500).json({ error: 'Something went wrong.'});
      console.error(err);
    })
});
