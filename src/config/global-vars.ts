import 'dotenv/config';

export const DB_HOST = process.env.DB_HOST || '';
export const POSTGRES_DB = process.env.POSTGRES_DB || '';
export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || '';
export const POSTGRES_PORT = process.env.POSTGRES_PORT || '';
export const POSTGRES_USERNAME = process.env.POSTGRES_USERNAME || '';
export const JWT_SECRET = process.env.JWT_SECRET || '';
export const SMTP_HOST = process.env.SMTP_HOST || '';
export const SMTP_USER = process.env.SMTP_USER || '';
export const SMTP_PASSWORD = process.env.SMTP_PASSWORD || '';
export const APP_URL = process.env.APP_URL || 'http://localhost:3000';
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || 'test';
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || 'test';
export const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
export const S3_ENDPOINT = process.env.S3_ENDPOINT || 'http://localhost:4566';
export const S3_BUCKET = process.env.S3_BUCKET || 'testing-bucket';
