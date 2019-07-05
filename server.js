const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Chatkit = require("@pusher/chatkit-server");
const path = require('path');
const app = express();

const chatkit = new Chatkit.default({
  instanceLocator: "v1:us1:c89d2d68-a0df-4ed6-82b0-ac8ea2d0d7f1",
  key:
    "823d9322-5290-4b11-acb0-6e44e4fcca21:/zU1bBU1/y5OASq6QnqHfOpQXM0WBu88qwL3tXCPUwg="
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.post("/api/users", (req, res) => {
  const { username } = req.body;
  chatkit
    .createUser({
      id: username,
      name: username
    })
    .then(res1 => {
      console.log(30, res1);
      res.sendStatus(201);
    })
    .catch(error => {
      console.log(34, error);
      if (error.error === "services/chatkit/user_already_exists") {
        res.sendStatus(200);
      } else {
        res.status(error.status).json(error);
      }
    });
});

app.post("/api/authenticate", (req, res) => {
  const authData = chatkit.authenticate({ userId: req.query.user_id });
  res.status(authData.status).send(authData.body);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/build/index.html'));
});

app.get('/assets', (req, res) => {
  res.sendFile(path.join(__dirname + '/build/'));
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, err => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Running on port ${PORT}`);
  }
});
