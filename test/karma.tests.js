/* eslint-env mocha */
import './utils/init';
import '@mui/monorepo/test/utils/setupKarma';

beforeEach(function beforeEach() {
  console.log('Starting: ', this.currentTest?.fullTitle());
});

afterEach(function afterEach() {
  console.log('Ending', this.currentTest?.fullTitle(), this.currentTest?.state);
});

const packagesContext = require.context('../packages', true, /\.test\.tsx$/);
packagesContext.keys().forEach(packagesContext);
