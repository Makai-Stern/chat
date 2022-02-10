import create from 'zustand';

const useStore = create((set) => ({
    chats: [],
    currentChatId:'',
    setCurrentChatId: (currentChatId) => set({currentChatId}),
    setChats: (chats) => set({chats})
}))

export default useStore;