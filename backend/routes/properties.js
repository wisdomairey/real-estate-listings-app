import express from 'express';
import { authenticate, requireAdmin, optionalAuth } from '../middleware/auth.js';
import { uploadMultiple, handleUploadError } from '../middleware/upload.js';
import {
  validateProperty,
  validatePropertyUpdate,
  validatePropertyQuery,
  validatePropertyId
} from '../middleware/validation.js';
import {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getPropertyStats,
  removePropertyImage
} from '../controllers/propertyController.js';

const router = express.Router();

// Public routes (with optional authentication for enhanced features)
router.get('/', validatePropertyQuery, optionalAuth, getProperties);
router.get('/:id', validatePropertyId, optionalAuth, getProperty);

// Protected routes (Admin only)
router.use(authenticate);
router.use(requireAdmin);

// Admin-only property management routes
router.post(
  '/',
  uploadMultiple,
  handleUploadError,
  validateProperty,
  createProperty
);

router.put(
  '/:id',
  validatePropertyId,
  uploadMultiple,
  handleUploadError,
  validatePropertyUpdate,
  updateProperty
);

router.delete('/:id', validatePropertyId, deleteProperty);

// Additional admin routes (protected)
router.get('/admin/stats', authenticate, getPropertyStats);
router.delete('/:id/images', authenticate, validatePropertyId, removePropertyImage);

export default router;
