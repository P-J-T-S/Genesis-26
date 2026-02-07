import { Router } from 'express';
import {
  getCreditRankings,
  getZoneCreditInfo,
  calculateZoneCredit,
  calculateAllCredits
} from '../controllers/credit.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Role-based access control middleware
const requireHigherRole = (req, res, next) => {
  // Check if user role is CITY_HEAD or WARD_HEAD
  const allowedRoles = ['CITY_HEAD', 'WARD_HEAD'];
  
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ 
      success: false,
      message: 'Access denied. Supervisor roles cannot view credit rankings.' 
    });
  }
  next();
};

// Public routes (will be protected by verifyJWT + role check)
router.get('/rankings', verifyJWT, requireHigherRole, getCreditRankings);
router.get('/zone/:zoneId', verifyJWT, requireHigherRole, getZoneCreditInfo);

// Admin routes (calculation triggers)
router.post('/calculate/:zoneId', verifyJWT, calculateZoneCredit);
router.post('/calculate-all', verifyJWT, calculateAllCredits);

export default router;