const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  required: {
    type: Number,
    required: true,
    min: 0
  },
  distributed: {
    type: Number,
    default: 0,
    min: 0
  }
});

const locationSchema = new mongoose.Schema({
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
    min: 0.1,
    max: 1000
  },
  polygon: [{
    type: [Number],
    validate: {
      validator: function(v) {
        return v.length === 2;
      },
      message: 'Polygon coordinates must be [lat, lng] pairs'
    }
  }]
});

const goalSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['Fundraising', 'Awareness', 'Health Check-up', 'Relief Distribution', 'Education', 'Environment', 'Other']
  },
  target: {
    type: Number,
    required: true,
    min: 1
  },
  unit: {
    type: String,
    required: true,
    trim: true
  }
});

const progressSchema = new mongoose.Schema({
  value: {
    type: Number,
    default: 0,
    min: 0
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const contactSchema = new mongoose.Schema({
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
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  }
});

const campaignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  type: {
    type: String,
    required: true,
    enum: ['Fundraising', 'Awareness', 'Health Check-up', 'Relief Distribution', 'Education', 'Environment', 'Other']
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(v) {
        return v > this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  goal: {
    type: goalSchema,
    required: true
  },
  location: {
    type: locationSchema,
    required: true
  },
  resources: [resourceSchema],
  volunteersRequired: {
    type: Number,
    required: true,
    min: 1
  },
  partners: [{
    type: String,
    trim: true
  }],
  progress: {
    type: progressSchema,
    default: () => ({})
  },
  contact: {
    type: contactSchema,
    required: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
campaignSchema.index({ type: 1 });
campaignSchema.index({ startDate: 1, endDate: 1 });
campaignSchema.index({ 'location.center': '2dsphere' });

module.exports = mongoose.model('Campaign', campaignSchema);
