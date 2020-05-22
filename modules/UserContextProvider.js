import PropTypes from 'prop-types';

export function UserContextProvider({ children }) {
  return <div>{children}</div>;
}

UserContextProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
