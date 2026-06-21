import Feedback from '../models/Feedback.js';
import User from '../models/User.js';
import Event from '../models/Event.js';

/**
 * Submit feedback for an event (supports guest submission and authenticated users)
 */
export async function createFeedback(request, reply) {
  const { eventId, rating, message, name, email } = request.body || {};

  // Request validation
  if (!eventId || !rating || !message || !message.trim()) {
    return reply.status(400).send({ error: 'All fields (eventId, rating, message) are required' });
  }

  const numericRating = parseInt(rating, 10);
  if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
    return reply.status(400).send({ error: 'Rating must be a number between 1 and 5' });
  }

  // Parse optional authentication
  let currentUser = null;
  try {
    await request.jwtVerify();
    currentUser = request.user;
  } catch (err) {
    // User is anonymous guest
  }

  try {
    let feedbackData = {
      eventId,
      rating: numericRating,
      message: message.trim(),
    };

    if (currentUser) {
      if (currentUser.role === 'admin') {
        return reply.status(403).send({ error: 'Admins cannot submit feedback' });
      }

      // Check duplicate feedback for logged-in user
      const existingFeedback = await Feedback.findOne({ eventId, userId: currentUser.id });
      if (existingFeedback) {
        return reply.status(400).send({ error: 'You have already submitted feedback for this event' });
      }

      feedbackData.userId = currentUser.id;
    } else {
      // Guest validations
      if (!name || !name.trim() || !email || !email.trim()) {
        return reply.status(400).send({ error: 'Name and email are required for anonymous feedback' });
      }
      if (!/\S+@\S+\.\S+/.test(email)) {
        return reply.status(400).send({ error: 'Please provide a valid email address' });
      }
      feedbackData.guestName = name.trim();
      feedbackData.guestEmail = email.trim().toLowerCase();
    }

    const feedback = new Feedback(feedbackData);
    const savedFeedback = await feedback.save();
    return savedFeedback;
  } catch (err) {
    request.log.error(err);
    reply.status(500);
    return { error: 'Failed to submit feedback' };
  }
}

/**
 * Update user's own feedback
 */
export async function updateFeedback(request, reply) {
  const { id } = request.params;
  const { rating, message } = request.body || {};

  // Request validation
  if (!rating || !message || !message.trim()) {
    return reply.status(400).send({ error: 'Rating and message are required' });
  }

  const numericRating = parseInt(rating, 10);
  if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
    return reply.status(400).send({ error: 'Rating must be a number between 1 and 5' });
  }

  try {
    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return reply.status(404).send({ error: 'Feedback not found' });
    }

    // Ownership check (Only feedback creator can update it; guests cannot edit)
    if (!feedback.userId || feedback.userId.toString() !== request.user.id) {
      return reply.status(403).send({ error: 'Forbidden: You cannot modify this feedback' });
    }

    feedback.rating = numericRating;
    feedback.message = message;

    const updatedFeedback = await feedback.save();
    return updatedFeedback;
  } catch (err) {
    request.log.error(err);
    reply.status(500);
    return { error: 'Failed to update feedback' };
  }
}

/**
 * Delete user's own feedback
 */
export async function deleteFeedback(request, reply) {
  const { id } = request.params;

  try {
    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return reply.status(404).send({ error: 'Feedback not found' });
    }

    // Ownership check (Only feedback creator can delete it; guests cannot delete)
    if (!feedback.userId || feedback.userId.toString() !== request.user.id) {
      return reply.status(403).send({ error: 'Forbidden: You cannot delete this feedback' });
    }

    await Feedback.deleteOne({ _id: id });
    return { success: true, message: 'Feedback deleted successfully' };
  } catch (err) {
    request.log.error(err);
    reply.status(500);
    return { error: 'Failed to delete feedback' };
  }
}

/**
 * Fetch feedbacks for a specific event (Admin only, searchable)
 */
export async function getEventFeedbacks(request, reply) {
  const { eventId } = request.params;
  const { search } = request.query || {};

  try {
    let query = { eventId };

    // Search by attendee name or email (checking logged in users and guests)
    if (search && search.trim()) {
      const searchRegex = new RegExp(search, 'i');
      
      // Find logged-in users matching the search query
      const matchingUsers = await User.find({
        $or: [
          { name: { $regex: searchRegex } },
          { email: { $regex: searchRegex } }
        ]
      });
      const userIds = matchingUsers.map(u => u._id);

      query.$or = [
        { userId: { $in: userIds } },
        { guestName: { $regex: searchRegex } },
        { guestEmail: { $regex: searchRegex } },
        { message: { $regex: searchRegex } }
      ];
    }

    const feedbacks = await Feedback.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    return feedbacks;
  } catch (err) {
    request.log.error(err);
    reply.status(500);
    return { error: 'Failed to fetch event feedbacks' };
  }
}

/**
 * Fetch feedbacks submitted by the active logged-in user (supports history search)
 */
export async function getMyFeedbacks(request, reply) {
  const { search } = request.query || {};
  try {
    let query = { userId: request.user.id };

    if (search && search.trim()) {
      const searchRegex = new RegExp(search, 'i');

      // Search by event name or message content
      const matchingEvents = await Event.find({
        $or: [
          { title: { $regex: searchRegex } },
          { category: { $regex: searchRegex } }
        ]
      });
      const eventIds = matchingEvents.map(e => e._id);

      query.$or = [
        { eventId: { $in: eventIds } },
        { message: { $regex: searchRegex } }
      ];
    }

    const feedbacks = await Feedback.find(query)
      .populate('eventId', 'title category date venue image')
      .sort({ createdAt: -1 });
    return feedbacks;
  } catch (err) {
    request.log.error(err);
    reply.status(500);
    return { error: 'Failed to fetch your feedbacks' };
  }
}
