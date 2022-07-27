import './licenseRelease';
import './licenseKey';
import { unstable_resetCleanupTracking } from '@mui/x-data-grid';
import { unstable_resetCleanupTracking as unstable_resetCleanupTrackingPro } from '@mui/x-data-grid-pro';
import enzyme from 'enzyme';
import Adapter from '@eps1lon/enzyme-adapter-react-17';
import * as testingLibrary from '@testing-library/react/pure';
import '@mui/monorepo/test/utils/initMatchers';

enzyme.configure({ adapter: new Adapter() });

// checking if an element is hidden is quite expensive
// this is only done in CI as a fail safe. It can still explicitly be checked
// in the test files which helps documenting what is part of the DOM but hidden
// from assistive technology
const defaultHidden = !process.env.CI;
// adds verbosity for something that might be confusing
console.warn(`${defaultHidden ? 'including' : 'excluding'} inaccessible elements by default`);
testingLibrary.configure({ defaultHidden });

const mochaHooks = {
  beforeEach: [],
  afterEach: [],
};

mochaHooks.afterEach.push(function resetCleanupTracking() {
  unstable_resetCleanupTracking();
  unstable_resetCleanupTrackingPro();
});

export { mochaHooks };
