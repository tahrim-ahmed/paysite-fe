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
				path: 'users',
				name: 'users',
				component: () => import('pages/users/Users.vue')
			},
			{
				path: 'files',
				name: 'files',
				component: () => import('pages/files/Files.vue')
			},
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
