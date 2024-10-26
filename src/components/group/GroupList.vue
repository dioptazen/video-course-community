<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useGroupStore } from '../../stores/group';
import GroupCard from './GroupCard.vue';
import SearchBar from './../SearchBar.vue';

const groupStore = useGroupStore();
const searchQuery = ref('');

async function handleSearch(query: string) {
  searchQuery.value = query;
  await groupStore.fetchGroups(query);
}

onMounted(() => {
  groupStore.fetchGroups();
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Communities</h1>
      <router-link
        to="/groups/create"
        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Create Group
      </router-link>
    </div>

    <SearchBar
      :value="searchQuery"
      @search="handleSearch"
      placeholder="Search communities..."
      class="mb-8"
    />

    <div v-if="groupStore.loading" class="text-center py-8">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"
      ></div>
    </div>

    <div v-else-if="groupStore.error" class="text-center py-8 text-red-600">
      {{ groupStore.error }}
    </div>

    <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <GroupCard
        v-for="group in groupStore.groups"
        :key="group.id"
        :group="group"
      />
    </div>
  </div>
</template>
