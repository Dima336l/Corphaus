// API base URL - change this for production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://corphaus-backend.onrender.com/api';

// Helper function for making API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Properties API
export const propertiesAPI = {
  getAll: (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams ? `/properties?${queryParams}` : '/properties';
    return apiRequest(endpoint);
  },

  getById: (id) => apiRequest(`/properties/${id}`),

  create: (propertyData, userId) => {
    return apiRequest('/properties', {
      method: 'POST',
      headers: {
        'x-user-id': userId,
      },
      body: JSON.stringify(propertyData),
    });
  },

  update: (id, propertyData, userId) => {
    return apiRequest(`/properties/${id}`, {
      method: 'PUT',
      headers: {
        'x-user-id': userId,
      },
      body: JSON.stringify(propertyData),
    });
  },

  delete: (id, userId) => {
    return apiRequest(`/properties/${id}`, {
      method: 'DELETE',
      headers: {
        'x-user-id': userId,
      },
    });
  },

  getMyListings: (userId) => {
    return apiRequest('/properties/my/listings', {
      headers: {
        'x-user-id': userId,
      },
    });
  },
};

// Wanted Ads API
export const wantedAdsAPI = {
  getAll: (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams ? `/wanted-ads?${queryParams}` : '/wanted-ads';
    return apiRequest(endpoint);
  },

  getById: (id) => apiRequest(`/wanted-ads/${id}`),

  create: (adData, userId) => {
    return apiRequest('/wanted-ads', {
      method: 'POST',
      headers: {
        'x-user-id': userId,
      },
      body: JSON.stringify(adData),
    });
  },

  update: (id, adData, userId) => {
    return apiRequest(`/wanted-ads/${id}`, {
      method: 'PUT',
      headers: {
        'x-user-id': userId,
      },
      body: JSON.stringify(adData),
    });
  },

  delete: (id, userId) => {
    return apiRequest(`/wanted-ads/${id}`, {
      method: 'DELETE',
      headers: {
        'x-user-id': userId,
      },
    });
  },

  getMyListings: (userId) => {
    return apiRequest('/wanted-ads/my/listings', {
      headers: {
        'x-user-id': userId,
      },
    });
  },
};

// Auth API
export const authAPI = {
  signup: (email, password, name, role, businessName = '') => {
    return apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, role, businessName }),
    });
  },

  login: (email, password) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  getMe: (userId) => {
    return apiRequest('/auth/me', {
      headers: {
        'x-user-id': userId,
      },
    });
  },

  upgrade: (userId) => {
    return apiRequest('/auth/upgrade', {
      method: 'POST',
      headers: {
        'x-user-id': userId,
      },
    });
  },
};

export default {
  auth: authAPI,
  properties: propertiesAPI,
  wantedAds: wantedAdsAPI,
};

