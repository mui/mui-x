import * as React from 'react';
import { ThemeProvider, unstable_createMuiStrictModeTheme } from '@mui/material/styles';
import { createClientRender } from '@material-ui/monorepo/test/utils';

export * from '@material-ui/monorepo/test/utils';

export const createClientRenderStrictMode = () => {
  const render = createClientRender();
  const strictTheme = unstable_createMuiStrictModeTheme();
  const Wrapper = (props) => <ThemeProvider theme={strictTheme} {...props} />;

  const isKarma = Boolean(process.env.KARMA);

  // Doesn't work in Karma, unclear why
  if (!isKarma) {
    // @material-ui/styles leak in strict mode. We leave a growing number of style in the head.
    // It significantly slowdown the tests in watch mode (linear growth with rerun).
    // It's similar to why https://github.com/mui-org/material-ui/pull/24837.
    // TODO v5: remove
    after(() => {
      Array.from(document.querySelectorAll('style')).forEach((style) => {
        document.head.removeChild(style);
      });
    });
  }

  return (element: React.ReactElement, options = {}) =>
    render(element, {
      wrapper: Wrapper,
      ...options,
    });
};
