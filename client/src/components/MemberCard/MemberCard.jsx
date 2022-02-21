import React from "react";

import { Avatar, Typography, Tag, Button, Popconfirm } from "antd";
import { MessageOutlined, UserOutlined } from "@ant-design/icons";

import { useAuthState } from "store";
import styles from "./styles.module.scss";

const { Text } = Typography;

function MemberCard({ chat, user, style }) {
  const currentUser = useAuthState((state) => state.user);
  console.log(chat);
  return (
    <div className={styles.memberCardContainer} style={style}>
      <div className={styles.memberCardLeft}>
        <Avatar
          src={user.profileImage}
          shape="square"
          size="large"
          icon={<UserOutlined />}
          styles={{ borderRadius: "10px" }}
        />

        <div className={styles.memberCardLeftMiddle}>
          <Text style={{ fontWeight: 500 }}>
            {user.name}{" "}
            {user.id === chat?.owner?.id && (
              <Tag color="geekblue" style={{ marginLeft: "5px" }}>
                Owner
              </Tag>
            )}
            {user.id === currentUser?.id && (
              <Tag style={{ marginLeft: "5px" }}>You</Tag>
            )}
          </Text>
          <Text style={{ color: "#bfbfbf" }}>@{user.username}</Text>
        </div>
      </div>

      {user.id !== 3 && (
        <Popconfirm
          placement="bottomRight"
          title={`Create a new chat with ${user.name}?`}
          onConfirm={null}
          okText="Yes"
          cancelText="No"
        >
          <Button icon={<MessageOutlined />} />
        </Popconfirm>
      )}
    </div>
  );
}

export default MemberCard;
