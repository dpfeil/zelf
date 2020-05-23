exports.handler = (event, context, callback) => {
  callback(null, {
    statusCode: 200,
    body: {
      clientId: process.env.clientId,
      apiKey: process.env.apiKey,
    },
  });
};
