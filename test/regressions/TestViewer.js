import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useFakeTimers } from 'sinon';
import { withStyles } from '@mui/styles';
import { createTheme } from '@mui/material/styles';

const styles = (theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(1),
    display: 'flex',
    justifyContent: 'center',
  },
  dataGridContainer: {
    minHeight: 400,
    maxWidth: 500,
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
  },
});

let clock;

function MockTime(props) {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    // Use a "real timestamp" so that we see a useful date instead of "00:00"
    // eslint-disable-next-line react-hooks/rules-of-hooks -- not a React hook
    clock = useFakeTimers({
      now: new Date('Mon Aug 18 14:11:54 2014 -0500').getTime(),
      shouldAdvanceTime: true,
    });

    setReady(true);

    return () => {
      clock.restore();
    };
  }, []);

  return ready ? props.children : null;
}

function LoadFont(props) {
  const { children, ...other } = props;
  // We're simulating `act(() => ReactDOM.render(children))`
  // In the end children passive effects should've been flushed.
  // React doesn't have any such guarantee outside of `act()` so we're approximating it.
  const [ready, setReady] = React.useState(false);
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
  }, []);

  return (
    <div aria-busy={!ready} data-testid="testcase" {...other}>
      {children}
    </div>
  );
}

LoadFont.propTypes = {
  children: PropTypes.node.isRequired,
};

function TestViewer(props) {
  const { children, classes, dataGridContainer } = props;

  return (
    <MockTime>
      <LoadFont
        className={clsx(classes.root, {
          [classes.dataGridContainer]: dataGridContainer,
        })}
      >
        {children}
      </LoadFont>
    </MockTime>
  );
}

TestViewer.propTypes = {
  children: PropTypes.node.isRequired,
  classes: PropTypes.object.isRequired,
  dataGridContainer: PropTypes.bool.isRequired,
};

const defaultTheme = createTheme();
export default withStyles(styles, { defaultTheme })(TestViewer);
