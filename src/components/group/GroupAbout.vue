<script setup lang="ts">
import { computed } from 'vue';
import { useGroupStore } from '../../stores/group';

const groupStore = useGroupStore();
const group = computed(() => groupStore.currentGroup);
</script>

<template>
  <div v-if="group" class="bg-white shadow rounded-lg p-6">
    <h3 class="text-lg font-medium text-gray-900 mb-4">About {{ group.name }}</h3>
    <div class="prose max-w-none">
      <p>{{ group.description }}</p>
    </div>
  </div>
</template>