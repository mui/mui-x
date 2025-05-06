export default {
  extension: ['js', 'ts', 'tsx'],
  recursive: true,
  slow: 500,
  timeout: (process.env.CIRCLECI === 'true' ? 8 : 4) * 1000, // Circle CI has low-performance CPUs.
  require: 'tsx',
  reporter: 'dot',
};
