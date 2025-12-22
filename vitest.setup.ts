// Vitest setup file
// Load environment variables for tests
import { config } from 'dotenv';
import '@testing-library/jest-dom';
import './i18n'; // Initialize i18n for tests

config();

// Set test API key if not already set
if (!process.env.ARK_API_KEY) {
  process.env.ARK_API_KEY = 'test-api-key';
}

// Mock IntersectionObserver for tests
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;
