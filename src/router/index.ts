import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import Login from '../components/auth/Login.vue';
import Register from '../components/auth/Register.vue';
import GroupList from '../components/group/GroupList.vue';
import GroupLayout from '../components/group/GroupLayout.vue';
import GroupCommunity from '../components/group/GroupCommunity.vue';
import GroupClassroom from '../components/group/GroupClassroom.vue';
import GroupMembers from '../components/group/GroupMembers.vue';
import GroupLeaderboard from '../components/group/GroupLeaderboard.vue';
import GroupAbout from '../components/group/GroupAbout.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { guest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: { guest: true }
    },
    {
      path: '/',
      name: 'home',
      component: GroupList,
      meta: { requiresAuth: true }
    },
    {
      path: '/groups/:url',
      component: GroupLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'group.community',
          component: GroupCommunity
        },
        {
          path: 'classroom',
          name: 'group.classroom',
          component: GroupClassroom
        },
        {
          path: 'members',
          name: 'group.members',
          component: GroupMembers
        },
        {
          path: 'leaderboard',
          name: 'group.leaderboard',
          component: GroupLeaderboard
        },
        {
          path: 'about',
          name: 'group.about',
          component: GroupAbout
        }
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = !!authStore.token;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.meta.guest && isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

export default router;