import React, { useState, useEffect, useContext } from 'react';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { UserContext } from '../context/UserContext';

const provider = new firebase.auth.GoogleAuthProvider();

provider.addScope('https://www.googleapis.com/auth/calendar');

export const useSession = () => {
  const { user } = useContext(UserContext);
  return user;
};

export const useAuth = () => {
  const [state, setState] = useState(() => {
    const user = firebase.auth().currentUser;
    return {
      initializing: !user,
      user,
    };
  });

  function onChange(user) {
    setState({ initializing: false, user });
  }

  useEffect(() => {
    // listen for auth state changes
    const unsubscribe = firebase.auth().onAuthStateChanged(onChange);
    // unsubscribe to the listener when unmounting
    return () => unsubscribe();
  }, []);

  return state;
};
