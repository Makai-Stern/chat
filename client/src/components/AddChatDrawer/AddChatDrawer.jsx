import React from "react";

import { Drawer, Form, Input, Select, Button, message, Upload } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

import { UserService } from "services";
import DebounceSelect from "./DebounceSelect";
import "./styles.css";

const { Option } = Select;

function AddChatDrawer(props) {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const [chatName, setChatName] = "";
  const [imageUrl, setImageUrl] = React.useState(
    "https://images.unsplash.com/photo-1645037057784-1c68f3b2fb2f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
  );

  // const [users, setUsers] = React.useState([]);

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  const beforeUpload = () => {};

  const fetchUserList = async (value) => {
    const response = await UserService.find(value);
    if (response.error) {
      message.error(
        "The server could not handle your request. Please try again."
      );
      return;
    }
    return response.data.map((user) => {
      return {
        label: `${user.name} - @${user.username}`,
        value: user.username,
      };
    });
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Drawer
      title="Create Chat"
      placement={"left"}
      closable={false}
      onClose={props.onClose}
      visible={props.visible}
      key={props.placement}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={true}
        requiredMark={true}
      >
        <Form.Item
          label={"Members"}
          required
          tooltip="This is a required field"
        >
          <DebounceSelect
            mode="multiple"
            value={props.users}
            setValue={props.setUsers}
            placeholder="Select users"
            fetchOptions={fetchUserList}
            onChange={(newValue) => {
              props.setUsers(newValue);
            }}
            style={{ width: "100%" }}
          />
        </Form.Item>

        {props.users
          ? props.users.length > 1 && (
              <>
                <Form.Item
                  label="Chat Name"
                  required
                  tooltip="This is a required field"
                >
                  <Input placeholder="Chat Name" />
                </Form.Item>

                <Form.Item label="Group Image">
                  <Upload
                    name="group-image"
                    listType="picture-card"
                    // className="avatar-uploader"
                    showUploadList={false}
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="avatar"
                        style={{
                          width: "100%",
                          height: "102px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      uploadButton
                    )}
                  </Upload>
                </Form.Item>
              </>
            )
          : ""}

        <Form.Item>
          <Button type="primary">Continue</Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
}

export default AddChatDrawer;
