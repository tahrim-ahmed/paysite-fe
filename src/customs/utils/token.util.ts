import {TokenInterface} from "src/customs/interfaces/token.interface";
import {Plugins} from '@capacitor/core';
import {Axios} from "boot/axios";
import {SessionStorage} from "quasar";

const {Storage} = Plugins

const tokenKey = 'login'
const currentUserKey = 'c_user'
const paymentKey = 'c_payment'

export async function getToken(): Promise<TokenInterface> {
	const sessionStorage = await SessionStorage.getItem(tokenKey)
	return sessionStorage ? JSON.parse(sessionStorage.toString()) as TokenInterface : {} as any
}

export async function setToken(token: any): Promise<void> {
	await Storage.set({key: tokenKey, value: JSON.stringify(token)})
	Axios.defaults.headers.common['Authorization'] = "Bearer " + token.accessToken
}

export async function destroyToken(): Promise<void> {
	await Storage.remove({key: tokenKey})
}

export async function getCurrentUser(): Promise<any> {
	const sessionStorage = await Storage.get({key: currentUserKey})
	return sessionStorage.value ? JSON.parse(sessionStorage.value) as any : {} as any
}

export async function setCurrentUser(token: any): Promise<void> {
	await Storage.set({key: currentUserKey, value: JSON.stringify(token)})
}

export async function setPayment(token: any): Promise<void> {
	await Storage.set({key: paymentKey, value: JSON.stringify(token)})
}

export async function destroyCurrentUser(): Promise<void> {
	await Storage.remove({key: currentUserKey})
}

export async function clearStorage(): Promise<void> {
	await Storage.clear()
}
