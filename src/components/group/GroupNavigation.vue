<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const currentSection = computed(() => route.name?.toString().split('.')[1] || 'community');

const navItems = [
  { name: 'Community', route: 'community', icon: '💬' },
  { name: 'Classroom', route: 'classroom', icon: '📚' },
  { name: 'Members', route: 'members', icon: '👥' },
  { name: 'Leaderboard', route: 'leaderboard', icon: '🏆' },
  { name: 'About', route: 'about', icon: 'ℹ️' },
];
</script>

<template>
  <nav class="bg-white border-b">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex space-x-8">
        <router-link
          v-for="item in navItems"
          :key="item.route"
          :to="{ name: `group.${item.route}` }"
          class="px-3 py-4 text-sm font-medium"
          :class="{
            'text-blue-600 border-b-2 border-blue-600': currentSection === item.route,
            'text-gray-500 hover:text-gray-700': currentSection !== item.route
          }"
        >
          <span class="mr-2">{{ item.icon }}</span>
          {{ item.name }}
        </router-link>
      </div>
    </div>
  </nav>
</template>