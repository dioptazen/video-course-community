<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useGroupStore } from '../../stores/group';
import { useAuthStore } from '../../stores/auth';
import GroupHeader from './GroupHeader.vue';
import GroupNavigation from './GroupNavigation.vue';

const route = useRoute();
const groupStore = useGroupStore();
const authStore = useAuthStore();

const isMember = computed(() => {
  if (!groupStore.currentGroup || !authStore.user) return false;
  // This would need to be implemented in the backend to check membership
  return true; // Placeholder
});

onMounted(async () => {
  const groupUrl = route.params.url as string;
  await groupStore.fetchGroupByUrl(groupUrl);
});
</script>

<template>
  <div
    v-if="groupStore.loading"
    class="flex justify-center items-center min-h-screen"
  >
    <div
      class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
    ></div>
  </div>

  <div v-else-if="groupStore.currentGroup" class="min-h-screen bg-gray-50">
    <GroupHeader :group="groupStore.currentGroup" :is-member="isMember" />
    <GroupNavigation v-if="isMember" />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-view></router-view>
    </main>
  </div>

  <div v-else-if="groupStore.error" class="text-center py-8 text-red-600">
    {{ groupStore.error }}
  </div>
</template>
