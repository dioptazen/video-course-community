<script setup lang="ts">
import { ref } from 'vue';
import type { Post } from '../../types';
import { useAuthStore } from '../../stores/auth';
import { formatDistanceToNow } from 'date-fns';

const props = defineProps<{
  post: Post;
}>();

const authStore = useAuthStore();
const isLiked = ref(false);

function toggleLike() {
  // TODO: Implement like functionality
  isLiked.value = !isLiked.value;
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center">
        <img
          :src="post.user?.profilePhoto"
          :alt="post.user?.firstName"
          class="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <h3 class="font-medium text-gray-900">
            {{ post.user?.firstName }} {{ post.user?.lastName }}
          </h3>
          <p class="text-sm text-gray-500">
            {{ formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) }}
          </p>
        </div>
      </div>
      <div v-if="post.isPinned" class="text-sm text-blue-600">
        📌 Pinned
      </div>
    </div>

    <h2 class="text-xl font-semibold mb-2">{{ post.title }}</h2>
    <p class="text-gray-700 mb-4">{{ post.content }}</p>

    <div class="flex items-center justify-between text-sm text-gray-500">
      <div class="flex items-center space-x-4">
        <button
          @click="toggleLike"
          class="flex items-center space-x-1 hover:text-blue-600"
          :class="{ 'text-blue-600': isLiked }"
        >
          <span>{{ isLiked ? '❤️' : '🤍' }}</span>
          <span>{{ post.likeCount }}</span>
        </button>
        <button class="flex items-center space-x-1 hover:text-blue-600">
          <span>💬</span>
          <span>{{ post.commentCount }}</span>
        </button>
      </div>
    </div>
  </div>
</template>