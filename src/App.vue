<script setup lang="ts">
import { useAuthStore } from './stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
</script>

<template>
  <router-view></router-view>
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>