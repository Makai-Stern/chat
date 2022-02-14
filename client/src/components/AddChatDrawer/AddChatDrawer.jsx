import React from "react";

import {
  Drawer,
  Radio,
  Space,
  Form,
  Input,
  InputNumber,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  AutoComplete,
  message,
  Upload,
} from "antd";

import {
  InfoCircleOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import "./styles.css";

const { Option } = Select;

function AddChatDrawer(props) {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const children = [];
  for (let i = 10; i < 36; i++) {
    children.push(
      <Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>
    );
  }

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  const beforeUpload = () => {};

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const imageUrl = "";
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
        <Form.Item label="Group Image">
          <Upload
            disabled
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {imageUrl ? (
              <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
            ) : (
              uploadButton
            )}
          </Upload>
        </Form.Item>

        <Form.Item label={"Members"}>
          <Select
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            placeholder="Please select"
            defaultValue={["a10", "c12"]}
            onChange={handleChange}
          >
            {children}
          </Select>
        </Form.Item>

        <Form.Item
          label="Chat Name"
          required
          tooltip="This is a required field"
        >
          <Input placeholder="input placeholder" />
        </Form.Item>
        <Form.Item
          label="Field B"
          tooltip={{
            title: "Tooltip with customize icon",
            icon: <InfoCircleOutlined />,
          }}
        >
          <Input placeholder="input placeholder" />
        </Form.Item>
        <Form.Item>
          <Button type="primary">Submit</Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
}

export default AddChatDrawer;
