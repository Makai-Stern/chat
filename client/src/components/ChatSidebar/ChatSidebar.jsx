import React from "react";
import { Typography, Input, Button } from "antd";
import { PlusOutlined, PushpinFilled } from "@ant-design/icons";

import AddChatDrawer from "components/AddChatDrawer/AddChatDrawer";
import PinnedChatsSection from "components/PinnedChatsSection/PinnedChatsSection";
import AllChatsSection from "components/AllChatsSection/AllChatsSection";
import styles from "./styles.module.scss";

const { Title } = Typography;
const { Search } = Input;

function ChatSidebar() {
  let chatCount = "27";
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

  return (
    <div className={styles.sidebar}>
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
        <div>
          <Search
            placeholder="Search for a chat..."
            onSearch={onSearch}
            style={{ width: 300 }}
          />
        </div>
      </div>
      {/* <PinnedChatsSection /> */}
      <AllChatsSection />
    </div>
  );
}

export default ChatSidebar;
