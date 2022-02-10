import axios from 'axios'
import resolve from './resolve'

const BASE_URL = process.env.REACT_APP_API + '/auth'

const AuthService = {
	logout: async function() {
		return await resolve(axios.get(`${BASE_URL}/logout`, { withCredentials: true }).then((res) => res.data))
	},
	login: async function(user) {
		return await resolve(axios.post(BASE_URL + '/login', user, { withCredentials: true }).then((res) => res.data))
	},
	register: async function(user) {
		return await resolve(
			axios.post(BASE_URL + '/register', user, { withCredentials: true }).then((res) => res.data)
		);
	},
	checkAuth: async function() {
		return await resolve(axios.get(`${BASE_URL}/whoami`, { withCredentials: true }).then((res) => res.data))
	},
	changePassword: async function(passwordData) {
		return await resolve(axios.post(`${BASE_URL}/password`, passwordData, { withCredentials: true }).then((res) => res.data))
	}
};

export default AuthService
