module.exports = {
  preset: 'ts-jest',
  rootDir: './',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest/setupTest.ts'],
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/lib/'],
};
