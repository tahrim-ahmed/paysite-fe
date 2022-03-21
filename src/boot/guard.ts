import {boot} from "quasar/wrappers";
import {Route} from "vue-router/types/router";
import {Loading, Notify, QSpinnerBars} from "quasar";

export default boot<any>(({Vue, router, store}: any) => {
	router.beforeEach((to: Route, from: Route, next: any) => {
		//@ts-ignore
		Loading.show({spinner: QSpinnerBars, spinnerSize: '75px'});

		if (store.state.token) {
			if (to.name === 'login') {
				if((store.state.currentUser?.paymentStatus === 1)) {
					router.replace({path: 'dashboard'}).catch((e: any) => e);
				}
				else {
					router.replace({path: 'payment'}).catch((e: any) => e);
				}
			}
			if (to.meta?.onlyAdmin) {
				if ((store.state.currentUser?.isAdmin)) next()
				else {
					store.dispatch("logout")
					Notify.create({
						message: 'Access protected!!',
						caption: 'Only Admin can access!!',
						type: 'warning',
						timeout: 4000
					})
					router.replace({name: 'login'}).catch((e: any) => e);
				}
			}

			if (to.meta?.notPaid) {
				if ((store.state.currentUser?.paymentStatus === 0)) next()
				else {
					Notify.create({
						message: 'Already paid!!',
						caption: 'You have already paid!!',
						type: 'warning',
						timeout: 4000
					})
					router.replace({name: 'dashboard'}).catch((e: any) => e);
				}
			}

			if (to.meta?.onlyPaid) {
				if ((store.state.currentUser?.paymentStatus === 1)) next()
				else {
					Notify.create({
						message: 'Not paid!!',
						caption: 'You have not paid!!',
						type: 'warning',
						timeout: 4000
					})
					router.replace({name: 'payment'}).catch((e: any) => e);
				}
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
