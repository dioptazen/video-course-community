<script setup lang="ts">
import type { Group } from '../../types';

defineProps<{
  group: Group;
}>();
</script>

<template>
  <router-link
    :to="`/groups/${group.url}`"
    class="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
  >
    <img
      :src="group.logo"
      :alt="group.name"
      class="w-full h-48 object-cover rounded-t-lg"
    />
    <div class="p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-2">{{ group.name }}</h2>
      <p class="text-gray-600 line-clamp-2 mb-4">{{ group.description }}</p>
      <div class="flex justify-between text-sm text-gray-500">
        <span>{{ group.memberCount }} members</span>
        <span>{{ group.onlineCount }} online</span>
      </div>
    </div>
  </router-link>
</template>
