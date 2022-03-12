import {boot} from "quasar/wrappers";
import {Route} from "vue-router/types/router";
import {Loading, Notify, QSpinnerBars} from "quasar";

export default boot<any>(({Vue, router, store}: any) => {
	router.beforeEach((to: Route, from: Route, next: any) => {
		//@ts-ignore
		Loading.show({spinner: QSpinnerBars, spinnerSize: '75px'});

		if (store.state.token) {
			if (to.name === 'login') {
				router.replace({name: 'dashboard'}).catch((e: any) => e);
			}

		} else {
			if (to.name !== 'login') {
				router.replace({name: 'login'}).catch((e: any) => e);
				Notify.create({
					message: 'Access protected!',
					caption: 'Authorization error!!',
					type: 'negative',
					timeout: 4000
				})
			}
		}
		next()
	});

	router.afterEach(() => {
		window.scrollTo(0, 0)
		Loading.hide();
	})
})
