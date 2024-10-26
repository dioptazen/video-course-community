import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';
import type { User } from '../types';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);

  async function login(email: string, password: string) {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      token.value = response.data.token;
      user.value = response.data.user;
      localStorage.setItem('token', token.value);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async function register(userData: Partial<User> & { password: string }) {
    try {
      const response = await axios.post('/api/auth/register', userData);
      token.value = response.data.token;
      user.value = response.data.user;
      localStorage.setItem('token', token.value);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  function logout() {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
  }

  return {
    user,
    token,
    login,
    register,
    logout
  };
});