import React from "react";
import { useNavigate } from "react-router-dom";
import { Menu, message } from "antd";
import { DownOutlined } from "@ant-design/icons";

function HeaderMenu({ logout }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    message.success("You have been logged out.");
    navigate("/login");
  };

  return (
    <Menu>
      <Menu.Item>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.antgroup.com"
        >
          1st menu item
        </a>
      </Menu.Item>
      <Menu.Item icon={<DownOutlined />} disabled>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.aliyun.com"
        >
          2nd menu item (disabled)
        </a>
      </Menu.Item>
      <Menu.Item disabled>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.luohanacademy.com"
        >
          3rd menu item (disabled)
        </a>
      </Menu.Item>
      <Menu.Item danger onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );
}

export default HeaderMenu;
