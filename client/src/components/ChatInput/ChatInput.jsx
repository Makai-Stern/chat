import React from "react";

import { Input, Button, message } from "antd";
import { SendOutlined } from "@ant-design/icons";

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
  const currentChat = useChatState((state) => state.currentChat);
  const [text, setText] = React.useState("");
  const addAttachments = useChatState((state) => state.addAttachments);

  function handleTextChange(event) {
    const currentText = event.target.value;
    setText(currentText);
  }

  const handleSubmit = async () => {
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
      // Send Message to Socket Server
      // socket.emit('addMessage', message)
      // add files to currentChat
      // if (files.length > 0) {
      //   addAttachmets(files);
      // }
      let attachments = [];
      messages.forEach((m) => {
        if (m.attachment) {
          attachments.push(m.attachment);
        }
      });
      addAttachments(attachments);
      console.log(attachments);
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
        <FileUploadPin handleFileChange={handleFileChange} />

        <Input.TextArea
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

        <Button icon={<SendOutlined />} onClick={handleSubmit}>
          Send
        </Button>
      </div>
    </>
  );
}

export default ChatInput;
