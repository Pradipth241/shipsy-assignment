// jest.config.js

module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // --- THIS IS THE CORRECTED PART ---
  moduleNameMapper: {
    // This rule tells Jest: for any import starting with '@/',
    // replace '@/' with the path to the 'src' folder.
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // --- END OF CORRECTION ---

  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
};