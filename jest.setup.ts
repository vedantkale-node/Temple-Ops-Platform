/// <reference types="node" />

process.env.NODE_ENV = "test";
process.env.MONGO_URI = "mongodb://127.0.0.1:27017/shrihari-test";
process.env.NO_DB = "true";
process.env.JWT_SECRET = "test-jwt-secret-that-is-at-least-32-chars";
process.env.SERVER_EMAIL = "test@example.com";
process.env.SERVER_EMAIL_SECRET = "test-email-secret";
process.env.TEMPLE_ID = "test-temple";
process.env.BASE_API_URL = "http://localhost:4000/api";
process.env.BASE_URL = "http://localhost:4000";
process.env.SESSION_SECRET = "test-session-secret-that-is-at-least-32-chars";

