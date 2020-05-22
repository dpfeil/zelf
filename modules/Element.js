import PropTypes from 'prop-types';
import ElementStyle from '../css/Element.module.css';

const defaultProps = {
  style: {},
};

export function Element({ children, style }) {
  return (
    <div className={ElementStyle.element} style={style}>
      <div className={ElementStyle.innerElement}>{children}</div>
    </div>
  );
}

Element.propTypes = {
  style: PropTypes.objectOf(PropTypes.any),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

Element.defaultProps = defaultProps;
