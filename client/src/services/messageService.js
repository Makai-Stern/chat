import axios from "services";
import resolve from "./resolve";

const BASE_URL = process.env.REACT_APP_API + "/messages/";

const MessageService = {
  post: async function (data) {
    return await resolve(axios.post(BASE_URL, data).then((res) => res.data));
  },
  read: async function (id) {
    return await resolve(axios.put(BASE_URL + id).then((res) => res.data));
  },
  getAll: async function (id, page = null, limit = 15) {
    if (page && limit) {
      return await resolve(
        axios
          .get(BASE_URL + id, {
            params: {
              page: page,
              limit: limit,
            },
          })
          .then((res) => res.data)
      );
    }
    return await resolve(axios.get(BASE_URL).then((res) => res.data));
  },
};

export default MessageService;
