import {store} from 'quasar/wrappers';
import Vuex from 'vuex';
import {TokenInterface} from "src/customs/interfaces/token.interface";
import {
	clearStorage,
	destroyCurrentUser,
	destroyToken,
	getCurrentUser,
	getToken,
	setCurrentUser,
	setPermission,
	setToken
} from "src/customs/utils/token.util";
import {SessionStorage} from "quasar";
import {Axios} from "boot/axios";

// import example from './module-example';
// import { ExampleStateInterface } from './module-example/state';

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export interface StateInterface {
	// Define your own store structure, using submodules if needed
	// example: ExampleStateInterface;
	// Declared as unknown to avoid linting issue. Best to strongly type as per the line above.
	token: string;
	currentUser: any;
}

export default store(async function ({Vue}) {
	Vue.use(Vuex);

	return new Vuex.Store<StateInterface>({
		state: {
			token: SessionStorage.getItem('pstwbst'),
			currentUser: SessionStorage.getItem('currentUser'),
		},
		mutations: {
			setToken(state, token: string) {
				state.token = token;
				SessionStorage.set('pstwbst', token);
				Axios.defaults.headers.common['Authorization'] = "Bearer " + token
			},

			setCurrentUser(state, user: any) {
				state.currentUser = user;
				SessionStorage.set('currentUser', user);
			},

			/********* destroy and logout **********/
			async logout(state) {
				state.token = '';
				state.currentUser = {};
				SessionStorage.remove('pstwbst');
				SessionStorage.remove('currentUser');
			}
		},
		actions: {
			async setToken(state, token: string) {
				await setToken(token);
				state.commit("setToken", token);
			},

			async setCurrentUser(state, user: any) {
				await setCurrentUser(user);
				state.commit("setCurrentUser", user)
			},

			/********* destroy and logout **********/
			async logout(state) {
				await state.commit("logout");
			}
		},
		getters: {
			token: (state) => state.token,
			currentUser: (state) => state.currentUser,
		}
	});
});
