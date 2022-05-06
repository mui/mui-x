import * as React from 'react';
import { LicenseInfo } from '@mui/x-data-grid-pro';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { configureActions } from '@storybook/addon-actions';

// Remove the license warning from demonstration purposes
LicenseInfo.setLicenseKey(
  '61628ce74db2c1b62783a6d438593bc5Tz1NVUktRG9jLEU9MTY4MzQ0NzgyMTI4NCxTPXByZW1pdW0sTE09c3Vic2NyaXB0aW9uLEtWPTI=',
);

configureActions({
  depth: 6,
  limit: 10,
});

export const parameters = {
  // The storybook action panel is throwing a serialisation error with mouse events
  // due to its circular structure
  actions: {
    argTypesRegex:
      '^on((?!CellBlur|CellClick|CellDoubleClick|CellEditBlur|CellKeyDown|CellEnter|CellLeave|CellMouseDown|CellOut|CellOver|ColumnHeaderClick|ColumnHeaderDoubleClick|ColumnHeaderOver|ColumnHeaderOut|ColumnHeaderEnter|ColumnHeaderLeave|StateChange|RowClick|RowDoubleClick|RowEnter|RowLeave|RowOut|RowOver).)*$',
  },
  options: {
    /**
     * display the top-level grouping as a "root" in the sidebar
     * @type {Boolean}
     */
    isToolshown: true,
    storySort: (a, b) =>
      a[1].kind === b[1].kind ? 0 : a[1].id.localeCompare(b[1].id, undefined, { numeric: true }),
  },
  viewport: {
    viewports: INITIAL_VIEWPORTS,
  },
  a11y: {
    element: '#root',
    config: {},
    options: {},
    manual: true,
  },
  docs: {
    page: null,
  },
};

export const decorators = [
  (Story) => (
    <React.StrictMode>
      <Story />
    </React.StrictMode>
  ),
];
