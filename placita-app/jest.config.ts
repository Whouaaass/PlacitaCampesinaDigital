import type {Config} from 'jest';

const config: Config = {
    verbose: true,
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
    testEnvironment: 'jsdom',
    transform: {
      '^.+\\.tsx?$': 'ts-jest',
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
    },
};

export default config;