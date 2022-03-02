import React from "react";

import moment from "moment";
import { Avatar, Image, Typography, message as alert } from "antd";
import {
  FilePdfTwoTone,
  FileTextTwoTone,
  FileExcelTwoTone,
  FileUnknownTwoTone,
  FileWordTwoTone,
  FilePptTwoTone,
  FileZipTwoTone,
  UserOutlined,
} from "@ant-design/icons";

import useOnScreen from "hooks/useOnScreen";
import { handleDownload } from "functions";
import { MessageService } from "services";
import { useAuthState } from "store";
import {
  WORD_FILE_EXTS,
  POWERPOINT_FILE_EXTS,
  IMAGE_FILE_EXTS,
  PDF_FILE_EXTS,
  ZIP_FILE_EXTS,
  TEXT_FILE_EXTS,
  EXCEL_FILE_EXTS,
} from "store/constants";
import styles from "./styles.module.scss";

function Message({ message, previousMessage, nextMessage }) {
  const user = useAuthState((state) => state.user);
  const currentUserId = user.id;
  const date = moment(message.createdAt).format("MMMM Do YYYY, h:mm a");
  const elementRef = React.useRef(null);
  const isOnScreen = useOnScreen(elementRef);
  const [readByUsers, setReadByUsers] = React.useState(message.readBy);
  const [readByDate, setReadByDate] = React.useState("");
  const [showDate, setShowDate] = React.useState(false);
  const [read, setRead] = React.useState(false);
  const { Text } = Typography;

  React.useState(() => {
    if (!nextMessage) {
      setShowDate(true);
    } else if (previousMessage) {
      const previousMessageDate = moment(previousMessage.createdAt).format(
        "YYYY-MM-DD"
      );
      const messageDate = moment(message.createdAt).format("YYYY-MM-DD");
      setShowDate(moment(messageDate).isBefore(previousMessageDate));
    } else {
      const nextMessageDate = moment(nextMessage.createdAt).format(
        "YYYY-MM-DD"
      );
      const messageDate = moment(message.createdAt).format("YYYY-MM-DD");
      setShowDate(moment(messageDate).isAfter(nextMessageDate));
    }

    setRead(readByUsers.length > 0);
    if (readByUsers.length > 0)
      setReadByDate(moment(readByUsers[0].createdAt).format("YYYY-MM-DD"));
  }, []);

  React.useEffect(() => {
    if (isOnScreen) {
      if (message.user.id !== user.id) {
        if (!read) {
          MessageService.read(message.id).then((res) => {
            setReadByUsers((prevUsers) => [user, ...prevUsers]);
          });
        }
      }
    }

    return () => {
      setReadByUsers([]);
      setReadByDate("");
      setShowDate(false);
      setRead(false);
    };
  }, [isOnScreen]);

  const readMessage = () => {};

  let filename = message.attachment ? message.attachment?.name : "";
  let fileExtension = message.attachment
    ? message.attachment?.name.split(/[#?]/)[0].split(".").pop().trim()
    : "";
  let fileLocation = message.attachment ? message.attachment?.file : "";

  return (
    <div className={styles.messages} ref={elementRef}>
      {/* TEXT */}
      {/* Received Message that's Text */}
      {message.user.id !== currentUserId && message.type === "text" && (
        <div className={styles.message}>
          {/* Avatar / Margin */}
          {previousMessage ? (
            previousMessage.user.id === message.user.id ? (
              <div style={{ width: "33px" }}></div>
            ) : (
              <Avatar
                style={{ marginRight: "10px" }}
                src={message.user.profileImage}
                icon={<UserOutlined />}
                size="small"
              />
            )
          ) : (
            <Avatar
              style={{ marginRight: "10px" }}
              src={message.user.profileImage}
              icon={<UserOutlined />}
              size="small"
            />
          )}

          {/* Message Content */}
          <div>
            <div
              className={`${styles.messageContent} ${styles.receivedMessage}`}
            >
              {message.text}
            </div>
            {/* <div className={styles.messageReadReceipts}>
              {read ? (
                <Text style={{ color: "#bfbfbf" }}>Read</Text>
              ) : (
                <Text style={{ color: "#bfbfbf" }}>Delivered</Text>
              )}
            </div> */}
          </div>
        </div>
      )}
      {/* Sent Message that's Text */}
      {message.user.id == currentUserId && message.type === "text" && (
        <div className={styles.message} style={{ alignSelf: "flex-end" }}>
          <div>
            {/* Message Content */}
            <div className={`${styles.messageContent} ${styles.sentMessage}`}>
              {message.text}
            </div>
            <div
              className={`${styles.messageReadReceipt} ${styles.justifyflexEnd}`}
              style={{ marginTop: "6px" }}
            >
              {read ? (
                <Text style={{ color: "#bfbfbf" }}>
                  Read {moment(readByDate).fromNow(true)} ago
                </Text>
              ) : (
                <Text style={{ color: "#bfbfbf" }}>Delivered</Text>
              )}
            </div>
          </div>
          {/* Avatar / Margin */}
          {previousMessage ? (
            previousMessage.user.id === message.user.id ? (
              <div style={{ width: "33px" }}></div>
            ) : (
              <Avatar
                style={{ marginLeft: "10px" }}
                src={message.user.profileImage}
                icon={<UserOutlined />}
                size="small"
              />
            )
          ) : (
            <Avatar
              style={{ marginLeft: "10px" }}
              src={message.user.profileImage}
              icon={<UserOutlined />}
              size="small"
            />
          )}
        </div>
      )}
      {/* ATTACHMENTS */}
      {/* Received Message that's an attachment */}
      {message.user.id !== currentUserId && message.type === "attachment" && (
        <div className={styles.message}>
          {previousMessage ? (
            previousMessage.user.id === message.user.id ? (
              <div style={{ width: "33px" }}></div>
            ) : (
              <Avatar
                style={{ marginRight: "10px" }}
                src={message.user.profileImage}
                icon={<UserOutlined />}
                size="small"
              />
            )
          ) : (
            <Avatar
              style={{ marginRight: "10px" }}
              src={message.user.profileImage}
              icon={<UserOutlined />}
              size="small"
            />
          )}

          <div>
            <div>
              {/* Images */}
              {IMAGE_FILE_EXTS.includes(fileExtension) && (
                <Image className={styles.imageAttachment} src={fileLocation} />
              )}

              {/* PDF */}
              {PDF_FILE_EXTS.includes(fileExtension) && (
                <div
                  className={`${styles.receivedMessage} ${styles.fileAttachment}`}
                >
                  <FilePdfTwoTone
                    style={{ marginRight: "5px", fontSize: "20px" }}
                  />
                  <a
                    onClick={() => handleDownload(fileLocation, filename)}
                    style={{ color: "#fff" }}
                  >
                    {filename}
                  </a>
                </div>
              )}

              {/* Text */}
              {TEXT_FILE_EXTS.includes(fileExtension) && (
                <div
                  className={`${styles.receivedMessage} ${styles.fileAttachment}`}
                >
                  <FileTextTwoTone
                    style={{ marginRight: "5px", fontSize: "20px" }}
                  />
                  <a
                    onClick={() => handleDownload(fileLocation, filename)}
                    style={{ color: "#fff" }}
                  >
                    {filename}
                  </a>
                </div>
              )}

              {/* Word */}
              {WORD_FILE_EXTS.includes(fileExtension) && (
                <div
                  className={`${styles.receivedMessage} ${styles.fileAttachment}`}
                >
                  <FileWordTwoTone
                    style={{ marginRight: "5px", fontSize: "20px" }}
                  />
                  <a
                    onClick={() => handleDownload(fileLocation, filename)}
                    style={{ color: "#fff" }}
                  >
                    {filename}
                  </a>
                </div>
              )}

              {/* Power Point */}
              {POWERPOINT_FILE_EXTS.includes(fileExtension) && (
                <div
                  className={`${styles.receivedMessage} ${styles.fileAttachment}`}
                >
                  <FilePptTwoTone
                    style={{ marginRight: "5px", fontSize: "20px" }}
                  />
                  <a
                    onClick={() => handleDownload(fileLocation, filename)}
                    style={{ color: "#fff" }}
                  >
                    {filename}
                  </a>
                </div>
              )}

              {/* Zip */}
              {ZIP_FILE_EXTS.includes(fileExtension) && (
                <div
                  className={`${styles.receivedMessage} ${styles.fileAttachment}`}
                >
                  <FileZipTwoTone
                    style={{ marginRight: "5px", fontSize: "20px" }}
                  />
                  <a
                    onClick={() => handleDownload(fileLocation, filename)}
                    style={{ color: "#fff" }}
                  >
                    {filename}
                  </a>
                </div>
              )}

              {/* Excel */}
              {EXCEL_FILE_EXTS.includes(fileExtension) && (
                <div
                  className={`${styles.receivedMessage} ${styles.fileAttachment}`}
                >
                  <FileExcelTwoTone
                    style={{ marginRight: "5px", fontSize: "20px" }}
                  />
                  <a onClick={() => handleDownload(fileLocation, filename)}>
                    {filename}
                  </a>
                </div>
              )}

              {/* Unknown */}
              {![
                ...IMAGE_FILE_EXTS,
                ...WORD_FILE_EXTS,
                ...PDF_FILE_EXTS,
                ...ZIP_FILE_EXTS,
                ...TEXT_FILE_EXTS,
                ...EXCEL_FILE_EXTS,
                ...POWERPOINT_FILE_EXTS,
              ].includes(fileExtension) && (
                <div
                  className={`${styles.receivedMessage} ${styles.fileAttachment}`}
                >
                  <FileUnknownTwoTone
                    style={{ marginRight: "5px", fontSize: "20px" }}
                  />
                  <a
                    onClick={() => handleDownload(fileLocation, filename)}
                    style={{ color: "#fff" }}
                  >
                    {filename}
                  </a>
                </div>
              )}
            </div>
            {/* <div
              className={`${styles.messageReadReceipt}`}
              style={{ marginTop: "6px" }}
            >
              <Text style={{ color: "#bfbfbf" }}>Delivered</Text>
            </div> */}
          </div>
        </div>
      )}
      {/* Sent Message that's an attachment */}
      {message.user.id == currentUserId && message.type === "attachment" && (
        <div className={styles.message} style={{ alignSelf: "flex-end" }}>
          {/* Message Content */}
          <div>
            <div>
              {/* Images */}
              {IMAGE_FILE_EXTS.includes(fileExtension) && (
                <Image className={styles.imageAttachment} src={fileLocation} />
              )}

              {/* PDF */}
              {PDF_FILE_EXTS.includes(fileExtension) && (
                <div
                  className={`${styles.sentMessage} ${styles.fileAttachment}`}
                  style={{ color: "#fff" }}
                >
                  <FilePdfTwoTone
                    style={{ marginRight: "5px", fontSize: "20px" }}
                  />
                  <a
                    onClick={() => handleDownload(fileLocation, filename)}
                    style={{ color: "#fff" }}
                  >
                    {filename}
                  </a>
                </div>
              )}

              {/* Text */}
              {TEXT_FILE_EXTS.includes(fileExtension) && (
                <div
                  className={`${styles.sentMessage} ${styles.fileAttachment}`}
                  style={{ color: "#fff" }}
                >
                  <FileTextTwoTone
                    style={{ marginRight: "5px", fontSize: "20px" }}
                  />
                  <a
                    onClick={() => handleDownload(fileLocation, filename)}
                    style={{ color: "#fff" }}
                  >
                    {filename}
                  </a>
                </div>
              )}

              {/* Word */}
              {WORD_FILE_EXTS.includes(fileExtension) && (
                <div
                  className={`${styles.sentMessage} ${styles.fileAttachment}`}
                  style={{ color: "#fff" }}
                >
                  <FileWordTwoTone
                    style={{ marginRight: "5px", fontSize: "20px" }}
                  />
                  <a
                    onClick={() => handleDownload(fileLocation, filename)}
                    style={{ color: "#fff" }}
                  >
                    {filename}
                  </a>
                </div>
              )}

              {/* Power Point */}
              {POWERPOINT_FILE_EXTS.includes(fileExtension) && (
                <div
                  className={`${styles.sentMessage} ${styles.fileAttachment}`}
                  style={{ color: "#fff" }}
                >
                  <FilePptTwoTone
                    style={{ marginRight: "5px", fontSize: "20px" }}
                  />
                  <a
                    onClick={() => handleDownload(fileLocation, filename)}
                    style={{ color: "#fff" }}
                  >
                    {filename}
                  </a>
                </div>
              )}

              {/* Zip */}
              {ZIP_FILE_EXTS.includes(fileExtension) && (
                <div
                  className={`${styles.sentMessage} ${styles.fileAttachment}`}
                >
                  <FileZipTwoTone
                    style={{ marginRight: "5px", fontSize: "20px" }}
                  />
                  <a
                    onClick={() => handleDownload(fileLocation, filename)}
                    style={{ color: "#fff" }}
                  >
                    {filename}
                  </a>
                </div>
              )}

              {/* Excel */}
              {EXCEL_FILE_EXTS.includes(fileExtension) && (
                <div
                  className={`${styles.sentMessage} ${styles.fileAttachment}`}
                >
                  <FileExcelTwoTone
                    style={{ marginRight: "5px", fontSize: "20px" }}
                  />
                  <a
                    onClick={() => handleDownload(fileLocation, filename)}
                    style={{ color: "#fff" }}
                  >
                    {filename}
                  </a>
                </div>
              )}

              {/* Unknown */}
              {![
                ...IMAGE_FILE_EXTS,
                ...WORD_FILE_EXTS,
                ...PDF_FILE_EXTS,
                ...ZIP_FILE_EXTS,
                ...TEXT_FILE_EXTS,
                ...EXCEL_FILE_EXTS,
                ...POWERPOINT_FILE_EXTS,
              ].includes(fileExtension) && (
                <div
                  className={`${styles.sentMessage} ${styles.fileAttachment}`}
                >
                  <FileUnknownTwoTone
                    style={{ marginRight: "5px", fontSize: "20px" }}
                  />
                  <a
                    onClick={() => handleDownload(fileLocation, filename)}
                    style={{ color: "#fff" }}
                  >
                    {filename}
                  </a>
                </div>
              )}
            </div>
            <div
              className={`${styles.messageReadReceipt} ${styles.justifyflexEnd}`}
              style={{ marginTop: "6px" }}
            >
              {read ? (
                <Text style={{ color: "#bfbfbf" }}>
                  Read {moment(readByDate).fromNow(true)} ago
                </Text>
              ) : (
                <Text style={{ color: "#bfbfbf" }}>Delivered</Text>
              )}
            </div>
          </div>
          {/* icon / Margin */}
          {previousMessage ? (
            previousMessage.user.id === message.user.id ? (
              <div style={{ width: "33px" }}></div>
            ) : (
              <Avatar
                style={{ marginLeft: "10px" }}
                src={message.user.profileImage}
                icon={<UserOutlined />}
                size="small"
              />
            )
          ) : (
            <Avatar
              style={{ marginLeft: "10px" }}
              src={message.user.profileImage}
              icon={<UserOutlined />}
              size="small"
            />
          )}
        </div>
      )}
      {showDate && (
        <h5
          style={{
            width: "100%",
            textAlign: "center",
            color: "#8c8c8c",
            marginTop: "30px",
            marginBottom: "20px",
          }}
        >
          {date}
        </h5>
      )}
    </div>
  );
}

export default Message;
