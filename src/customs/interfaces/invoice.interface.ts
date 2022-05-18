interface invoiceDetailsInterface {
	productID: string,
	discount: number
	unitTP: number
	unitMRP: number
	quantity: number
}

export interface InvoiceInterface {
	id?: string
	client: string
	totalTP: number
	totalMRP: number
	totalCommission: number
	others: number
	totalProfit: number
	platform: string
	products: invoiceDetailsInterface[]
}
