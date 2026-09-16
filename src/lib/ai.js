import { API_URL } from './config';

const getAuthHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('renterty_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
};

const aiFetch = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  try {
    const response = await fetch(url, {
      credentials: 'include',
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...(options.headers || {})
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData.error || errorData.message || `Request failed with status ${response.status}`;
      return { success: false, error: message };
    }

    return await response.json();
  } catch (err) {
    console.warn(`[aiFetch Notice on ${endpoint}]:`, err.message);
    return { success: false, error: err.message };
  }
};

/**
 * 1. AI Smart Search
 */
export const aiSmartSearch = async (query) => {
  return await aiFetch('/ai/search', {
    method: 'POST',
    body: JSON.stringify({ query })
  });
};

/**
 * 2. AI Rental Assistant
 */
export const aiAssistantMessage = async (message, conversationHistory = []) => {
  return await aiFetch('/ai/assistant', {
    method: 'POST',
    body: JSON.stringify({ message, conversationHistory })
  });
};

/**
 * 3. AI Property Recommendations
 */
export const aiGetRecommendations = async (limit = 4) => {
  return await aiFetch('/ai/recommendations', {
    method: 'POST',
    body: JSON.stringify({ limit })
  });
};

/**
 * 4. AI Property Description Generator
 */
export const aiGenerateDescription = async (propertyData) => {
  return await aiFetch('/ai/generate-description', {
    method: 'POST',
    body: JSON.stringify(propertyData)
  });
};

/**
 * 5. AI Property Image Analyzer
 */
export const aiAnalyzeImage = async (imageUrl, propertyDetails = {}) => {
  return await aiFetch('/ai/analyze-image', {
    method: 'POST',
    body: JSON.stringify({ imageUrl, propertyDetails })
  });
};

/**
 * 6. AI Rent Price Estimator
 */
export const aiEstimateRent = async (propertySpecs) => {
  return await aiFetch('/ai/estimate-rent', {
    method: 'POST',
    body: JSON.stringify(propertySpecs)
  });
};

/**
 * 7. AI Listing Quality & Fraud Risk Detector
 */
export const aiAnalyzeListing = async (propertyData) => {
  return await aiFetch('/ai/analyze-listing', {
    method: 'POST',
    body: JSON.stringify({ propertyData })
  });
};

/**
 * 8. AI Review Sentiment & Insights
 */
export const aiAnalyzeReviews = async ({ propertyId, ownerId, reviewTexts }) => {
  return await aiFetch('/ai/analyze-reviews', {
    method: 'POST',
    body: JSON.stringify({ propertyId, ownerId, reviewTexts })
  });
};

/**
 * 9. AI Interaction Stats (Admin)
 */
export const aiGetStats = async () => {
  return await aiFetch('/ai/stats');
};
