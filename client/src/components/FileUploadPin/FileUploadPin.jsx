import React from "react";
import { PaperClipOutlined } from "@ant-design/icons";

function FileUploadPin({ handleFileChange }) {
  return (
    <div style={{ cursor: "pointer" }}>
      <label onChange={handleFileChange} htmlFor="formId">
        <input name="" type="file" id="formId" hidden />
        <PaperClipOutlined
          style={{
            cursor: "pointer",
            display: "blocK",
            fontSize: "20px",
            color: "#595959",
          }}
        />
      </label>
    </div>
  );
}

export default FileUploadPin;
