<template>
	<q-layout>
		<q-header elevated>
			<q-toolbar>
				<q-toolbar-title>
					Pay Site
				</q-toolbar-title>

				<div>
					<q-btn class="q-mr-md" dense flat no-caps stretch label="Register" @click="addDialog = true"/>
					<q-btn dense flat no-caps stretch label="Tips" @click="tipsDialog = true"/>
				</div>

			</q-toolbar>
		</q-header>
		<q-page-container>
			<q-page class="flex flex-center">
				<q-card :style="$q.platform.is.mobile? 'border-radius: 10px; margin-top: 50px' : 'border-radius: 10px; margin-top: 20px'">
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

				<!--	Registration  -->
				<q-dialog v-model="addDialog" persistent>
					<q-card>
						<q-bar class="bg-primary text-white">
							<q-space />
							<q-btn dense flat icon="close" @click="closeAddDialog">
								<q-tooltip>Close</q-tooltip>
							</q-btn>
						</q-bar>
						<q-tabs class="q-pt-none" v-model="tab" dense active-color="primary">
							<q-tab name="info" label="Register"/>
						</q-tabs>
						<q-tab-panels v-model="tab" class="bg-grey-1" animated>
							<q-tab-panel name="info">
								<q-form greedy @submit.prevent="register">
									<q-card-section>
										<div class="row q-col-gutter-md">
											<div class="col-12 col-md-6 q-pt-md">
												<q-input v-model="registration.firstName" label="First Name" outlined dense/>
											</div>
											<div class="col-12 col-md-6 q-pt-md">
												<q-input v-model="registration.lastName" label="Last Name" outlined dense/>
											</div>
											<div class="col-12 col-md-12 q-pt-md">
												<q-input v-model="registration.email" label="Email" outlined dense/>
											</div>
											<div class="col-12 col-md-12 q-pt-md">
												<q-input v-model="registration.phone" label="Contact No" outlined dense/>
											</div>
											<div class="col-12 col-md-12 q-pt-md">
												<q-input v-model="registration.password" label="Password" type="password" outlined dense/>
											</div>
										</div>
										<div class="row justify-end q-mt-md">
											<q-btn color="primary" label="Register" type="submit"/>
										</div>
									</q-card-section>
								</q-form>
							</q-tab-panel>
						</q-tab-panels>
					</q-card>
				</q-dialog>

				<q-dialog v-model="tipsDialog">
					<q-img src="images/steps.png"/>
				</q-dialog>
			</q-page>
		</q-page-container>
	</q-layout>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {LoginInterface} from "src/customs/interfaces/login.interface";
import {AxiosResponseInterface} from "src/customs/interfaces/axios-response.interface";
import {Loading, QSpinnerClock, QSpinnerCube} from "quasar";
import {RegistrationInterface} from "src/customs/interfaces/registration.interface";
import {ResponseStatusEnum} from "src/customs/enum/response-status.enum";
import jwt_decode from "jwt-decode";

@Component({})
export default class Index extends Vue {
	tab = 'info'

	addDialog: boolean = false
	tipsDialog: boolean = false

	login: LoginInterface = {
		email: 'm@gmail.com',
		password: '123456',
		isRemembered: true
	}

	registration: RegistrationInterface = {
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		password: '',
		payment: 0,
	}

	closeAddDialog() {
		this.addDialog = false;
		this.registration.firstName = ''
		this.registration.lastName = ''
		this.registration.email = ''
		this.registration.password = ''
		this.registration.phone = ''
	}

	loginFunc() {
		this.login = {
			...this.login,
			isRemembered: this.login.isRemembered ? 1 : 0
		}
		//@ts-ignore
		Loading.show({spinner: QSpinnerCube})
		this.$axios.post('auth/login', this.login).then(async (response) => {
			if (!(response instanceof Error)) {
				const loginResponse = response.data as AxiosResponseInterface
				if (loginResponse.status === ResponseStatusEnum.SUCCESS) {
					await this.$store.dispatch("setToken", loginResponse.payload.data)
					const userData: any = {} = jwt_decode(this.$store.getters.token)
					await this.$store.dispatch("setCurrentUser", userData.response)
					console.log(this.$store.getters.currentUser)
					const userPayment = userData.response.paymentStatus === 1
					await this.$store.dispatch("setPayment", userPayment)
					if(this.$store.getters.payment === true) {
						await this.$router.replace({name: 'dashboard'}).catch(e => e)
					}
					else {
						await this.$router.replace({name: 'payment'}).catch(e => e)
					}
					this.$q.notify({
						message: `${loginResponse.message}`,
						type: 'positive',
						timeout: 4000,
					})
				}
			} else {
				const fail = JSON.parse(response.request.response);
				this.$q.notify({
					message: fail?.message || 'Login failed!!',
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

	register() {
		//@ts-ignore
		Loading.show({spinner: QSpinnerClock, spinnerSize: '5rem', backgroundColor: 'grey'})
		this.$axios.post('users/registration', this.registration).then(response => {
			if (!(response instanceof Error)) {
				const res = response.data as AxiosResponseInterface
				this.$q.notify({
					message: res.message,
					caption: 'Please Login!!',
					type: res.status === ResponseStatusEnum.CREATED ? 'positive' : 'negative'
				})
			} else {
				this.$q.notify({
					message: 'Already registered!!',
					caption: 'Please Login!!',
					type: 'negative'
				})
			}
		}).finally(() => {
			this.closeAddDialog();
			Loading.hide()
		})
	}
};
</script>
