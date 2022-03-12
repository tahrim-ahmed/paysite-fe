<template>
	<q-layout>
		<q-page-container>
			<q-page class="row justify-center">
				<div class="col-12 q-px-md q-pt-md">
					<q-table :columns="columns" :data="rows" :loading="isLoading" :pagination.sync="pagination"
					         :style="'max-height: 88.5vh'" binary-state-sort card-class="full-width bg-card-theme"
					         row-key="id" wrap-cells>
						<template v-slot:no-data="{ icon, message, filter }">
							<div class="text-overline full-width row justify-center q-py-xl">
								<q-icon :name="filter ? 'filter_b_and_w' : icon" class="col-1" color="warning" size="2em"/>
								<span>No data to show!</span>
							</div>
						</template>

						<template v-slot:top>
							<div class="q-table__control q-py-xs">
								<q-btn color="primary" icon="add" label="User" size="sm" @click="addDialog = true"/>
							</div>
							<q-space/>
							<q-input v-model="filter" autogrow color="black" debounce="1000" dense label="Search">
								<template v-slot:append>
									<q-icon name="search"/>
								</template>
							</q-input>
						</template>

						<template v-slot:header-cell="props">
							<q-th :props="props" class="bg-grey-3">
								{{ props.col.label }}
							</q-th>
						</template>

						<template v-slot:body="props">
							<q-tr :props="props">

								<q-td class="q-px-sm cursor-pointer">
									{{ props.row.firstName+' '+props.row.lastName }}
								</q-td>

								<q-td class="q-px-sm cursor-pointer">
									{{ props.row.email }}
								</q-td>

								<q-td class="q-px-sm cursor-pointer">
									{{ props.row.phone }}
								</q-td>

								<q-td class="q-px-sm text-center">
									<q-icon class="cursor-pointer" color="dark" name="view_module" size="sm">
										<q-menu anchor="bottom left" fit self="top left" transition-hide="rotate" transition-show="rotate">
											<q-list style="min-width: 100px">
												<q-item clickable dense v-close-popup @click="openUpdateDialog(props.row)">
													<q-item-section side>
														<q-icon color="positive" name="edit" style="font-size: 15px"/>
													</q-item-section>
													<q-item-section>
														<q-item-label style="font-size: 15px">Edit</q-item-label>
													</q-item-section>
												</q-item>
												<q-separator/>
												<q-item clickable dense>
													<q-item-section side>
														<q-icon color="negative" name="delete_forever" style="font-size: 15px"/>
													</q-item-section>
													<q-item-section>
														<div>Delete</div>
														<q-popup-proxy :breakpoint="700">
															<q-banner dense>
																<template v-slot:avatar>
																	<q-icon color="negative" name="delete_forever"/>
																</template>
																Would you really like to delete user
																<span class="text-bold text-negative">
																{{props.row.firstName+' '+props.row.lastName}}
																</span> for forever?
																<template v-slot:action>
																	<q-btn color="negative" glossy @click=""> Yes</q-btn>
																	<q-btn v-close-popup color="secondary" glossy> No</q-btn>
																</template>
															</q-banner>
														</q-popup-proxy>
													</q-item-section>
												</q-item>
											</q-list>
										</q-menu>
									</q-icon>
								</q-td>
							</q-tr>
						</template>
					</q-table>

					<!--	Add User  -->
					<q-dialog v-model="addDialog" persistent>
						<q-card>
							<q-bar class="bg-primary text-white">
								<q-space />
								<q-btn dense flat icon="close" @click="closeAddDialog">
									<q-tooltip>Close</q-tooltip>
								</q-btn>
							</q-bar>
							<q-tabs class="q-pt-none" v-model="tab" dense active-color="primary">
								<q-tab name="info" label="Add New User"/>
							</q-tabs>
							<q-tab-panels v-model="tab" class="bg-grey-1" animated>
								<q-tab-panel name="info">
									<q-form greedy @submit.prevent="saveUser">
										<q-card-section>
											<div class="row q-col-gutter-md">
												<div class="col-12 col-md-6 q-pt-md">
													<q-input v-model="user.firstName" label="First Name" outlined dense/>
												</div>
												<div class="col-12 col-md-6 q-pt-md">
													<q-input v-model="user.lastName" label="Last Name" outlined dense/>
												</div>
												<div class="col-12 col-md-12 q-pt-md">
													<q-input v-model="user.phone" label="Email" outlined dense/>
												</div>
												<div class="col-12 col-md-12 q-pt-md">
													<q-input v-model="user.email" label="Email" outlined dense/>
												</div>
												<div class="col-12 col-md-12 q-pt-md">
													<q-input v-model="user.password" label="Password" type="password" outlined dense/>
												</div>
												<div class="col-12 col-md-12 q-pt-md">
													<q-select v-model="user.role" options="" emit-value fill-input
													          hide-selected input-debounce="1000" label="Select Group" map-options option-label="name"
													          option-value="_id" outlined dense clearable
													          stack-label use-input @filter="">
														<template v-slot:no-option>
															<q-item>
																<q-item-section class="text-grey">
																	No results
																</q-item-section>
															</q-item>
														</template>
														<template v-slot:option="scope">
															<q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
																<q-item-section>
																	<q-item-label>
																		{{ scope.opt.name }}
																	</q-item-label>
																</q-item-section>
															</q-item>
														</template>
													</q-select>
												</div>
											</div>
											<div class="row justify-end q-pt-md">
												<q-btn color="primary" label="Save" type="submit"/>
											</div>
										</q-card-section>
									</q-form>
								</q-tab-panel>
							</q-tab-panels>
						</q-card>
					</q-dialog>

					<!--	Edit Group  -->
					<q-dialog v-model="updateDialog" persistent>
						<q-card>
							<q-bar class="bg-primary text-white">
								<q-space />
								<q-btn dense flat icon="close" @click="closeUpdateDialog">
									<q-tooltip>Close</q-tooltip>
								</q-btn>
							</q-bar>
							<q-tabs class="q-pt-none" v-model="tab" dense active-color="primary">
								<q-tab name="info" label="Update User"/>
							</q-tabs>
							<q-tab-panels v-model="tab" class="bg-grey-1" animated>
								<q-tab-panel name="info">
									<q-form greedy @submit.prevent="saveUpdate">
										<q-card-section>
											<div class="row q-col-gutter-md">
												<div class="col-12 col-md-6 q-pt-md">
													<q-input v-model="updateUser.firstName" label="First Name" outlined dense/>
												</div>
												<div class="col-12 col-md-6 q-pt-md">
													<q-input v-model="updateUser.lastName" label="Last Name" outlined dense/>
												</div>
												<div class="col-12 col-md-12 q-pt-md">
													<q-input v-model="updateUser.phone" label="Password" outlined dense/>
												</div>
												<div class="col-12 col-md-12 q-pt-md">
													<q-input v-model="updateUser.email" label="Email" outlined dense/>
												</div>
												<div class="col-12 col-md-12 q-pt-md">
													<q-input v-model="updateUser.password" label="Password" type="password" outlined dense/>
												</div>
												<div class="col-12 col-md-12 q-pt-md">
													<q-select v-model="updateUser.role" options="" emit-value fill-input
													          hide-selected input-debounce="1000" label="Select Group" map-options option-label="name"
													          option-value="_id" outlined dense clearable
													          stack-label use-input @filter="">
														<template v-slot:no-option>
															<q-item>
																<q-item-section class="text-grey">
																	No results
																</q-item-section>
															</q-item>
														</template>
														<template v-slot:option="scope">
															<q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
																<q-item-section>
																	<q-item-label>
																		{{ scope.opt.name }}
																	</q-item-label>
																</q-item-section>
															</q-item>
														</template>
													</q-select>
												</div>
											</div>
											<div class="row justify-end q-pt-md">
												<q-btn color="primary" label="Update" type="submit"/>
											</div>
										</q-card-section>
									</q-form>
								</q-tab-panel>
							</q-tab-panels>
						</q-card>
					</q-dialog>
				</div>
			</q-page>
		</q-page-container>
	</q-layout>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator';
import {Loading, QSpinnerBox, QSpinnerComment} from "quasar";
import {UserInterface} from "src/customs/interfaces/user.interface";

@Component({})
export default class Users extends Vue {
	tab = 'info'

	/***************** table ****************/
	rows: any = [];
	pagination: any = {
		sortBy: 'code',
		descending: false,
		page: 1,
		rowsPerPage: 15,
		rowsNumber: 0
	}
	isLoading: boolean = false;
	filter: string = ''
	columns: any = [
		{
			label: 'User Name',
			name: 'name',
			field: 'name',
			align: 'left',
			sortable: true
		},{
			label: 'Email',
			name: 'email',
			field: 'email',
			align: 'left',
			sortable: true
		},{
			label: 'Phone',
			name: 'phone',
			field: 'phone',
			align: 'left',
			sortable: true
		},{
			label: 'Action',
			name: 'action',
			field: 'action',
			align: 'center',
			style: {width: '30px'}
		}
	]

	/*************** add ***************/
	addDialog: boolean = false;
	user: UserInterface = {
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		phone: '',
		role: ''
	}
	/************* update ***************/
	updateDialog: boolean = false;
	updateUser: any = {
		_id: '',
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		phone: '',
		role: ''
	}

	created() {
		this.onRequest({
			pagination: this.pagination
		})
	}

	@Watch('filter', {immediate: true})
	onFilter() {
		this.onRequest({
			pagination: this.pagination
		})
	}

	onRequest({pagination}: any = {}) {
		if (pagination) {
			this.pagination = pagination
		}

		let url = 'user/pagination?page=' + this.pagination.page +
				'&limit=' + this.pagination.rowsPerPage

		this.$axios.get(url).then(value => {
			this.rows = value.data
		}).finally(() => {
			this.isLoading = false
		})
	}

	saveUser() {
		//@ts-ignore
		Loading.show({spinner: QSpinnerBox, spinnerSize: '5rem', backgroundColor: 'grey'})
		this.$axios.post('user/register', {...this.user}).then(response => {
			if (!(response instanceof Error)) {
				this.$q.notify({
					message: 'User added success!',
					type: 'positive'
				})
			}
		}).then(()=> {
			this.onRequest({
				pagination: this.pagination
			})
		}).finally(() => {
			this.closeAddDialog();
			Loading.hide()
		})
	}

	closeAddDialog() {
		this.addDialog = false;
		this.user.firstName = ''
		this.user.lastName = ''
		this.user.email = ''
		this.user.password = ''
		this.user.phone = ''
		this.user.role = ''

	}

	openUpdateDialog(user: any) {
		Object.keys(this.updateUser).forEach((key: any) => {
			this.updateUser[key] = user[key] || '';
		})
		this.updateUser.group = user?.group?._id
		this.updateUser.permission = user?.permission?._id
		this.updateDialog = true;
	}

	closeUpdateDialog() {
		this.updateDialog = false;
		this.updateUser._id = ''
		this.updateUser.firstName = ''
		this.updateUser.lastName = ''
		this.updateUser.email = ''
		this.updateUser.password = ''
		this.updateUser.phone = ''
		this.updateUser.role = ''

	}

	saveUpdate() {
		//@ts-ignore
		Loading.show({spinner: QSpinnerComment, spinnerSize: '5rem', backgroundColor: 'grey'})
		const url = `/user/update/${this.updateUser._id}`
		delete this.updateUser._id;
		this.$axios.put(url, {...this.updateUser}).then(response => {
			if (!(response instanceof Error)) {
				this.$q.notify({
					message: 'Updated Successfully!',
					type: 'positive'
				})
				this.onFilter()
			}
		}).finally(() => {
			this.closeUpdateDialog();
			Loading.hide()
		})
	}
}
</script>


<style scoped>

</style>
