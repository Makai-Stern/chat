import React from "react";
import { Typography, Skeleton } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";

import { useChatState } from "store";
import { ChatService } from "services";
import ChatCard from "components/ChatCard/ChatCard";
import styles from "./styles.module.scss";

const { Text } = Typography;
// const chats = [
//   {
//     id: "1",
//     type: "Group",
//     name: "School Project (Economics)",
//     backgroundImage:
//       "https://images.pexels.com/photos/5088017/pexels-photo-5088017.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
//     pinned: true,
//     lastMessage: {
//       id: "2",
//       text: "Sounds good!",
//       type: "Attachment",
//       user: {
//         id: "23",
//         username: "Leo",
//         name: "Leonardo Olive",
//         profileImage:
//           "https://images.pexels.com/photos/819530/pexels-photo-819530.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
//       },
//       createdAt: "2022-10-01",
//       attachments: [
//         "https://vetstreet-brightspot.s3.amazonaws.com/d5/a490b0a8af11e0a0d50050568d634f/file/nova-scotia-duck-tolling-retriever-4-645mk070411.jpg",
//       ],
//     },
//     users: [
//       {
//         id: "23",
//         username: "leo",
//         name: "Leonardo Olive",
//         profileImage:
//           "https://images.pexels.com/photos/819530/pexels-photo-819530.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
//       },
//       {
//         id: "18",
//         username: "miranda",
//         name: "Miranda Cosgrave",
//         profileImage:
//           "https://images.pexels.com/photos/9416738/pexels-photo-9416738.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
//       },
//       {
//         id: "1",
//         username: "You",
//         profileImage:
//           "https://images.pexels.com/photos/1367192/pexels-photo-1367192.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
//       },
//     ],
//   },
//   {
//     id: "2",
//     type: "Single",
//     name: "Morgan Dreaman",
//     pinned: true,
//     lastMessage: {
//       id: "2",
//       text: "That's fine, thanks.",
//       type: "Text",
//       user: {
//         id: "24",
//         name: "Morgan Dreaman",
//         username: "morgpug",
//       },
//       createdAt: "2022-10-01",
//       attachments: [],
//     },
//     users: [
//       {
//         id: "23",
//         username: "Leslie Laurens",
//         name: "Leslie Laurens",
//         profileImage:
//           "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
//       },
//       {
//         id: "1",
//         username: "You",
//         name: "You",
//         profileImage:
//           "https://images.pexels.com/photos/1367192/pexels-photo-1367192.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
//       },
//     ],
//   },
//   {
//     id: "3",
//     type: "Group",
//     name: "Rock climbing",
//     backgroundImage:
//       "https://images.pexels.com/photos/747964/pexels-photo-747964.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
//     pinned: true,
//     lastMessage: {
//       id: "2",
//       text: "Sounds good!",
//       type: "Text",
//       user: {
//         id: "23",
//         name: "Leonardo Olive",
//         username: "Leo",
//       },
//       createdAt: "2022-10-01",
//       attachments: [],
//     },
//     users: [
//       {
//         id: "23",
//         username: "leo",
//         profileImage:
//           "https://images.pexels.com/photos/819530/pexels-photo-819530.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
//       },
//       {
//         id: "18",
//         username: "miranda",
//         profileImage:
//           "https://images.pexels.com/photos/9416738/pexels-photo-9416738.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
//       },
//       {
//         id: "1",
//         username: "You",
//         profileImage:
//           "https://images.pexels.com/photos/1367192/pexels-photo-1367192.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
//       },
//     ],
//   },
// ];

function AllChatsSection() {
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const setCurrentChatId = useChatState((state) => state.setCurrentChatId);

  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState([]);

  const loadMoreData = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    const { data: chats } = await ChatService.getAll(page, 20);
    console.log(data);
    if (chats.length > 0) {
      setData((prevChats) => [...prevChats, ...chats]);
      setPage((prevPage) => prevPage + 1);
    } else {
      setHasMore(false);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    loadMoreData();
  }, []);

  return (
    <>
      <div className={styles.container}>
        <div
          id="scrollableDiv"
          style={{
            height: "100%",
            overflow: "auto",
          }}
        >
          {data.length > 0 ? (
            <InfiniteScroll
              scrollableTarget="scrollableDiv"
              dataLength={data.length}
              next={loadMoreData}
              hasMore={hasMore}
              loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
            >
              {data.map((chat) => (
                <ChatCard key={chat.id} chat={chat} />
              ))}
            </InfiniteScroll>
          ) : (
            <Text
              style={{ color: "#bfbfbf", fontSize: "14px", fontWeight: 500 }}
            >
              No Chats
            </Text>
          )}
        </div>
      </div>
    </>
  );
}

export default AllChatsSection;
