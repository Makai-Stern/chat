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
  updateChat: (chat) => {
    set({
      chats: get().chats.map((c) => {
        if (c.id === chat.id) {
          return chat;
        } else {
          return c;
        }
      }),
    });
  },
  setCurrentChatId: (currentChatId) => set({ currentChatId }),
  setChats: (chats) => set({ chats }),
  addChat: (chat) => {
    if (!get().chats.find((c) => c.id === chat.id)) {
      // get().incrementChatCount(1);
      get().setChatCount(1 + get().chats.length);
      set({ chats: [chat, ...get().chats] });
    }
  },
  addChats: (chats) => {
    // get().incrementChatCount(chats.length);
    // set({ chats: [...chats, ...get().chats] });
    const currentChats = get().chats;
    let addedChats = [];
    chats.forEach((chat) => {
      if (!currentChats.find((c) => c.id === chat.id)) addedChats.push(chat);
    });
    // get().incrementChatCount(addedChats.length);
    get().setChatCount(addedChats.length + get().chats.length);
    set({ chats: [...addedChats, ...get().chats] });
  },
  clear: () => set({}, true),
}));

export default useStore;
