import React from "react";
import { PaperClipOutlined } from "@ant-design/icons";

function FileUploadPin({ handleFileChange, disabled = false }) {
  return (
    <div style={disabled ? {} : { cursor: "pointer" }}>
      <label onChange={handleFileChange} htmlFor="formId">
        <input disabled={disabled} name="" type="file" id="formId" hidden />
        <PaperClipOutlined
          style={
            disabled
              ? { display: "blocK", fontSize: "20px", color: "#bfbfbf" }
              : {
                  cursor: "pointer",
                  display: "blocK",
                  fontSize: "20px",
                  color: "#595959",
                }
          }
        />
      </label>
    </div>
  );
}

export default FileUploadPin;
