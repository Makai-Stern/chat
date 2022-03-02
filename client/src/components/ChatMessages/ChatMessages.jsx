import React from "react";

import { Typography, Skeleton, Spin } from "antd";
import { EditTwoTone } from "@ant-design/icons";

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
  const [showChatLoader, setShowChatLoader] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [files, setFiles] = React.useState([]);

  const FETCH_NUM = 15;

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

    if (currentChat?.id) {
      ChatService.getMessages(currentChat.id, 1, FETCH_NUM).then((response) => {
        const { data: messages } = response;
        if (messages instanceof Array) {
          if (messages.length > 0) {
            setData(messages);
          }
        }
      });
    }

    setPage((prevPage) => prevPage + 1);
    setIsLoading(false);

    return () => {
      setChatTitle("");
      setData([]);
      setIsLoading(false);
      setPage(1);
      setHasMore(true);
    };
  }, [currentChat?.id]);

  const changeChatTitle = (value) => {
    console.log(value);
    setChatTitle(value);
  };

  const loadMoreData = async () => {
    if (isLoading || showChatLoader) {
      return;
    }

    setShowChatLoader(true);
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

    setShowChatLoader(false);
  };

  const addMessages = (messages) => {
    setData((prevMessages) => [...messages, ...prevMessages]);
  };

  const handleFileRemove = (index) => {
    let currentFiles = [...files];
    currentFiles.splice(index, 1);
    setFiles(currentFiles);
  };

  const handleFileChange = (e) => {
    const newFiles = e.target.files;
    if (newFiles) {
      setFiles((prevFiles) => [...newFiles, ...prevFiles]);
    }
    console.log(newFiles);
  };

  const handleScroll = async (e) => {
    // const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    // if (bottom) {}
    // need state to see last scroll direction, so that if user is still at top the request wont go until the user scrolls on top again

    if (hasMore) {
      const top =
        e.target.scrollHeight + e.target.scrollTop === e.target.clientHeight ||
        e.target.scrollHeight + e.target.scrollTop - 500 <
          e.target.clientHeight ||
        e.target.scrollHeight + e.target.scrollTop ===
          e.target.clientHeight + 1; // give some leeway

      if (top) {
        await loadMoreData();
      }
    }
  };

  return (
    <div
      className={styles.container}
      style={currentChat?.id ? {} : { borderRight: "none" }}
    >
      <div className={styles.chatName}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Title
            level={3}
            style={{
              // marginBottom: "60px",
              marginRight: "10px",
            }}
            editable={
              currentChat.type === "group"
                ? {
                    icon: <EditTwoTone style={{ fontSize: "18px" }} />,
                    tooltip: "click to edit text",
                    onChange: changeChatTitle,
                  }
                : false
            }
          >
            {chatTitle}
          </Title>
          {showChatLoader && <Spin />}
        </div>

        {!isLoading && data.length === 0 && (
          <Text style={{ color: "#bfbfbf", fontSize: "14px", fontWeight: 500 }}>
            No Messages
          </Text>
        )}
      </div>

      <div className={styles.messagesContainer}>
        {isLoading ? (
          <div style={{ width: "100%", paddingTop: "20px" }}>
            <Skeleton active />
          </div>
        ) : (
          <div
            onScroll={handleScroll}
            style={{
              height: "100%",
              // overflow: "auto",
            }}
            className={styles.messages}
          >
            {data.length > 0 && (
              <div
                style={{ display: "flex", flexDirection: "column-reverse" }}
                // loader={<Skeleton paragraph={{ rows: 1 }} active />}
              >
                {data &&
                  data.map((message, i) => {
                    return (
                      <div key={i}>
                        <Message
                          previousMessage={data[i - 1]}
                          nextMessage={data[i + 1]}
                          key={i}
                          message={message}
                        />
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}
      </div>
      <ChatInput
        addMessages={addMessages}
        handleFileRemove={handleFileRemove}
        handleFileChange={handleFileChange}
        files={files}
        setFiles={setFiles}
      />
    </div>
  );
}

export default ChatMessages;
