<template>
	<q-layout>
		<q-page-container>
			<q-page class="flex flex-center">
				<q-card :style="$q.platform.is.mobile? 'border-radius: 10px; margin-top: 50px' : 'border-radius: 10px; margin-top: 30px'">
					<q-tabs class="q-pt-lg" v-model="tab" dense active-color="primary">
						<q-tab name="info" label="Login to continue"/>
					</q-tabs>
					<q-tab-panels v-model="tab" class="bg-grey-1" animated>
						<q-tab-panel name="info">
							<q-form greedy @submit.prevent="loginFunc">
								<q-card-section>
									<div class="row q-col-gutter-md">
										<div class="col-12 col-md-12 q-pt-md">
											<q-input v-model="login.email" label="Email" outlined dense/>
										</div>
										<div class="col-12 col-md-12 q-pt-md">
											<q-input v-model="login.password" label="Password" type="password" outlined dense/>
										</div>
										<div class="col-12 col-md-12 q-pt-md">
											<q-checkbox v-model="login.isRemembered" label="Remember Me" outlined dense/>
										</div>
									</div>
									<div class="row justify-end">
										<q-btn color="primary" label="Login" type="submit"/>
									</div>
								</q-card-section>
							</q-form>
						</q-tab-panel>
					</q-tab-panels>
				</q-card>
			</q-page>
		</q-page-container>
	</q-layout>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {LoginInterface} from "src/customs/interfaces/login.interface";
import {AxiosResponseInterface} from "src/customs/interfaces/axios-response.interface";
import {Loading, QSpinnerCube} from "quasar";
import {Axios} from "boot/axios";

@Component({})
export default class Index extends Vue {
	tab = 'info'

	login: LoginInterface = {
		email: "mma.rifat66@gmail.com",
		password: "123456",
		isRemembered: true
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
				if (response.status > 199 && response.status < 300) {
					const loginResponse = response.data as AxiosResponseInterface
					await this.$store.dispatch("setToken", loginResponse.accessToken)
					await this.$store.dispatch("setCurrentUser", loginResponse)
					await this.$router.replace({name: 'dashboard'}).catch(e => e)
					this.$q.notify({
						message: `Login Success`,
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
