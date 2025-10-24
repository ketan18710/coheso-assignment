import fs from 'fs';
import path from 'path';
import { Database, RequestType } from '../types';

const DB_PATH = path.join(__dirname, '../../db.json');

/**
 * Read the database file
 */
export const readDatabase = (): Database => {
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
 * Write to the database file
 */
export const writeDatabase = (data: Database): void => {
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

