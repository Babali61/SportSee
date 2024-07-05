const API_URL = 'http://localhost:3001';



const checkResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const data = await response.json();
    return data;
  } else {
    const text = await response.text();
    throw new Error(`Erreur: ${text}`);
  }
};

export const fetchUserData = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/user/${userId}`);
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des données utilisateur: ${response.statusText}`);
    }
    return await checkResponse(response);
  } catch (error) {
    console.error('Erreur lors de la récupération des données utilisateur :', error);
    throw error;
  }
};

export const fetchUserActivity = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/user/${userId}/activity`);
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération de l'activité utilisateur: ${response.statusText}`);
    }
    return await checkResponse(response);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'activité utilisateur :", error);
    throw error;
  }
};

export const fetchUserAverageSessions = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/user/${userId}/average-sessions`);
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des sessions moyennes de l'utilisateur: ${response.statusText}`);
    }
    return await checkResponse(response);
  } catch (error) {
    console.error("Erreur lors de la récupération des sessions moyennes de l'utilisateur :", error);
    throw error;
  }
};

export const fetchUserPerformance = async (userId) => {
  const response = await fetch(`http://localhost:3001/user/${userId}/performance`);
  if (!response.ok) {
    throw new Error('User performance data not found');
  }
  const data = await response.json();
  console.log('Fetched Data:', data);
  return data;
};
