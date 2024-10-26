<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
//import PostList from './../community/PostList.vue';
//import PostForm from './../community/PostForm.vue';
//import TopicList from './../community/TopicList.vue';
import { useCommunityStore } from '../../stores/community';

const communityStore = useCommunityStore();
const route = useRoute();
const selectedTopic = ref<number | null>(null);
const showPostForm = ref(false);

onMounted(async () => {
  const groupUrl = route.params.url as string;
  await communityStore.fetchPosts(groupUrl);
  await communityStore.fetchTopics(groupUrl);
});

function handleTopicSelect(topicId: number | null) {
  selectedTopic.value = topicId;
  communityStore.filterPostsByTopic(topicId);
}
</script>

<template>
  <div class="grid grid-cols-12 gap-6">
    <!-- Sidebar with topics -->
    <div class="col-span-3">
      <!--<TopicList
        :topics="communityStore.topics"
        :selected-topic="selectedTopic"
        @select-topic="handleTopicSelect"
      />-->
    </div>

    <!-- Main content -->
    <div class="col-span-9">
      <div class="mb-6 flex justify-between items-center">
        <h2 class="text-2xl font-bold text-gray-900">Community Posts</h2>
        <button
          @click="showPostForm = true"
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          New Post
        </button>
      </div>

      <!--<PostForm
        v-if="showPostForm"
        :topics="communityStore.topics"
        @submit="communityStore.createPost"
        @cancel="showPostForm = false"
      />

      <PostList
        :posts="communityStore.filteredPosts"
        :loading="communityStore.loading"
        :error="communityStore.error"
      />-->
    </div>
  </div>
</template>
