import {boot} from "quasar/wrappers";
import {copyToClipboard, Notify} from "quasar";
import moment from "moment";
import {AxiosInstance} from "axios";

export interface HelperInterface {
	rules: {
		required(value: any): boolean | string,
		noSpace(value: any): boolean | string,
		number(value: any): boolean | string,
		email(value: any): boolean | string,
		min5char(value: any): boolean | string,
		validYoutubeUrl(value: string): boolean | string,
	}

	capitalizeFirstLetter(s: string): string

	smallFirstLetter(s: string): string

	titleCase(s: string): string

	reset(o: any, val?: any): any

	console(): void

	convertDate(rawDate: Date | string, format?: string): any

	copyText(text: string, field?: string): void

	toBase64(file: File): Promise<string>

	numDifferentiation(val: number): string

	numberWithCommas(val: number): string

	removeCommas(val: string): number
}

export const helper: HelperInterface = {
	rules: {
		required: (v: any) => {
			return (v !== null && v !== undefined ? !!v.toString().length : false) || 'Field is required!'
		},
		noSpace: (v: string) => {
			return !(/^\s/i.test(v)) || 'No Space is accepted!'
		},
		number: (v: any) => !isNaN(v) || 'Only Number!',
		email: (v: string) => {
			let reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return !v.length || reg.test(v) || 'Not a valid email!'
		},
		min5char(v: any) {
			return (v.toString().length === 5) || 'Minimum 6 characters'
		},
		validYoutubeUrl(url: string) {
			const regExp = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(\?\S*)?$/;
			if (url.match(regExp)) {
				return true;
			} else {
				return 'Only valid youtube link required!!'
			}
		}
	},

	capitalizeFirstLetter: (string: string) => {
		return string.length ? string[0].toUpperCase() + string.slice(1) : '';
	},

	smallFirstLetter: (string: string) => {
		return string.length ? string[0].toLowerCase() + string.slice(1) : '';
	},

	titleCase(str: string): string {
		let newStr: string[] = str.toLowerCase().split(' ');
		for (let i = 0; i < newStr.length; i++) {
			newStr[i] = newStr[i].charAt(0).toUpperCase() + newStr[i].slice(1);
		}
		return newStr.join(' ');
	},

	reset: (obj: any, val?: any) => {
		if (obj) {
			Object.keys(obj).forEach(key => {
				if (Array.isArray(obj[key])) {
					obj[key] = [];
				} else if (typeof obj[key] == "object") {
					helper.reset(obj[key]);
				} else if (typeof obj[key] == "number" || typeof obj[key] == "bigint") {
					obj[key] = 0
				} else if (typeof obj[key] == "string") {
					obj[key] = ''
				} else if (obj[key] == null) {
					obj[key] = null
				} else {
					obj[key] = val
				}
			})
		}
		return obj;
	},

	console() {
		console.log(arguments);
	},
	convertDate(rawDate: Date | string, format?: string) {
		format = format || "DD MMM, YYYY"
		return moment(rawDate).format(format)
	},

	copyText(text: string, field?: string) {
		copyToClipboard(text).then(() => {
			Notify.create({
				message: (field || '') + ' Copied to Clipboard!',
				caption: text,
				icon: 'content_copy',
				type: 'positive'
			})
		}).catch(() => {
			Notify.create({
				message: 'Copy Failed!!',
				caption: text,
				icon: 'content_copy',
				type: 'negative'
			})
		})
	},

	toBase64(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result.toString());
			reader.onerror = error => reject(error);
		});
	},

	numDifferentiation(val: number): string {
		return formatter.format(val);
	},

	numberWithCommas(x: number): string {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	},
	removeCommas(x: string): number {
		return Number(x.toString().replace(/,/g, ''))
	}
}

const formatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'BDT',
	minimumFractionDigits: 0,
	maximumFractionDigits: 2,
	//@ts-ignore
	notation: 'compact',
	compactDisplay: 'long',
})

export default boot<any>(({Vue}: any) => {
	Vue.prototype.$helper = helper;
})

declare module 'vue/types/vue' {
	interface Vue {
		$axios: AxiosInstance
		$helper: HelperInterface
	}
}
