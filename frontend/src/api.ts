const API_BASE_URL = 'http://localhost:3001';

// Call the backend chat API
export const sendChatMessage = async (history: any[], message: string) => {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ history, message }),
  });
  if (!response.ok) {
    throw new Error('Failed to connect to the AI backend.');
  }
  return response.json();
};

// Upload a file and get transactions
export const uploadStatement = async (file: File) => {
  const formData = new FormData();
  formData.append('statement', file);

  const response = await fetch(`${API_BASE_URL}/api/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'File upload failed.');
  }
  
  // The response is expected to be a JSON string, so we parse it here
  const jsonString = await response.text();
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.error("Failed to parse JSON from server:", jsonString);
    throw new Error("Received invalid data from server.");
  }
};
