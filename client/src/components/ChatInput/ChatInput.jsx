import React from "react";

import { Input, Button } from "antd";
import { PaperClipOutlined, SendOutlined } from "@ant-design/icons";

import styles from "./styles.module.scss";

function ChatInput() {
  return (
    <div className={styles.chatInputContainer}>
      <PaperClipOutlined style={{ fontSize: "20px", color: "#595959" }} />

      <Input
        style={{
          width: "calc(100% - 200px)",
          borderRadius: "8px",
          borderColor: "rgb(229 228 228)",
        }}
        defaultValue="https://ant.design"
      />
      <Button type="primary" icon={<SendOutlined />}>
        Send
      </Button>
    </div>
  );
}

export default ChatInput;
