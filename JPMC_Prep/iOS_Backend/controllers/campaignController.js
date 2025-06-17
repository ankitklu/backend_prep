const Campaign = require('../models/Campaign');
const { validationResult } = require('express-validator');

// Get all campaigns
const getAllCampaigns = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    
    // Filter by type if provided
    if (req.query.type) {
      filter.type = req.query.type;
    }
    
    // Filter by status if provided
    if (req.query.status) {
      const now = new Date();
      if (req.query.status === 'active') {
        filter.startDate = { $lte: now };
        filter.endDate = { $gte: now };
      } else if (req.query.status === 'upcoming') {
        filter.startDate = { $gt: now };
      } else if (req.query.status === 'completed') {
        filter.endDate = { $lt: now };
      }
    }

    const campaigns = await Campaign.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Campaign.countDocuments(filter);
    
    res.json({
      success: true,
      data: campaigns,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching campaigns',
      error: error.message
    });
  }
};

// Get campaign by ID
const getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }
    
    res.json({
      success: true,
      data: campaign
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching campaign',
      error: error.message
    });
  }
};

// Create new campaign
const createCampaign = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const campaign = new Campaign(req.body);
    await campaign.save();
    
    res.status(201).json({
      success: true,
      message: 'Campaign created successfully',
      data: campaign
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating campaign',
      error: error.message
    });
  }
};

// Update campaign
const updateCampaign = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Campaign updated successfully',
      data: campaign
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating campaign',
      error: error.message
    });
  }
};

// Delete campaign
const deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);
    
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Campaign deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting campaign',
      error: error.message
    });
  }
};

// Add resources to campaign
const addResources = async (req, res) => {
  try {
    const { resources } = req.body;
    
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }
    
    campaign.resources.push(...resources);
    await campaign.save();
    
    res.json({
      success: true,
      message: 'Resources added successfully',
      data: campaign
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error adding resources',
      error: error.message
    });
  }
};

// Update campaign progress
const updateProgress = async (req, res) => {
  try {
    const { value } = req.body;
    
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { 
        'progress.value': value,
        'progress.updatedAt': new Date()
      },
      { new: true, runValidators: true }
    );
    
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Progress updated successfully',
      data: campaign
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating progress',
      error: error.message
    });
  }
};

// Get campaign statistics
const getCampaignStats = async (req, res) => {
  try {
    const stats = await Campaign.aggregate([
      {
        $group: {
          _id: null,
          totalCampaigns: { $sum: 1 },
          totalVolunteers: { $sum: '$volunteersRequired' },
          totalResources: { $sum: { $size: '$resources' } },
          avgProgress: { $avg: '$progress.value' }
        }
      }
    ]);
    
    const now = new Date();
    const activeCampaigns = await Campaign.countDocuments({
      startDate: { $lte: now },
      endDate: { $gte: now }
    });
    
    const upcomingCampaigns = await Campaign.countDocuments({
      startDate: { $gt: now }
    });
    
    const completedCampaigns = await Campaign.countDocuments({
      endDate: { $lt: now }
    });
    
    res.json({
      success: true,
      data: {
        ...stats[0],
        activeCampaigns,
        upcomingCampaigns,
        completedCampaigns
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};

module.exports = {
  getAllCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  addResources,
  updateProgress,
  getCampaignStats
};
