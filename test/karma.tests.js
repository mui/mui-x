import './utils/init';

const packagesContext = require.context('../packages', true, /\.test\.tsx$/);
packagesContext.keys().forEach(packagesContext);
