import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Database, RequestType } from '../types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '../../db.json');

// In-memory storage for Vercel serverless (data persists between requests but not deployments)
let inMemoryDb: Database | null = null;

/**
 * Check if we're running on Vercel (read-only filesystem)
 */
const isVercel = (): boolean => {
  return process.env.VERCEL === '1';
};

/**
 * Read the database file or in-memory store
 */
export const readDatabase = (): Database => {
  // On Vercel, use in-memory storage
  if (isVercel()) {
    if (!inMemoryDb) {
      // Initialize with some sample data on Vercel
      inMemoryDb = {
        requestTypes: [
          {
            id: 'sample-1',
            requestType: 'Time Off Request',
            purpose: 'Request time off for vacation, sick leave, or personal days',
            fields: [
              { id: 'field-1', label: 'Start Date', type: 'date', required: true },
              { id: 'field-2', label: 'End Date', type: 'date', required: true },
              { id: 'field-3', label: 'Reason', type: 'select', required: true, options: ['Vacation', 'Sick Leave', 'Personal'] },
              { id: 'field-4', label: 'Additional Notes', type: 'long-text', required: false },
            ],
            owner: 'hr@company.com',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      };
    }
    return inMemoryDb;
  }

  // Local development: use file system
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, create it with empty structure
    const emptyDb: Database = { requestTypes: [] };
    writeDatabase(emptyDb);
    return emptyDb;
  }
};

/**
 * Write to the database file or in-memory store
 */
export const writeDatabase = (data: Database): void => {
  // On Vercel, update in-memory storage
  if (isVercel()) {
    inMemoryDb = data;
    return;
  }

  // Local development: write to file
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
};

/**
 * Get all request types
 */
export const getAllRequestTypes = (): RequestType[] => {
  const db = readDatabase();
  return db.requestTypes;
};

/**
 * Get a request type by ID
 */
export const getRequestTypeById = (id: string): RequestType | undefined => {
  const db = readDatabase();
  return db.requestTypes.find((rt) => rt.id === id);
};

/**
 * Create a new request type
 */
export const createRequestType = (requestType: RequestType): RequestType => {
  const db = readDatabase();
  db.requestTypes.push(requestType);
  writeDatabase(db);
  return requestType;
};

/**
 * Update a request type
 */
export const updateRequestType = (id: string, updates: Partial<RequestType>): RequestType | null => {
  const db = readDatabase();
  const index = db.requestTypes.findIndex((rt) => rt.id === id);
  
  if (index === -1) {
    return null;
  }
  
  db.requestTypes[index] = {
    ...db.requestTypes[index],
    ...updates,
    id, // Ensure ID doesn't change
    createdAt: db.requestTypes[index].createdAt, // Preserve creation date
    updatedAt: new Date().toISOString(), // Update timestamp
  };
  
  writeDatabase(db);
  return db.requestTypes[index];
};

/**
 * Delete a request type
 */
export const deleteRequestType = (id: string): boolean => {
  const db = readDatabase();
  const initialLength = db.requestTypes.length;
  db.requestTypes = db.requestTypes.filter((rt) => rt.id !== id);
  
  if (db.requestTypes.length === initialLength) {
    return false; // Nothing was deleted
  }
  
  writeDatabase(db);
  return true;
};

