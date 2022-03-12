export interface TokenInterface {
	accessToken: string
	email: string
	firstName: string
	lastName: string
	phone: string
	timeout: Date
	userType: {
		_id: string,
		name: string
	}

	isAdmin: boolean,
}
