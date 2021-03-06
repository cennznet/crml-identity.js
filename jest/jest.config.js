module.exports = {
    globals: {
        'ts-jest': {
            tsConfig: 'tsconfig.json',
        },
    },
    rootDir: process.cwd(),
    moduleFileExtensions: ['ts', 'js', 'node', 'json'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    testMatch: ['/**/?(*.)+(spec|e2e).[jt]s?(x)'],
    testEnvironment: 'node',
    preset: 'ts-jest',
    moduleNameMapper: {
        '@cennznet/crml-attestation(.*)$': '<rootDir>/packages/attestation/src/$1',
    },
    modulePathIgnorePatterns: [
        '<rootDir>/build',
        '<rootDir>/packages/attestation/build'
    ],
    collectCoverageFrom: ['src/**/*.[jt]s?(x)', '!**/node_modules/**'],
    coverageReporters: ['json', 'html'],
    coverageThreshold: {
        global: {
            branches: 60,
            functions: 80,
            lines: 80,
            statements: -10,
        },
    },
    testEnvironment: './jest/env.js',
    setupFilesAfterEnv: ['./jest/jest.setup.js']
};
