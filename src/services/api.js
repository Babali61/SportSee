

const API_URL = 'http://localhost:3001';

const checkResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  console.log('Response Content-Type:', contentType);
  if (contentType && contentType.includes('application/json')) {
    const data = await response.json();
    console.log('Response JSON Data:', data);
    return data;
  } else {
    const text = await response.text();
    console.error('Response Text:', text);
    throw new Error(`Erreur: ${text}`);
  }
};

/**
 * Récupère les données de l'utilisateur par son ID.
 *
 * @param {number} id - L'ID de l'utilisateur.
 * @returns {Promise<Object>} Les données de l'utilisateur.
 */

export const fetchUserData = async (id) => {
  console.log(`Fetching user data for ID: ${id}`);
  try {
    const response = await fetch(`${API_URL}/user/${id}`);
    console.log('User Data Response:', response);
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des données utilisateur: ${response.statusText}`);
    }
    return await checkResponse(response);
  } catch (error) {
    console.error('Erreur lors de la récupération des données utilisateur :', error);
    throw error;
  }
};


/**
 * Récupère les données d'activité quotidienne de l'utilisateur.
 *
 * @param {number} userId - L'ID de l'utilisateur.
 * @returns {Promise<Object>} Les données d'activité.
 */

export const fetchUserActivity = async (userId) => {
  console.log(`Fetching user activity for user ID: ${userId}`);
  try {
    const response = await fetch(`${API_URL}/user/${userId}/activity`);
    console.log('User Activity Response:', response);
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération de l'activité utilisateur: ${response.statusText}`);
    }
    return await checkResponse(response);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'activité utilisateur :", error);
    throw error;
  }
};

/**
 * Récupère les sessions moyennes de l'utilisateur par jour.
 *
 * @param {number} userId - L'ID de l'utilisateur.
 * @returns {Promise<Object>} Les données des sessions moyennes.
 */

export const fetchUserAverageSessions = async (userId) => {
  console.log(`Fetching user average sessions for user ID: ${userId}`);
  try {
    const response = await fetch(`${API_URL}/user/${userId}/average-sessions`);
    console.log('User Average Sessions Response:', response);
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des sessions moyennes de l'utilisateur: ${response.statusText}`);
    }
    return await checkResponse(response);
  } catch (error) {
    console.error("Erreur lors de la récupération des sessions moyennes de l'utilisateur :", error);
    throw error;
  }
};

/**
 * Récupère les performances de l'utilisateur.
 *
 * @param {number} userId - L'ID de l'utilisateur.
 * @returns {Promise<Object>} Les données de performance.
 */

export const fetchUserPerformance = async (userId) => {
  console.log(`Fetching user performance for user ID: ${userId}`);
  try {
    const response = await fetch(`${API_URL}/user/${userId}/performance`);
    console.log('User Performance Response:', response);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des performances utilisateur');
    }
    return await checkResponse(response);
  } catch (error) {
    console.error("Erreur lors de la récupération des performances utilisateur :", error);
    throw error;
  }
};