import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Submit feedback details to Fastify API
 * @param {Object} data - Feedback details { name, email, eventName, message }
 * @returns {Promise<Object>} Created feedback item from MongoDB
 */
export const submitFeedback = async (data) => {
  const response = await api.post('/feedback', data);
  return response.data;
};

/**
 * Fetch all feedback items from MongoDB via Fastify API
 * @returns {Promise<Array>} List of feedback objects
 */
export const getFeedbacks = async () => {
  const response = await api.get('/feedback');
  return response.data;
};

export default api;
