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
								<q-btn color="primary" icon="add" label="Permission" size="sm" @click="addDialog = true"/>
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

					<!--	Add Permission  -->
					<q-dialog v-model="addDialog" persistent>
						<q-card>
							<q-bar class="bg-primary text-white">
								<q-space />
								<q-btn dense flat icon="close" @click="closeAddDialog">
									<q-tooltip>Close</q-tooltip>
								</q-btn>
							</q-bar>
							<q-tabs class="q-pt-none" v-model="tab" dense active-color="primary">
								<q-tab name="permission" label="Add New Permission"/>
							</q-tabs>
							<q-tab-panels v-model="tab" class="bg-grey-1" animated>
								<q-tab-panel name="permission">
									<q-form greedy @submit.prevent="savePermission">
										<q-card-section>
											<div class="row q-col-gutter-md q-pr-md">
												<div class="col-12 col-md-12 q-pt-md">
													<q-input v-model="permission.name" label="Permission Name" outlined dense/>
												</div>
												<div class="col-12 col-md-12 q-pt-md">
													<q-markup-table flat class="bg-grey-1" wrap-cells dense>
														<q-tr class="bg-grey-5 text-bold">
															<q-td colspan="6">
																<q-checkbox v-model="checkAll" label="All Permissions" @input="checkAllPermission"/>
															</q-td>
														</q-tr>
														<q-tr class="bg-grey-3">
															<q-td>
																<q-checkbox v-model="productAll" label="Product" @input="checkAllProduct"/>
															</q-td>
															<q-td>
																<q-checkbox v-model="permission.product.add" label="Add"/>
															</q-td>
															<q-td>
																<q-checkbox v-model="permission.product.edit" label="Edit"/>
															</q-td>
															<q-td>
																<q-checkbox v-model="permission.product.delete" label="Delete"/>
															</q-td>
															<q-td>
																<q-checkbox v-model="permission.product.list" label="List"/>
															</q-td>
															<q-td/>
														</q-tr>
														<q-tr class="bg-grey-3">
															<q-td>
																<q-checkbox v-model="clientsAll" label="Clients" @input="checkAllClients"/>
															</q-td>
															<q-td>
																<q-checkbox v-model="permission.clients.add" label="Add"/>
															</q-td>
															<q-td>
																<q-checkbox v-model="permission.clients.edit" label="Edit"/>
															</q-td>
															<q-td>
																<q-checkbox v-model="permission.clients.delete" label="Delete"/>
															</q-td>
															<q-td>
																<q-checkbox v-model="permission.clients.list" label="List"/>
															</q-td>
															<q-td/>
														</q-tr>
														<q-tr class="bg-grey-3">
															<q-td>
																<q-checkbox v-model="stockAll" label="Stock" @input="checkAllStock"/>
															</q-td>
															<q-td>
																<q-checkbox v-model="permission.stock.add" label="Add"/>
															</q-td>
															<q-td>
																<q-checkbox v-model="permission.stock.edit" label="Edit"/>
															</q-td>
															<q-td>
																<q-checkbox v-model="permission.stock.delete" label="Delete"/>
															</q-td>
															<q-td>
																<q-checkbox v-model="permission.stock.list" label="List"/>
															</q-td>
															<q-td/>
														</q-tr>
														<q-tr class="bg-grey-3">
															<q-td>
																<q-checkbox v-model="invoiceAll" label="Invoice" @input="checkAllInvoice"/>
															</q-td>
															<q-td>
																<q-checkbox v-model="permission.invoice.add" label="Add"/>
															</q-td>
															<q-td>
																<q-checkbox v-model="permission.invoice.edit" label="Edit"/>
															</q-td>
															<q-td>
																<q-checkbox v-model="permission.invoice.delete" label="Delete"/>
															</q-td>
															<q-td>
																<q-checkbox v-model="permission.invoice.list" label="List"/>
															</q-td>
															<q-td/>
														</q-tr>
														<q-tr class="bg-grey-3">
															<q-td>
																<q-checkbox v-model="usersAll" label="Users" @input="checkAllUsers"/>
															</q-td>
															<q-td>
																<q-checkbox v-model="permission.users.add" label="Add"/>
															</q-td>
															<q-td>
																<q-checkbox v-model="permission.users.edit" label="Edit"/>
															</q-td>
															<q-td>
																<q-checkbox v-model="permission.users.delete" label="Delete"/>
															</q-td>
															<q-td>
																<q-checkbox v-model="permission.users.list" label="List"/>
															</q-td>
															<q-td/>
														</q-tr>
														<q-tr class="bg-grey-3">
															<q-td>
																<q-checkbox v-model="groupAll" label="Groups" @input="checkAllGroup"/>
															</q-td>
															<q-td>
																<q-checkbox v-model="permission.group.add" label="Add"/>
															</q-td>
															<q-td>
																<q-checkbox v-model="permission.group.edit" label="Edit"/>
															</q-td>
															<q-td>
																<q-checkbox v-model="permission.group.delete" label="Delete"/>
															</q-td>
															<q-td>
																<q-checkbox v-model="permission.group.list" label="List"/>
															</q-td>
															<q-td/>
														</q-tr>
													</q-markup-table>
												</div>
											</div>
										</q-card-section>
										<q-card-actions class="row justify-end">
											<div class="col-12 col-md-auto q-px-lg">
												<q-btn class="full-width" label="Save" color="primary" type="submit" no-caps/>
											</div>
										</q-card-actions>
									</q-form>
								</q-tab-panel>
							</q-tab-panels>
						</q-card>
					</q-dialog>

					<!--	Edit Group  -->
<!--					<q-dialog v-model="updateDialog" persistent>
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
									<q-form greedy @submit.prevent="saveUpdate">
										<q-card-section>
											<div class="row q-col-gutter-md">
												<div class="col-12 col-md-12 q-pt-md">
													<q-input v-model="updateGroup.name" label="Group Name" outlined dense/>
												</div>
												<div class="col-12 col-md-12 q-pt-md">
													<q-input v-model="updateGroup.description" label="Group Description" outlined dense
													         type="textarea"/>
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
					</q-dialog>-->
				</div>
			</q-page>
		</q-page-container>
	</q-layout>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {Loading} from "quasar";
import {PermissionInterface} from "src/customs/interfaces/permission.interface";

@Component({})
export default class Permission extends Vue {

	tab = 'permission'

	productAll: boolean = false
	clientsAll: boolean = false
	stockAll: boolean = false
	invoiceAll: boolean = false
	usersAll: boolean = false
	groupAll: boolean = false

	checkAll: boolean = false

	/***************** table ****************/
	rows: any = [];
	pagination: any = {
		sortBy: 'name',
		descending: false,
		page: 1,
		rowsPerPage: 15,
		rowsNumber: 0
	}
	isLoading: boolean = false;
	filter: string = ''
	columns: any = [
		{
			label: 'Permission Name',
			name: 'name',
			field: 'name',
			align: 'left',
			sortable: true
		},{
			label: 'Permission Description',
			name: 'description',
			field: 'description',
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
	permission: PermissionInterface = {
		name: '',
		clients: {
			add: false,
			list: false,
			edit: false,
			delete: false
		},
		product: {
			add: false,
			list: false,
			edit: false,
			delete: false
		},
		invoice: {
			add: false,
			list: false,
			edit: false,
			delete: false
		},
		stock: {
			add: false,
			list: false,
			edit: false,
			delete: false
		},
		users: {
			add: false,
			list: false,
			edit: false,
			delete: false,
		},
		group: {
			add: false,
			list: false,
			edit: false,
			delete: false,
		}
	}

	checkAllPermission() {
		this.clientsAll = this.checkAll;
		this.checkAllClients();

		this.productAll = this.checkAll;
		this.checkAllProduct();

		this.stockAll = this.checkAll;
		this.checkAllStock();

		this.invoiceAll = this.checkAll;
		this.checkAllInvoice();

		this.usersAll = this.checkAll;
		this.checkAllUsers();

		this.groupAll = this.checkAll;
		this.checkAllGroup();
	}

	checkAllProduct() {
		this.permission.product.add = this.productAll;
		this.permission.product.edit = this.productAll;
		this.permission.product.delete = this.productAll;
		this.permission.product.list = this.productAll;
	}

	checkAllClients() {
		this.permission.clients.add = this.clientsAll;
		this.permission.clients.edit = this.clientsAll;
		this.permission.clients.delete = this.clientsAll;
		this.permission.clients.list = this.clientsAll;
	}

	checkAllStock() {
		this.permission.stock.add = this.stockAll;
		this.permission.stock.edit = this.stockAll;
		this.permission.stock.delete = this.stockAll;
		this.permission.stock.list = this.stockAll;
	}

	checkAllInvoice() {
		this.permission.invoice.add = this.invoiceAll;
		this.permission.invoice.edit = this.invoiceAll;
		this.permission.invoice.delete = this.invoiceAll;
		this.permission.invoice.list = this.invoiceAll;
	}

	checkAllUsers() {
		this.permission.users.add = this.usersAll;
		this.permission.users.edit = this.usersAll;
		this.permission.users.delete = this.usersAll;
		this.permission.users.list = this.usersAll;
	}

	checkAllGroup() {
		this.permission.group.add = this.groupAll;
		this.permission.group.edit = this.groupAll;
		this.permission.group.delete = this.groupAll;
		this.permission.group.list = this.groupAll;
	}

	savePermission() {
		Loading.show()
		this.$axios.post('auth/group', {
			permission: this.permission
		}).then(value => {
			this.$q.notify({
				message: 'Group Permission Added Success!',
				type: 'positive'
			})
		}).finally(() => {
			Loading.hide()

			this.addDialog = false

			this.permission.name = ''

			this.checkAll = false

			this.checkAllPermission()
		})
	}

	closeAddDialog() {
		this.addDialog = false;
		this.permission.name = ''

		this.checkAll = false

		this.checkAllPermission()
	}
}
</script>


<style scoped>

</style>
