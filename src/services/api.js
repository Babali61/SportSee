import { USER_MAIN_DATA, USER_ACTIVITY, USER_AVERAGE_SESSIONS, USER_PERFORMANCE } from '../mocks/data';
import UserData from '../models/UserData';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

/**
 * Service pour gérer les appels API
 */
class ApiService {
  constructor() {
    this.useApi = false;
    this.lastCheck = 0;
    // L'ID sera fourni lors des appels aux méthodes
  }

  /**
   * Vérifie la disponibilité de l'API
   * @param {number} userId - ID de l'utilisateur pour le test
   * @returns {Promise<boolean>}
   */
  async checkApiAvailability(userId) {
    // Ne vérifie pas plus d'une fois toutes les 5 secondes
    const now = Date.now();
    if (now - this.lastCheck < 5000) {
      return this.useApi;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 400);
      
      const response = await fetch(`${BASE_URL}/user/${userId}`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      this.useApi = response.ok;
      this.lastCheck = now;
      return this.useApi;
    } catch (error) {
      this.useApi = false;
      this.lastCheck = now;
      console.log('API non disponible, utilisation des mocks');
      return false;
    }
  }

  /**
   * Récupère les données principales de l'utilisateur
   * @param {number} userId 
   * @returns {Promise<UserData>}
   */
  async getUserData(userId) {
    try {
      await this.checkApiAvailability(userId);
      let userData;
      
      if (!this.useApi) {
        userData = USER_MAIN_DATA.find(user => user.id === userId);
        if (!userData) throw new Error('Utilisateur non trouvé');
      } else {
        const response = await fetch(`${BASE_URL}/user/${userId}`);
        if (!response.ok) {
          this.useApi = false;
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        userData = data.data;
      }

      return new UserData(userData);
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur:', error);
      throw new Error('Impossible de récupérer les données utilisateur');
    }
  }

  /**
   * Récupère les activités de l'utilisateur
   * @param {number} userId 
   * @returns {Promise<Array>}
   */
  async getUserActivity(userId) {
    try {
      await this.checkApiAvailability(userId);
      let activityData;
      
      if (!this.useApi) {
        activityData = USER_ACTIVITY.find(activity => activity.userId === userId);
        if (!activityData) throw new Error('Activités non trouvées');
      } else {
        const response = await fetch(`${BASE_URL}/user/${userId}/activity`);
        if (!response.ok) {
          this.useApi = false;
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        activityData = data.data;
      }

      return activityData.sessions;
    } catch (error) {
      console.error('Erreur lors de la récupération des activités:', error);
      throw new Error('Impossible de récupérer les activités');
    }
  }

  /**
   * Récupère les sessions moyennes de l'utilisateur
   * @param {number} userId 
   * @returns {Promise<Array>}
   */
  async getUserAverageSessions(userId) {
    try {
      await this.checkApiAvailability(userId);
      let sessionsData;
      
      if (!this.useApi) {
        sessionsData = USER_AVERAGE_SESSIONS.find(session => session.userId === userId);
        if (!sessionsData) throw new Error('Sessions non trouvées');
      } else {
        const response = await fetch(`${BASE_URL}/user/${userId}/average-sessions`);
        if (!response.ok) {
          this.useApi = false;
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        sessionsData = data.data;
      }

      return sessionsData.sessions;
    } catch (error) {
      console.error('Erreur lors de la récupération des sessions moyennes:', error);
      throw new Error('Impossible de récupérer les sessions moyennes');
    }
  }

  /**
   * Récupère les performances de l'utilisateur
   * @param {number} userId 
   * @returns {Promise<Object>}
   */
  async getUserPerformance(userId) {
    try {
      await this.checkApiAvailability(userId);
      let performanceData;
      
      if (!this.useApi) {
        performanceData = USER_PERFORMANCE.find(perf => perf.userId === userId);
        if (!performanceData) throw new Error('Performances non trouvées');
      } else {
        const response = await fetch(`${BASE_URL}/user/${userId}/performance`);
        if (!response.ok) {
          this.useApi = false;
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        performanceData = data.data;
      }

      return performanceData;
    } catch (error) {
      console.error('Erreur lors de la récupération des performances:', error);
      throw new Error('Impossible de récupérer les performances');
    }
  }

  /**
   * Récupère uniquement le prénom de l'utilisateur
   * @param {number} userId 
   * @returns {Promise<string>}
   */
  async getUserFirstName(userId) {
    try {
      const userData = await this.getUserData(userId);
      return userData.userInfos.firstName;
    } catch (error) {
      console.error('Erreur lors de la récupération du prénom:', error);
      throw new Error('Impossible de récupérer le prénom de l\'utilisateur');
    }
  }

  /**
   * Récupère le score de l'utilisateur
   * @param {number} userId 
   * @returns {Promise<number>}
   */
  async getUserScore(userId) {
    try {
      const userData = await this.getUserData(userId);
      return userData.score;
    } catch (error) {
      console.error('Erreur lors de la récupération du score:', error);
      throw new Error('Impossible de récupérer le score de l\'utilisateur');
    }
  }
}

// Création d'une instance du service
const apiService = new ApiService();

// Export de l'instance
export default apiService;