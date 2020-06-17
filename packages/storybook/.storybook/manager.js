// manager.js
import { addons } from '@storybook/addons';
import muiTheme from './mui-theme';

addons.setConfig({
  panelPosition: 'right',
  theme: muiTheme,
});
