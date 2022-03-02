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
  const chats = useChatState((state) => state.chats);
  const setChats = useChatState((state) => state.setChats);
  const setCurrentChat = useChatState((state) => state.setCurrentChat);
  const FETCH_NUM = 20;

  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState([]);

  const loadMoreData = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    const { data } = await ChatService.getAll(page, FETCH_NUM);
    if (data.length > 0) {
      setData((prevChats) => [...prevChats, ...data]);
      setChats(data);
      setPage((prevPage) => prevPage + 1);
      if (!currentChatId) {
        const firstChat = data[0];
        setCurrentChat(firstChat);
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
            height: "calc(100vh - 150px)",
          }}
        >
          {chats?.length > 0 ? (
            <InfiniteScroll
              scrollableTarget="scrollableDiv"
              dataLength={data.length}
              next={loadMoreData}
              hasMore={hasMore}
              loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
            >
              {chats.map((chat, i) => (
                <ChatCard key={i} chat={chat} />
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
