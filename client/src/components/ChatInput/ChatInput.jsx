import React from "react";

import { Input, Button } from "antd";
import { PaperClipOutlined, SendOutlined } from "@ant-design/icons";

import styles from "./styles.module.scss";

function ChatInput() {
  const [text, setText] = React.useState("");
  const [attachments, setAttachmets] = React.useState([]);

  const removeAttachment = () => {};
  const handleSubmit = async () => {};
  // Need to add x to input

  return (
    <div className={styles.chatInputContainer}>
      <PaperClipOutlined style={{ fontSize: "20px", color: "#595959" }} />

      <Input
        style={{
          width: "calc(100% - 200px)",
          borderRadius: "8px",
          borderColor: "rgb(229 228 228)",
        }}
        placeholder="Send a message..."
        defaultValue=""
      />
      <Button icon={<SendOutlined />}>Send</Button>
    </div>
  );
}

export default ChatInput;
