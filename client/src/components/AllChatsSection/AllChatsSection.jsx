import React from "react";
import { Typography, Skeleton, message } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";

import { useAuthState } from "store";
import { useSocket } from "contexts/SocketProvider";
import { useChatState } from "store";
import { ChatService } from "services";
import ChatCard from "components/ChatCard/ChatCard";
import styles from "./styles.module.scss";

const { Text } = Typography;

function AllChatsSection() {
  const user = useAuthState((state) => state.user);
  const socket = useSocket();
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const currentChatId = useChatState((state) => state.currentChatId);
  const chats = useChatState((state) => state.chats);
  const addChat = useChatState((state) => state.addChat);
  const addChats = useChatState((state) => state.addChats);
  const setChats = useChatState((state) => state.setChats);
  const setCurrentChat = useChatState((state) => state.setCurrentChat);
  const FETCH_NUM = 20;

  const [loading, setLoading] = React.useState(false);
  // const [data, setData] = React.useState([]);

  const loadMoreData = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    const { data: chatData } = await ChatService.getAll(page, FETCH_NUM);
    if (chatData.length > 0) {
      // setData((prevChats) => [...prevChats, ...data]);
      addChats(chatData);
      setPage((prevPage) => prevPage + 1);

      // Join Rooms that are shown
      let rooms = [];
      chatData.forEach((c) => {
        rooms.push(c.id);
      });
      socket.emit("joinRooms", rooms);

      const firstChat = chatData[0];
      setCurrentChat(firstChat);
    } else {
      setHasMore(false);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    loadMoreData();

    return () => {
      setChats([]);
      setCurrentChat({});
      // setData([]);
    };
  }, []);

  React.useEffect(() => {
    if (socket) {
      socket.on("getChat", (payload) => {
        if (!payload.user.id !== user.id) {
          if (payload.chat.users.find((u) => u.id === user.id)) {
            if (!chats.find((c) => c.id === payload.chat.id)) {
              addChat(payload.chat);
              // setCurrentChat(data.chat);
              let room = [payload.chat.id];
              socket.emit("joinRooms", room);
            }
          }
        }
      });
    }
    return () => socket.off("getChat");
  }, [socket, addChat]);

  return (
    <>
      <div className={styles.container}>
        <div
          id="scrollableDiv"
          style={{
            height: "calc(100vh - 150px)",
          }}
        >
          {chats?.length > 0 ? (
            <InfiniteScroll
              scrollableTarget="scrollableDiv"
              dataLength={chats.length}
              next={loadMoreData}
              hasMore={hasMore}
              loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
            >
              {chats.map((chat, i) => {
                let chatName = "";
                if (chat.type === "single") {
                  let recipient = {};

                  chat.users.forEach((u) => {
                    if (u.id !== user.id) recipient = u;
                  });

                  // Set defaults for single chat
                  chatName = recipient.name;
                } else {
                  chatName = chat.name;
                }

                return <ChatCard key={i} chat={chat} chatName={chatName} />;
              })}
            </InfiniteScroll>
          ) : (
            <Text
              style={{ color: "#bfbfbf", fontSize: "14px", fontWeight: 500 }}
            >
              No Chats
            </Text>
          )}
        </div>
      </div>
    </>
  );
}

export default AllChatsSection;
