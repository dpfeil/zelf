import fetch from 'cross-fetch';
exports.handler = (event, context, callback) => {
  const data = JSON.parse(event.body);
  console.log('event body', data);
  return fetch('https://getpocket.com/v3/get', {
    method: 'post',
    body: JSON.stringify({
      consumer_key: process.env.pocketKey,
      access_token: data.access_token,
      sort: 'newest',
      detailType: 'complete',
      count: 10,
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
