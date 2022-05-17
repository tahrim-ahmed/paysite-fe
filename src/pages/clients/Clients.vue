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
								<q-btn color="primary" icon="add" label="Client" size="sm" @click="addDialog = true"/>
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
					</q-table>

					<!--	Add Client  -->
					<q-dialog v-model="addDialog" persistent>
						<q-card>
							<q-bar class="bg-primary text-white">
								<q-space />
								<q-btn dense flat icon="close" @click="closeAddDialog">
									<q-tooltip>Close</q-tooltip>
								</q-btn>
							</q-bar>
							<q-tabs class="q-pt-none" v-model="tab" dense active-color="primary">
								<q-tab name="info" label="Add Client Info"/>
							</q-tabs>
							<q-tab-panels v-model="tab" class="bg-grey-1" animated>
								<q-tab-panel name="info">
									<div v-if="imageSource !== ''" class="row justify-center">
										<div class="col-12 col-md-4 text-center q-pt-md">
											<q-avatar size="150px" square>
												<q-img :ratio="1" :src="imageSource" width="300px" contain/>
											</q-avatar>
										</div>
									</div>
									<q-form greedy @submit.prevent="saveClient">
										<q-card-section>
											<div class="row q-col-gutter-md">
												<div class="col-12 col-md-6 q-pt-md">
													<q-input v-model="client.code" label="Client Code" outlined dense/>
												</div>
												<div class="col-12 col-md-6 q-pt-md">
													<q-input v-model="client.name" label="Client Name" outlined dense/>
												</div>
												<div class="col-12 col-md-6 q-pt-md">
													<q-input v-model="client.contact" label="Client Contact" outlined dense/>
												</div>
												<div class="col-12 col-md-6 q-pt-md">
													<q-input v-model="client.email" label="Email" outlined dense/>
												</div>
												<div class="col-12 col-md-6 q-pt-md">
													<q-input v-model="client.billing" label="Billing Address" outlined dense/>
												</div>
												<div class="col-12 col-md-6 q-pt-md">
													<q-input v-model="client.shipping" label="Shipping Address" outlined dense/>
												</div>
<!--												<div class="col-12 col-md-grow q-pt-md">
													<q-file v-model="image" accept=".jpg, image/*" clearable counter
													        label="Client Image"
													        @clear="setImage" @input="setImage" dense outlined>
														<template v-slot:prepend>
															<q-icon name="attach_file"/>
														</template>
													</q-file>
												</div>-->
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

					<!--	Edit Client  -->
					<q-dialog v-model="updateDialog" persistent>
						<q-card>
							<q-bar class="bg-primary text-white">
								<q-space />
								<q-btn dense flat icon="close" @click="closeAddDialog">
									<q-tooltip>Close</q-tooltip>
								</q-btn>
							</q-bar>
							<q-tabs class="q-pt-none" v-model="tab" dense active-color="primary">
								<q-tab name="info" label="Update Client Info"/>
							</q-tabs>
							<q-tab-panels v-model="tab" class="bg-grey-1" animated>
								<q-tab-panel name="info">
									<div v-if="imageSource !== ''" class="row justify-center">
										<div class="col-12 col-md-4 text-center q-pt-md">
											<q-avatar size="150px" square>
												<q-img :ratio="1" :src="imageSource" width="300px" contain/>
											</q-avatar>
										</div>
									</div>
									<q-form greedy @submit.prevent="saveUpdate">
										<q-card-section>
											<div class="row q-col-gutter-md">
												<div class="col-12 col-md-6 q-pt-md">
													<q-input v-model="updateClient.code" label="Client Code" outlined dense/>
												</div>
												<div class="col-12 col-md-6 q-pt-md">
													<q-input v-model="updateClient.name" label="Client Name" outlined dense/>
												</div>
												<div class="col-12 col-md-6 q-pt-md">
													<q-input v-model="updateClient.contact" label="Client Contact" outlined dense/>
												</div>
												<div class="col-12 col-md-6 q-pt-md">
													<q-input v-model="updateClient.email" label="Email" outlined dense/>
												</div>
												<div class="col-12 col-md-6 q-pt-md">
													<q-input v-model="updateClient.billing" label="Billing Address" outlined dense/>
												</div>
												<div class="col-12 col-md-6 q-pt-md">
													<q-input v-model="updateClient.shipping" label="Shipping Address" outlined dense/>
												</div>
												<div class="col-12 col-md-grow q-pt-md">
													<q-file v-model="image" accept=".jpg, image/*" clearable counter
													        label="Client Image"
													        @clear="setImage" @input="setImage" dense outlined>
														<template v-slot:prepend>
															<q-icon name="attach_file"/>
														</template>
													</q-file>
												</div>
												<div class="col-md-auto q-pt-md">
													<q-btn class="full-width" label="Save" color="primary" type="submit" no-caps/>
												</div>
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
import {Component, Vue} from 'vue-property-decorator';
import {Loading} from "quasar";
import {ClientInterface} from "src/customs/interfaces/client.interface";

@Component({})
export default class List extends Vue {
	tab = 'info'

	imageSource = ''

	image: File = null

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
			label: 'Code',
			name: 'code',
			field: 'code',
			align: 'left',
			sortable: true
		},{
			label: 'Name',
			name: 'name',
			field: 'name',
			align: 'left',
			sortable: true
		},{
			label: 'Contact No',
			name: 'contact',
			field: 'contact',
			align: 'left',
			sortable: true
		},{
			label: 'Email',
			name: 'email',
			field: 'email',
			align: 'left',
			sortable: true
		},{
			label: 'Billing Address',
			name: 'billing',
			field: 'billing',
			align: 'left',
		},{
			label: 'Shipping Address',
			name: 'shipping',
			field: 'shipping',
			align: 'left',
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
	client: ClientInterface = {
		code: '',
		name: '',
		contact: '',
		billing: '',
		shipping: '',
		email: ''
	}
	/************* update ***************/
	updateDialog: boolean = false;
	updateClient: ClientInterface = {
		_id: '',
		code: '',
		name: '',
		email: '',
		billing: '',
		shipping: '',
		contact: '',
	}

	created() {
		this.onRequest({
			pagination: this.pagination
		})
	}


	onRequest({pagination}: any = {}) {
		if (pagination) {
			this.pagination = pagination
		}

		let url = 'client/pagination?page=' + this.pagination.page +
				'&limit=' + this.pagination.rowsPerPage

		this.$axios.get(url).then(value => {
			this.rows = value.data
		}).finally(() => {
			this.isLoading = false
		})
	}

	setImage() {
		this.imageSource = this.image ? URL.createObjectURL(this.image) : ''
	}

	saveClient() {
		Loading.show()
		this.$axios.post('client/create', {
			...this.client
		}).then(value => {
			this.$q.notify({
				message: 'Clients Added Success!',
				type: 'positive'
			})
		}).then(()=> {
			this.onRequest({
				pagination: this.pagination
			})
		}).finally(() => {
			Loading.hide()
			this.client.code = ''
			this.client.name = ''
			this.client.contact = ''
			this.client.billing = ''
			this.client.shipping = ''
			this.client.email = ''
			this.addDialog = false
		})
	}

	closeAddDialog() {
		this.addDialog = false;
		this.client.code = ''
		this.client.name = ''
		this.client.contact = ''
		this.client.billing = ''
		this.client.shipping = ''
		this.client.email = ''

	}

	saveUpdate() {
		this.$axios.put('clients/save/'+this.updateClient._id, {
			client: this.updateClient
		}).then(value => {
			this.$q.notify({
				message: 'Client Edit Success!',
				type: 'positive'
			})
		}).finally(() => {
			Loading.hide()
			this.updateDialog = false
		})
	}
}
</script>


<style scoped>

</style>
