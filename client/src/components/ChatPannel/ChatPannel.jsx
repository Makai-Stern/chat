import React from "react";

import { Typography, Tabs, Image, Button } from "antd";
import {
  FilePdfTwoTone,
  FileTextTwoTone,
  FileExcelTwoTone,
  FileUnknownTwoTone,
  FileWordTwoTone,
  FilePptTwoTone,
  FileZipTwoTone,
} from "@ant-design/icons";
import { Resizable } from "re-resizable";

import MemberCard from "components/MemberCard/MemberCard";
import styles from "./styles.module.scss";

const { TabPane } = Tabs;
const { Title, Text } = Typography;

const members = [
  {
    id: 1,
    name: "James Roland",
    username: "james.roland",
    profileImage:
      "https://images.pexels.com/photos/3771045/pexels-photo-3771045.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    id: 2,
    name: "Sarah Jones",
    username: "sarah.jones",
    profileImage:
      "https://images.pexels.com/photos/4075524/pexels-photo-4075524.png?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    id: 3,
    name: "John Doe",
    username: "john.doe",
    profileImage:
      "https://images.pexels.com/photos/7539488/pexels-photo-7539488.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
];

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
      {/* Members */}
      <div className={styles.section} style={{ marginBottom: "50px" }}>
        <Title
          level={5}
          style={{ color: "#595959", fontSize: "14px", marginBottom: "15px" }}
        >
          Group Image
        </Title>

        <div className={styles.chatBgImageContainer}>
          <Image
            style={{
              objectFit: "cover",
              width: "100%",
              height: "150px",
              borderRadius: "10px",
              marginRight: "10px",
            }}
            src={
              "https://images.pexels.com/photos/3184433/pexels-photo-3184433.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
            }
          />
        </div>
      </div>
      {/* Members */}
      <div className={styles.section} style={{ marginBottom: "50px" }}>
        <Title level={5} style={{ color: "#595959", fontSize: "14px" }}>
          Members
        </Title>

        <div>
          {members.map((user) => (
            <MemberCard key={user.id} user={user} />
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <Title level={5} style={{ color: "#595959", fontSize: "14px" }}>
          Attachments
        </Title>
        <div
          style={{
            marginTop: "15px",
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <Image
            src={
              "https://images.pexels.com/photos/10533350/pexels-photo-10533350.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
            }
            style={{
              objectFit: "cover",
              width: "70px",
              height: "70px",
              borderRadius: "10px",
            }}
          />
          <div
            style={{
              width: "70px",
              height: "70px",
              background: "#fafafa",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #f5f5f5",
            }}
          >
            <FilePdfTwoTone style={{ fontSize: "25px" }} />
          </div>
          <Image
            src={
              "https://images.pexels.com/photos/9986405/pexels-photo-9986405.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
            }
            style={{
              objectFit: "cover",
              width: "70px",
              height: "70px",
              borderRadius: "10px",
            }}
          />

          <div
            style={{
              width: "70px",
              height: "70px",
              // background: "#fdfdfd",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px dashed #ede6e6",
            }}
          >
            <Text style={{ fontWeight: 500 }}>+7</Text>
          </div>
        </div>
      </div>
    </Resizable>
  );
}

export default ChatPannel;
