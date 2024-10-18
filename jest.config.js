module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/*.test.ts'],
    moduleFileExtensions: ['ts', 'js'],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    moduleNameMapper: {
        '^@lib/(.*)$': '<rootDir>/src/lib/$1',
        '^@game/(.*)$': '<rootDir>/src/game/$1',
        '^@components/(.*)$': '<rootDir>/src/ecs/components/$1',
        '^@systems/(.*)$': '<rootDir>/src/ecs/systems/$1',
        '^@events/(.*)$': '<rootDir>/src/ecs/events/$1',
    },
};
