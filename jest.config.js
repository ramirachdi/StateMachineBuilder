module.exports = {
    // Preset to use React Testing Library for React Native; remove if not needed
    // preset: '@testing-library/react-native',
    
    // Specifies which files Jest should look for when running tests
    testMatch: ['**/__tests__/**/*.+(js|jsx|ts|tsx)'],
    
    // Set up files to run after the test framework has been installed in the environment
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
    

    
    // Specifies which files Jest should collect coverage from and exclude
    collectCoverageFrom: [
      'src/**/*.(js|jsx|ts|tsx)',
      '!src/**/*.test.(js|jsx|ts|tsx)',
      '!src/**/index.(js|jsx|ts|tsx)' // Add or adjust paths as needed
    ],
    
    // Specifies which paths Jest should ignore when looking for tests
    testPathIgnorePatterns: ['/node_modules/', '/__tests__/helpers/', '/dist/', '/__mocks__/'],
    
    // Handle CSS imports or other assets
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
    
    // Handle JavaScript and TypeScript files using Babel
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    },
    
    // Ensure the jsdom environment is used for testing
    testEnvironment: 'jsdom',
  };
  