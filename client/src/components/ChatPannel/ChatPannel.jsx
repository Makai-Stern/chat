import React from "react";

import { Typography } from "antd";
import { Resizable } from "re-resizable";

import styles from "./styles.module.scss";

function ChatPannel() {
  return (
    <Resizable
      className={styles.container}
      enable={{
        top: false,
        right: false,
        bottom: false,
        left: true,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false,
      }}
    >
      Chat Pannel
    </Resizable>
  );
}

export default ChatPannel;
