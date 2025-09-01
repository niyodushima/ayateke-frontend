const SafeIcon = ({ Component }) => {
  if (typeof Component === 'function') {
    return <Component style={{ fontSize: '20px' }} />;
  }
  return null;
};

export default SafeIcon;
