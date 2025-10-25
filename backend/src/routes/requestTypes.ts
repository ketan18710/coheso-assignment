import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import * as db from '../utils/db.js';
import { RequestType, CreateRequestTypeInput } from '../types/index.js';

const router = Router();

// Validation schemas
const FieldSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1, 'Field label is required'),
  type: z.enum(['text', 'long-text', 'date', 'select']),
  required: z.boolean(),
  placeholder: z.string().optional(),
  options: z.array(z.string()).optional(),
});

const CreateRequestTypeSchema = z.object({
  requestType: z.string().min(1, 'Request type name is required'),
  purpose: z.string().min(10, 'Purpose must be at least 10 characters'),
  fields: z.array(FieldSchema),
  owner: z.string().email('Valid email is required'),
});

const UpdateRequestTypeSchema = z.object({
  requestType: z.string().min(1).optional(),
  purpose: z.string().min(10).optional(),
  fields: z.array(FieldSchema).optional(),
  owner: z.string().email().optional(),
});

/**
 * GET /api/request-types
 * Get all request types
 */
router.get('/', (req: Request, res: Response) => {
  try {
    const requestTypes = db.getAllRequestTypes();
    res.json({ data: requestTypes });
  } catch (error) {
    console.error('Error fetching request types:', error);
    res.status(500).json({ error: 'Failed to fetch request types' });
  }
});

/**
 * GET /api/request-types/:id
 * Get a single request type by ID
 */
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const requestType = db.getRequestTypeById(id);
    
    if (!requestType) {
      return res.status(404).json({ error: 'Request type not found' });
    }
    
    res.json({ data: requestType });
  } catch (error) {
    console.error('Error fetching request type:', error);
    res.status(500).json({ error: 'Failed to fetch request type' });
  }
});

/**
 * POST /api/request-types
 * Create a new request type
 */
router.post('/', (req: Request, res: Response) => {
  try {
    // Validate input
    const validatedData = CreateRequestTypeSchema.parse(req.body);
    
    // Ensure all fields have IDs
    const fieldsWithIds = validatedData.fields.map((field) => ({
      ...field,
      id: field.id || uuidv4(),
    }));
    
    // Create new request type
    const newRequestType: RequestType = {
      id: uuidv4(),
      requestType: validatedData.requestType,
      purpose: validatedData.purpose,
      fields: fieldsWithIds,
      owner: validatedData.owner,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const created = db.createRequestType(newRequestType);
    res.status(201).json({ data: created });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.issues 
      });
    }
    console.error('Error creating request type:', error);
    res.status(500).json({ error: 'Failed to create request type' });
  }
});

/**
 * PUT /api/request-types/:id
 * Update a request type
 */
router.put('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Check if request type exists
    const existing = db.getRequestTypeById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Request type not found' });
    }
    
    // Validate input
    const validatedData = UpdateRequestTypeSchema.parse(req.body);
    
    // Prepare update data with proper types
    const updateData: Partial<RequestType> = {
      ...(validatedData.requestType && { requestType: validatedData.requestType }),
      ...(validatedData.purpose && { purpose: validatedData.purpose }),
      ...(validatedData.owner && { owner: validatedData.owner }),
    };
    
    // If fields are being updated, ensure they all have IDs
    if (validatedData.fields) {
      updateData.fields = validatedData.fields.map((field) => ({
        ...field,
        id: field.id || uuidv4(),
      }));
    }
    
    // Update request type
    const updated = db.updateRequestType(id, updateData);
    
    if (!updated) {
      return res.status(404).json({ error: 'Request type not found' });
    }
    
    res.json({ data: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.issues 
      });
    }
    console.error('Error updating request type:', error);
    res.status(500).json({ error: 'Failed to update request type' });
  }
});

/**
 * DELETE /api/request-types/:id
 * Delete a request type
 */
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const deleted = db.deleteRequestType(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Request type not found' });
    }
    
    res.json({ success: true, message: 'Request type deleted successfully' });
  } catch (error) {
    console.error('Error deleting request type:', error);
    res.status(500).json({ error: 'Failed to delete request type' });
  }
});

export default router;

