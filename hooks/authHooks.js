import React, { useState, useEffect, useContext } from 'react';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { UserContext, MainContext } from '../context';

const provider = new firebase.auth.GoogleAuthProvider();

provider.addScope('https://www.googleapis.com/auth/calendar');

export const useSession = () => {
  const { user } = useContext(UserContext);
  return user;
};

export const useServices = () => {
  const { services } = useContext(MainContext);
  return services;
};

export const useFirebase = (collection, doc, def) => {
  const [state, setState] = useState(def);

  function onChange(doc) {
    setState(doc.data());
  }

  useEffect(() => {
    if (doc !== null) {
      var db = firebase.firestore();
      var docRef = db.collection(collection).doc(doc);
      var unsubscribe = docRef.onSnapshot(onChange);
      return () => unsubscribe();
    }
  }, [doc]);

  return state;
};

export const useAuth = () => {
  const [state, setState] = useState(() => {
    const fbuser = firebase.auth().currentUser;
    return {
      fbinitializing: !fbuser,
      fbuser,
    };
  });

  function onChange(fbuser) {
    setState({ fbinitializing: false, fbuser });
  }

  useEffect(() => {
    // listen for auth state changes
    const unsubscribe = firebase.auth().onAuthStateChanged(onChange);
    // unsubscribe to the listener when unmounting
    return () => unsubscribe();
  }, []);

  return state;
};
