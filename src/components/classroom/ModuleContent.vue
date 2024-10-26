<script setup lang="ts">
import { computed } from 'vue';
import type { CourseModule } from '../../types';

const props = defineProps<{
  module: CourseModule;
  progress: { moduleId: number; completed: boolean; completedAt: string | null; }[];
}>();

const emit = defineEmits<{
  (e: 'complete', moduleId: number): void;
}>();

const isCompleted = computed(() => {
  return props.progress.some(p => p.moduleId === props.module.id && p.completed);
});

function handleComplete() {
  emit('complete', props.module.id);
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-md">
    <!-- Module header -->
    <div class="p-6 border-b">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900">{{ module.title }}</h1>
        <button
          v-if="!isCompleted && module.type === 'LESSON'"
          @click="handleComplete"
          class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Mark as Complete
        </button>
        <span
          v-else-if="isCompleted"
          class="text-green-600 flex items-center"
        >
          ✓ Completed
        </span>
      </div>
    </div>

    <!-- Module content -->
    <div class="p-6">
      <p class="text-gray-700 mb-6">{{ module.description }}</p>

      <!-- Video content for lessons -->
      <div v-if="module.type === 'LESSON' && module.videoUrl" class="aspect-w-16 aspect-h-9 mb-6">
        <iframe
          :src="module.videoUrl"
          class="w-full h-full rounded-lg"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>

      <!-- Module image -->
      <img
        v-if="module.image"
        :src="module.image"
        :alt="module.title"
        class="w-full rounded-lg"
      />
    </div>
  </div>
</template>