require('dotenv').config();
const express = require('express');
const session = require('express-session');
const massive = require('massive');
const { signUp } = require('./controller');

const app = express();
app.use(express.json());

let { SERVER_PORT, CONNECTION_STRING, SECRET } = process.env;

app.use(
  session({
    secret: SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

massive({
  connectionString: CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
})
  .then((dbInstance) => {
    app.set('db', dbInstance);
  })
  .catch((err) => {
    console.log(err);
  });

app.post('/auth/signup', signUp);

app.listen(SERVER_PORT, () => {
  console.log(`Listening on port: ${SERVER_PORT}`);
});
