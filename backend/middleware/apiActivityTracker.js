const ApiActivity = require('../models/ApiActivity');
const { ServiceUsage, TotalUsage } = require('../models/ServiceUsage');

const apiActivityTracker = async (req, res, next) => {
  try {
    // Save individual API activity
    const apiActivity = new ApiActivity({
      endpoint: req.originalUrl,
      method: req.method,
      userId: req.user ? req.user.id : null,
      ipAddress: req.ip,
    });
    await apiActivity.save();

    // Update total usage count
    await TotalUsage.findOneAndUpdate(
      {},
      { $inc: { totalCount: 1 } },
      { upsert: true, new: true }
    );

    // Update individual service usage count
    await ServiceUsage.findOneAndUpdate(
      { endpoint: req.originalUrl },
      { $inc: { count: 1 } },
      { upsert: true, new: true }
    );

  } catch (err) {
    console.error('Error saving API activity:', err.message);
    // Do not block the request if activity tracking fails
  }
  next();
};

module.exports = apiActivityTracker;
