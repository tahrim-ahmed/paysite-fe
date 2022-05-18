interface crudInterface {
	add: boolean,
	edit: boolean,
	list: boolean,
	delete: boolean
}

export interface PermissionInterface {
	_id?: string,
	name: string,
	clients: crudInterface,
	product: crudInterface,
	invoice: crudInterface,
	stock: crudInterface,
	users: crudInterface,
	group: crudInterface
}
