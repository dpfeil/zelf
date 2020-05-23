import { useState, useEffect } from 'react';
import * as firebase from 'firebase/app';
import fetch from 'cross-fetch';
import 'firebase/auth';
import gapi from './gapi';

const CLIENT_ID = process.env.clientId;
const API_KEY = process.env.apiKey;

console.log(CLIENT_ID);
console.log(API_KEY);

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = [
  'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/calendar';

const useGapiAuth = () => {
  const [state, setState] = useState(() => {
    if ('auth2' in gapi) {
      const auth2 = gapi.auth2.getAuthInstance();
      const user = auth2.currentUser.get();
      return {
        initializing: !user,
        user,
      };
    }

    return {
      intializing: true,
      user: null,
    };
  });

  function onChange(isSignedIn) {
    if (isSignedIn) {
      const auth2 = gapi.auth2.getAuthInstance();
      const user = auth2.currentUser.get();
      setState({ initializing: false, user });
    } else {
      setState({ initializing: true, user: null });
    }
  }

  useEffect(() => {
    async function getUser() {
      const fetcher = await initialize();
      console.log('auth is initialized yay');
      gapi.auth2.getAuthInstance().isSignedIn.listen(onChange);
      onChange(gapi.auth2.getAuthInstance().isSignedIn.get());
    }
    getUser();

    /*
    // listen for auth state changes
    if ('auth2' in gapi) {
      console.log('auth is initialized yay');
      gapi.auth2.getAuthInstance().isSignedIn.listen(onChange);
    }
    */
  }, []);

  return state;
};

const handleIsSignedIn = (isSignedIn) => {
  if (isSignedIn) {
    const auth2 = gapi.auth2.getAuthInstance();
    const currentUser = auth2.currentUser.get();
    const profile = currentUser.getBasicProfile();
    console.log('gapi: user signed in!', {
      name: profile.getName(),
      imageURL: profile.getImageUrl(),
      email: profile.getEmail(),
    });
    const authResponse = currentUser.getAuthResponse(true);
    const credential = firebase.auth.GoogleAuthProvider.credential(
      authResponse.id_token,
      authResponse.access_token,
    );
    firebase
      .auth()
      .signInWithCredential(credential)
      .then(({ user }) => {
        console.log('firebase: user signed in!', {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        });
      });
  } else {
    console.log('gapi: user is not signed in');
  }
};

const googleSignIn = () => {
  const auth2 = gapi.auth2.getAuthInstance();
  if (auth2.isSignedIn.get()) {
    console.log('already signed in');
    return;
  }

  auth2.signIn().catch((error) => console.log(`sign in error: ${error}`));
};

const googleSignOut = () => {
  console.log('signing out...');
  const auth2 = gapi.auth2.getAuthInstance();
  if (!auth2.isSignedIn.get()) {
    console.log('Not signed in!');
    return;
  }

  auth2
    .signOut()
    .then(() => console.log('gapi: sign out complete'))
    .then(() => firebase.auth().signOut())
    .then(() => console.log('firebase: sign out complete'));
};

const keyLoad = () => {
  if (typeof API_KEY !== 'undefined') {
    return new Promise((resolve) => {
      resolve(
        JSON.stringify({
          clientId: CLIENT_ID,
          apiKey: API_KEY,
        }),
      );
    }).then((response) => JSON.parse(response));
  }
  return fetch('/.netlify/functions/getKeys').then((response) =>
    response.json(),
  );
};

const gapiLoad = (data) => {
  return new Promise((resolve) => {
    gapi.load('client:auth2', () => resolve(data));
  });
};

const initClient = (data) => {
  return gapi.client
    .init({
      apiKey: data.apiKey,
      clientId: data.clientId,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES,
    })
    .then(() => {
      const auth2 = gapi.auth2.getAuthInstance();
      auth2.isSignedIn.listen(handleIsSignedIn);
      handleIsSignedIn(auth2.isSignedIn.get());
    });
};

const initialize = () => {
  return keyLoad()
    .then((data) => gapiLoad(data))
    .then((data) => initClient(data));
};

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
const listUpcomingEvents = () => {
  return gapi.client.calendar.events
    .list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 10,
      orderBy: 'startTime',
    })
    .then((response) => {
      let text = '';
      console.log('list events');
      const events = response.result.items;
      // appendPre('Upcoming events:');

      if (events.length > 0) {
        for (let i = 0; i < events.length; i += 1) {
          const event = events[i];
          let when = event.start.dateTime;
          if (!when) {
            when = event.start.date;
          }
          text += `${event.summary} (${when})\n`;
          // appendPre(`${event.summary} (${when})`);
        }
      } else {
        text = 'No upcoming events found.';
        // appendPre('No upcoming events found.');
      }
      return text;
    });
};

const AuthAPI = () => {
  // gapiLoad()
  //  .then(() => initClient());

  return <div className="AuthAPI" />;
};

export {
  AuthAPI,
  googleSignIn,
  googleSignOut,
  listUpcomingEvents,
  useGapiAuth,
};
