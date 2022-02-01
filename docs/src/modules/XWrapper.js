import * as React from 'react';
import PropTypes from 'prop-types';
import GlobalStyles from '@mui/material/GlobalStyles';

export default function XWrapper(props) {
  return (
    <React.Fragment>
      <GlobalStyles
        styles={{
          '.plan-pro, .plan-premium': {
            display: 'inline-block',
            height: '1em',
            width: '1em',
            verticalAlign: 'middle',
            marginLeft: '0.13em',
            marginBottom: '0.13em',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
          },
          '.plan-pro': {
            backgroundImage: 'url(/static/x/pro.svg)',
          },
          '.plan-premium': {
            backgroundImage: 'url(/static/x/premium.svg)',
          },
        }}
      />
      {props.children}
    </React.Fragment>
  );
}

XWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};
