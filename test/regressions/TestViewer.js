import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import GlobalStyles from '@mui/material/GlobalStyles';
import { useLocation } from 'react-router-dom';
import { useFakeTimers } from 'sinon';

const StyledBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isDataGridTest',
})(({ theme, isDataGridTest }) => ({
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  padding: theme.spacing(1),
  justifyContent: 'center',
  ...(isDataGridTest && {
    width: 500,
    minHeight: 400,
    // Workaround the min-height limitation
    '& .grid-container': {
      position: 'relative',
      '& > .MuiDataGrid-root': {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
      },
    },
  }),
}));

let clock;

function MockTime(props) {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    // Use a "real timestamp" so that we see a useful date instead of "00:00"
    // eslint-disable-next-line react-hooks/rules-of-hooks -- not a React hook
    clock = useFakeTimers({
      now: new Date('Mon Aug 18 14:11:54 2014 -0500').getTime(),
      // We need to let time advance to use `useDemoData`, but on the pickers test it makes the tests flaky
      shouldAdvanceTime: props.isDataGridTest,
    });
    setReady(true);

    return () => {
      clock.restore();
    };
  }, [props.isDataGridTest]);

  return ready ? props.children : null;
}

MockTime.propTypes = {
  children: PropTypes.node.isRequired,
  isDataGridTest: PropTypes.bool,
};

function LoadFont(props) {
  const { children, ...other } = props;
  const location = useLocation();
  // We're simulating `act(() => ReactDOM.render(children))`
  // In the end children passive effects should've been flushed.
  // React doesn't have any such guarantee outside of `act()` so we're approximating it.
  const [ready, setReady] = React.useState(false);

  // In react-router v6, with multiple routes sharing the same element,
  // this effect will only run once if no dependency is passed.
  React.useEffect(() => {
    function handleFontsEvent(event) {
      if (event.type === 'loading') {
        setReady(false);
      } else if (event.type === 'loadingdone') {
        // Don't know if there could be multiple loaded events after we started loading multiple times.
        // So make sure we're only ready if fonts are actually ready.
        if (document.fonts.status === 'loaded') {
          setReady(true);
        }
      }
    }

    document.fonts.addEventListener('loading', handleFontsEvent);
    document.fonts.addEventListener('loadingdone', handleFontsEvent);

    // and wait `load-css` timeouts to be flushed
    clock.runToLast();

    // In case the child triggered font fetching we're not ready yet.
    // The fonts event handler will mark the test as ready on `loadingdone`
    if (document.fonts.status === 'loaded') {
      setReady(true);
    }

    return () => {
      document.fonts.removeEventListener('loading', handleFontsEvent);
      document.fonts.removeEventListener('loadingdone', handleFontsEvent);
    };
  }, [location]);

  return (
    <StyledBox aria-busy={!ready} data-testid="testcase" {...other}>
      {children}
    </StyledBox>
  );
}

LoadFont.propTypes = {
  children: PropTypes.node.isRequired,
};

function TestViewer(props) {
  const { children, isDataGridTest } = props;

  return (
    <React.Fragment>
      <GlobalStyles
        styles={{
          html: {
            WebkitFontSmoothing: 'antialiased', // Antialiasing.
            MozOsxFontSmoothing: 'grayscale', // Antialiasing.
            // Do the opposite of the docs in order to help catching issues.
            boxSizing: 'content-box',
          },
          '*, *::before, *::after': {
            boxSizing: 'inherit',
            // Disable transitions to avoid flaky screenshots
            transition: 'none !important',
            animation: 'none !important',
          },
          body: {
            margin: 0,
            overflowX: 'hidden',
          },
          '@media print': {
            '@page': {
              size: 'auto',
              margin: 0,
            },
          },
        }}
      />
      <MockTime isDataGridTest={isDataGridTest}>
        <LoadFont isDataGridTest={isDataGridTest}>{children}</LoadFont>
      </MockTime>
    </React.Fragment>
  );
}

TestViewer.propTypes = {
  children: PropTypes.node.isRequired,
  isDataGridTest: PropTypes.bool.isRequired,
};

export default TestViewer;
