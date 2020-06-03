import { Button } from '@blueprintjs/core';
import fetch from 'cross-fetch';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { useServices } from '../hooks';

const POCKET_REDIR_URL = 'http://localhost:3000/setpocketauth';

const pocketGet = (access_token) => {
  return fetch('/.netlify/functions/pocketGet', {
    method: 'post',
    body: JSON.stringify({
      access_token: access_token,
    }),
  }).then((response) => {
    return response.json();
  });
};

const pocketRequest = () => {
  return fetch('/.netlify/functions/pocketRequest').then((response) => {
    return response.json();
  });
};

const pocketSetCode = (data) => {
  var user = firebase.auth().currentUser;
  var db = firebase.firestore();

  return db
    .collection('users')
    .doc(user.uid)
    .set(
      {
        services: {
          pocket: {
            code: data.code,
            state: 'CODE_RECEIVED',
          },
        },
      },
      { merge: true },
    )
    .then(function () {
      console.log('Document successfully updated!');
      console.log(data);
      return data;
    })
    .catch(function (error) {
      console.error('Error writing document: ', error);
    });
};

const initialize = () => {
  return pocketRequest()
    .then((data) => pocketSetCode(data))
    .then((data) => {
      var user = firebase.auth().currentUser;
      console.log('ready to open');
      console.log('data', data);
      let redirURL = window.location.hostname;
      window.open(
        `https://getpocket.com/auth/authorize?request_token=${data.code}&redirect_uri=${redirURL}/${user.uid}`,
        '',
        'width=600,height=600',
      );
    });
};

const printPocketGet = (access_token) => {
  pocketGet(access_token).then((response) => console.log(response));
};

const PocketModule = () => {
  const services = useServices();
  if ('pocket' in services && services.pocket.state === 'AUTHORIZED') {
    return (
      <div>
        <h2>
          Pocket <small>(authorized as {services.pocket.username})</small>
        </h2>

        <Button onClick={() => printPocketGet(services.pocket.access_token)}>
          Get
        </Button>
      </div>
    );
  }
  return (
    <div>
      <h2>Pocket</h2>
      <Button onClick={initialize}>Authenticate</Button>
    </div>
  );
};

export { PocketModule };
