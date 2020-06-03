import fetch from 'cross-fetch';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { useRouter } from 'next/router';
import { Container, Element } from '../../modules';

const getPocketCode = (uid) => {
  var db = firebase.firestore();
  var docRef = db.collection('users').doc(uid);

  return docRef
    .get()
    .then(function (doc) {
      if (doc.exists) {
        console.log('Document data:', doc.data());
        return {
          code: doc.data().services.pocket.code,
          uid: uid,
        };
      } else {
        // doc.data() will be undefined in this case
        console.log('No such document!');
      }
    })
    .catch(function (error) {
      console.log('Error getting document:', error);
    });
};

const pocketAuthorize = (data) => {
  return fetch('/.netlify/functions/pocketAuthorize', {
    method: 'post',
    body: JSON.stringify({
      code: data.code,
    }),
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      console.log('response:', response);
      return {
        response: response,
        uid: data.uid,
      };
    });
};

const pocketSetAccessToken = (data) => {
  var db = firebase.firestore();
  console.log('data:', data);
  return db
    .collection('users')
    .doc(data.uid)
    .set(
      {
        services: {
          pocket: {
            access_token: data.response.access_token,
            username: data.response.username,
            state: 'AUTHORIZED',
          },
        },
      },
      { merge: true },
    )
    .then(function () {
      console.log('Document successfully updated!');
      return data;
    })
    .catch(function (error) {
      console.error('Error writing document: ', error);
    });
};

const authorize = (uid) => {
  console.log('uid:', uid);
  getPocketCode(uid)
    .then((data) => pocketAuthorize(data))
    .then((data) => pocketSetAccessToken(data))
    .then(() => window.close());
};

export default function SetPocketAuth() {
  const router = useRouter();
  const { uid } = router.query;
  if (typeof uid !== 'undefined') authorize(uid);
  return (
    <Container>
      <Element style={style}>
        <h1>zelf</h1>
        <h3>authorizing...</h3>
      </Element>
    </Container>
  );
}
