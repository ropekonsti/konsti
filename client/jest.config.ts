module.exports = {
  clearMocks: true,
  coverageDirectory: 'coverage',
  preset: 'ts-jest',

  moduleNameMapper: {
    '\\.(jpg|png|gif|svg)$': '<rootDir>/src/test/__mocks__/binaryMock.ts',
    '^client(.*)$': '<rootDir>/src/$1',
    '^shared(.*)$': '<rootDir>/../shared/$1',
  },

  setupFiles: ['./src/test/setupTests.ts'],
  testPathIgnorePatterns: ['cypress'],
};