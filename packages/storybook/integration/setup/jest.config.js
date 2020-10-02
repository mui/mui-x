module.exports = {
  preset: 'jest-puppeteer',
  rootDir: '../',
  testRegex: './integration/mouse.test.ts',
  setupFilesAfterEnv: ['./setup/setupTests.js'],
  transform: {
    '^.+\\.(t)sx?$': 'ts-jest',
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/lib/'],
};
