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
  const [attachments, setAttachments] = React.useState([]);
  // files for chat input
  const [files, setFiles] = React.useState([]);

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

    if (currentChat.id) {
      ChatService.getMessages(currentChat.id, 1, FETCH_NUM).then((resposne) => {
        const { data: messages } = resposne;

        if (messages instanceof Array) {
          if (messages.length > 0) {
            setData(messages);
          }
        }
      });
    }

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

  const addMessages = (messages) => {
    // message can be an obj or a list
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

  return (
    <div className={styles.container}>
      <div className={styles.chatName}>
        {currentChat?.type === "group" && (
          <Title
            level={3}
            editable={{
              icon: <EditTwoTone style={{ fontSize: "18px" }} />,
              tooltip: "click to edit text",
              onChange: changeChatTitle,
            }}
          >
            {chatTitle}
          </Title>
        )}

        {currentChat?.type === "single" && <Title level={3}>{chatTitle}</Title>}
      </div>

      <div className={styles.messagesContainer}>
        {isLoading ? (
          <div style={{ width: "100%", padding: "20px" }}>
            <Skeleton active />
          </div>
        ) : (
          <div
            id="scrollableDiv"
            style={{
              height: "100%",
            }}
            className={styles.messages}
          >
            {data.length > 0 ? (
              <InfiniteScroll
                scrollableTarget="scrollableDiv"
                dataLength={data.length}
                next={loadMoreData}
                inverse={true}
                hasMore={hasMore}
                style={{ display: "flex", flexDirection: "column-reverse" }}
                loader={<Skeleton paragraph={{ rows: 1 }} active />}
              >
                {data &&
                  data.map((container, i) => {
                    let key = Object.keys(container)[0];
                    return (
                      <div key={i}>
                        <h5
                          style={{
                            width: "100%",
                            textAlign: "center",
                            color: "#8c8c8c",
                            marginTop: "30px",
                            marginBottom: "20px",
                          }}
                        >
                          {key}
                        </h5>

                        {container[key].map((message, i) => (
                          // Check message type
                          <Message
                            previousMessage={container[key][i - 1]}
                            key={i}
                            message={message}
                          />
                        ))}
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
      <ChatInput
        addMessages={addMessages}
        handleFileRemove={handleFileRemove}
        handleFileChange={handleFileChange}
        setAttachments={setAttachments}
        files={files}
      />
    </div>
  );
}

export default ChatMessages;
