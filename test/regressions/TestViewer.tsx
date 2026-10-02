import * as React from 'react';
import { useLocation } from 'react-router';
import { styled } from '@mui/material/styles';
import GlobalStyles from '@mui/material/GlobalStyles';

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
  const { children, isDataGridTest, isDataGridPivotTest, path } = props;

  return (
    <React.Fragment>
      <GlobalStyles
        styles={{
          html: {
            WebkitFontSmoothing: 'antialiased', // Antialiasing.
            MozOsxFontSmoothing: 'grayscale', // Antialiasing.
            // Do the opposite of the docs in order to help catching issues.
            boxSizing: 'content-box',
            // Screenshots of test cases taller than the viewport drop the page scrollbar while
            // capturing, which resizes the content mid-capture. Never show it, so the width stays
            // the same. Not inherited, so scrollbars of other elements (e.g. the grid) still show.
            scrollbarWidth: 'none',
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
      <LoadFont
        isDataGridTest={isDataGridTest}
        isDataGridPivotTest={isDataGridPivotTest}
        data-testpath={path}
      >
        {children}
      </LoadFont>
    </React.Fragment>
  );
}

function LoadFont(props: any) {
  const { children, ...other } = props;
  const location = useLocation();

  // We're simulating `act(() => ReactDOM.render(children))`
  // In the end children passive effects should've been flushed.
  // React doesn't have any such guarantee outside of `act()` so we're approximating it.
  // In react-router v6, multiple routes share the same element: track which location is ready,
  // and run the effect for each location, otherwise it only runs once.
  const [readyLocation, setReadyLocation] = React.useState<typeof location | null>(null);
  const ready = readyLocation === location;

  React.useEffect(() => {
    function markReady() {
      // Don't know if there could be multiple loaded events after we started loading multiple times.
      // So make sure we're only ready if fonts are actually ready.
      if (document.fonts.status === 'loaded') {
        setReadyLocation(location);
      }
    }

    function handleFontsEvent(event: any) {
      if (event.type === 'loading') {
        setReadyLocation(null);
      } else if (event.type === 'loadingdone') {
        markReady();
      }
    }

    document.fonts.addEventListener('loading', handleFontsEvent);
    document.fonts.addEventListener('loadingdone', handleFontsEvent);

    // In case the child triggered font fetching we're not ready yet.
    // The fonts event handler will mark the test as ready on `loadingdone`
    markReady();

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
