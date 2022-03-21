<template>
	<q-layout>
		<q-page-container>
			<q-page class="flex flex-center">
				Please Pay
			</q-page>
		</q-page-container>
	</q-layout>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {LoginInterface} from "src/customs/interfaces/login.interface";
import {AxiosResponseInterface} from "src/customs/interfaces/axios-response.interface";
import {ResponseStatusEnum} from "src/customs/enum/response-status.enum";
import {Loading, QSpinnerCube} from "quasar";

@Component({})
export default class Payment extends Vue {
	tab = 'info'

	login: LoginInterface = {
		email: "",
		password: "",
		isRemembered: false
	}

	loginFunc() {
		this.login = {
			...this.login,
			isRemembered: this.login.isRemembered ? 1 : 0
		}
		//@ts-ignore
		Loading.show({spinner: QSpinnerCube})
		this.$axios.post('user/login', this.login).then(async (response) => {
			if (!(response instanceof Error)) {
				const loginResponse = response.data as AxiosResponseInterface
				if (loginResponse.status === ResponseStatusEnum.SUCCESS) {
					await this.$store.dispatch("setToken", loginResponse.payload.data.token)
					await this.$store.dispatch("setCurrentUser", loginResponse.payload.data.user)
					await this.$router.replace({name: 'dashboard'}).catch(e => e)
					this.$q.notify({
						message: `${loginResponse.message}`,
						type: 'positive',
						timeout: 4000,
					})
				}
			} else {
				this.$q.notify({
					message: 'Login failed!!',
					type: 'negative'
				})
			}
		}).catch(() => {
			this.$q.notify({
				message: 'Something error',
				type: 'negative'
			})
		}).finally(() => {
			Loading.hide()
		})
	}
};
</script>
