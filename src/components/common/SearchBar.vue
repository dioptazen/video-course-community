<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  value: string;
  placeholder?: string;
}>();

const emit = defineEmits<{
  (e: 'search', value: string): void;
}>();

const searchInput = ref(props.value);

watch(searchInput, (newValue) => {
  emit('search', newValue);
});
</script>

<template>
  <div class="relative">
    <input
      type="text"
      v-model="searchInput"
      :placeholder="placeholder"
      class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
    <span
      v-if="searchInput"
      @click="searchInput = ''"
      class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
    >
      ✕
    </span>
  </div>
</template>