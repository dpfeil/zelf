import '../public/css/normalize.css';
import '../public/css/blueprint-icons.css';
import '../public/css/blueprint.css';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { FocusStyleManager } from '@blueprintjs/core';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { MainValues, MainContext } from '../context/MainContext';
import { UserContext } from '../context/UserContext';
import { CustomNavbar } from '../modules';
import config from '../firebase-config';
import { useAuth, useFirebase } from '../hooks';

const useGapiAuth =
  typeof window === 'undefined'
    ? require('../api/FakeGapiAuth').default
    : require('../api/AuthAPI').useGapiAuth;
/*
const AuthAPI = dynamic(
  () => import('../api/AuthAPI').then((mod) => mod.AuthAPI),
  {
    ssr: false,
  },
);*/

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

FocusStyleManager.onlyShowFocusOnTabs();

const style = {
  display: 'grid',
  gridTemplateColumns: 'auto',
  gridTemplateRows: 'max-content auto',
  height: '100vh',
};

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  const { initializing, user } = useGapiAuth();

  const { fbinitializing, fbuser } = useAuth();

  const { services } = useFirebase(
    'users',
    fbuser !== null && 'uid' in fbuser ? fbuser.uid : null,
    { services: {} },
  );

  return (
    <div style={style}>
      <UserContext.Provider value={{ user }}>
        <MainContext.Provider value={{ ...MainValues, services }}>
          <CustomNavbar />
          <Component {...pageProps} />
        </MainContext.Provider>
      </UserContext.Provider>
    </div>
  );
}

MyApp.propTypes = {
  Component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.elementType,
  ]).isRequired,
  pageProps: PropTypes.objectOf(PropTypes.any).isRequired,
};
