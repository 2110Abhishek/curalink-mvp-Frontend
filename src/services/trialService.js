import axios from "axios";

const API_URL = "https://curalink-mvp-backend.onrender.com/api/trials";

// Get all trials
export const getTrials = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching trials:', error);
    return [];
  }
};

// Create new trial
export const createTrial = async (trialData) => {
  try {
    const response = await axios.post(API_URL, trialData);
    return response.data;
  } catch (error) {
    console.error('Error creating trial:', error);
    throw error;
  }
};

// Update existing trial
export const updateTrial = async (id, trialData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, trialData);
    return response.data;
  } catch (error) {
    console.error('Error updating trial:', error);
    throw error;
  }
};

// Delete trial
export const deleteTrial = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting trial:', error);
    throw error;
  }
};