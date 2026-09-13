/**
 * Renterty AI Client Library
 * Centralized API client for all 8 AI Layer features
 */

const getApiUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
};

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

/**
 * 1. AI Smart Search
 */
export const aiSmartSearch = async (query) => {
  const res = await fetch(`${getApiUrl()}/ai/search`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ query })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to process AI search query');
  }
  return await res.json();
};

/**
 * 2. AI Rental Assistant
 */
export const aiAssistantMessage = async (message, conversationHistory = []) => {
  const res = await fetch(`${getApiUrl()}/ai/assistant`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ message, conversationHistory })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to communicate with AI Assistant');
  }
  return await res.json();
};

/**
 * 3. AI Property Recommendations
 */
export const aiGetRecommendations = async (limit = 4) => {
  const res = await fetch(`${getApiUrl()}/ai/recommendations`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ limit })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to fetch recommendations');
  }
  return await res.json();
};

/**
 * 4. AI Property Description Generator
 */
export const aiGenerateDescription = async (propertyData) => {
  const res = await fetch(`${getApiUrl()}/ai/generate-description`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(propertyData)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to generate property description');
  }
  return await res.json();
};

/**
 * 5. AI Property Image Analyzer
 */
export const aiAnalyzeImage = async (imageUrl, propertyDetails = {}) => {
  const res = await fetch(`${getApiUrl()}/ai/analyze-image`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ imageUrl, propertyDetails })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to analyze property image');
  }
  return await res.json();
};

/**
 * 6. AI Rent Price Estimator
 */
export const aiEstimateRent = async (propertySpecs) => {
  const res = await fetch(`${getApiUrl()}/ai/estimate-rent`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(propertySpecs)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to calculate rent estimate');
  }
  return await res.json();
};

/**
 * 7. AI Listing Quality & Fraud Risk Detector
 */
export const aiAnalyzeListing = async (propertyData) => {
  const res = await fetch(`${getApiUrl()}/ai/analyze-listing`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ propertyData })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to assess listing quality');
  }
  return await res.json();
};

/**
 * 8. AI Review Sentiment & Insights
 */
export const aiAnalyzeReviews = async ({ propertyId, ownerId, reviewTexts }) => {
  const res = await fetch(`${getApiUrl()}/ai/analyze-reviews`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ propertyId, ownerId, reviewTexts })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to analyze reviews');
  }
  return await res.json();
};

/**
 * 9. AI Interaction Stats (Admin)
 */
export const aiGetStats = async () => {
  const res = await fetch(`${getApiUrl()}/ai/stats`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to fetch AI analytics stats');
  }
  return await res.json();
};
