import React from "react";

import { useNavigate } from "react-router-dom";
import { Input, Typography, Button, Form, message } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  MailOutlined,
  LockOutlined,
} from "@ant-design/icons";

import Header from "components/Header/Header";
import { AuthService } from "services";
import styles from "./styles.module.scss";

const { Title } = Typography;

function Login() {
  const errorMessage = "The email or password is incorrect";
  const serverOfflineMessage = "The server is offline. Please try again later.";
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
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = React.useState(false);

  const onFinish = async (user) => {
    setIsLoading(true);
    const response = await AuthService.login(user);
    // The login was unsuccessful
    if (response.error) {
      // check if the server is offline
      if (!response.serverOnline) {
        message.error(serverOfflineMessage);
      } else {
        // display a generic error Message
        message.error(errorMessage);
      }
      setIsLoading(false);
      return;
    }
    // The login was successful (cookie is set)
    setIsLoading(false);
    message.success("You are logged in.");
    navigate("/");
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
          <Title level={3}>Login</Title>

          <Form.Item
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
            name="password"
            label="Password"
            rules={[{ required: true }]}
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

          <Button loading={isLoading} type="primary" htmlType="submit">
            Continue
          </Button>

          <a>Forgot your password?</a>
        </Form>
      </div>
    </div>
  );
}

export default Login;
