import React from "react";

import { Typography } from "antd";
import { EditTwoTone } from "@ant-design/icons";

import Message from "./Message";
import styles from "./styles.module.scss";

const { Title } = Typography;

const messages = [
  {
    "Tuesday April 7th at 1:21 PM": [
      {
        id: "1",
        type: "Text",
        text: "Awesome! It's going to be an awesome deal!",
        attachment: '',
        createdAt: "Tuesday April 7th at 1:21 PM",
        user: {
          id: "1",
          username: "jesliesmith",
          name: "Jeslie Smith",
          profileImage:
            "https://images.pexels.com/photos/9972792/pexels-photo-9972792.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        },
      },
      {
        id: "2",
        type: "Text",
        text: "I reviewed the documents",
        attachment: '',
        createdAt: "Tuesday April 7th ar 1:21 PM",
        user: {
          id: "1",
          username: "jesliesmith",
          name: "Jeslie Smith",
          profileImage:
            "https://images.pexels.com/photos/9972792/pexels-photo-9972792.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        },
      },
      {
        id: "3",
        type: "Attachment",
        text: "",
        attachment:
          "https://images.pexels.com/photos/10435879/pexels-photo-10435879.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        createdAt: "Tuesday April 7th ar 1:21 PM",
        user: {
          id: "1",
          username: "jesliesmith",
          name: "Jeslie Smith",
          profileImage:
            "https://images.pexels.com/photos/9972792/pexels-photo-9972792.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        },
      },
      {
        id: "8",
        type: "Attachment",
        text: "",
        attachment:
          "https://images.pexels.com/photos/10435879/test-doc.pptx?auto=compress&cs=tinysrgb&dpr=1&w=500",
        createdAt: "Tuesday April 7th ar 1:21 PM",
        user: {
          id: "1",
          username: "jesliesmith",
          name: "Jeslie Smith",
          profileImage:
            "https://images.pexels.com/photos/9972792/pexels-photo-9972792.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        },
      },
    ],
  },
  {
    "Tuesday April 8th at 12:03 PM": [
      {
        id: "4",
        type: "Text",
        text: "Alright, I'll take a look as well",
        attachment: "",
        createdAt: "Tuesday April 8th ar 1:21 PM",
        user: {
          id: "activeUser",
          username: "activeUser",
          name: "Active User (You)",
          profileImage:
            "https://images.pexels.com/photos/10101703/pexels-photo-10101703.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        },
      },
      {
        id: "2",
        type: "Text",
        text: "Thanks btw",
        attachments: [],
        createdAt: "Tuesday April 8th ar 1:21 PM",
        user: {
          id: "activeUser",
          username: "activeUser",
          name: "Active User (You)",
          profileImage:
            "https://images.pexels.com/photos/10101703/pexels-photo-10101703.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        },
      },
      {
        id: "3",
        type: "Attachment",
        text: "",
        attachment:
          "https://images.pexels.com/photos/9980100/pexels-photo-9980100.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260",
        createdAt: "Tuesday April 8th ar 1:21 PM",
        user: {
          id: "activeUser",
          username: "activeUser",
          name: "Active User (You)",
          profileImage:
            "https://images.pexels.com/photos/10101703/pexels-photo-10101703.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        },
      },
    ],
  },
];
function ChatMessages() {
  let [chatTitle, setChatTitle] = React.useState("Scouting Group");

  const changeChatTitle = (value) => {
    console.log(value);
    setChatTitle(value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.chatName}>
        <Title
          level={3}
          style={{
            marginBottom: "60px",
          }}
          editable={{
            icon: <EditTwoTone style={{ fontSize: "18px" }} />,
            tooltip: "click to edit text",
            onChange: changeChatTitle,
          }}
        >
          {chatTitle}
        </Title>
      </div>

      {messages &&
        messages.map((container, i) => {
          let key = Object.keys(container)[0];
          return (
            <div>
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
    </div>
  );
}

export default ChatMessages;
