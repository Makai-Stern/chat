export default async function resolve(promise) {
    
	const resolved = {
		data: null,
		error: null,
		serverOnline: true,
		authorized: true,
		serverError: null
	}

	try {
		resolved.data = await promise;
	} catch (e) {

		resolved.error = e

		if (e.message === 'Network Error') {
			console.error(e)
			resolved.serverOnline = false
		}

		if (e.response?.status === '403') {
			resolved.authorized = false
		}

		if (e.response?.data) {
			resolved.serverError = e.response.data
		}
	}

	return resolved
}
