<script setup lang="ts">
import { ref, computed } from 'vue';
import type { CourseModule } from '../../types';

const props = defineProps<{
  module: CourseModule;
  activeModule: CourseModule | null;
  modules: CourseModule[];
}>();

const isExpanded = ref(false);

const children = computed(() => {
  return props.modules.filter(m => m.parentId === props.module.id);
});

const hasChildren = computed(() => children.value.length > 0);

function toggleExpand() {
  if (hasChildren.value) {
    isExpanded.value = !isExpanded.value;
  }
}
</script>

<template>
  <div class="module-tree-item">
    <div
      @click="toggleExpand"
      class="flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-50"
      :class="{
        'bg-blue-50 text-blue-700': module.id === activeModule?.id
      }"
    >
      <span v-if="hasChildren" class="mr-2">
        {{ isExpanded ? '▼' : '▶' }}
      </span>
      <span v-else class="mr-2">•</span>
      
      <span class="flex-grow">{{ module.title }}</span>
    </div>

    <div
      v-if="hasChildren && isExpanded"
      class="pl-4 mt-1 space-y-1"
    >
      <ModuleTreeItem
        v-for="child in children"
        :key="child.id"
        :module="child"
        :active-module="activeModule"
        :modules="modules"
      />
    </div>
  </div>
</template>