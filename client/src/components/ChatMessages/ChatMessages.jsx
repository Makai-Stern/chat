import React from "react";

import { Typography, Skeleton } from "antd";
import { EditTwoTone } from "@ant-design/icons";
import InfiniteScroll from "react-infinite-scroll-component";

import { useChatState } from "store";
import { useAuthState } from "store";
import { ChatService } from "services";
import ChatInput from "components/ChatInput/ChatInput";
import Message from "./Message";
import styles from "./styles.module.scss";

const { Title, Text } = Typography;

function ChatMessages() {
  const user = useAuthState((state) => state.user);
  const currentChat = useChatState((state) => state.currentChat);
  const [isLoading, setIsLoading] = React.useState(false);
  const [chatTitle, setChatTitle] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const [data, setData] = React.useState([]);

  const FETCH_NUM = 20;

  React.useEffect(() => {
    setPage(1);
    setIsLoading(true);

    if (currentChat?.type === "single") {
      let recipient = {};

      currentChat?.users.forEach((u) => {
        if (u.id !== user.id) recipient = u;
      });

      // Set defaults for single chat
      setChatTitle(recipient.name);
      // setSingleChatImage(recipient.profileImage);
    }
    if (currentChat?.type === "group") setChatTitle(currentChat.name);

    ChatService.getMessages(currentChat.id, 1, FETCH_NUM).then((resposne) => {
      const { data: messages } = resposne;

      if (messages.length > 0) {
        setData(messages);
      }
    });

    setIsLoading(false);
    setPage((prevPage) => prevPage + 1);

    return () => {
      setChatTitle("");
      setData([]);
      setIsLoading(false);
      setPage(1);
    };
  }, [currentChat.id]);

  const changeChatTitle = (value) => {
    console.log(value);
    setChatTitle(value);
  };

  const loadMoreData = async () => {
    alert("Loading More Messages!");
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    const { data: messages } = await ChatService.getMessages(
      currentChat.id,
      page,
      FETCH_NUM
    );
    if (messages instanceof Array) {
      if (messages.length > 0) {
        setData((prevMessages) => [...prevMessages, ...messages]);
        setPage((prevPage) => prevPage + 1);
      } else {
        setHasMore(false);
      }
    }

    setIsLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.chatName}>
        <Title
          level={3}
          style={
            {
              // marginBottom: "60px",
            }
          }
          editable={{
            icon: <EditTwoTone style={{ fontSize: "18px" }} />,
            tooltip: "click to edit text",
            onChange: changeChatTitle,
          }}
        >
          {chatTitle}
        </Title>
      </div>

      <div className={styles.messagesContainer} id="scrollableDiv">
        {isLoading ? (
          <div style={{ width: "100%", padding: "20px" }}>
            <Skeleton active />
          </div>
        ) : (
          <div
            style={{
              height: "100%",
              overflow: "auto",
            }}
            className={styles.messages}
          >
            {data.length > 0 ? (
              <InfiniteScroll
                userWindow={false}
                scrollableTarget="scrollableDiv"
                dataLength={data.length}
                next={loadMoreData}
                inverse={true}
                hasMore={hasMore}
                style={{ display: "flex", flexDirection: "column-reverse" }}
                loader={<Skeleton paragraph={{ rows: 1 }} active />}
              >
                {data &&
                  data.map((message, i) => {
                    return (
                      <div>
                        <Message
                          previousMessage={data[i - 1]}
                          key={i}
                          message={message}
                        />
                      </div>
                    );
                  })}
              </InfiniteScroll>
            ) : (
              <Text
                style={{ color: "#bfbfbf", fontSize: "14px", fontWeight: 500 }}
              >
                No Messages
              </Text>
            )}
          </div>
        )}
      </div>
      <ChatInput />
    </div>
  );
}

export default ChatMessages;
