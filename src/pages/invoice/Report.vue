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

						<template v-slot:body="props">
							<q-tr :props="props">

								<q-td class="q-px-sm cursor-pointer">
									{{ $helper.convertDate(props.row.createdAt) }}
								</q-td>

								<q-td class="q-px-sm cursor-pointer">
									{{ props.row.invoiceNo }}
								</q-td>

								<q-td class="q-px-sm cursor-pointer">
									{{ props.row.client.code+' - '+props.row.client.name }}
								</q-td>

								<q-td class="q-px-sm cursor-pointer">
									{{ props.row.client.cell }}
								</q-td>

								<q-td class="q-px-sm cursor-pointer text-bold">
									{{ $helper.numberWithCommas(props.row.totalTP) }}
								</q-td>

								<q-td class="q-px-sm cursor-pointer text-bold">
									{{ $helper.numberWithCommas(props.row.totalMRP) }}
								</q-td>

								<q-td class="q-px-sm cursor-pointer text-bold">
									{{ $helper.numberWithCommas(props.row.totalCommission) }}
								</q-td>

								<q-td class="q-px-sm cursor-pointer text-bold">
									{{ $helper.numberWithCommas(Number(props.row.totalMRP) - Number(Number(props.row.totalTP) +
										Number(props.row.totalCommission) + Number(props.row.others))) }}
								</q-td>

								<q-td class="q-px-sm text-center">
									<q-icon class="cursor-pointer" color="dark" name="view_module" size="sm">
										<q-menu anchor="bottom left" fit self="top left" transition-hide="rotate" transition-show="rotate">
											<q-list style="min-width: 100px">
												<q-item clickable dense v-close-popup @click="openDetailsDialog(props.row)">
													<q-item-section side>
														<q-icon color="secondary" name="table_view" style="font-size: 15px"/>
													</q-item-section>
													<q-item-section>
														<q-item-label style="font-size: 15px">Details</q-item-label>
													</q-item-section>
												</q-item>
												<q-separator/>
												<q-item clickable dense v-close-popup @click="">
													<q-item-section side>
														<q-icon color="positive" name="file_download" style="font-size: 15px"/>
													</q-item-section>
													<q-item-section>
														<q-item-label style="font-size: 15px">Download</q-item-label>
													</q-item-section>
												</q-item>
												<q-separator/>
												<q-item clickable dense v-close-popup @click="">
													<q-item-section side>
														<q-icon color="primary" name="print" style="font-size: 15px"/>
													</q-item-section>
													<q-item-section>
														<q-item-label style="font-size: 15px">Print</q-item-label>
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
																Would you really like to delete invoice
																<span class="text-bold text-negative">
																{{props.row.invoiceNo}}
																</span> for forever?
																<template v-slot:action>
																	<q-btn color="negative" glossy @click="remove(props.row._id)" v-close-popup> Yes</q-btn>
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

					<!--	Add Invoice  -->
					<q-dialog class="row" v-model="addDialog" persistent>
						<q-card :class="invoice.clientID? 'col q-mr-md' : ''">
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
													<q-select v-model="invoice.clientID" :options="clientOptions" class="col col-4" clearable
													          input-debounce="1000" label="Select Client" map-options option-label="name"
													          option-value="id" emit-value
													          use-input @filter="filterClientFn" outlined dense>
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
																		{{ scope.opt.code }} - {{ scope.opt.name }}
																	</q-item-label>
																</q-item-section>
															</q-item>
														</template>

													</q-select>
												</div>
												<div class="col-12 col-md-12 q-pt-md">
												<q-select v-model="addMore.product" :options="productOptions" class="col col-4" clearable
													          input-debounce="1000" label="Select Product" map-options option-label="name"
													          use-input @filter="filterProductFn" outlined dense>
														<template v-slot:no-option>
															<q-item>
																<q-item-section class="text-grey">
																	No results
																</q-item-section>
															</q-item>
														</template>

													</q-select>
												</div>
												<div class="col-12 col-md-4 q-pt-md">
													<q-input v-model="addMore.unitTP" label="Unit TP" outlined dense/>
												</div>
												<div class="col-12 col-md-4 q-pt-md">
													<q-input v-model="addMore.unitMRP" label="Unit MRP" outlined dense/>
												</div>
												<div class="col-12 col-md-4 q-pt-md">
													<q-input v-model="addMore.quantity" label="Quantity" outlined dense/>
												</div>
												<div class="col-12 col-md-9 q-pt-md">
													<q-input v-model="addMore.discount" label="Discount %" outlined dense/>
												</div>
												<div class="col-md-3 q-pt-md">
													<q-btn class="full-width" label="Add Que" color="primary" @click="addToQueue" no-caps/>
												</div>
												<div class="col-12 col-md-6 q-pt-md">
													<q-select v-model="invoice.platform" :options="platformOptions" class="col col-4"
													          input-debounce="1000" label="Select Platform" outlined dense @change="calculateTotal"/>
												</div>
												<div class="col-12 col-md-6 q-pt-md">
													<q-input v-model="invoice.others" label="Others Cost" outlined dense/>
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
						<q-card v-if="invoice.clientID" class="col">
							<div class="row q-ma-md">
								<div class="col-12 col-md-6 text-bold">
									Date: {{invDate}} <br>
									Client: {{currentClient.name}}
								</div>
							</div>
							<div class="q-ma-md">
								<q-markup-table v-if="preservedProducts.length" bordered dense flat separator="cell" wrap-cells>
									<thead class="bg-primary text-white text-center">
									<tr>
										<th class="text-center text-uppercase" colspan="9">Product Information</th>
									</tr>
									<tr>
										<th>Product Name</th>
										<th>Pack Size</th>
										<th>Quantity</th>
										<th>Unit TP</th>
										<th>Unit MRP</th>
										<th>Dis %</th>
										<th>Dis Amount</th>
										<th>Total</th>
										<th>#</th>
									</tr>
									</thead>
									<tbody class="text-center">
									<tr v-for="(product, index) of preservedProducts" :key="product.product.id">
										<td>{{ product.product.name }}</td>
										<td>{{ product.product.packSize }}</td>
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
											৳ {{ product.unitTP }}
											<q-popup-edit v-model="product.unitTP" persistent>
												<template v-slot="scope">
													<q-input v-model.number="scope.value" autofocus dense type="number"
													         @keyup.enter="updateUnitTP(index, scope.value)"/>
												</template>
											</q-popup-edit>
										</td>
										<td>
											৳ {{ product.unitMRP }}
											<q-popup-edit v-model="product.unitMRP" persistent>
												<template v-slot="scope">
													<q-input v-model.number="scope.value" autofocus dense type="number"
													         @keyup.enter="updateUnitMRP(index, scope.value)"/>
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
												$helper.numberWithCommas((((Number(product.quantity) * Number(product.unitMRP)) *
														Number(product.discount)) / 100).toFixed(2))
											}}
										</td>
										<td>৳ {{
												$helper.numberWithCommas(((Number(product.quantity) * Number(product.unitMRP)) -
														(((Number(product.quantity) * Number(product.unitMRP)) * Number(product.discount)) /
																100)).toFixed(2))
											}}
										</td>
										<td class="cursor-pointer">
											<q-icon name="delete" @click="removeQueue(index)"/>
										</td>
									</tr>
									<tr>
										<td class="text-right text-bold" colspan="7">Total TP</td>
										<td class="text-right text-bold">৳ {{
												$helper.numberWithCommas(invoice.totalTP)
											}}
										</td>
									</tr>
									<tr>
										<td class="text-right text-bold" colspan="7">Total Other Cost</td>
										<td class="text-right text-bold">৳ {{
												$helper.numberWithCommas(invoice.others)
											}}
										</td>
									</tr>
									<tr>
										<td class="text-right text-bold" colspan="7">Total MRP</td>
										<td class="text-right text-bold">৳ {{
												$helper.numberWithCommas(invoice.totalMRP)
											}}
										</td>
									</tr>
									<tr v-if="invoice.platform === 'Daraz'">
										<td class="text-right text-bold" colspan="7">Daraz Commission</td>
										<td class="text-right text-bold">৳ {{
												$helper.numberWithCommas((12 * Number(this.invoice.totalMRP)) / 100)
											}}
										</td>
									</tr>
									<tr>
										<td class="text-right text-bold" colspan="7">Total Profit</td>
										<td class="text-right text-bold">৳ {{
												invoice.platform === 'Daraz' ? $helper.numberWithCommas((Number(invoice.totalMRP) -
																Number(Number(invoice.totalTP) + Number(invoice.others) + Number((12 *
																		Number(invoice.totalMRP)) / 100))).toFixed(2)) :
														$helper.numberWithCommas((Number(invoice.totalMRP) -
																Number(Number(invoice.totalTP) + Number(invoice.others))).toFixed(2))
											}}
										</td>
									</tr>
									</tbody>
								</q-markup-table>
							</div>
						</q-card>
					</q-dialog>

					<!--	Invoice Details  -->
					<q-dialog v-model="detailsDialogue" persistent>
						<q-card style="width: 700px; max-width: 80vw; max-height: 100vw;">
							<q-bar class="bg-primary text-white">
								<q-space />
								<q-btn dense flat icon="close" @click="closeDetailsDialog">
									<q-tooltip>Close</q-tooltip>
								</q-btn>
							</q-bar>
							<q-tabs class="q-pt-none" v-model="detailsTab" dense active-color="primary">
								<q-tab name="client" label="Client Details"/>
								<q-tab name="product" label="Invoice Details"/>
							</q-tabs>
							<q-tab-panels v-model="detailsTab" class="bg-grey-1" animated>
								<q-tab-panel name="client">
									<div class="row">
										<div class="col-6">
											Client Code: {{ invoiceDetails.client.code }} <br>
											Client Email: {{ invoiceDetails.client.email }} <br>
											Client Shipping: {{ invoiceDetails.client.shipping }} <br>
										</div>
										<div class="col-6">
											Client Name: {{ invoiceDetails.client.name }} <br>
											Client Cell: {{ invoiceDetails.client.cell }} <br>
											Client Billing: {{ invoiceDetails.client.billing }} <br>
										</div>
									</div>
								</q-tab-panel>
								<q-tab-panel name="product">
									<div class="row">
										<div class="col-6">
											Invoice No: {{ invoiceDetails.invoiceID }} <br>
										</div>
										<div class="col-6">
											Invoice Date: {{ $helper.convertDate(invoiceDetails.createdAt) }} <br>
										</div>
									</div>
									<q-markup-table dense class="q-mt-md">
										<thead class="bg-grey-12">
										<tr>
											<th class="text-left">Product Name</th>
											<th class="text-left">Pack Size</th>
											<th class="text-left">Quantity</th>
											<th class="text-left">Unit TP</th>
											<th class="text-left">Unit MRP</th>
											<th class="text-left">Dis %</th>
											<th class="text-left">Dis Amount</th>
											<th class="text-left">Total</th>
										</tr>
										</thead>
										<tbody>
										<tr v-for="products of invoiceDetails.invoiceDetails">
											<td class="text-left">{{ products.product.name }}</td>
											<td class="text-left">{{ products.product.packSize }}</td>
											<td class="text-left">{{ products.quantity }}</td>
											<td class="text-left">{{ products.unitTP }}</td>
											<td class="text-left">{{ products.unitMRP }}</td>
											<td class="text-left">{{ products.discount === 0 ? '-' : products.discount+' %' }}</td>
											<td>
												{{
													products.discount === 0 ? '-' : '৳ '+$helper.numberWithCommas((((Number(products.quantity) *
															Number(products.unitMRP)) * Number(products.discount)) / 100).toFixed(2))
												}}
											</td>
											<td>৳
												{{
													$helper.numberWithCommas(((Number(products.quantity) * Number(products.unitMRP)) -
															(((Number(products.quantity) * Number(products.unitMRP)) * Number(products.discount)) /
																	100)).toFixed(2))
												}}
											</td>
										</tr>
										<tr>
											<td class="text-right text-bold" colspan="7">Total TP</td>
											<td class="text-bold">৳
												{{
													$helper.numberWithCommas(invoiceDetails.totalTP.toFixed(2))
												}}
											</td>
										</tr>
										<tr v-if="invoiceDetails.platform === 'Daraz'">
											<td class="text-right text-bold" colspan="7">Daraz Commission</td>
											<td class="text-bold">৳
												{{
													$helper.numberWithCommas(invoiceDetails.totalCommission.toFixed(2))
												}}
											</td>
										</tr>
										<tr>
											<td class="text-right text-bold" colspan="7">
												Others
												<q-tooltip>
													Including Packing, travelling
												</q-tooltip>
											</td>
											<td class="text-bold">৳
												{{
													invoiceDetails.others > 0 ? $helper.numberWithCommas(invoiceDetails.others) : 0
												}}
											</td>
										</tr>
										<tr>
											<td class="text-right text-bold" colspan="7">Total MRP</td>
											<td class="text-bold">৳
												{{
													$helper.numberWithCommas(invoiceDetails.totalMRP.toFixed(2))
												}}
											</td>
										</tr>
										<tr>
											<td class="text-right text-bold" colspan="7">
												{{ Number(invoiceDetails.totalMRP) - Number(Number(invoiceDetails.totalTP) + Number(invoiceDetails.totalCommission) +
													Number(invoiceDetails.others)) >= 0 ?
													'Profit' : 'Loss' }}
											</td>
											<td class="text-bold">৳
												{{
													$helper.numberWithCommas(Number(invoiceDetails.totalMRP) - Number(Number(invoiceDetails.totalTP) + Number(invoiceDetails.totalCommission) +
															Number(invoiceDetails.others)))
												}}
											</td>
										</tr>
										</tbody>
									</q-markup-table>
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
import {Loading, QSpinnerClock} from "quasar";
import {AxiosResponseInterface} from "src/customs/interfaces/axios-response.interface";
import {ResponseStatusEnum} from "src/customs/enum/response-status.enum";
import {InvoiceInterface} from "../../customs/interfaces/invoice.interface";
import {ProductInterface} from "../../customs/interfaces/product.interface";

interface AddMoreInterface {
	product: ProductInterface,
	unitTP: number,
	unitMRP: number,
	quantity: number,
	discount: number
}

@Component({})

export default class List extends Vue {
	tab = 'info'
	detailsTab = 'client'

	detailsDialogue: boolean = false

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
			sortable: true,
		},{
			label: 'Invoice No',
			name: 'invoiceNo',
			field: 'invoiceNo',
			align: 'left',
			sortable: true
		},{
			label: 'Client Code',
			name: 'clientName',
			field: 'name',
			align: 'left',
			sortable: true
		},{
			label: 'Contact No',
			name: 'contact',
			field: 'cell',
			align: 'left',
			sortable: true
		},{
			label: 'Total TP',
			name: 'totalTP',
			field: 'totalTP',
			align: 'left',
			sortable: true
		},{
			label: 'Total MRP',
			name: 'totalMRP',
			field: 'totalMRP',
			align: 'left',
			sortable: true
		},{
			label: 'Commission',
			name: 'totalCommission',
			field: 'totalCommission',
			align: 'left',
		},{
			label: 'Profit',
			name: 'totalProfit',
			field: 'totalProfit',
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
		clientID: '',
		totalTP: 0,
		totalMRP: 0,
		totalCommission: 0,
		others: 0,
		totalProfit: 0,
		platform: '',
		createInvoiceDetailsDto: []
	}

	invoiceDetails: any = {
		client: {
			code: '',
			name: '',
			contact: '',
			billing: '',
			shipping: '',
			email: ''
		},
		createdAt: '',
		createdBy: '',
		deletedAt: '',
		id: '',
		invoiceDetails: [
			{
				discount: 0,
				product: {
					name: '',
					packSize: '',
				},
				quantity: 0,
				unitMRP: 0,
				unitTP: 0,
			}
		],
		invoiceID: '',
		others: 0,
		platform: '',
		totalCommission: 0,
		totalMRP: 0,
		totalTP: 0,
		totalProfit: 0,
	}

	currentClient: any = {}

	productOptions: any[] = [];
	clientOptions: any[] = [];
	platformOptions: any[] = ['Daraz', 'Facebook', 'Offline'];

	preservedProducts: Array<AddMoreInterface> = [];

	addMore: AddMoreInterface = {
		product: {
			id: '', name: '', packSize: ''
		},
		quantity: null,
		unitTP: null,
		unitMRP: null,
		discount: 0
	}

	openDetailsDialog(invoice: any) {
		Object.keys(this.invoiceDetails).forEach((key: any) => {
			this.invoiceDetails[key] = invoice[key] || '';
		})
		this.detailsDialogue = true;
	}

	closeDetailsDialog() {
		this.detailsDialogue = false;
		this.detailsTab = 'client';
	}

	@Watch('invoice.clientID')
	onAddInvoiceChange() {
		const client = this.clientOptions.find((f: any) => f.id === this.invoice.clientID)
		if (client) this.currentClient = client
	}

	created() {
		this.onRequest({
			pagination: this.pagination
		})
	}

	@Watch('filter', { immediate: true })
	onFilter() {
		this.onRequest({
			pagination: this.pagination
		})
	}
	onRequest({ pagination }: any = {}) {
		if (!this.isLoading) {
			if (pagination) {
				this.pagination = pagination
			}
			this.isLoading = true
			this.rows = []
			let url =
					'invoice/pagination?page=' + this.pagination.page +
					'&limit=' + this.pagination.rowsPerPage +
					'&sort=' + this.pagination.sortBy +
					'&order=' + (this.pagination.descending ? 'DESC' : 'ASC')
			if (this.filter) url += '&search=' + this.filter
			this.$axios.get(url).then(async (response) => {
				if (!(response instanceof Error)) {
					const res = response.data as AxiosResponseInterface
					if (res.error) {
						this.$q.notify({
							message: res.message,
							type: 'negative'
						})
					} else {
						if (res.status === ResponseStatusEnum.SUCCESS) {
							this.rows = res?.page?.data || []
							this.pagination.rowsNumber = res.page.count
						}
					}
				}
			}).finally(() => {
				this.isLoading = false;
			})
		}
	}

	addToQueue() {
		this.preservedProducts.push(this.addMore)
		this.calculateTotal();
		this.resetAddMore();
	}

	calculateTotal() {
		if (this.addDialog) {
			this.invoice.totalMRP = this.preservedProducts.reduce((acc, cur) => acc + ((cur.quantity * cur.unitMRP) - (((Number(cur.quantity) *
					Number(cur.unitMRP) *
					cur.discount)) / 100)), 0)

			this.invoice.totalTP = this.preservedProducts.reduce((acc, cur) => acc + ((cur.quantity * cur.unitTP)), 0)
		}
	}

	resetAddMore() {
		this.addMore = {
			product: {
				id: '', name: '', packSize: ''
			},
			unitTP: null,
			unitMRP: null,
			quantity: null,
			discount: null
		}
	}

	updateQuantity(index: number, qty: number) {
		this.preservedProducts[index].quantity = qty;
		this.calculateTotal();
	}

	updateUnitTP(index: number, price: number) {
		this.preservedProducts[index].unitTP = price;
		this.calculateTotal();
	}

	updateUnitMRP(index: number, price: number) {
		this.preservedProducts[index].unitMRP = price;
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

	saveInvoice() {
		this.invoice.createInvoiceDetailsDto = this.preservedProducts.map(m => {
			return {
				productID: m.product.id,
				quantity: Number(m.quantity),
				unitTP: Number(m.unitTP),
				unitMRP: Number(m.unitMRP),
				discount: Number(m.discount),
			}
		})
		if (this.invoice.platform === 'Daraz') {
			this.invoice.totalCommission = Number((12 * Number(this.invoice.totalMRP)) / 100)

			this.invoice.totalProfit = Number(this.invoice.totalMRP) -
					Number(Number(this.invoice.totalTP) + Number(this.invoice.others) + Number((12 *
							Number(this.invoice.totalMRP)) / 100))
		}
		else {
			this.invoice.totalCommission = 0

			this.invoice.totalProfit = Number(this.invoice.totalMRP) - Number(Number(this.invoice.totalTP) + Number(this.invoice.others))
		}

		//@ts-ignore
		Loading.show({spinner: QSpinnerClock, spinnerSize: '5rem', backgroundColor: 'grey'})
		this.$axios.post('invoice', this.invoice).then(response => {
			if (!(response instanceof Error)) {
				const res = response.data as AxiosResponseInterface
				this.$q.notify({
					message: res.message,
					type: res.status === ResponseStatusEnum.CREATED ? 'positive' : 'negative'
				})
				this.onFilter()
			}
		}).finally(() => {
			this.closeAddDialog();
			Loading.hide()
		})
	}

	closeAddDialog() {
		this.addDialog = false;
		this.invoice.clientID = ''
		this.invoice.totalTP = 0
		this.invoice.totalMRP = 0
		this.invoice.others = 0
		this.invoice.platform = ''
		this.invoice.createInvoiceDetailsDto = []
		this.preservedProducts = []
		this.currentClient = {}
	}

	/*************** filter ***************/
	filterProductFn(val: string, update: Function) {
		let url = 'product/search?page=1&limit=5';
		if (val) url += '&search=' + val
		this.$axios.get(url).then(async (response) => {
			if (!(response instanceof Error)) {
				const res = response.data as AxiosResponseInterface
				if (res.status === ResponseStatusEnum.SUCCESS) {
					update(() => {
						this.productOptions = res?.page?.data || []
					})
				}
			}
		})
	}

	filterClientFn(val: string, update: Function) {
		let url = 'client/search?page=1&limit=5';
		if (val) url += '&search=' + val
		this.$axios.get(url).then(async (response) => {
			if (!(response instanceof Error)) {
				const res = response.data as AxiosResponseInterface
				if (res.status === ResponseStatusEnum.SUCCESS) {
					update(() => {
						this.clientOptions = res?.page?.data || []
					})
				}
			}
		})
	}
}
</script>


<style scoped>

</style>
