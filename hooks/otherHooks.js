import { useState, useEffect } from 'react';

const CLIENT_ID = process.env.clientId;
const API_KEY = process.env.apiKey;

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = [
  'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

export function useSigninStatus() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  return isSignedIn;
}
