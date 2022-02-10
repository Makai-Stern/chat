import axios from 'axios'
import resolve from './resolve'

const BASE_URL = process.env.REACT_APP_API + '/messages/'

const MessageService = {
	post: async function(data) {
		return await resolve(axios.post(BASE_URL, data, { withCredentials: true }).then((res) => res.data));
	},
};

export default MessageService