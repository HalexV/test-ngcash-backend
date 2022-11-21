import config from './jest.config';

config.testMatch = ['**/unit/**/*.test.ts'];
config.setupFiles = ['<rootDir>/.jest/setEnvVars.ts'];

export default config;
