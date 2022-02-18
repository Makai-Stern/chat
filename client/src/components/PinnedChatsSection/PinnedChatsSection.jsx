import React from "react";

import { Typography } from "antd";
import { PushpinFilled } from "@ant-design/icons";

import ChatCard from "components/ChatCard/ChatCard";
import styles from "./styles.module.scss";

const { Text } = Typography;

const chats = [
  {
    id: "active",
    type: "Group",
    name: "Scouting Group",
    backgroundImage:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    pinned: true,
    lastMessage: {
      id: "2",
      text: "Sounds good!",
      type: "Attachment",
      user: {
        id: "23",
        username: "Leo",
        name: "Leonardo Olive",
        profileImage:
          "https://images.pexels.com/photos/819530/pexels-photo-819530.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      },
      createdAt: "2022-10-01",
      attachments: [
        "https://vetstreet-brightspot.s3.amazonaws.com/d5/a490b0a8af11e0a0d50050568d634f/file/nova-scotia-duck-tolling-retriever-4-645mk070411.jpg",
      ],
    },
    users: [
      {
        id: "23",
        username: "leo",
        name: "Leonardo Olive",
        profileImage:
          "https://images.pexels.com/photos/819530/pexels-photo-819530.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      },
      {
        id: "18",
        username: "miranda",
        name: "Miranda Cosgrave",
        profileImage:
          "https://images.pexels.com/photos/9416738/pexels-photo-9416738.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      },
      {
        id: "1",
        username: "You",
        profileImage:
          "https://images.pexels.com/photos/1367192/pexels-photo-1367192.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      },
    ],
  },
  {
    id: "2",
    type: "Single",
    name: "Leslie Laurens",
    pinned: true,
    lastMessage: {
      id: "2",
      text: "Yup, I think we should do that",
      type: "Text",
      user: {
        id: "24",
        name: "Leslie Laurens",
        username: "leslielaurens1",
      },
      createdAt: "2022-10-01",
      attachments: [],
    },
    users: [
      {
        id: "23",
        username: "Leslie Laurens",
        name: "Leslie Laurens",
        profileImage:
          "https://images.unsplash.com/photo-1645037349367-ccb170b45f7a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1412&q=80",
      },
      {
        id: "1",
        username: "You",
        name: "You",
        profileImage:
          "https://images.pexels.com/photos/1367192/pexels-photo-1367192.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      },
    ],
  },
  {
    id: "3",
    type: "Group",
    name: "R&D Group",
    backgroundImage: "",
    pinned: true,
    lastMessage: {
      id: "2",
      text: "Sounds good!",
      type: "Text",
      user: {
        id: "23",
        name: "Leonardo Olive",
        username: "Leo",
      },
      createdAt: "2022-10-01",
      attachments: [],
    },
    users: [
      {
        id: "23",
        username: "leo",
        profileImage:
          "https://images.pexels.com/photos/819530/pexels-photo-819530.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      },
      {
        id: "18",
        username: "miranda",
        profileImage:
          "https://images.pexels.com/photos/9416738/pexels-photo-9416738.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      },
      {
        id: "1",
        username: "You",
        profileImage:
          "https://images.pexels.com/photos/1367192/pexels-photo-1367192.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      },
    ],
  },
  {
    id: "3",
    type: "Group",
    name: "R&D Group",
    backgroundImage: "",
    pinned: true,
    lastMessage: {
      id: "2",
      text: "Sounds good!",
      type: "Text",
      user: {
        id: "23",
        name: "Leonardo Olive",
        username: "Leo",
      },
      createdAt: "2022-10-01",
      attachments: [],
    },
    users: [
      {
        id: "23",
        username: "leo",
        profileImage:
          "https://images.pexels.com/photos/819530/pexels-photo-819530.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      },
      {
        id: "18",
        username: "miranda",
        profileImage:
          "https://images.pexels.com/photos/9416738/pexels-photo-9416738.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      },
      {
        id: "1",
        username: "You",
        profileImage:
          "https://images.pexels.com/photos/1367192/pexels-photo-1367192.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      },
    ],
  },
  {
    id: "3",
    type: "Group",
    name: "R&D Group",
    backgroundImage: "",
    pinned: true,
    lastMessage: {
      id: "2",
      text: "Sounds good!",
      type: "Text",
      user: {
        id: "23",
        name: "Leonardo Olive",
        username: "Leo",
      },
      createdAt: "2022-10-01",
      attachments: [],
    },
    users: [
      {
        id: "23",
        username: "leo",
        profileImage:
          "https://images.pexels.com/photos/819530/pexels-photo-819530.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      },
      {
        id: "18",
        username: "miranda",
        profileImage:
          "https://images.pexels.com/photos/9416738/pexels-photo-9416738.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      },
      {
        id: "1",
        username: "You",
        profileImage:
          "https://images.pexels.com/photos/1367192/pexels-photo-1367192.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      },
    ],
  },
];

function PinnedChatsSection() {
  return (
    <>
      <div style={{ marginBottom: "5px", marginTop: "30px" }}>
        <PushpinFilled
          style={{ color: "#8c8c8c", marginRight: "6px", fontSize: "14px" }}
        />
        <Text style={{ color: "#8c8c8c", fontSize: "14px" }}>Pinned</Text>
      </div>
      <div className={styles.container}>
        <div>
          {chats.map((chat) => (
            <ChatCard key={chat.id} chat={chat} />
          ))}
        </div>
      </div>
    </>
  );
}

export default PinnedChatsSection;
