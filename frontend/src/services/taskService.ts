import axios from 'axios';
import type { Task } from '../shared/types';

const API_BASE_URL = "http://localhost:4000";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const taskService = {
  async getTasks(): Promise<Task[]> {
    const response = await api.get('/tasks');
    return response.data;
  },

  async createTask(title: string, description: string): Promise<Task> {
    const response = await api.post('/tasks', { title, description });
    return response.data;
  },

  async updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Promise<Task | null> {
    try {
      const response = await api.put(`/tasks/${id}`, updates);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  async deleteTask(id: string): Promise<boolean> {
    try {
      await api.delete(`/tasks/${id}`);
      return true;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return false;
      }
      throw error;
    }
  },

  async getTaskById(id: string): Promise<Task | null> {
    try {
      const response = await api.get(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }
};
