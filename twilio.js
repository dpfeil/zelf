const accountSid = 'AC91d52dabb322b0df43a8db366b64980e';
const authToken = '4e21768750f84ca79e19cf992347fd81';
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({ body: 'Hi there!', from: '+12673174242', to: '+2153850682' })
  .then((message) => console.log(message.sid));
