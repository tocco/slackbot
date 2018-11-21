var SlackBot = require("slackbots")
var tocco_token = require("./token")

var channel = "general"
var link = 'https://www.tocco.ch/nice2/rest/entities/Task/70368'

var bot = new SlackBot({
  token: tocco_token.token,
  name: "tocco_slackbot"
})

bot.on("start", function() {
  bot.postMessageToChannel(channel, "Hello Theo this is the slackbot by cykh", input);
  console.log("Hello world!");
})

var input = {
  "text": "Now back in stock!:tada:",
  "attachments": [
    {
      "title": "The Further Adventures of Slackbot",
      "fields": [
        {
          "title": "Volume",
          "value": "www.tocco/id.com",
          "short": true
        },
        {
          "title": "Issue",
          "value": "3",
          "short": true
        }
      ],
      "author_name": "Stanford S. Strickland",
      "author_icon": "http://a.slack-edge.com/7f18https://a.slack-edge.com/bfaba/img/api/homepage_custom_integrations-2x.png",
      "image_url": "http://i.imgur.com/OJkaVOI.jpg?1"
    },
    {
      "title": "Synopsis",
      "text": "After @episod pushed exciting changes to a devious new branch back in Issue 1, Slackbot notifies @don about an unexpected deploy..."
    },
    {
      "fallback": "Would you recommend it to customers?",
      "title": "Would you recommend it to customers?",
      "callback_id": "comic_1234_xyz",
      "color": "#3AA3E3",
      "attachment_type": "default",
      "actions": [
        {
          "name": "recommend",
          "text": "Recommend",
          "type": "button",
          "value": "recommend"
        },
        {
          "name": "no",
          "text": "No",
          "type": "button",
          "value": "bad"
        }
      ]
    }
  ]
}