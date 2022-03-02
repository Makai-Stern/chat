// TODO: Create a AttachmentCard Component

import React from "react";

import { Typography, Image, Tooltip } from "antd";
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

import {
  WORD_FILE_EXTS,
  POWERPOINT_FILE_EXTS,
  IMAGE_FILE_EXTS,
  PDF_FILE_EXTS,
  ZIP_FILE_EXTS,
  TEXT_FILE_EXTS,
  EXCEL_FILE_EXTS,
} from "store/constants";
import { handleDownload } from "functions";
import { ChatService } from "services";
import { useChatState } from "store";
import MemberCard from "components/MemberCard/MemberCard";
import styles from "./styles.module.scss";

const { Title, Text } = Typography;

function ChatPannel() {
  const currentChat = useChatState((state) => state.currentChat);
  const currentAttachments = useChatState((state) => state.currentAttachments);
  const setCurrentAttachments = useChatState(
    (state) => state.setCurrentAttachments
  );
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    setIsLoading(true);

    if (currentChat?.id) {
      ChatService.getAttachments(currentChat.id).then((response) => {
        const { data } = response;
        setCurrentAttachments(data);
      });
    } else {
      setCurrentAttachments([]);
    }

    setIsLoading(false);
  }, [currentChat?.id]);

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
      style={currentChat?.id ? {} : { background: "#fdfdfd" }}
    >
      {currentChat?.id && (
        <>
          {/* Members */}
          {currentChat?.backgroundImage && (
            <div className={styles.section} style={{ marginBottom: "50px" }}>
              <Title
                level={5}
                style={{
                  color: "#595959",
                  fontSize: "14px",
                  marginBottom: "15px",
                }}
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
                  src={currentChat.backgroundImage}
                />
              </div>
            </div>
          )}
          {/* Members */}
          <div className={styles.section} style={{ marginBottom: "50px" }}>
            <Title level={5} style={{ color: "#595959", fontSize: "14px" }}>
              Members
            </Title>

            {currentChat?.users?.length > 0 && (
              <div className={styles.members}>
                {currentChat.users.map((user) => (
                  <MemberCard chat={currentChat} key={user.id} user={user} />
                ))}
              </div>
            )}
          </div>

          <div className={styles.section}>
            <Title level={5} style={{ color: "#595959", fontSize: "14px" }}>
              Attachments
            </Title>
            {currentAttachments.length > 0 ? (
              <>
                {/* test */}
                <div className={styles.attachments}>
                  {currentAttachments.map((attachment, i) => (
                    <div key={i}>
                      {IMAGE_FILE_EXTS.includes(
                        attachment.name.split(/[#?]/)[0].split(".").pop().trim()
                      ) && (
                        <Image
                          src={attachment.file}
                          style={{
                            objectFit: "cover",
                            width: "70px",
                            height: "70px",
                            borderRadius: "10px",
                          }}
                        />
                      )}

                      {/* PDF */}
                      {PDF_FILE_EXTS.includes(
                        attachment.name.split(/[#?]/)[0].split(".").pop().trim()
                      ) && (
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
                            cursor: "pointer",
                          }}
                        >
                          <FilePdfTwoTone style={{ fontSize: "25px" }} />
                        </div>
                      )}

                      {/* Text */}
                      {TEXT_FILE_EXTS.includes(
                        attachment.name.split(/[#?]/)[0].split(".").pop().trim()
                      ) && (
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
                            cursor: "pointer",
                          }}
                        >
                          <FileTextTwoTone style={{ fontSize: "25px" }} />
                        </div>
                      )}

                      {/* Word */}
                      {WORD_FILE_EXTS.includes(
                        attachment.name.split(/[#?]/)[0].split(".").pop().trim()
                      ) && (
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
                            cursor: "pointer",
                          }}
                        >
                          <FileWordTwoTone style={{ fontSize: "25px" }} />
                        </div>
                      )}

                      {/* Power Point */}
                      {POWERPOINT_FILE_EXTS.includes(
                        attachment.name.split(/[#?]/)[0].split(".").pop().trim()
                      ) && (
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
                            cursor: "pointer",
                          }}
                        >
                          <FilePptTwoTone style={{ fontSize: "25px" }} />
                        </div>
                      )}

                      {/* Zip */}
                      {ZIP_FILE_EXTS.includes(
                        attachment.name.split(/[#?]/)[0].split(".").pop().trim()
                      ) && (
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
                            cursor: "pointer",
                          }}
                        >
                          <FileZipTwoTone style={{ fontSize: "25px" }} />
                        </div>
                      )}

                      {/* Excel */}
                      {EXCEL_FILE_EXTS.includes(
                        attachment.name.split(/[#?]/)[0].split(".").pop().trim()
                      ) && (
                        <Tooltip title={attachment.name}>
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
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              handleDownload(attachment.file, attachment.name)
                            }
                          >
                            <FileExcelTwoTone style={{ fontSize: "25px" }} />
                          </div>
                        </Tooltip>
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
                      ].includes(
                        attachment.name.split(/[#?]/)[0].split(".").pop().trim()
                      ) && (
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
                            cursor: "pointer",
                          }}
                        >
                          <FileUnknownTwoTone style={{ fontSize: "25px" }} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <Text
                style={{ color: "#bfbfbf", fontSize: "14px", fontWeight: 500 }}
              >
                No Attachments
              </Text>
            )}
          </div>
        </>
      )}
    </Resizable>
  );
}

export default ChatPannel;
