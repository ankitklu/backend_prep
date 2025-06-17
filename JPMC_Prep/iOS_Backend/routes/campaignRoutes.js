const express = require('express');
const { body } = require('express-validator');
const {
  getAllCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  addResources,
  updateProgress,
  getCampaignStats
} = require('../controllers/campaignController');

const router = express.Router();

// Validation middleware
const campaignValidation = [
  body('name').trim().isLength({ min: 1, max: 200 }).withMessage('Name is required and must be less than 200 characters'),
  body('description').trim().isLength({ min: 1, max: 2000 }).withMessage('Description is required and must be less than 2000 characters'),
  body('type').isIn(['Fundraising', 'Awareness', 'Health Check-up', 'Relief Distribution', 'Education', 'Environment', 'Other']).withMessage('Invalid campaign type'),
  body('startDate').isISO8601().withMessage('Invalid start date'),
  body('endDate').isISO8601().withMessage('Invalid end date'),
  body('goal.type').isIn(['Fundraising', 'Awareness', 'Health Check-up', 'Relief Distribution', 'Education', 'Environment', 'Other']).withMessage('Invalid goal type'),
  body('goal.target').isInt({ min: 1 }).withMessage('Goal target must be a positive integer'),
  body('goal.unit').trim().isLength({ min: 1 }).withMessage('Goal unit is required'),
  body('location.center.lat').isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
  body('location.center.lng').isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
  body('location.radius').isFloat({ min: 0.1, max: 1000 }).withMessage('Radius must be between 0.1 and 1000 km'),
  body('volunteersRequired').isInt({ min: 1 }).withMessage('Volunteers required must be a positive integer'),
  body('contact.name').trim().isLength({ min: 1 }).withMessage('Contact name is required'),
  body('contact.phone').trim().isLength({ min: 1 }).withMessage('Contact phone is required'),
  body('contact.email').isEmail().withMessage('Invalid email address')
];

const progressValidation = [
  body('value').isNumeric().withMessage('Progress value must be a number')
];

const resourceValidation = [
  body('resources').isArray().withMessage('Resources must be an array'),
  body('resources.*.name').trim().isLength({ min: 1 }).withMessage('Resource name is required'),
  body('resources.*.required').isInt({ min: 0 }).withMessage('Required amount must be a non-negative integer')
];

// Routes
router.get('/stats', getCampaignStats);
router.get('/', getAllCampaigns);
router.get('/:id', getCampaignById);
router.post('/', campaignValidation, createCampaign);
router.put('/:id', campaignValidation, updateCampaign);
router.delete('/:id', deleteCampaign);
router.post('/:id/resources', resourceValidation, addResources);
router.put('/:id/progress', progressValidation, updateProgress);

module.exports = router;
