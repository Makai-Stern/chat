import React from 'react'
import { useAuthState } from 'store'

export default function useAuthStatus() {
    const [authenticated, setAuthenticated] = React.useState(false)
    const [user, setUser] = React.useState(null)
    const checkAuth = useAuthState((state) => state.checkAuth)
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        async function getUser() {
            try {
                const data = await checkAuth();
                return data
            } catch (error) {
                // console.error('Auth Middleware', error);
            }
        }
        getUser().then((data) => {
            if (data?.user) {
                setUser(data.user)
                setAuthenticated(true)
            }
            setLoading(false)
        })
    }, [checkAuth])

    return { authenticated, loading, user }
}