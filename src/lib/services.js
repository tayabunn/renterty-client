/**
 * Client Services for Renterty Next-Level Features:
 * - Interactive Tour Booking
 * - Maintenance Dispatch & AI Triaging
 * - Direct Messaging & AI Smart Replies
 * - Digital Residential Leases & E-Signatures
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

const apiFetch = async (endpoint, options = {}) => {
  const url = `${getApiUrl()}${endpoint}`;
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
    const message = errorData.message || errorData.error || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return await response.json();
};

/* =========================================================================
   1. TOURS API
   ========================================================================= */
export const scheduleTour = async (tourData) => {
  return await apiFetch('/tours', {
    method: 'POST',
    body: JSON.stringify(tourData)
  });
};

export const getTenantTours = async () => {
  return await apiFetch('/tours/tenant');
};

export const getOwnerTours = async () => {
  return await apiFetch('/tours/owner');
};

export const updateTourStatus = async (tourId, updateData) => {
  return await apiFetch(`/tours/${tourId}/status`, {
    method: 'PATCH',
    body: JSON.stringify(updateData)
  });
};

/* =========================================================================
   2. MAINTENANCE API
   ========================================================================= */
export const triageMaintenancePreview = async (ticketData) => {
  return await apiFetch('/maintenance/triage-preview', {
    method: 'POST',
    body: JSON.stringify(ticketData)
  });
};

export const createMaintenanceTicket = async (ticketData) => {
  return await apiFetch('/maintenance', {
    method: 'POST',
    body: JSON.stringify(ticketData)
  });
};

export const getTenantTickets = async () => {
  return await apiFetch('/maintenance/tenant');
};

export const getOwnerTickets = async () => {
  return await apiFetch('/maintenance/owner');
};

export const updateTicketStatus = async (ticketId, updateData) => {
  return await apiFetch(`/maintenance/${ticketId}/status`, {
    method: 'PATCH',
    body: JSON.stringify(updateData)
  });
};

/* =========================================================================
   3. IN-APP MESSAGING API
   ========================================================================= */
export const getConversations = async () => {
  return await apiFetch('/messages/conversations');
};

export const getConversationMessages = async (conversationId) => {
  return await apiFetch(`/messages/${conversationId}`);
};

export const sendMessage = async (messageData) => {
  return await apiFetch('/messages', {
    method: 'POST',
    body: JSON.stringify(messageData)
  });
};

export const getSmartReplies = async ({ lastMessage, propertyTitle, role }) => {
  return await apiFetch('/messages/smart-replies', {
    method: 'POST',
    body: JSON.stringify({ lastMessage, propertyTitle, role })
  });
};

/* =========================================================================
   4. DIGITAL LEASE & E-SIGNATURE API
   ========================================================================= */
export const getLeaseForProperty = async (propertyId) => {
  return await apiFetch(`/leases/property/${propertyId}`);
};

export const createLease = async (leaseData) => {
  return await apiFetch('/leases/create', {
    method: 'POST',
    body: JSON.stringify(leaseData)
  });
};

export const signLease = async (leaseId, signatureDataUrl) => {
  return await apiFetch(`/leases/${leaseId}/sign`, {
    method: 'POST',
    body: JSON.stringify({ signatureDataUrl })
  });
};

export const getLeasePdfDownloadUrl = (leaseId) => {
  return `${getApiUrl()}/leases/${leaseId}/pdf`;
};
