/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    cache: true,
    // use __tests__ folder for tests
    testMatch: ['**/__tests__/**/*.test.ts'],
}
