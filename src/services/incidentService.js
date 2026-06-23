// src/services/incidentService.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const incidentService = {
  async getIncidents() {
    try {
      const res = await fetch(`${API_URL}/api/incidents`);
      if (!res.ok) throw new Error('Network response was not ok');
      return await res.json();
    } catch (error) {
      console.error('Failed to load incidents:', error);
      return [];
    }
  },

  async saveIncident(incident) {
    try {
      const res = await fetch(`${API_URL}/api/incidents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(incident)
      });
      if (!res.ok) throw new Error('Network response was not ok');
      return await res.json();
    } catch (error) {
      console.error('Failed to save incident:', error);
      throw error;
    }
  },

  async deleteIncident(id) {
    try {
      const res = await fetch(`${API_URL}/api/incidents/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Network response was not ok');
      return await res.json();
    } catch (error) {
      console.error('Failed to delete incident:', error);
      throw error;
    }
  }
};