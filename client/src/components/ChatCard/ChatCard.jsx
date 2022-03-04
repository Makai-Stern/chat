import React from "react";

import { Typography, Avatar } from "antd";
import { UserOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import Moment from "react-moment";

import { useSocket } from "contexts/SocketProvider";
import { useChatState } from "store";
import { useAuthState } from "store";
import styles from "./styles.module.scss";

const { Text } = Typography;

function ChatCard({ chat, chatName }) {
  const socket = useSocket();
  const user = useAuthState((state) => state.user);
  const setCurrentChat = useChatState((state) => state.setCurrentChat);
  const updateChat = useChatState((state) => state.updateChat);
  const currentChat = useChatState((state) => state.currentChat);
  const activeChat = chat.id === currentChat?.id ? true : false;

  const [readByUser, setReadByUser] = React.useState(true);
  const [lastMessage, setLastMessage] = React.useState(chat.lastMessage);
  // const [chatName, setChatName] = React.useState("");
  const [singleChatImage, setSingleChatImage] = React.useState("");

  React.useEffect(() => {
    if (chat?.type === "single") {
      let recipient = {};

      chat.users.forEach((u) => {
        if (u.id !== user.id) recipient = u;
      });

      // Set defaults for single chat
      // setChatName(recipient.name);
      setSingleChatImage(recipient.profileImage);

      if (chat?.lastMessage?.user.id !== user?.id) {
        setReadByUser(chat.lastMessage?.readBy.find((u) => u.id === user?.id));
      } else {
        setReadByUser(true);
      }
    }
  }, []);

  React.useEffect(() => {
    if (lastMessage) {
      if (lastMessage.user.id !== user.id) {
        setReadByUser(chat.lastMessage?.readBy.find((u) => u.id === user?.id));
      } else {
        setReadByUser(true);
      }
    }
  }, [lastMessage]);

  React.useEffect(() => {
    setLastMessage(chat.lastMessage);
  }, [chat.lastMessage, chat]);

  React.useEffect(() => {
    if (socket) {
      socket.on("getLastMessage", (payload) => {
        console.log(chatName, "received update last message", payload.messages);
        if (payload.chat.id === chat.id) {
          // setLastMessage(payload.messages[payload.messages.length - 1]);
          updateChat(payload.chat);
        }
      });
    }
    return () => socket.off("getLastMessage");
  }, [socket]);

  const activateChat = () => {
    setCurrentChat(chat);
  };
  return (
    <div className={styles.container} onClick={activateChat}>
      {chat ? (
        <>
          {chat.type === "group" && (
            <div
              className={styles.chatCard}
              style={activeChat ? { backgroundColor: "#F9FAFB" } : {}}
            >
              <div className={styles.chatCardLeft}>
                <Avatar
                  className={styles.avatar}
                  src={chat.backgroundImage}
                  icon={<UsergroupAddOutlined />}
                  shape="square"
                  size={42}
                />

                <div className={styles.chatCardLeftItems}>
                  {/* Chat Name */}
                  <Text
                    style={{
                      fontWeight: 500,
                      color: "#434343",
                      maxWidth: "150px",
                    }}
                    ellipsis
                  >
                    {chat.name}
                  </Text>
                  <div className={styles.chatCardLeftPreview}>
                    {lastMessage ? (
                      <>
                        {/* Chat Preview */}
                        {lastMessage.type === "text" && (
                          <div className={styles.messagePreview}>
                            <Text
                              ellipsis={true}
                              style={{
                                color: "#8c8c8c",
                                fontSize: "12px",
                                maxWidth: "150px",
                              }}
                              strong={!readByUser}
                            >
                              {lastMessage.user.id !== user.id
                                ? lastMessage.user.name
                                : "You"}
                              : {lastMessage.text}
                            </Text>
                          </div>
                        )}
                        {lastMessage.type === "attachment" && (
                          <div className={styles.messagePreview}>
                            <Text
                              ellipsis={true}
                              style={{
                                color: "#8c8c8c",
                                fontSize: "12px",
                                maxWidth: "150px",
                              }}
                              strong={!readByUser}
                            >
                              {lastMessage.user.id !== user.id
                                ? lastMessage.user.name
                                : "You"}{" "}
                              Attached a file
                            </Text>
                          </div>
                        )}
                      </>
                    ) : (
                      <Text
                        ellipsis={true}
                        style={{
                          color: "#40a9ff",
                          fontSize: "12px",
                          maxWidth: "150px",
                        }}
                      >
                        New Chat
                      </Text>
                    )}
                  </div>
                </div>
              </div>
              {/* Use Moment */}
              {lastMessage?.createdAt ? (
                <Text style={{ color: "#8c8c8c", fontSize: "12px" }}>
                  <Moment fromNow ago>
                    {lastMessage.createdAt}
                  </Moment>
                </Text>
              ) : (
                <Text style={{ color: "#8c8c8c", fontSize: "12px" }}>
                  <Moment fromNow ago>
                    {chat.createdAt}
                  </Moment>
                </Text>
              )}
            </div>
          )}

          {chat.type === "single" && (
            <div
              className={styles.chatCard}
              style={activeChat ? { backgroundColor: "#F9FAFB" } : {}}
            >
              <div className={styles.chatCardLeft}>
                <Avatar
                  className={styles.avatar}
                  src={singleChatImage}
                  shape="square"
                  size={42}
                  icon={<UserOutlined />}
                >
                  {chatName}
                </Avatar>

                <div className={styles.chatCardLeftItems}>
                  {/* Chat Name */}
                  <Text
                    style={{
                      fontWeight: 500,
                      color: "#434343",
                      maxWidth: "150px",
                    }}
                    ellipsis
                  >
                    {chatName}
                  </Text>
                  <div className={styles.chatCardLeftPreview}>
                    {lastMessage ? (
                      <>
                        {/* Chat Preview */}
                        {lastMessage.type === "text" && (
                          <div className={styles.messagePreview}>
                            <Text
                              ellipsis={true}
                              style={{
                                color: "#8c8c8c",
                                fontSize: "12px",
                                maxWidth: "150px",
                              }}
                              strong={!readByUser}
                            >
                              {lastMessage.user.id !== user.id
                                ? lastMessage.user.name
                                : "You"}
                              : {lastMessage.text}
                            </Text>
                          </div>
                        )}
                        {lastMessage.type === "attachment" && (
                          <div className={styles.messagePreview}>
                            <Text
                              ellipsis={true}
                              style={{
                                color: "#8c8c8c",
                                fontSize: "12px",
                                maxWidth: "150px",
                              }}
                              strong={!readByUser}
                            >
                              {lastMessage.user.id !== user.id
                                ? lastMessage.user.name
                                : "You"}{" "}
                              Attached a file
                            </Text>
                          </div>
                        )}
                      </>
                    ) : (
                      <Text
                        ellipsis={true}
                        style={{
                          color: "#40a9ff",
                          fontSize: "12px",
                          maxWidth: "150px",
                        }}
                      >
                        New Chat
                      </Text>
                    )}
                  </div>
                </div>
              </div>
              {/* Use Moment */}
              <div style={{ height: "100%" }}>
                {lastMessage?.createdAt ? (
                  <Text style={{ color: "#8c8c8c", fontSize: "12px" }}>
                    <Moment fromNow ago>
                      {lastMessage.createdAt}
                    </Moment>
                  </Text>
                ) : (
                  <Text style={{ color: "#8c8c8c", fontSize: "12px" }}>
                    <Moment fromNow ago>
                      {chat.createdAt}
                    </Moment>
                  </Text>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        ""
      )}
    </div>
  );
}

export default ChatCard;
