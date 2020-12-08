import * as React from 'react';
import { ThemeProvider, unstable_createMuiStrictModeTheme } from '@material-ui/core/styles';
import { createClientRender } from '@material-ui/monorepo/test/utils';

export * from '@material-ui/monorepo/test/utils';

export const createClientRenderStrictMode = () => {
  const render = createClientRender();
  const strictTheme = unstable_createMuiStrictModeTheme();
  const Wrapper = (props) => <ThemeProvider theme={strictTheme} {...props} />;

  return (element: React.ReactElement, options = {}) =>
    render(element, {
      wrapper: Wrapper,
      ...options,
    });
};
