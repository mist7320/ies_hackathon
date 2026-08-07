const API_BASE_URL = 'http://localhost:8001';

console.log('database connected');

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.detail || data.message || 'Request failed');
  }

  return data;
}

export const apiService = {
  getHealth: () => request('/health'),
  getDocuments: () => request('/documents'),
  getDocument: (documentId) => request(`/documents/${documentId}`),
  uploadDocument: (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return request('/documents/upload', {
      method: 'POST',
      body: formData,
    });
  },
};
