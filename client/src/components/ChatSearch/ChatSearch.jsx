import React from "react";
import { message } from "antd";

import DebounceSelect from "components/DebounceSelect/DebounceSelect";
import { ChatService } from "services";

function ChatSearch({ style }) {
  const [chats, setChats] = React.useState([]);

  const fetchChatList = async (value) => {
    const response = await ChatService.find(value);
    if (response.error) {
      message.error(
        "The server could not handle your request. Please try again."
      );
      return;
    }
    return response.data.map((chat) => {
      return {
        label: `${chat.name}`,
        value: chat.id,
      };
    });
  };

  return (
    <DebounceSelect
      showSearch
      // mode="multiple"
      value={chats}
      placeholder="Select chats..."
      fetchOptions={fetchChatList}
      onChange={(newValue) => {
        setChats(newValue);
      }}
      style={style}
    />
  );
}

export default ChatSearch;
