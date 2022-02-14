import React from "react";

import { Input, Typography, Button, Form } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  MailOutlined,
  LockOutlined,
  UserOutlined,
  ProfileOutlined,
} from "@ant-design/icons";

import Header from "components/Header/Header";
import styles from "./styles.module.scss";

const { Title } = Typography;

function Register() {
  const validateMessages = {
    required: "${label} is required!",
    types: {
      email: "${label} is not a valid email!",
      number: "${label} is not a valid number!",
    },
    number: {
      range: "${label} must be between ${min} and ${max}",
    },
  };

  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = React.useState(false);

  const onFinish = (user) => {
    alert("hello");
  };

  return (
    <div className={styles.authContainer}>
      <Header />

      <div className={styles.formContainer}>
        <Form
          className={styles.form}
          form={form}
          onFinish={onFinish}
          validateMessages={validateMessages}
        >
          <Title level={3}>Sign up</Title>

          <Form.Item
            hasFeedback
            name="name"
            label="Name"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input
              prefix={
                <ProfileOutlined style={{ color: "#bfbfbf", marginRight: 4 }} />
              }
              placeholder="Name"
            />
          </Form.Item>

          <Form.Item
            hasFeedback
            name="username"
            label="Username"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input
              prefix={
                <UserOutlined style={{ color: "#bfbfbf", marginRight: 4 }} />
              }
              placeholder="Username"
            />
          </Form.Item>

          <Form.Item
            hasFeedback
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                type: "email",
              },
            ]}
          >
            <Input
              prefix={
                <MailOutlined style={{ color: "#bfbfbf", marginRight: 4 }} />
              }
              placeholder="Email"
            />
          </Form.Item>

          <Form.Item
            hasFeedback
            name="password"
            label="Password"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input.Password
              prefix={
                <LockOutlined style={{ color: "#bfbfbf", marginRight: 4 }} />
              }
              placeholder="Password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item
            hasFeedback
            name="confirmPassword"
            label="Confirm Password"
            dependencies={["password"]}
            rules={[
              {
                required: true,
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "The two passwords that you entered do not match!"
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={
                <LockOutlined style={{ color: "#bfbfbf", marginRight: 4 }} />
              }
              placeholder="Confirm your Password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Button loading={isLoading} type="primary" htmlType="submit">
            Continue
          </Button>
          <a>Already have an account?</a>
        </Form>
      </div>
    </div>
  );
}

export default Register;
