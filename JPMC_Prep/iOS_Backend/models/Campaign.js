const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  required: {
    type: Number,
    required: true,
    min: 0
  },
  distributed: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  }
});

const campaignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['fundraising', 'awareness', 'health-checkup', 'relief-distribution', 'education', 'environment']
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  goal: {
    type: {
      type: String,
      required: true
    },
    target: {
      type: Number,
      required: true,
      min: 1
    },
    unit: {
      type: String,
      required: true
    }
  },
  location: {
    center: {
      lat: {
        type: Number,
        required: true,
        min: -90,
        max: 90
      },
      lng: {
        type: Number,
        required: true,
        min: -180,
        max: 180
      }
    },
    radius: {
      type: Number,
      required: true,
      min: 1
    },
    polygon: [{
      lat: Number,
      lng: Number
    }]
  },
  resources: [resourceSchema],
  volunteersRequired: {
    type: Number,
    required: true,
    min: 0
  },
  partners: [{
    type: String,
    trim: true
  }],
  progress: {
    value: {
      type: Number,
      default: 0,
      min: 0
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  contact: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    }
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused', 'cancelled'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
campaignSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Index for geospatial queries
campaignSchema.index({ 'location.center': '2dsphere' });

// Index for text search
campaignSchema.index({ 
  name: 'text', 
  description: 'text', 
  type: 'text' 
});

const Campaign = mongoose.model('Campaign', campaignSchema);

module.exports = Campaign;