import React from "react";

import { Input, Button, message } from "antd";
import { SendOutlined } from "@ant-design/icons";

import { useSocket } from "contexts/SocketProvider";
import { useAuthState } from "store";
import { MessageService } from "services";
import { useChatState } from "store";
import styles from "./styles.module.scss";
import FileUploadPin from "components/FileUploadPin/FileUploadPin";
import FileCardContainer from "components/FileCard/FileCardContainer";

function ChatInput({
  addMessages,
  handleFileRemove,
  handleFileChange,
  files,
  setFiles,
}) {
  const user = useAuthState((state) => state.user);
  const socket = useSocket();
  const currentChat = useChatState((state) => state.currentChat);
  const [text, setText] = React.useState("");
  const addAttachments = useChatState((state) => state.addAttachments);

  const handleTextChange = (event) => {
    const currentText = event.target.value;
    setText(currentText);
  };

  const sendMessageToSocket = (messages) => {
    const payload = { chat: currentChat, user, messages };
    socket.emit("sendMessage", payload);
  };

  const handleSubmit = async () => {
    if (Object.keys(currentChat).length === 0) return;
    if ((!text || text.match(/^ *$/) !== null) && !files) {
      message.error("Your message is missing text.");
      return;
    }

    const formData = new FormData();
    formData.append("text", text);
    formData.append("chat_id", currentChat?.id);

    // Check if there is a File
    if (files.length > 0) {
      files.forEach((file) => {
        formData.append("attachments", file);
      });
    }

    const response = await MessageService.post(formData);
    const messages = response.data;

    if (messages) {
      addMessages(messages);
      sendMessageToSocket(messages);

      let attachments = [];
      messages.forEach((m) => {
        if (m.attachment) {
          attachments.push(m.attachment);
        }
      });
      addAttachments(attachments);
      // Reset the state
      setText("");
      setFiles([]);
    } else {
      message.error("We are experiencing issues. Please try again.");
    }
  };

  return (
    <>
      {files.length > 0 && (
        <FileCardContainer files={files} handleFileRemove={handleFileRemove} />
      )}
      <div className={styles.chatInputContainer}>
        <FileUploadPin
          handleFileChange={handleFileChange}
          disabled={Object.keys(currentChat).length === 0}
        />

        <Input.TextArea
          disabled={Object.keys(currentChat).length === 0}
          allowClear
          style={{
            width: "calc(100% - 200px)",
            borderRadius: "8px",
            borderColor: "rgb(229 228 228)",
          }}
          autoSize={{ minRows: 1, maxRows: 2 }}
          placeholder="Send a message..."
          defaultValue=""
          value={text}
          onChange={handleTextChange}
        />

        <Button
          icon={<SendOutlined />}
          onClick={handleSubmit}
          disabled={Object.keys(currentChat).length === 0}
        >
          Send
        </Button>
      </div>
    </>
  );
}

export default ChatInput;
