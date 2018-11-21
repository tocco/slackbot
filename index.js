var SlackBot = require("slackbots")
var base64 = require("base-64")
var fetch = require("node-fetch")

var tocco_token = require("./token")

var stringToEncode = tocco_token.username + ':' + tocco_token.password

var username = tocco_token.username
console.log('username', username)
var password = tocco_token.password

var fetchTaskURL = 'https://www.tocco.ch/nice2/rest/entities/Task?_where=task_nr==67093&paths_=!'


let sessionId = null;
const transformResponse = (response) => {
  console.log('response', response.data[0].display)
  response.data[0].display
  // const labels = response.data.map(
  //   installation => installation.fields.instance.value,
  //   );
  //
  // if (labels.length === 0) {
  //   return null;
  // }
  //
  // return {
  //   title: label,
  //   type: 'labelList',
  //   data: labels,
  // };
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

 function getPromise (username, password) {
  const headers = {
    Accept: 'application/json',
    Authorization: `Basic ${base64.encode(`${username}:${password}`)}`,
  };
  console.log('headers', headers)
  if (sessionId) {
    headers.cookie = 'nice_auth=' + sessionId;
  }
  return fetch(fetchTaskURL, { method: 'GET', headers })
    .then(response => extractAndStoreSessionId(response))
    .then(response => response.json())
    .then(response =>
       transformResponse(response)
  )
    .catch(error =>
    // logError('backofficeAdapter', 'labelList', error, apiConfig),
   console.log('error', error)
    );
 }

getPromise(username, password)
