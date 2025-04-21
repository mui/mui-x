import * as React from 'react';
import { useLocation } from 'react-router';
import { styled } from '@mui/material/styles';
import GlobalStyles from '@mui/material/GlobalStyles';
import { fakeClock, setupFakeClock } from '../utils/setupFakeClock'; // eslint-disable-line

const StyledBox = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isDataGridTest' && prop !== 'isDataGridPivotTest',
})<{ isDataGridTest?: boolean; isDataGridPivotTest?: boolean }>(
  ({ theme, isDataGridTest, isDataGridPivotTest }) => ({
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    padding: theme.spacing(1),
    justifyContent: 'center',
    ...(isDataGridTest && {
      width: isDataGridPivotTest ? 800 : 500,
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
  }),
);

function TestViewer(props: any) {
  const { children, isDataGridTest, isDataGridPivotTest, isChartTest, path } = props;

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
      <MockTime shouldAdvanceTime={isDataGridTest || isChartTest} shouldRunToFrame={isChartTest}>
        <LoadFont
          isDataGridTest={isDataGridTest}
          isDataGridPivotTest={isDataGridPivotTest}
          data-testpath={path}
        >
          {children}
        </LoadFont>
      </MockTime>
    </React.Fragment>
  );
}

function MockTime(
  props: React.PropsWithChildren<{ shouldAdvanceTime: boolean; shouldRunToFrame: boolean }>,
) {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const dispose = setupFakeClock(props.shouldAdvanceTime);
    setReady(true);
    return dispose;
  }, [props.shouldAdvanceTime]);

  React.useEffect(() => {
    if (props.shouldRunToFrame && ready) {
      fakeClock?.runToFrame();
    }
  }, [props.shouldRunToFrame, ready]);

  return ready ? props.children : null;
}

function LoadFont(props: any) {
  const { children, ...other } = props;
  const location = useLocation();

  // We're simulating `act(() => ReactDOM.render(children))`
  // In the end children passive effects should've been flushed.
  // React doesn't have any such guarantee outside of `act()` so we're approximating it.
  const [ready, setReady] = React.useState(false);

  // In react-router v6, with multiple routes sharing the same element,
  // this effect will only run once if no dependency is passed.
  React.useEffect(() => {
    function handleFontsEvent(event: any) {
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
    fakeClock?.runToLast();

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

export default TestViewer;
