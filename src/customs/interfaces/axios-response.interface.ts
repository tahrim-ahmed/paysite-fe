export interface AxiosResponseInterface {
	status: number;
	error: {
		fields: { field: string, value: string, message: string }[],
		system: {
			domain: string,
			message: string,
			value: string
		}
	};
	message: string;
	nonce: number;
	payload: {
		count: number;
		data: any;
	}
	page: {
		page: number,
		limit: number,
		count: number,
		data: any
	};
}
