const express = require('express');
const router = express.Router();
const {
  getAllCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  addResource,
  updateProgress,
  getCampaignsByLocation,
  getCampaignStats
} = require('../controllers/campaignController');

// GET /api/campaigns - Get all campaigns
router.get('/', getAllCampaigns);

// GET /api/campaigns/stats - Get campaign statistics
router.get('/stats', getCampaignStats);

// GET /api/campaigns/location - Get campaigns by location
router.get('/location', getCampaignsByLocation);

// GET /api/campaigns/:id - Get campaign by ID
router.get('/:id', getCampaignById);

// POST /api/campaigns - Create new campaign
router.post('/', createCampaign);

// PUT /api/campaigns/:id - Update campaign
router.put('/:id', updateCampaign);

// DELETE /api/campaigns/:id - Delete campaign
router.delete('/:id', deleteCampaign);

// POST /api/campaigns/:id/resources - Add resource to campaign
router.post('/:id/resources', addResource);

// POST /api/campaigns/:id/progress - Update campaign progress
router.post('/:id/progress', updateProgress);

module.exports = router;