<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import type { User } from '../../types';

const route = useRoute();
const members = ref<User[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    const groupUrl = route.params.url as string;
    const response = await fetch(`/api/groups/${groupUrl}/members`);
    members.value = await response.json();
  } catch (err) {
    error.value = 'Failed to load members';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="bg-white shadow rounded-lg">
    <div class="px-4 py-5 sm:px-6">
      <h3 class="text-lg font-medium leading-6 text-gray-900">Group Members</h3>
    </div>
    
    <div v-if="loading" class="p-4 flex justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
    
    <div v-else-if="error" class="p-4 text-red-600 text-center">
      {{ error }}
    </div>
    
    <ul v-else role="list" class="divide-y divide-gray-200">
      <li v-for="member in members" :key="member.id" class="px-4 py-4 sm:px-6">
        <div class="flex items-center space-x-4">
          <img
            :src="member.profilePhoto || '/default-avatar.png'"
            :alt="member.firstName"
            class="h-10 w-10 rounded-full"
          />
          <div>
            <p class="text-sm font-medium text-gray-900">
              {{ member.firstName }} {{ member.lastName }}
            </p>
            <p class="text-sm text-gray-500">{{ member.email }}</p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>