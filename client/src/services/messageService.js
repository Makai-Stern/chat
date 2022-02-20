import axios from "axios";
import resolve from "./resolve";

const BASE_URL = process.env.REACT_APP_API + "/messages/";

const MessageService = {
  post: async function (data) {
    return await resolve(
      axios
        .post(BASE_URL, data, { withCredentials: true })
        .then((res) => res.data)
    );
  },
  getAll: async function (id, page = null, limit = 15) {
    if (page && limit) {
      return await resolve(
        axios
          .get(BASE_URL + id, {
            withCredentials: true,
            params: {
              page: page,
              limit: limit,
            },
          })
          .then((res) => res.data)
      );
    }
    return await resolve(
      axios.get(BASE_URL, { withCredentials: true }).then((res) => res.data)
    );
  },
};

export default MessageService;
