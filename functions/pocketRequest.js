import fetch from 'cross-fetch';
exports.handler = (event, context, callback) => {
  console.log(process.env.pocketKey);
  return fetch('https://getpocket.com/v3/oauth/request', {
    method: 'post',
    body: JSON.stringify({
      consumer_key: process.env.pocketKey,
      redirect_uri: 'https://google.com',
    }),
    headers: {
      'Content-type': 'application/json',
      'X-Accept': 'application/json',
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      console.log('success', response);
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify(response),
      });
      //return response.json();
    })
    .catch((error) => {
      console.log('error', error);
      /* Error! return the error with statusCode 400 */
      return callback(null, {
        statusCode: 400,
        body: JSON.stringify(error),
      });
    });
};
