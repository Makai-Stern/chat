import React from "react";

import { Typography } from "antd";
import { EditTwoTone } from "@ant-design/icons";

import { useChatState } from "store";
import { useAuthState } from "store";
import { ChatService } from "services";
import ChatInput from "components/ChatInput/ChatInput";
import Message from "./Message";
import styles from "./styles.module.scss";

const { Title } = Typography;

const testMessages = [
  {
    "Tuesday April 7th at 1:21 PM": [
      {
        id: "1",
        type: "Text",
        text: "Awesome! It's going to be an awesome deal!",
        attachment: "",
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
        attachment: "",
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
  const user = useAuthState((state) => state.user);
  const currentChat = useChatState((state) => state.currentChat);
  const [isLoading, setIsLoading] = React.useState(false);
  const [chatTitle, setChatTitle] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    setPage(1);

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

    ChatService.getMessages(currentChat.id, 1, 20).then((resposne) => {
      const { data: messages } = resposne;

      if (messages.length > 0) {
        setData(messages);
      }
    });

    return () => {
      setChatTitle("");
      setData([]);
    };
  }, [currentChat.id]);

  const changeChatTitle = (value) => {
    console.log(value);
    setChatTitle(value);
  };

  const loadMoreData = async () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    const { data: messages } = await ChatService.getMessages(
      currentChat.id,
      page,
      20
    );
    console.log("Messages", messages);
    if (messages.length > 0) {
      setData((prevMessages) => [...prevMessages, ...messages]);
      setPage((prevPage) => prevPage + 1);
    } else {
      setHasMore(false);
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

      <div className={styles.messagesContainer}>
        {data &&
          data.map((container, i) => {
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
                  <>
                    {console.log(message)}
                    <Message
                      previousMessage={container[key][i - 1]}
                      key={i}
                      message={message}
                    />
                  </>
                ))}
              </div>
            );
          })}
      </div>
      <ChatInput />
    </div>
  );
}

export default ChatMessages;
