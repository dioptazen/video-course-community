import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';
import type { Post, Topic } from '../types';

export const useCommunityStore = defineStore('community', () => {
  const posts = ref<Post[]>([]);
  const topics = ref<Topic[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const currentTopicId = ref<number | null>(null);

  const filteredPosts = computed(() => {
    if (!currentTopicId.value) return posts.value;
    return posts.value.filter(post => post.topicId === currentTopicId.value);
  });

  async function fetchPosts(groupUrl: string) {
    try {
      loading.value = true;
      const response = await axios.get(`/api/groups/${groupUrl}/posts`);
      posts.value = response.data;
    } catch (err) {
      error.value = 'Failed to fetch posts';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchTopics(groupUrl: string) {
    try {
      const response = await axios.get(`/api/groups/${groupUrl}/topics`);
      topics.value = response.data;
    } catch (err) {
      error.value = 'Failed to fetch topics';
      throw err;
    }
  }

  async function createPost(postData: Partial<Post>) {
    try {
      loading.value = true;
      const response = await axios.post('/api/posts', postData);
      posts.value.unshift(response.data);
      return response.data;
    } catch (err) {
      error.value = 'Failed to create post';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function filterPostsByTopic(topicId: number | null) {
    currentTopicId.value = topicId;
  }

  return {
    posts,
    topics,
    loading,
    error,
    filteredPosts,
    fetchPosts,
    fetchTopics,
    createPost,
    filterPostsByTopic
  };
});