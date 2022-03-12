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
								<q-btn color="primary" icon="add" label="File" size="sm" @click="addDialog = true"/>
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

					<!--	Add File  -->
					<q-dialog v-model="addDialog" persistent>
						<q-card class="text-bold" style="width: 80%">
							<q-card-section class="row items-center q-pa-none">
								<q-space />
								<q-btn icon="close" flat round dense @click="closeAddDialog"/>
							</q-card-section>
							<q-linear-progress :value="1"/>
							<q-card-section class="text-center">
								<p>Select file to import</p>
								<q-uploader :factory="uploadFile" class="col-12 q-mt-lg full-width"
								            field-name="file" label="Import File" @uploaded="onUploadFinish"/>
							</q-card-section>
						</q-card>
					</q-dialog>

					<!--	Edit File  -->
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
													<q-input v-model="updateFile.fileName" label="First Name" outlined dense/>
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
import {FileInterface} from "src/customs/interfaces/file.interface";

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
	file: FileInterface = {
		fileName: ''
	}
	/************* update ***************/
	updateDialog: boolean = false;
	updateFile: any = {
		_id: '',
		fileName: ''
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

	uploadFile() {
		return {
			url: process.env.API + 'master-upload',
			headers: [
				{name: 'Authorization', value: "Bearer " + this.$store.getters.token.accessToken},
				{name: 'key', value: process.env.API_KEY},
			],
			method: "POST"
		}
	}

	onUploadFinish(e: any) {
		let res = JSON.parse(e.xhr.response)
		this.$q.notify({
			message: 'File Upload Success',
			type: 'positive'
		})
		this.addDialog = false;
	}

	closeAddDialog() {
		this.addDialog = false;
		this.file.fileName = ''

	}

	openUpdateDialog(user: any) {
		Object.keys(this.updateFile).forEach((key: any) => {
			this.updateFile[key] = user[key] || '';
		})
		this.updateDialog = true;
	}

	closeUpdateDialog() {
		this.updateDialog = false;
		this.updateFile.fileName = ''

	}

	saveUpdate() {
		//@ts-ignore
		Loading.show({spinner: QSpinnerComment, spinnerSize: '5rem', backgroundColor: 'grey'})
		const url = `/user/update/${this.updateFile._id}`
		delete this.updateFile._id;
		this.$axios.put(url, {...this.updateFile}).then(response => {
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
