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
  setCurrentChat: (currentChat) => set({ currentChat }),
  setCurrentChatId: (currentChatId) => set({ currentChatId }),
  setChats: (chats) => set({ chats }),
}));

export default useStore;
