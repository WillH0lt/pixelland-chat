import { createMemoryHistory, createRouter } from 'vue-router'

export const routes = [
  {
    path: '/',
    name: 'home',
    children: [
      {
        name: 'createChannel',
        path: '/createChannel',
        component: () => import('./components/CreateOrEditChannelView.vue'),
      },
      {
        name: 'editChannel',
        path: '/editChannel/:channelId',
        component: () => import('./components/CreateOrEditChannelView.vue'),
      },
      {
        name: 'createCategory',
        path: '/createCategory',
        component: () => import('./components/CreateOrEditCategoryView.vue'),
      },
      {
        name: 'editCategory',
        path: '/editCategory/:channelId',
        component: () => import('./components/CreateOrEditCategoryView.vue'),
      },
      {
        name: 'createInstance',
        path: '/createInstance',
        component: () => import('./components/CreateOrEditInstanceView.vue'),
      },
      {
        name: 'editInstance',
        path: '/editInstance',
        component: () => import('./components/CreateOrEditInstanceView.vue'),
      },
      {
        name: 'invite',
        path: '/invite',
        component: () => import('./components/InviteView.vue'),
        children: [
          {
            name: 'createInvite',
            path: '/create',
            component: () => import('./components/CreateInvitesView.vue'),
          },
        ],
      },
      {
        name: 'viewInvite',
        path: '/viewInvite/:code',
        component: () => import('./components/ViewInviteView.vue'),
      },
      {
        name: 'channel',
        path: '/channel/:channelId',
        component: () => import('./components/ChannelView.vue'),
      },
      {
        name: 'likes',
        path: '/instances/:instanceId/likes/',
        component: () => import('./components/LikeView.vue'),
      },
      {
        name: 'groups',
        path: '/groups',
        component: () => import('./components/GroupsView.vue'),
      },
    ],
  },
]

const history = createMemoryHistory()
export const router = createRouter({ history, routes })
