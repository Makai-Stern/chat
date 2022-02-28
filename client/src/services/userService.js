import axios from "services";
import resolve from "./resolve";

const BASE_URL = process.env.REACT_APP_API + "/users/";

const UserService = {
  find: async function (query) {
    return await resolve(
      axios.get(BASE_URL + '"' + query + '"').then((res) => res.data)
    );
  },
  update: async function (data) {
    return await resolve(axios.put(BASE_URL, data).then((res) => res.data));
  },
};

export default UserService;
