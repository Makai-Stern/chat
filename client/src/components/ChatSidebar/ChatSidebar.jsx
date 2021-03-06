import React from "react";
import { Typography, Input, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { useChatState } from "store";
import { ChatService } from "services";
import ChatSearch from "components/ChatSearch/ChatSearch";
import AddChatDrawer from "components/AddChatDrawer/AddChatDrawer";
// import PinnedChatsSection from "components/PinnedChatsSection/PinnedChatsSection";
import AllChatsSection from "components/AllChatsSection/AllChatsSection";
import styles from "./styles.module.scss";

const { Title } = Typography;
const { Search } = Input;

function ChatSidebar() {
  const chatCount = useChatState((state) => state.chatCount);
  const setChatCount = useChatState((state) => state.setChatCount);

  const onSearch = (value) => console.log(value);

  // Chat Drawer State (state had to be outside, so that user list can be cleared)
  const [users, setUsers] = React.useState([]);
  const [visible, setVisible] = React.useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
    setUsers([]);
  };

  // get chat count
  React.useEffect(() => {
    ChatService.getChatCount().then((response) => {
      const { data } = response;
      setChatCount(data);
    });
  }, []);

  return (
    <div className={styles.sidebar} style={{ width: "341px" }}>
      <div className={styles.sidebarSpaceBetween}>
        <Title level={5}>Chats ({chatCount})</Title>
        <Button onClick={showDrawer} type="link" icon={<PlusOutlined />} />
        <AddChatDrawer
          visible={visible}
          showDrawer={showDrawer}
          onClose={onClose}
          users={users}
          setUsers={setUsers}
        />
      </div>
      <div className={styles.sidebarSpaceBetween}>
        {/* <Search
            placeholder="Search for a chat..."
            onSearch={onSearch}
            style={{ width: 300 }}
          /> */}
        {/* <ChatSearch style={{ width: 300 }} /> */}
      </div>
      {/* <PinnedChatsSection /> */}
      <AllChatsSection />
    </div>
  );
}

export default ChatSidebar;
