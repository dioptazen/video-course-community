import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';
import type { Group } from '../types';

export const useGroupStore = defineStore('group', () => {
  const groups = ref<Group[]>([]);
  const currentGroup = ref<Group | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchGroups(search?: string) {
    try {
      loading.value = true;
      const params = search ? { search } : {};
      const response = await axios.get('/api/groups', { params });
      groups.value = response.data;
    } catch (err) {
      error.value = 'Failed to fetch groups';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchGroupByUrl(url: string) {
    try {
      loading.value = true;
      const response = await axios.get(`/api/groups/${url}`);
      currentGroup.value = response.data;
    } catch (err) {
      error.value = 'Failed to fetch group details';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function joinGroup(groupId: number) {
    try {
      await axios.post(`/api/groups/${groupId}/join`);
      if (currentGroup.value && currentGroup.value.id === groupId) {
        currentGroup.value.memberCount++;
      }
    } catch (err) {
      error.value = 'Failed to join group';
      throw err;
    }
  }

  return {
    groups,
    currentGroup,
    loading,
    error,
    fetchGroups,
    fetchGroupByUrl,
    joinGroup
  };
});