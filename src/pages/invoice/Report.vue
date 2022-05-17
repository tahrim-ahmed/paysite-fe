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
								<q-btn color="primary" icon="add" label="Invoice" size="sm" @click="addDialog = true"/>
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

					<!--	Add Invoice  -->
					<q-dialog class="row" v-model="addDialog" persistent>
						<q-card :class="invoice.client? 'col q-mr-md' : ''">
							<q-bar class="bg-primary text-white">
								<q-space />
								<q-btn dense flat icon="close" @click="closeAddDialog">
									<q-tooltip>Close</q-tooltip>
								</q-btn>
							</q-bar>
							<q-tabs class="q-pt-none" v-model="tab" dense active-color="primary">
								<q-tab name="info" label="New Invoice"/>
							</q-tabs>
							<q-tab-panels v-model="tab" class="bg-grey-1" animated>
								<q-tab-panel name="info">
									<q-form greedy @submit.prevent="saveInvoice">
										<q-card-section>
											<div class="row q-col-gutter-md">
												<div class="col-12 col-md-12 q-pt-md">
													<q-input v-model="invoice.client" label="Select Client" outlined dense/>
												</div>
												<div class="col-12 col-md-12 q-pt-md">
<!--													<q-select v-model="addMore.product" :options="productOptions" class="col col-4"
													          input-debounce="1000" label="Select Product" map-options option-label="name"
													          use-input @filter="filterProductFn" outlined dense>
														<template v-slot:no-option>
															<q-item>
																<q-item-section class="text-grey">
																	No results
																</q-item-section>
															</q-item>
														</template>

													</q-select>-->
													<q-input v-model="addMore.product.name" label="Product" outlined dense/>
												</div>
												<div class="col-12 col-md-6 q-pt-md">
													<q-input v-model="addMore.unitPrice" label="Unit Price" outlined dense/>
												</div>
												<div class="col-12 col-md-6 q-pt-md">
													<q-input v-model="addMore.quantity" label="Quantity" outlined dense/>
												</div>
												<div class="col-12 col-md-grow q-pt-md">
													<q-input v-model="addMore.discount" label="Discount %" outlined dense/>
												</div>
												<div class="col-md-auto q-pt-md">
													<q-btn class="full-width" label="Add Que" color="primary" @click="addToQueue" no-caps/>
												</div>
												<div :class="invoice.paymentType === 'Credit' ? 'col-12 col-md-6 q-pt-md' :
												'col-12 col-md-12 q-pt-md'">
													<q-select v-model="invoice.paymentType" :options="['Credit', 'Cash']" label="Payment Type"
													          outlined dense/>
												</div>
												<div v-if="invoice.paymentType === 'Credit'" class="col-12 col-md-6 q-pt-md">
													<q-input v-model="invoice.creditPeriod" mask="date" :rules="['date']" dense outlined
													         hide-bottom-space clearable>
														<template v-slot:append>
															<q-icon name="event" class="cursor-pointer">
																<q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
																	<q-date v-model="invoice.creditPeriod" minimal>
																		<div class="row items-center justify-end">
																			<q-btn v-close-popup label="Close" color="primary" flat />
																		</div>
																	</q-date>
																</q-popup-proxy>
															</q-icon>
														</template>
													</q-input>
												</div>
											</div>
											<div class="row justify-end q-pt-md">
												<q-btn color="primary" label="Submit" type="submit"/>
											</div>
										</q-card-section>
									</q-form>
								</q-tab-panel>
							</q-tab-panels>
						</q-card>
						<q-card v-if="invoice.client" class="col">
							<div class="row q-ma-md">
								<div class="col-12 col-md-6 text-bold">
									Date: {{invDate}} <br>
									Client: {{invoice.client}}
								</div>
								<div class="col-12 col-md-6 text-bold text-right">
									Payment Type: {{invoice.paymentType ? invoice.paymentType : '-'}} <br>
									<span v-if="invoice.paymentType === 'Credit' && invoice.creditPeriod">
										Credit Period:
										Till - {{invoice.creditPeriod ? $helper.convertDate(invoice.creditPeriod) : '-'}}
									</span>
								</div>
							</div>
							<div class="q-ma-md">
								<q-markup-table v-if="preservedProducts.length" bordered dense flat separator="cell" wrap-cells>
									<thead class="bg-primary text-white text-center">
									<tr>
										<th class="text-center text-uppercase" colspan="8">Product Information</th>
									</tr>
									<tr>
										<th>Product Name</th>
										<th>Pack Size</th>
										<th>Quantity</th>
										<th>Unit Price</th>
										<th>Dis %</th>
										<th>Dis Amount</th>
										<th>Total</th>
										<th>#</th>
									</tr>
									</thead>
									<tbody class="text-center">
									<tr v-for="(product, index) of preservedProducts" :key="product.product._id">
										<td>{{ product.product.name }}</td>
										<td>Pack Size</td>
										<td>
											{{ product.quantity }}
											<q-popup-edit v-model="product.quantity" persistent>
												<template v-slot="scope">
													<q-input v-model.number="scope.value" autofocus dense type="number"
													         @keyup.enter="updateQuantity(index, scope.value)"/>
												</template>
											</q-popup-edit>
										</td>
										<td>
											৳ {{ product.unitPrice }}
											<q-popup-edit v-model="product.unitPrice" persistent>
												<template v-slot="scope">
													<q-input v-model.number="scope.value" autofocus dense type="number"
													         @keyup.enter="updateUnitPrice(index, scope.value)"/>
												</template>
											</q-popup-edit>
										</td>
										<td>
											{{ (product.discount === '0') || (product.discount === 0) ? '-' : product.discount+'%' }}
											<q-popup-edit v-model="product.discount" persistent>
												<template v-slot="scope">
													<q-input v-model.number="scope.value" autofocus dense type="number"
													         @keyup.enter="updateDiscount(index, scope.value)"/>
												</template>
											</q-popup-edit>
										</td>
										<td>৳ {{
												$helper.numberWithCommas((((Number(product.quantity) * Number(product.unitPrice)) * Number(product.discount)) / 100).toFixed(2))
											}}
										</td>
										<td>৳ {{
												$helper.numberWithCommas(((Number(product.quantity) * Number(product.unitPrice)) - (((Number(product.quantity) * Number(product.unitPrice)) * Number(product.discount)) / 100)).toFixed(2))
											}}
										</td>
										<td class="cursor-pointer">
											<q-icon name="delete" @click="removeQueue(index)"/>
										</td>
									</tr>
									<tr>
										<td class="text-right text-bold" colspan="6">Total</td>
										<td class="text-right text-bold">৳ {{
												$helper.numberWithCommas(invoice.totalAmount)
											}}
										</td>
									</tr>
									</tbody>
								</q-markup-table>
							</div>
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
import {InvoiceInterface} from "src/customs/interfaces/invoice.interface";
import {AxiosResponseInterface} from "src/customs/interfaces/axios-response.interface";
import {ResponseStatusEnum} from "src/customs/enum/response-status.enum";
import {ProductInterface} from "src/customs/interfaces/product.interface";

interface AddMoreInterface {
	product: ProductInterface,
	unitPrice: number,
	quantity: number,
	discount: number
}

@Component({})

export default class List extends Vue {
	tab = 'info'

	invDate: any = this.$helper.convertDate(new Date())

	/***************** table ****************/
	rows: any = [];
	pagination: any = {
		sortBy: 'createdAt',
		descending: false,
		page: 1,
		rowsPerPage: 15,
		rowsNumber: 0
	}
	isLoading: boolean = false;
	filter: string = ''
	columns: any = [
		{
			label: 'Invoice Date',
			name: 'createdAt',
			field: 'createdAt',
			align: 'left',
			sortable: true
		},{
			label: 'Invoice No',
			name: 'invoiceNo',
			field: 'invoiceNo',
			align: 'left',
			sortable: true
		},{
			label: 'Client Code',
			name: 'clientName',
			field: 'clientName',
			align: 'left',
			sortable: true
		},{
			label: 'Contact No',
			name: 'contact',
			field: 'contact',
			align: 'left',
			sortable: true
		},{
			label: 'Total Amount',
			name: 'totalAmount',
			field: 'totalAmount',
			align: 'left',
			sortable: true
		},{
			label: 'Payment Type',
			name: 'paymentType',
			field: 'paymentType',
			align: 'left',
		},{
			label: 'Credit Period',
			name: 'creditPeriod',
			field: 'creditPeriod',
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
	invoice: InvoiceInterface = {
		client: '',
		totalAmount: 0,
		paymentType: null,
		creditPeriod: null,
		products: []
	}

	productOptions: any[] = [];

	preservedProducts: Array<AddMoreInterface> = [];

	addMore: AddMoreInterface = {
		product: {
			_id: '', name: '', packSize: ''
		},
		quantity: null,
		unitPrice: null,
		discount: 0
	}

	addToQueue() {
		this.preservedProducts.push(this.addMore)
		this.calculateTotal();
		this.resetAddMore();
	}

	calculateTotal() {
		if (this.addDialog) {
			this.invoice.totalAmount = this.preservedProducts.reduce((acc, cur) => acc + ((cur.quantity * cur.unitPrice) - (((Number(cur.quantity) * Number(cur.unitPrice) *
					cur.discount)) / 100)), 0)
		}
	}

	resetAddMore() {
		this.addMore = {
			product: {
				_id: '', name: '', packSize: ''
			},
			unitPrice: null,
			quantity: null,
			discount: null
		}
	}

	updateQuantity(index: number, qty: number) {
		this.preservedProducts[index].quantity = qty;
		this.calculateTotal();
	}

	updateUnitPrice(index: number, price: number) {
		this.preservedProducts[index].unitPrice = price;
		this.calculateTotal();
	}

	updateDiscount(index: number, discount: number) {
		this.preservedProducts[index].discount = discount;
		this.calculateTotal();
	}

	removeQueue(index: number) {
		this.preservedProducts.splice(index, 1)
		this.calculateTotal();
	}

	created() {
		this.loadTable()
	}


	loadTable() {
		this.$axios.patch('clients/all', {

		}).then(value => {

			this.rows = value.data.data.rows
		}).finally(() => {
			this.isLoading = false
		})
	}

	saveInvoice() {
		Loading.show()
		this.$axios.post('clients/save', {
			invoice: this.invoice,
		}).then(value => {
			this.$q.notify({
				message: 'Invoice Added Success!',
				type: 'positive'
			})
		}).finally(() => {
			Loading.hide()
			this.invoice.client = ''
			this.invoice.totalAmount = 0
			this.invoice.creditPeriod = null
			this.invoice.paymentType = 0
			this.invoice.products = []
			this.addDialog = false
		})
	}

	closeAddDialog() {
		this.addDialog = false;
		this.invoice.client = ''
		this.invoice.totalAmount = 0
		this.invoice.creditPeriod = null
		this.invoice.paymentType = 0
		this.invoice.products = []
		this.resetAddMore()
	}

	/*************** filter ***************/
	filterProductFn(val: string, update: Function) {
		/*let url = 'product/search?page=1&limit=5';
		if (val) url += '&search=' + val
		this.$axios.get(url).then(async (response) => {
			if (!(response instanceof Error)) {
				const res = response.data as AxiosResponseInterface
				if (res.status === ResponseStatusEnum.SUCCESS) {
					update(() => {
						const products = res?.page?.data || [];
						this.productOptions = products.filter((f: any) => !this.preservedProducts.map(r => r.product.id).includes(f.id))
					})
				}
			}
		})*/
	}
}
</script>


<style scoped>

</style>
