module.exports = {
  recursive: true,
  reporter: 'dot',
  slow: 300,
  require: [require.resolve('./test/utils/setup')],
  extension: ['js', 'tsx', 'ts'],
};
