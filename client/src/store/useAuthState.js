import create from 'zustand'
import { AuthService } from 'services'

const useStore = create((set) => ({
    authenticated: false,
    user: null,
    setUser: (user) => set({user}),
    checkAuth: async () => {
        const resposne = await AuthService.checkAuth()
        try {
            if (resposne?.error) throw new Error('User not Authenticated')
            const user = resposne.data
            let authenticated = false

            // Check if User is authenticated
            if (user) authenticated = true
            const data = {user, authenticated}
            
            // Set the State
            set(data)
            return data
        } catch (error) {
            return resposne
        }
    },
    logout: async () => {
        const resposne = await AuthService.logout()
        return resposne
    },
	clear: () => set({}, true)
}))

export default useStore