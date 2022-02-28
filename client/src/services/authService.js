import axios from "services";
import resolve from "./resolve";

const BASE_URL = process.env.REACT_APP_API + "/auth";

const AuthService = {
  logout: async function () {
    return await resolve(
      axios.get(`${BASE_URL}/logout`).then((res) => res.data)
    );
  },
  login: async function (user) {
    return await resolve(
      axios.post(BASE_URL + "/login", user).then((res) => res.data)
    );
  },
  register: async function (user) {
    return await resolve(
      axios.post(BASE_URL + "/register", user).then((res) => res.data)
    );
  },
  checkAuth: async function () {
    return await resolve(
      axios.get(`${BASE_URL}/whoami`).then((res) => res.data)
    );
  },
  changePassword: async function (passwordData) {
    return await resolve(
      axios.post(`${BASE_URL}/password`, passwordData).then((res) => res.data)
    );
  },
};

export default AuthService;
