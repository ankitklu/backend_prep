const Campaign = require('../models/Campaign');

// Get all campaigns
const getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
};

// Get campaign by ID
const getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    res.json(campaign);
  } catch (error) {
    console.error('Error fetching campaign:', error);
    res.status(500).json({ error: 'Failed to fetch campaign' });
  }
};

// Create new campaign
const createCampaign = async (req, res) => {
  try {
    const campaignData = req.body;
    
    // Validate dates
    if (new Date(campaignData.startDate) >= new Date(campaignData.endDate)) {
      return res.status(400).json({ error: 'End date must be after start date' });
    }

    // Filter out empty partners
    if (campaignData.partners) {
      campaignData.partners = campaignData.partners.filter(partner => partner.trim() !== '');
    }

    const campaign = new Campaign(campaignData);
    const savedCampaign = await campaign.save();
    
    res.status(201).json(savedCampaign);
  } catch (error) {
    console.error('Error creating campaign:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to create campaign' });
  }
};

// Update campaign
const updateCampaign = async (req, res) => {
  try {
    const campaignId = req.params.id;
    const updateData = req.body;

    // Validate dates if provided
    if (updateData.startDate && updateData.endDate) {
      if (new Date(updateData.startDate) >= new Date(updateData.endDate)) {
        return res.status(400).json({ error: 'End date must be after start date' });
      }
    }

    // Filter out empty partners
    if (updateData.partners) {
      updateData.partners = updateData.partners.filter(partner => partner.trim() !== '');
    }

    const campaign = await Campaign.findByIdAndUpdate(
      campaignId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    res.json(campaign);
  } catch (error) {
    console.error('Error updating campaign:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to update campaign' });
  }
};

// Delete campaign
const deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    res.json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    res.status(500).json({ error: 'Failed to delete campaign' });
  }
};

// Add resource to campaign
const addResource = async (req, res) => {
  try {
    const campaignId = req.params.id;
    const resourceData = req.body;

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    campaign.resources.push(resourceData);
    await campaign.save();

    res.json(campaign);
  } catch (error) {
    console.error('Error adding resource:', error);
    res.status(500).json({ error: 'Failed to add resource' });
  }
};

// Update campaign progress
const updateProgress = async (req, res) => {
  try {
    const campaignId = req.params.id;
    const { value } = req.body;

    if (typeof value !== 'number' || value < 0) {
      return res.status(400).json({ error: 'Progress value must be a non-negative number' });
    }

    const campaign = await Campaign.findByIdAndUpdate(
      campaignId,
      {
        progress: {
          value: value,
          updatedAt: new Date()
        }
      },
      { new: true }
    );

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    res.json(campaign);
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
};

// Get campaigns by location (within radius)
const getCampaignsByLocation = async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;
    
    if (!lat || !lng || !radius) {
      return res.status(400).json({ error: 'Latitude, longitude, and radius are required' });
    }

    const campaigns = await Campaign.find({
      'location.center': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseFloat(radius) * 1000 // Convert km to meters
        }
      }
    });

    res.json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns by location:', error);
    res.status(500).json({ error: 'Failed to fetch campaigns by location' });
  }
};

// Get campaign statistics
const getCampaignStats = async (req, res) => {
  try {
    const totalCampaigns = await Campaign.countDocuments();
    const activeCampaigns = await Campaign.countDocuments({ status: 'active' });
    const completedCampaigns = await Campaign.countDocuments({ status: 'completed' });
    
    const campaignsByType = await Campaign.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalVolunteersNeeded = await Campaign.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$volunteersRequired' }
        }
      }
    ]);

    res.json({
      totalCampaigns,
      activeCampaigns,
      completedCampaigns,
      campaignsByType,
      totalVolunteersNeeded: totalVolunteersNeeded[0]?.total || 0
    });
  } catch (error) {
    console.error('Error fetching campaign statistics:', error);
    res.status(500).json({ error: 'Failed to fetch campaign statistics' });
  }
};

module.exports = {
  getAllCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  addResource,
  updateProgress,
  getCampaignsByLocation,
  getCampaignStats
};