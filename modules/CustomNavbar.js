import { useContext } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Navbar, Button, Alignment } from '@blueprintjs/core';
import { MainContext } from '../context/MainContext';
import { useSession } from '../hooks';

const googleSignIn =
  typeof window === 'undefined'
    ? require('../api/FakeFunction')
    : require('../api/AuthAPI').googleSignIn;

const googleSignOut =
  typeof window === 'undefined'
    ? require('../api/FakeFunction')
    : require('../api/AuthAPI').googleSignOut;

function UserInfo({ user }) {
  const profile = user.getBasicProfile();
  return (
    <>
      <img
        style={{ height: 40, borderRadius: 20 }}
        src={profile.getImageUrl()}
        alt="profile"
      />
      <span>{profile.getName()}</span>
      <Button className="bp3-minimal" text="Sign out" onClick={googleSignOut} />
    </>
  );
}

UserInfo.propTypes = {
  user: PropTypes.objectOf(PropTypes.any).isRequired,
};

/*
.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ])
*/

export function CustomNavbar() {
  const mainValues = useContext(MainContext);
  const user = useSession();

  return (
    <Navbar>
      <Navbar.Group align={Alignment.LEFT}>
        <Navbar.Heading>{mainValues.projectName}</Navbar.Heading>
        <Navbar.Divider />
        <Button className="bp3-minimal" icon="home" text="Home" />
        <Link href="/about">
          <a href="/about">About Page</a>
        </Link>
      </Navbar.Group>
      <Navbar.Group align={Alignment.RIGHT}>
        {!user ? (
          <Button
            className="bp3-minimal"
            text="Login with Google"
            onClick={googleSignIn}
          />
        ) : null}
        {user ? <UserInfo user={user} /> : null}
      </Navbar.Group>
    </Navbar>
  );
}
