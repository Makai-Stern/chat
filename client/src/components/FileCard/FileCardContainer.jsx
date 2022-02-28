import React from "react";

import FileCard from "./FileCard";
import styles from "./styles.module.scss";

function FileCardContainer({ files, handleFileRemove }) {
  return (
    <div className={styles.fileCardContainer}>
      {files &&
        files.map((f, i) => (
          <FileCard
            key={i}
            file={f}
            index={i}
            handleFileRemove={handleFileRemove}
          />
        ))}
    </div>
  );
}

export default FileCardContainer;
