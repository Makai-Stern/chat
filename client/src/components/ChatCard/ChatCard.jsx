import React from "react";

import { Typography, Avatar, Image } from "antd";

import styles from "./styles.module.scss";

const { Text } = Typography;

function ChatCard({ chat }) {
  const activeChat = chat.id === "active" ? true : false;
  const chatUserCount = 4;
  const avatarBackgroundColor = "#1890ff";
  const avatarTextColor = "#1890ff";

  return (
    <div className={styles.container}>
      {chat ? (
        <>
          {chat.type === "Group" && (
            <div
              className={styles.chatCard}
              style={activeChat ? { backgroundColor: "#F9FAFB" } : {}}
            >
              <div className={styles.chatCardLeft}>
                {/* Chat Avatar */}
                {chat.backgroundImage ? (
                  <Avatar
                    className={styles.avatar}
                    src={chat.backgroundImage}
                    shape="square"
                    size={42}
                  />
                ) : (
                  <Avatar
                    className={styles.avatar}
                    style={{ backgroundColor: avatarBackgroundColor }}
                    shape="square"
                    size={42}
                  >
                    {chatUserCount}
                  </Avatar>
                )}
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
                    {/* Chat Preview */}
                    {chat.lastMessage.type === "Text" && (
                      <div className={styles.messagePreview}>
                        <Text
                          ellipsis={true}
                          style={{
                            color: "#8c8c8c",
                            fontSize: "12px",
                            maxWidth: "150px",
                          }}
                        >
                          {chat.lastMessage.user.name}: {chat.lastMessage.text}
                        </Text>
                      </div>
                    )}
                    {chat.lastMessage.type === "Attachment" && (
                      <div className={styles.messagePreview}>
                        <Text
                          ellipsis={true}
                          style={{
                            color: "#8c8c8c",
                            fontSize: "12px",
                            maxWidth: "150px",
                          }}
                        >
                          {/* {chat.lastMessage.user.name} Attached a file */}
                          New file attached
                        </Text>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* Use Moment */}
              {chat.lastMessage.createdAt && (
                <Text style={{ color: "#8c8c8c", fontSize: "12px" }}>4h</Text>
              )}
            </div>
          )}

          {chat.type === "Single" && (
            <div className={styles.chatCard}>
              <div className={styles.chatCardLeft}>
                <Avatar
                  className={styles.avatar}
                  src={chat.users[0].profileImage}
                  style={{ backgroundColor: avatarBackgroundColor }}
                  shape="square"
                  size={42}
                >
                  {chat.users[0].name[0]}
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
                    {chat.name}
                  </Text>
                  <div className={styles.chatCardLeftPreview}>
                    {/* Chat Preview */}
                    {chat.lastMessage.type === "Text" && (
                      <div className={styles.messagePreview}>
                        <Text
                          ellipsis={true}
                          style={{
                            color: "#8c8c8c",
                            fontSize: "12px",
                            maxWidth: "150px",
                          }}
                        >
                          {chat.lastMessage.user.name}: {chat.lastMessage.text}
                        </Text>
                      </div>
                    )}
                    {chat.lastMessage.type === "Attachment" && (
                      <div className={styles.messagePreview}>
                        <Text
                          ellipsis={true}
                          style={{
                            color: "#8c8c8c",
                            fontSize: "12px",
                            maxWidth: "150px",
                          }}
                        >
                          {chat.lastMessage.user.name} Attached a file
                        </Text>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* Use Moment */}
              <div style={{ height: "100%" }}>
                {chat.lastMessage.createdAt && (
                  <Text style={{ color: "#8c8c8c", fontSize: "12px" }}>
                    12m
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
