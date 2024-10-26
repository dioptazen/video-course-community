<script setup lang="ts">
import { computed } from 'vue';
import type { Post } from '../../types';
import PostCard from './PostCard.vue';

const props = defineProps<{
  posts: Post[];
  loading: boolean;
  error: string | null;
}>();

const sortedPosts = computed(() => {
  return [...props.posts].sort((a, b) => {
    // Pinned posts first
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    // Then sort by date
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
});
</script>

<template>
  <div>
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
    </div>

    <div v-else-if="error" class="text-center py-8 text-red-600">
      {{ error }}
    </div>

    <div v-else-if="posts.length === 0" class="text-center py-8 text-gray-500">
      No posts yet. Be the first to share something!
    </div>

    <div v-else class="space-y-6">
      <PostCard
        v-for="post in sortedPosts"
        :key="post.id"
        :post="post"
      />
    </div>
  </div>
</template>