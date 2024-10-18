const pino = require('pino');

// Mock the Pino logger
const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    fatal: jest.fn(),
    trace: jest.fn(),
};

jest.mock('pino', () => {
    return jest.fn(() => mockLogger);
});
