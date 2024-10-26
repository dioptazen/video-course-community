<script setup lang="ts">
import { computed } from 'vue';
import type { CourseModule } from '../../types';
import ModuleTreeItem from './ModuleTreeItem.vue';

const props = defineProps<{
  modules: CourseModule[];
  activeModule: CourseModule | null;
  loading: boolean;
}>();

const mainModules = computed(() => {
  return props.modules.filter(module => module.type === 'MAIN');
});
</script>

<template>
  <div>
    <h2 class="text-lg font-semibold text-gray-900 mb-4">Course Content</h2>

    <div v-if="loading" class="py-4 text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
    </div>

    <div v-else class="space-y-2">
      <ModuleTreeItem
        v-for="module in mainModules"
        :key="module.id"
        :module="module"
        :active-module="activeModule"
        :modules="modules"
      />
    </div>
  </div>
</template>