import React from "react";
import Header from "components/Header/Header";
import ChatSidebar from "components/ChatSidebar/ChatSidebar";
import Chat from "components/Chat/Chat";
import styles from "./styles.module.css";

function Home() {
  return (
    <div>
      <Header />
      <div className={styles.chat}>
        <ChatSidebar />
        <Chat />
      </div>
    </div>
  );
}

export default Home;
