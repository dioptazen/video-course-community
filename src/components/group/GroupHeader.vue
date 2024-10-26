<script setup lang="ts">
import { ref } from 'vue';
import type { Group } from '../types';
import { useGroupStore } from '../../stores/group';

const props = defineProps<{
  group: Group;
  isMember: boolean;
}>();

const groupStore = useGroupStore();
const isJoining = ref(false);

async function handleJoin() {
  if (isJoining.value) return;

  try {
    isJoining.value = true;
    await groupStore.joinGroup(props.group.id);
  } finally {
    isJoining.value = false;
  }
}
</script>

<template>
  <header class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <img
            :src="group.logo"
            :alt="group.name"
            class="h-12 w-12 rounded-full object-cover"
          />
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ group.name }}</h1>
            <p class="text-sm text-gray-500">
              {{ group.memberCount }} members · {{ group.onlineCount }} online
            </p>
          </div>
        </div>

        <button
          v-if="!isMember"
          @click="handleJoin"
          :disabled="isJoining"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {{ isJoining ? 'Joining...' : 'Join Group' }}
        </button>
      </div>
    </div>
  </header>
</template>
