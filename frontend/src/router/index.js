import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/HomeView.vue'),
      meta: {
        title: 'Home'
      },
    },
    {
      path: '/unauthorized',
      name: 'Unauthorized',
      component: () => import('../views/UnauthorizedView.vue'),
      meta: {
        title: 'Unauthorized'
      },
    },
    {
      path: '/volunteers',
      name: 'Volunteers',
      component: () => import('../views/VolunteersView.vue'),
      meta: {
        title: 'Volunteers'
      },
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/LoginView.vue'),
      meta: {
        title: 'Login'
      },
    },
    {
      path: '/volunteer/:id',
      name: 'Volunteer',
      component: () => import('../views/VolunteerView.vue'),
      props: true,
      meta: {
        title: 'Volunteer'
      },
    },
    {
      path: '/volunteer/delete/:id',
      name: 'Delete volunteer',
      component: () => import('../views/VolunteerView.vue'),
      props: true,
      meta: {
        title: 'Deleting volunteer'
      },
    },
    {
      path: '/search/:keyword',
      name: 'Search results',
      component: () => import('../views/SearchView.vue'),
      props: true,
      meta: {
        title: 'Search results'
      },
    },
    {
      path: '/become/volunteer',
      name: 'Become volunteer',
      component: () => import('../views/BecomeVolunteerView.vue'),
      meta: {
        title: 'Become volunteer'
      },
    },
    {
      path: '/myevents',
      name: 'My events',
      component: () => import('../views/MyEventsView.vue'),
      meta: {
        title: 'Events'
      },
    },
    {
      path: '/event',
      name: 'Event',
      component: () => import('../views/EventView.vue'),
      meta: {
        title: 'Events'
      },
    },
    {
      path: '/event/delete/:id',
      name: 'Delete event',
      component: () => import('../views/EventView.vue'),
      meta: {
        title: 'Deleting event'
      },
    },
    {
      path: '/event/new',
      name: 'New event',
      component: () => import('../views/NewEventView.vue'),
      meta: {
        title: 'New event'
      },
    },
    {
      path: '/event/detail/:id',
      name: 'Event detail',
      component: () => import('../views/EventDetailView.vue'),
      props: true,
      meta: {
        title: 'Event detail'
      },
    },
    {
      path: '/event/edit/:id',
      name: 'Edit event',
      component: () => import('../views/EditEventView.vue'),
      props: true,
      meta: {
        title: 'Edit event'
      },
    },
  ]
})

export default router
