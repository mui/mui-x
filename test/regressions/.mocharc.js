export default {
  extension: ['js', 'ts', 'tsx'],
  recursive: true,
  require: 'tsx',
  timeout: (process.env.CIRCLECI === 'true' ? 5 : 2) * 1000, // Circle CI has low-performance CPUs.
};
