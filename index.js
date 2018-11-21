var express = require('express')
var bodyParser = require('body-parser')

var app = express()
app.use(bodyParser.json())

var  port = 8080

var SlackBot = require("slackbots")
var base64 = require("base-64")
var fetch = require("node-fetch")

var tocco_token = require("./token")

var stringToEncode = tocco_token.username + ':' + tocco_token.password

var username = tocco_token.username
var password = tocco_token.password
var regex = "#[0-9]{3,6}"

var link = 'https://www.tocco.ch/nice2/rest/entities/Task/70368'

var bot = new SlackBot({
  token: tocco_token.token,
  name: "toccobot"
})

app.post('/', function(req, res) {
    console.log(req.body)
    if (req.body.challenge) {
      res.send(req.body.challenge)
     }
    if (req.body.event) {
        console.log("event found")
        var event = req.body.event;
        if (event.type && event.text && event.channel && event.type === "message") {
            console.log("real message")
            var tasknumbers = event.text.match(regex);
            if (tasknumbers && tasknumbers.length > 0) {
                console.log("tasknumbers found")
                for(var i = 0; i < tasknumbers.length; i++) {
                    getPromise(tasknumbers[i].substring(1), username, password).then(function(taskDisplay) {
                        bot.postMessage(event.channel, taskDisplay);
                    })
                }
            }
        }
    }
    res.send("test")
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

let sessionId = null;
const transformResponse = (response) => {
  console.log("response", response)
  return response.data[0].display
};

const extractAndStoreSessionId = response => {
  const cookie = response.headers.get('set-cookie');
  if (cookie) {
    const match = cookie.match(/nice_auth=([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/);
    if (match && match[1]) {
      sessionId = match[1];
    }
  }
  return response;
};

 function getPromise (tasknumber, username, password) {
  const headers = {
    Accept: 'application/json',
    Authorization: `Basic ${base64.encode(`${username}:${password}`)}`,
  };
  if (sessionId) {
    headers.cookie = 'nice_auth=' + sessionId;
  }
  console.log("tasknumber", tasknumber)
  var fetchTaskURL = `https://www.tocco.ch/nice2/rest/entities/Task?_where=task_nr==${tasknumber}&paths_=!`

  return fetch(fetchTaskURL, { method: 'GET', headers })
    .then(response => extractAndStoreSessionId(response))
    .then(response => response.json())
    .then(response => transformResponse(response)
 ).catch(error => console.log('error', error));
 }

