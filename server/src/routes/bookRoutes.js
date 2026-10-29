import { Router } from 'express';
import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getFeaturedBooks,
  saveBook,
  unsaveBook,
  getSavedBooks,
  getRecommendations,
  getPublicStats
} from '../controllers/bookController.js';
import { authenticate, optionalAuthenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { ROLES } from '../config/constants.js';

const router = Router();

// Public / optionally authenticated
router.get('/', optionalAuthenticate, getAllBooks);
router.get('/featured', getFeaturedBooks);
router.get('/public-stats', getPublicStats);

// Student authenticated endpoints
router.get('/saved', authenticate, getSavedBooks);
router.get('/recommendations', authenticate, getRecommendations);
router.post('/:id/save', authenticate, saveBook);
router.delete('/:id/save', authenticate, unsaveBook);

// Single book detail
router.get('/:id', optionalAuthenticate, getBookById);

// Staff/Admin management endpoints
router.post('/', authenticate, authorize(ROLES.LIBRARIAN, ROLES.ADMIN), createBook);
router.patch('/:id', authenticate, authorize(ROLES.LIBRARIAN, ROLES.ADMIN), updateBook);
router.delete('/:id', authenticate, authorize(ROLES.ADMIN), deleteBook);

export default router;
