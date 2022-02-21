import create from "zustand";

const useStore = create((set) => ({
  chats: [],
  currentChatId: "",
  currentChat: {},
  chatCount: 0,
  setChatCount: (chatCount) => set({ chatCount }),
  setCurrentChat: (currentChat) => set({ currentChat }),
  setCurrentChatId: (currentChatId) => set({ currentChatId }),
  setChats: (chats) => set({ chats }),
}));

export default useStore;
