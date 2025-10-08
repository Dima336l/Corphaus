import express from 'express';
import {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties
} from '../controllers/propertyController.js';
import { authenticate, checkListingLimit } from '../middleware/auth.js';
import Property from '../models/Property.js';

const router = express.Router();

// Public routes
router.get('/', getAllProperties);

// Protected routes (require authentication) - Must come BEFORE /:id
router.get('/my/listings', authenticate, getMyProperties);
router.post('/', authenticate, createProperty);

// Dynamic ID routes - Must come AFTER static routes
router.get('/:id', getPropertyById);
router.put('/:id', authenticate, updateProperty);
router.delete('/:id', authenticate, deleteProperty);

export default router;

