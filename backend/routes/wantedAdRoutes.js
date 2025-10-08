import express from 'express';
import {
  getAllWantedAds,
  getWantedAdById,
  createWantedAd,
  updateWantedAd,
  deleteWantedAd,
  getMyWantedAds
} from '../controllers/wantedAdController.js';
import { authenticate, checkListingLimit } from '../middleware/auth.js';
import WantedAd from '../models/WantedAd.js';

const router = express.Router();

// Public routes
router.get('/', getAllWantedAds);

// Protected routes (require authentication) - Must come BEFORE /:id
router.get('/my/listings', authenticate, getMyWantedAds);
router.post('/', authenticate, createWantedAd);

// Dynamic ID routes - Must come AFTER static routes
router.get('/:id', getWantedAdById);
router.put('/:id', authenticate, updateWantedAd);
router.delete('/:id', authenticate, deleteWantedAd);

export default router;

