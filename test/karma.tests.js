import './utils/init';
import consoleError from './utils/consoleError';

consoleError();

const packagesContext = require.context('../packages', true, /\.test\.tsx$/);
packagesContext.keys().forEach(packagesContext);
