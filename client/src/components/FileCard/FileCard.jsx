import React from "react";
import { Image, Spin } from "antd";
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

function FileCard({ file, handleFileRemove, index }) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [preview, setPreview] = React.useState(null);
  const fileExtension = file.name.split(/[#?]/)[0].split(".").pop().trim();
  const filename = file.name;

  // For image preview
  React.useEffect(() => {
    setIsLoading(true);
    const objectUrl = IMAGE_FILE_EXTS.includes(fileExtension)
      ? URL.createObjectURL(file)
      : null;

    if (IMAGE_FILE_EXTS.includes(fileExtension)) {
      setPreview(objectUrl);
    }
    console.log(objectUrl);
    setIsLoading(false);
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return (
    <div
      className={styles.fileCard}
      mx={3}
      onClick={() => handleFileRemove(index)}
    >
      {isLoading ? (
        <div>
          <Spin />
        </div>
      ) : (
        <>
          {EXCEL_FILE_EXTS.includes(fileExtension) && (
            <div>
              <FileExcelTwoTone
                style={{ marginRight: "5px", fontSize: "20px" }}
              />
              {filename}
            </div>
          )}

          {PDF_FILE_EXTS.includes(fileExtension) && (
            <div>
              <FilePdfTwoTone
                style={{ marginRight: "5px", fontSize: "20px" }}
              />
              {filename}
            </div>
          )}

          {TEXT_FILE_EXTS.includes(fileExtension) && (
            <div>
              <FileTextTwoTone
                style={{ marginRight: "5px", fontSize: "20px" }}
              />
              {filename}
            </div>
          )}

          {WORD_FILE_EXTS.includes(fileExtension) && (
            <div>
              <FileWordTwoTone
                style={{ marginRight: "5px", fontSize: "20px" }}
              />
              {filename}
            </div>
          )}

          {POWERPOINT_FILE_EXTS.includes(fileExtension) && (
            <div>
              <FilePptTwoTone
                style={{ marginRight: "5px", fontSize: "20px" }}
              />
              {filename}
            </div>
          )}
          {ZIP_FILE_EXTS.includes(fileExtension) && (
            <div>
              <FileZipTwoTone
                style={{ marginRight: "5px", fontSize: "20px" }}
              />
              {filename}
            </div>
          )}

          {![
            ...IMAGE_FILE_EXTS,
            ...WORD_FILE_EXTS,
            ...PDF_FILE_EXTS,
            ...ZIP_FILE_EXTS,
            ...TEXT_FILE_EXTS,
            ...EXCEL_FILE_EXTS,
            ...POWERPOINT_FILE_EXTS,
          ].includes(fileExtension) && (
            <div>
              <FileUnknownTwoTone
                style={{ marginRight: "5px", fontSize: "20px" }}
              />
              {filename}
            </div>
          )}

          {IMAGE_FILE_EXTS.includes(fileExtension) && (
            <div>
              <Image
                preview={false}
                style={{ width: "80px", objectFit: "contain" }}
                src={preview}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default FileCard;
