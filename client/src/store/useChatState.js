import create from "zustand";

const useStore = create((set, get) => ({
  chats: [],
  currentChatId: "",
  currentChat: {},
  chatCount: 0,
  currentAttachments: [],
  addAttachments: (attachments) => {
    set({ currentAttachments: [...attachments, ...get().currentAttachments] });
  },
  setCurrentAttachments: (currentAttachments) => set({ currentAttachments }),
  setChatCount: (chatCount) => set({ chatCount }),
  incrementChatCount: (i) => {
    let count = Number.isInteger(get().chatCount) ? i + get().chatCount : i;
    set({ chatCount: count });
  },
  setCurrentChat: (currentChat) => set({ currentChat }),
  setCurrentChatId: (currentChatId) => set({ currentChatId }),
  setChats: (chats) => set({ chats }),
  addChat: (chat) => {
    set({ chats: [chat, ...get().chats] });
  },
  addChats: (chats) => set({ chats: [...chats, ...get().chats] }),
}));

export default useStore;
