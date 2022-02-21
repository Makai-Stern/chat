import axios from "axios";
import resolve from "./resolve";

const BASE_URL = process.env.REACT_APP_API + "/chats/";

const ChatService = {
  create: async function (data) {
    return await resolve(
      axios
        .post(BASE_URL, data, { withCredentials: true })
        .then((res) => res.data)
    );
  },
  getAll: async function (page = null, limit = 15) {
    if (page && limit) {
      return await resolve(
        axios
          .get(BASE_URL, {
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
  getChat: async function (id, page = null, limit = null) {
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
      axios
        .get(BASE_URL + id, { withCredentials: true })
        .then((res) => res.data)
    );
  },
  getAttachments: async function (id) {
    return await resolve(
      axios
        .get(BASE_URL + id + "/attachments", { withCredentials: true })
        .then((res) => res.data)
    );
  },
  getMessages: async function (id, page = null, limit = 15) {
    if (page && limit) {
      return await resolve(
        axios
          .get(BASE_URL + id + "/messages", {
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
  getChatCount: async function () {
    return await resolve(
      axios
        .get(BASE_URL + "count", { withCredentials: true })
        .then((res) => res.data)
    );
  },
};

export default ChatService;
