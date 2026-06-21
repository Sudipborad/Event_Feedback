import Event from '../models/Event.js';
import Feedback from '../models/Feedback.js';
import User from '../models/User.js';

/**
 * Fetch Admin Dashboard data containing platform analytics metrics
 */
export async function getAdminDashboardData(request, reply) {
  try {
    // 1. Core platform metrics counters
    const totalEvents = await Event.countDocuments();
    const totalFeedback = await Feedback.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });

    // 2. Average rating calculator
    const allFeedbacks = await Feedback.find({});
    const averageRating = allFeedbacks.length > 0 
      ? parseFloat((allFeedbacks.reduce((sum, f) => sum + f.rating, 0) / allFeedbacks.length).toFixed(1))
      : 0;

    // 3. Highlight events calculations via aggregation pipeline
    const feedbackStats = await Feedback.aggregate([
      {
        $group: {
          _id: '$eventId',
          feedbackCount: { $sum: 1 },
          avgRating: { $avg: '$rating' }
        }
      }
    ]);

    let highestRatedEvent = null;
    let mostFeedbackEvent = null;

    if (feedbackStats.length > 0) {
      // Find event with highest average rating
      const topRated = [...feedbackStats].sort((a, b) => b.avgRating - a.avgRating)[0];
      if (topRated) {
        const eventInfo = await Event.findById(topRated._id);
        if (eventInfo) {
          highestRatedEvent = {
            id: eventInfo._id,
            title: eventInfo.title,
            averageRating: parseFloat(topRated.avgRating.toFixed(1)),
          };
        }
      }

      // Find event with most feedback submissions
      const mostPopular = [...feedbackStats].sort((a, b) => b.feedbackCount - a.feedbackCount)[0];
      if (mostPopular) {
        const eventInfo = await Event.findById(mostPopular._id);
        if (eventInfo) {
          mostFeedbackEvent = {
            id: eventInfo._id,
            title: eventInfo.title,
            feedbackCount: mostPopular.feedbackCount,
          };
        }
      }
    }

    return {
      totalEvents,
      totalFeedback,
      totalUsers,
      averageRating,
      highestRatedEvent,
      mostFeedbackEvent,
    };
  } catch (err) {
    request.log.error(err);
    reply.status(500);
    return { error: 'Failed to calculate admin dashboard statistics' };
  }
}
