const config: any = {
  clearMocks: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['<rootDir>/src/.*/dtos'],
  coverageProvider: 'v8',
  coverageReporters: ['html', 'text'],
  coverageThreshold: {
    global: {
      branches: 100,
      lines: 100,
      functions: 100,
      statements: 100,
    },
  },
  preset: 'ts-jest',
  roots: ['<rootDir>/__tests__', '<rootDir>/src'],
};

export default config;
