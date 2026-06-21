import Event from '../models/Event.js';
import Feedback from '../models/Feedback.js';

/**
 * Get all events with rating and review statistics
 */
export async function getEvents(request, reply) {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    const eventsWithStats = await Promise.all(events.map(async (event) => {
      const feedbacks = await Feedback.find({ eventId: event._id });
      const count = feedbacks.length;
      const avg = count > 0 ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / count : 0;
      return {
        ...event.toObject(),
        averageRating: parseFloat(avg.toFixed(1)),
        feedbackCount: count,
      };
    }));
    return eventsWithStats;
  } catch (err) {
    request.log.error(err);
    reply.status(500);
    return { error: 'Failed to fetch events' };
  }
}

/**
 * Get Event by ID with associated feedback list (feedbacks filtered by RBAC)
 */
export async function getEventById(request, reply) {
  const { id } = request.params;
  try {
    const event = await Event.findById(id);
    if (!event) {
      return reply.status(404).send({ error: 'Event not found' });
    }

    // Try verifying JWT to see if we have an authenticated user context
    let currentUser = null;
    try {
      await request.jwtVerify();
      currentUser = request.user;
    } catch (e) {
      // Ignore auth error, user is anonymous
    }

    const feedbacks = await Feedback.find({ eventId: event._id }).populate('userId', 'name email').sort({ createdAt: -1 });
    const count = feedbacks.length;
    const avg = count > 0 ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / count : 0;
    
    // Filter feedbacks based on ownership/security rules
    let filteredFeedbacks = [];
    let userFeedback = null;

    if (currentUser) {
      // Find current user's feedback if it exists
      userFeedback = feedbacks.find(f => f.userId && f.userId._id.toString() === currentUser.id);
      
      // If the current user is an Admin, they can see ALL feedbacks
      if (currentUser.role === 'admin') {
        filteredFeedbacks = feedbacks;
      } else if (userFeedback) {
        // Otherwise, they only see their own feedback
        filteredFeedbacks = [userFeedback];
      }
    }

    return {
      ...event.toObject(),
      averageRating: parseFloat(avg.toFixed(1)),
      feedbackCount: count,
      feedbacks: filteredFeedbacks,
      myFeedback: userFeedback,
    };
  } catch (err) {
    request.log.error(err);
    reply.status(500);
    return { error: 'Failed to fetch event details' };
  }
}

/**
 * Create a new event (Admin only via verifyAdmin guard)
 */
export async function createEvent(request, reply) {
  const { title, category, description, venue, date, image } = request.body || {};

  // Request validation
  if (!title || !title.trim() || !category || !category.trim() || !description || !description.trim() || !venue || !venue.trim() || !date || !image || !image.trim()) {
    return reply.status(400).send({ error: 'All event fields are required' });
  }

  try {
    const newEvent = new Event({
      title,
      category,
      description,
      venue,
      date,
      image,
    });

    const savedEvent = await newEvent.save();
    return savedEvent;
  } catch (err) {
    request.log.error(err);
    reply.status(500);
    return { error: 'Failed to create event' };
  }
}

/**
 * Update an existing event details (Admin only via verifyAdmin guard)
 */
export async function updateEvent(request, reply) {
  const { id } = request.params;
  const { title, category, description, venue, date, image } = request.body || {};

  // Request validation
  if (!title || !title.trim() || !category || !category.trim() || !description || !description.trim() || !venue || !venue.trim() || !date || !image || !image.trim()) {
    return reply.status(400).send({ error: 'All event fields are required' });
  }

  try {
    const event = await Event.findById(id);
    if (!event) {
      return reply.status(404).send({ error: 'Event not found' });
    }

    event.title = title;
    event.category = category;
    event.description = description;
    event.venue = venue;
    event.date = date;
    event.image = image;

    const updatedEvent = await event.save();
    return updatedEvent;
  } catch (err) {
    request.log.error(err);
    reply.status(500);
    return { error: 'Failed to update event' };
  }
}

/**
 * Delete an event (Admin only via verifyAdmin guard)
 */
export async function deleteEvent(request, reply) {
  const { id } = request.params;

  try {
    const event = await Event.findById(id);
    if (!event) {
      return reply.status(404).send({ error: 'Event not found' });
    }

    // Perform atomic deletion
    await Event.deleteOne({ _id: id });
    // Cascading delete feedbacks associated with the event
    await Feedback.deleteMany({ eventId: id });

    return { success: true, message: 'Event and related feedbacks deleted successfully' };
  } catch (err) {
    request.log.error(err);
    reply.status(500);
    return { error: 'Failed to delete event' };
  }
}
