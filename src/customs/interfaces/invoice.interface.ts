interface invoiceDetailsInterface {
	productID: string,
	discount: number
	unitPrice: number
	quantity: number
}

export interface InvoiceInterface {
	_id?: string
	client: string
	totalAmount: number
	paymentType: 0 | 1 | boolean
	creditPeriod?: Date
	products: invoiceDetailsInterface[]
}
