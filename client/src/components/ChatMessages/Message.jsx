import React from "react";

import axios from "axios";
import { Avatar, Image, message as alert } from "antd";
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

import { useAuthState } from "store";
import styles from "./styles.module.scss";

function Message({ message, previousMessage }) {
  const user = useAuthState((state) => state.user);
  const currentUserId = user.id;

  const WORD_FILE_EXTS = ["doc", "docx"];
  const POWERPOINT_FILE_EXTS = ["ppt", "pptx"];
  const IMAGE_FILE_EXTS = ["jpeg", "jpg", "png", "gif", "bmp", "tiff"];
  const PDF_FILE_EXTS = ["pdf"];
  const ZIP_FILE_EXTS = ["zip", "7z"];
  const TEXT_FILE_EXTS = ["txt"];
  const EXCEL_FILE_EXTS = [
    "xls",
    "csv",
    "xlsx",
    "xlsm",
    "xltm",
    "xltx",
    "xlsb",
  ];

  // let filename = message.attachment
  //   ? message.attachment?.split("/").pop().split("?")[0]
  //   : "";
  // let fileExtension = message.attachment
  //   ? message.attachment.split(/[#?]/)[0].split(".").pop().trim()
  //   : "";

  let filename = message.attachment ? message.attachment?.name : "";
  let fileExtension = message.attachment
    ? message.attachment?.name.split(/[#?]/)[0].split(".").pop().trim()
    : "";
  let fileLocation = message.attachment ? message.attachment?.file : "";
  console.log(filename);

  const handleDownload = (url, name = null) => {
    name
      ? alert.info(`Downloading "${name}"`)
      : alert.info(`Downloading file...`);
    axios
      .get(url, {
        responseType: "blob",
      })
      .then((response) => {
        // if filename is not set, get filename from url
        const filename = name ? name : url.substring(url.lastIndexOf("/") + 1);
        let blob = new Blob([response.data], { type: response.data.type });
        let link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        link.remove();
        alert.success(`Downloaded "${filename}"`);
      });
  };

  return (
    <div className={styles.messages}>
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
          <div className={`${styles.messageContent} ${styles.receivedMessage}`}>
            {message.text}
          </div>
        </div>
      )}

      {/* Sent Message that's Text */}
      {message.user.id == currentUserId && message.type === "text" && (
        <div className={styles.message} style={{ alignSelf: "flex-end" }}>
          {/* Message Content */}
          <div className={`${styles.messageContent} ${styles.sentMessage}`}>
            {message.text}
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

          <div className={`${styles.messageContent}`}>
            {/* Images */}
            {IMAGE_FILE_EXTS.includes(fileExtension) && (
              <Image className={styles.imageAttachment} src={fileLocation} />
            )}

            {/* PDF */}
            {PDF_FILE_EXTS.includes(fileExtension) && (
              <div
                className={`${styles.messageContent} ${styles.receivedMessage} ${styles.receivedFileAttachment}`}
              >
                <FilePdfTwoTone
                  style={{ marginRight: "5px", fontSize: "20px" }}
                />
                {filename}
              </div>
            )}

            {/* Text */}
            {TEXT_FILE_EXTS.includes(fileExtension) && (
              <div
                className={`${styles.messageContent} ${styles.receivedMessage} ${styles.receivedFileAttachment}`}
              >
                <FileTextTwoTone
                  style={{ marginRight: "5px", fontSize: "20px" }}
                />
                {filename}
              </div>
            )}

            {/* Word */}
            {WORD_FILE_EXTS.includes(fileExtension) && (
              <div
                className={`${styles.messageContent} ${styles.receivedMessage} ${styles.receivedFileAttachment}`}
              >
                <FileWordTwoTone
                  style={{ marginRight: "5px", fontSize: "20px" }}
                />
                {filename}
              </div>
            )}

            {/* Power Point */}
            {POWERPOINT_FILE_EXTS.includes(fileExtension) && (
              <div
                className={`${styles.messageContent} ${styles.receivedMessage} ${styles.receivedFileAttachment}`}
              >
                <FilePptTwoTone
                  style={{ marginRight: "5px", fontSize: "20px" }}
                />
                {filename}
              </div>
            )}

            {/* Zip */}
            {ZIP_FILE_EXTS.includes(fileExtension) && (
              <div
                className={`${styles.messageContent} ${styles.receivedMessage} ${styles.receivedFileAttachment}`}
              >
                <FileZipTwoTone
                  style={{ marginRight: "5px", fontSize: "20px" }}
                />
                {filename}
              </div>
            )}

            {/* Excel */}
            {EXCEL_FILE_EXTS.includes(fileExtension) && (
              <div
                className={`${styles.messageContent} ${styles.receivedMessage} ${styles.receivedFileAttachment}`}
              >
                <FileExcelTwoTone
                  style={{ marginRight: "5px", fontSize: "20px" }}
                />
                {filename}
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
                className={`${styles.messageContent} ${styles.receivedMessage} ${styles.receivedFileAttachment}`}
              >
                <FileUnknownTwoTone
                  style={{ marginRight: "5px", fontSize: "20px" }}
                />
                {filename}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sent Message that's an attachment */}
      {message.user.id == currentUserId && message.type === "attachment" && (
        <div className={styles.message} style={{ alignSelf: "flex-end" }}>
          {/* Message Content */}
          <div className={`${styles.messageContent}`}>
            {/* Images */}
            {IMAGE_FILE_EXTS.includes(fileExtension) && (
              <Image className={styles.imageAttachment} src={fileLocation} />
            )}

            {/* PDF */}
            {PDF_FILE_EXTS.includes(fileExtension) && (
              <div
                className={`${styles.messageContent} ${styles.receivedMessage} ${styles.receivedFileAttachment}`}
              >
                <FilePdfTwoTone
                  style={{ marginRight: "5px", fontSize: "20px" }}
                />
                {filename}
              </div>
            )}

            {/* Text */}
            {TEXT_FILE_EXTS.includes(fileExtension) && (
              <div
                className={`${styles.messageContent} ${styles.receivedMessage} ${styles.receivedFileAttachment}`}
              >
                <FileTextTwoTone
                  style={{ marginRight: "5px", fontSize: "20px" }}
                />
                {filename}
              </div>
            )}

            {/* Word */}
            {WORD_FILE_EXTS.includes(fileExtension) && (
              <div
                className={`${styles.messageContent} ${styles.receivedMessage} ${styles.receivedFileAttachment}`}
              >
                <FileWordTwoTone
                  style={{ marginRight: "5px", fontSize: "20px" }}
                />
                {filename}
              </div>
            )}

            {/* Power Point */}
            {POWERPOINT_FILE_EXTS.includes(fileExtension) && (
              <div
                className={`${styles.messageContent} ${styles.receivedMessage} ${styles.receivedFileAttachment}`}
              >
                <FilePptTwoTone
                  style={{ marginRight: "5px", fontSize: "20px" }}
                />
                {filename}
              </div>
            )}

            {/* Zip */}
            {ZIP_FILE_EXTS.includes(fileExtension) && (
              <div
                className={`${styles.messageContent} ${styles.receivedMessage} ${styles.receivedFileAttachment}`}
              >
                <FileZipTwoTone
                  style={{ marginRight: "5px", fontSize: "20px" }}
                />
                {filename}
              </div>
            )}

            {/* Excel */}
            {EXCEL_FILE_EXTS.includes(fileExtension) && (
              <div
                className={`${styles.messageContent} ${styles.receivedMessage} ${styles.receivedFileAttachment}`}
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
                className={`${styles.messageContent} ${styles.receivedMessage} ${styles.receivedFileAttachment}`}
              >
                <FileUnknownTwoTone
                  style={{ marginRight: "5px", fontSize: "20px" }}
                />
                {filename}
              </div>
            )}
          </div>

          {/* iconr / Margin */}
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
    </div>
  );
}

export default Message;
