import React from "react";
import { useNavigate } from "react-router-dom";

import { Typography, Button, Avatar, Dropdown, Divider, Image } from "antd";
import { MessageTwoTone, DownOutlined, UserOutlined } from "@ant-design/icons";

import { useAuthState } from "store";
import HeaderMenu from "./HeaderMenu";
import styles from "./styles.module.css";

function Header() {
  const navigate = useNavigate();
  let pathname = window.location.pathname;
  const user = useAuthState((state) => state.user);
  const logout = useAuthState((state) => state.logout);

  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <MessageTwoTone style={{ fontSize: "25px", marginRight: "8px" }} />

        <Typography.Text
          style={{ fontWeight: 500, color: "rgb(24, 144, 255)" }}
        >
          Messenger
        </Typography.Text>
      </div>

      {/* should check path and if logged in */}
      {pathname.toLowerCase() === "/login" && (
        <Button onClick={() => navigate("/register")}>Sign Up</Button>
      )}

      {pathname.toLowerCase() === "/register" && (
        <Button onClick={() => navigate("/login")}>Sign in</Button>
      )}

      {pathname.toLowerCase() === "/" && (
        <div>
          {/* if you put a component in the src, the Avatar will not fallback to it's children */}
          <Avatar
            icon={<UserOutlined />}
            src={user?.profileImage}
            style={{
              backgroundColor: "#eb7c1ceb",
              verticalAlign: "middle",
              // border: "1px solid #1890ff",
            }}
            gap={4}
          />

          <Divider style={{ borderColor: "#CDCDCD" }} type="vertical" />

          <Dropdown overlay={() => <HeaderMenu logout={logout} />}>
            <a
              style={{ color: "#434343", fontWeight: "500" }}
              onClick={(e) => e.preventDefault()}
            >
              <span>{user?.name}</span> <DownOutlined />
            </a>
          </Dropdown>
        </div>
      )}
    </div>
  );
}

export default Header;
