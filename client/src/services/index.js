import axios from "axios";

export default axios.create({
  withCredentials: true,
});

export { default as AuthService } from "./authService";
export { default as ChatService } from "./chatService";
export { default as MessageService } from "./messageService";
export { default as UserService } from "./userService";
