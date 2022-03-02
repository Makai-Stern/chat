import React from "react";
import { useNavigate } from "react-router-dom";
import { Menu, message } from "antd";
import { SettingTwoTone, LeftCircleTwoTone } from "@ant-design/icons";

import { useChatState } from "store";

function HeaderMenu({ logout, showUpdateDrawer, show }) {
  const navigate = useNavigate();
  const setChats = useChatState((state) => state.setChats);
  const setChatCount = useChatState((state) => state.setChatCount);
  const setCurrentChat = useChatState((state) => state.setCurrentChat);

  const handleLogout = async () => {
    await logout();
    message.success("You have been logged out.");
    navigate("/login");
    setChatCount(0);
    setChats([]);
    setCurrentChat([]);
  };

  return (
    <Menu onClick={show}>
      <Menu.Item key={1} icon={<SettingTwoTone />} onClick={showUpdateDrawer}>
        Update Account
      </Menu.Item>
      <Menu.Item key={2} icon={<LeftCircleTwoTone />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );
}

export default HeaderMenu;
