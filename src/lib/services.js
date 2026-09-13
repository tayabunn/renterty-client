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

/* =========================================================================
   1. TOURS API
   ========================================================================= */
export const scheduleTour = async (tourData) => {
  const res = await fetch(`${getApiUrl()}/tours`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(tourData)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to schedule tour');
  }
  return await res.json();
};

export const getTenantTours = async () => {
  const res = await fetch(`${getApiUrl()}/tours/tenant`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch tours');
  return await res.json();
};

export const getOwnerTours = async () => {
  const res = await fetch(`${getApiUrl()}/tours/owner`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch tour requests');
  return await res.json();
};

export const updateTourStatus = async (tourId, updateData) => {
  const res = await fetch(`${getApiUrl()}/tours/${tourId}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(updateData)
  });
  if (!res.ok) throw new Error('Failed to update tour');
  return await res.json();
};

/* =========================================================================
   2. MAINTENANCE API
   ========================================================================= */
export const triageMaintenancePreview = async (ticketData) => {
  const res = await fetch(`${getApiUrl()}/maintenance/triage-preview`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(ticketData)
  });
  if (!res.ok) throw new Error('Failed to preview triage');
  return await res.json();
};

export const createMaintenanceTicket = async (ticketData) => {
  const res = await fetch(`${getApiUrl()}/maintenance`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(ticketData)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to submit maintenance ticket');
  }
  return await res.json();
};

export const getTenantTickets = async () => {
  const res = await fetch(`${getApiUrl()}/maintenance/tenant`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch maintenance tickets');
  return await res.json();
};

export const getOwnerTickets = async () => {
  const res = await fetch(`${getApiUrl()}/maintenance/owner`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch property tickets');
  return await res.json();
};

export const updateTicketStatus = async (ticketId, updateData) => {
  const res = await fetch(`${getApiUrl()}/maintenance/${ticketId}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(updateData)
  });
  if (!res.ok) throw new Error('Failed to update ticket');
  return await res.json();
};

/* =========================================================================
   3. IN-APP MESSAGING API
   ========================================================================= */
export const getConversations = async () => {
  const res = await fetch(`${getApiUrl()}/messages/conversations`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch conversations');
  return await res.json();
};

export const getConversationMessages = async (conversationId) => {
  const res = await fetch(`${getApiUrl()}/messages/${conversationId}`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch messages');
  return await res.json();
};

export const sendMessage = async (messageData) => {
  const res = await fetch(`${getApiUrl()}/messages`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(messageData)
  });
  if (!res.ok) throw new Error('Failed to send message');
  return await res.json();
};

export const getSmartReplies = async ({ lastMessage, propertyTitle, role }) => {
  const res = await fetch(`${getApiUrl()}/messages/smart-replies`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ lastMessage, propertyTitle, role })
  });
  if (!res.ok) throw new Error('Failed to get smart replies');
  return await res.json();
};

/* =========================================================================
   4. DIGITAL LEASE & E-SIGNATURE API
   ========================================================================= */
export const getLeaseForProperty = async (propertyId) => {
  const res = await fetch(`${getApiUrl()}/leases/property/${propertyId}`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch lease');
  return await res.json();
};

export const createLease = async (leaseData) => {
  const res = await fetch(`${getApiUrl()}/leases/create`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(leaseData)
  });
  if (!res.ok) throw new Error('Failed to create lease');
  return await res.json();
};

export const signLease = async (leaseId, signatureDataUrl) => {
  const res = await fetch(`${getApiUrl()}/leases/${leaseId}/sign`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ signatureDataUrl })
  });
  if (!res.ok) throw new Error('Failed to sign lease');
  return await res.json();
};

export const getLeasePdfDownloadUrl = (leaseId) => {
  return `${getApiUrl()}/leases/${leaseId}/pdf`;
};
