import "@testing-library/jest-dom";

// Polyfill for TextEncoder to fix ReferenceError in Node.js environment
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder as unknown as typeof global.TextEncoder;
global.TextDecoder = TextDecoder as unknown as typeof global.TextDecoder;