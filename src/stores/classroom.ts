import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';
import type { CourseModule } from '../types';

interface ModuleProgress {
  moduleId: number;
  completed: boolean;
  completedAt: string | null;
}

export const useClassroomStore = defineStore('classroom', () => {
  const modules = ref<CourseModule[]>([]);
  const currentModule = ref<CourseModule | null>(null);
  const progress = ref<ModuleProgress[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const moduleTree = computed(() => {
    const tree: CourseModule[] = [];
    const moduleMap = new Map<number, CourseModule & { children: CourseModule[] }>();

    // Create map of all modules with empty children arrays
    modules.value.forEach(module => {
      moduleMap.set(module.id, { ...module, children: [] });
    });

    // Build tree structure
    modules.value.forEach(module => {
      const moduleWithChildren = moduleMap.get(module.id)!;
      if (module.parentId) {
        const parent = moduleMap.get(module.parentId);
        if (parent) {
          parent.children.push(moduleWithChildren);
        }
      } else {
        tree.push(moduleWithChildren);
      }
    });

    return tree;
  });

  async function fetchModules(groupUrl: string) {
    try {
      loading.value = true;
      const [modulesResponse, progressResponse] = await Promise.all([
        axios.get(`/api/groups/${groupUrl}/modules`),
        axios.get(`/api/groups/${groupUrl}/progress`)
      ]);
      
      modules.value = modulesResponse.data;
      progress.value = progressResponse.data;
    } catch (err) {
      error.value = 'Failed to fetch course modules';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function markModuleComplete(moduleId: number) {
    try {
      const response = await axios.post(`/api/modules/${moduleId}/complete`);
      const updatedProgress = response.data;
      
      const index = progress.value.findIndex(p => p.moduleId === moduleId);
      if (index !== -1) {
        progress.value[index] = updatedProgress;
      } else {
        progress.value.push(updatedProgress);
      }
    } catch (err) {
      error.value = 'Failed to update module progress';
      throw err;
    }
  }

  return {
    modules,
    currentModule,
    progress,
    loading,
    error,
    moduleTree,
    fetchModules,
    markModuleComplete
  };
});