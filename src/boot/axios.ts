import axios, {AxiosInstance} from 'axios';
import {boot} from 'quasar/wrappers';
import {ResponseStatusEnum} from "src/customs/enum/response-status.enum";
import {Notify} from "quasar";
import {AxiosResponseInterface} from "src/customs/interfaces/axios-response.interface";

declare module 'vue/types/vue' {
	interface Vue {
		$axios: AxiosInstance;
	}
}
const Axios = axios.create({
	baseURL: 'http://localhost:7575/api/v1',
	headers: {
		'key' : 'AIzaSyBaIfequKgNU79QbEmM8iJ45zxP0SrEReo'
	}
})

export default boot(({Vue, store, router}) => {
	if(store.state.token) {
		Axios.defaults.headers.common['Authorization'] = "Bearer " + store.state.token
	}

	Axios.interceptors.response.use((response) => {
		return new Promise(async resolve => {

			if (response.data.status === ResponseStatusEnum.SESSION_EXPIRED) {
				await store.dispatch("logout")
				await router.replace({name: 'login'}).catch((e: any) => e)

				Notify.create({
					message: response.data.message,
					caption: 'Session Expired!!',
					type: 'warning',
					timeout: 4000
				})
			}

			if (response.data.status === ResponseStatusEnum.ERROR) {
				Notify.create({
					message: 'Operation Failed!',
					caption: response.data.message,
					type: 'negative',
					timeout: 4000
				})
			}

			resolve(response)
		})
	}, error => {
		// general error if server is not running
		if (error.message === 'Network Error') {
			Notify.create({
				message: "Network Error",
				caption: "Connection with server error",
				type: 'negative',
				timeout: 4000
			})
		}

		return error;
	})
	Vue.prototype.$axios = Axios
});
export {Axios}

