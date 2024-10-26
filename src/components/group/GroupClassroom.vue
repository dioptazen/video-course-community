<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useClassroomStore } from '../../stores/classroom';
import ModuleList from './../classroom/ModuleList.vue';
import ModuleContent from './../classroom/ModuleContent.vue';

const classroomStore = useClassroomStore();
const route = useRoute();

onMounted(async () => {
  const groupUrl = route.params.url as string;
  await classroomStore.fetchModules(groupUrl);
});
</script>

<template>
  <div class="grid grid-cols-12 gap-6">
    <!-- Module navigation sidebar -->
    <div class="col-span-3 bg-white rounded-lg shadow-md p-4">
      <ModuleList
        :modules="classroomStore.modules"
        :active-module="classroomStore.currentModule"
        :loading="classroomStore.loading"
      />
    </div>

    <!-- Module content -->
    <div class="col-span-9">
      <ModuleContent
        v-if="classroomStore.currentModule"
        :module="classroomStore.currentModule"
        :progress="classroomStore.progress"
        @complete="classroomStore.markModuleComplete"
      />

      <div
        v-else
        class="bg-white rounded-lg shadow-md p-8 text-center text-gray-500"
      >
        Select a module to start learning
      </div>
    </div>
  </div>
</template>
