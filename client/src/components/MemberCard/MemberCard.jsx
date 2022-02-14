import React from "react";

import { Avatar, Typography, Tag, Button, Popconfirm, message } from "antd";
import { MessageOutlined } from "@ant-design/icons";

import styles from "./styles.module.scss";

const { Text } = Typography;

function MemberCard({ user, style }) {
  return (
    <div className={styles.memberCardContainer} style={style}>
      <div className={styles.memberCardLeft}>
        <Avatar
          src={user.profileImage}
          shape="square"
          size="large"
          styles={{ borderRadius: "10px" }}
        />

        <div className={styles.memberCardLeftMiddle}>
          <Text style={{ fontWeight: 500 }}>
            {user.name}{" "}
            {user.id === 1 && (
              <Tag color="geekblue" style={{ marginLeft: "5px" }}>
                Admin
              </Tag>
            )}
            {user.id === 3 && <Tag style={{ marginLeft: "5px" }}>You</Tag>}
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
