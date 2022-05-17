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
								<q-btn color="primary" icon="add" label="Product" size="sm" @click="addDialog = true"/>
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

					<!--	Add Product  -->
					<q-dialog v-model="addDialog" persistent>
						<q-card>
							<q-bar class="bg-primary text-white">
								<q-space />
								<q-btn dense flat icon="close" @click="closeAddDialog">
									<q-tooltip>Close</q-tooltip>
								</q-btn>
							</q-bar>
							<q-tabs class="q-pt-none" v-model="tab" dense active-color="primary">
								<q-tab name="info" label="Add Product Info"/>
							</q-tabs>
							<q-tab-panels v-model="tab" class="bg-grey-1" animated>
								<q-tab-panel name="info">
									<q-form greedy @submit.prevent="saveProduct">
										<q-card-section>
											<div class="row q-col-gutter-md">
												<div class="col-12 col-md-12 q-pt-md">
													<q-input v-model="product.name" label="Product Name" outlined dense/>
												</div>
												<div class="col-12 col-md-12 q-pt-md">
													<q-input v-model="product.packSize" label="Pack Size" outlined dense/>
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

					<!--	Edit Product  -->
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
									<q-form greedy @submit.prevent="saveUpdate">
										<q-card-section>
											<div class="row q-col-gutter-md">
												<div class="col-12 col-md-12 q-pt-md">
													<q-input v-model="updateProduct.name" label="Product Name" outlined dense/>
												</div>
												<div class="col-12 col-md-12 q-pt-md">
													<q-input v-model="updateProduct.packSize" label="Pack Size" outlined dense/>
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
import {Component, Vue} from 'vue-property-decorator';
import {Loading} from "quasar";
import {ProductInterface} from "src/customs/interfaces/product.interface";

@Component({})
export default class Products extends Vue {
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
			label: 'Product Name',
			name: 'productName',
			field: 'productName',
			align: 'left',
			sortable: true
		},{
			label: 'Pack Size',
			name: 'packSize',
			field: 'packSize',
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
	product: ProductInterface = {
		name: '',
		packSize: ''
	}
	/************* update ***************/
	updateDialog: boolean = false;
	updateProduct: ProductInterface = {
		_id: '',
		name: '',
		packSize: ''
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

		let url = 'product/pagination?page=' + this.pagination.page +
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

	saveProduct() {
		Loading.show()
		this.$axios.post('products/save', {
			product: this.product,
		}).then(value => {
			this.$q.notify({
				message: 'Product Added Success!',
				type: 'positive'
			})
		}).finally(() => {
			Loading.hide()
			this.product.name = ''
			this.product.packSize = ''
			this.addDialog = false
		})
	}

	closeAddDialog() {
		this.addDialog = false;
		this.product.name = ''
		this.product.packSize = ''

	}

	saveUpdate() {
		this.$axios.put('products/save/'+this.updateProduct._id, {
			product: this.updateProduct
		}).then(value => {
			this.$q.notify({
				message: 'Product Edit Success!',
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
