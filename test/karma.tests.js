/* eslint-env mocha */
import '@mui/monorepo/test/utils/init';
import '@mui/monorepo/test/utils/setupKarma';
import './utils/licenseRelease';
import './utils/setupXKarma';

const packagesContext = require.context('../packages', true, /\.test\.tsx$/);
packagesContext.keys().forEach(packagesContext);
