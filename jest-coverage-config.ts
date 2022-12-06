import config from './jest.config';

config.testMatch = ['<rootDir>/__tests__/**/*.test.ts'];
config.setupFiles = ['<rootDir>/.jest/setEnvVars.ts'];

export default config;
