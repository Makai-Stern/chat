import React from "react";
import { Typography, Skeleton } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";

import { useChatState } from "store";
import { ChatService } from "services";
import ChatCard from "components/ChatCard/ChatCard";
import styles from "./styles.module.scss";

const { Text } = Typography;

function AllChatsSection() {
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const currentChatId = useChatState((state) => state.currentChatId);
  // const setCurrentChatId = useChatState((state) => state.setCurrentChatId);
  const setCurrentChat = useChatState((state) => state.setCurrentChat);

  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState([]);

  const loadMoreData = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    const { data: chats } = await ChatService.getAll(page, 20);
    if (chats.length > 0) {
      setData((prevChats) => [...prevChats, ...chats]);
      setPage((prevPage) => prevPage + 1);

      if (!currentChatId) {
        const firstChat = chats[0]
        setCurrentChat(firstChat);
        // setCurrentChatId(firstChat.id);
      }
    } else {
      setHasMore(false);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    loadMoreData();
  }, []);

  return (
    <>
      <div className={styles.container}>
        <div
          id="scrollableDiv"
          style={{
            height: "100%",
            overflow: "auto",
          }}
        >
          {data.length > 0 ? (
            <InfiniteScroll
              scrollableTarget="scrollableDiv"
              dataLength={data.length}
              next={loadMoreData}
              hasMore={hasMore}
              loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
            >
              {data.map((chat) => (
                <ChatCard key={chat.id} chat={chat} />
              ))}
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
