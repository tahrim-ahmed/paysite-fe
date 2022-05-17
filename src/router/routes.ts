import {RouteConfig} from 'vue-router';

const routes: RouteConfig[] = [
	{
		path: '',
		name: 'login',
		component: () => import('pages/auth/Login.vue')
	},
	{
		path: '/',
		component: () => import('layouts/MainLayout.vue'),
		children: [
			{
				path: 'dashboard',
				name: 'dashboard',
				component: () => import('pages/dashboard/Dashboard.vue'),
			},
			{
				path: 'clients',
				name: 'clients',
				component: () => import('pages/clients/Clients.vue')
			},
			{
				path: 'products',
				name: 'products',
				component: () => import('pages/products/Products.vue')
			},
			{
				path: 'report',
				name: 'report',
				component: () => import('pages/invoice/Report.vue')
			},
			{
				path: 'users',
				name: 'users',
				component: () => import('pages/users/Users.vue')
			},
			{
				path: 'settings/groups',
				name: 'groups',
				component: () => import('pages/settings/groups/Groups.vue')
			},
			{
				path: 'settings/profile',
				name: 'profile',
				component: () => import('pages/settings/profile/Profile.vue')
			},
			{
				path: 'settings/permission',
				name: 'permission',
				component: () => import('pages/settings/permission/Permission.vue')
			}
		]
	},

	// Always leave this as last one,
	// but you can also remove it
	{
		path: '*',
		component: () => import('pages/Error404.vue')
	}
];

export default routes;
