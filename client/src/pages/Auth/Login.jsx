import React from "react";

import { useNavigate, Navigate } from "react-router-dom";
import { Input, Typography, Button, Form, message, Spin } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  MailOutlined,
  LockOutlined,
} from "@ant-design/icons";

import { AuthService } from "services";
import useAuthStatus from "hooks/useAuthStatus";
import Header from "components/Header/Header";
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
  // Checks if user is already logged in
  const { authenticated, loading } = useAuthStatus();

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

  if (loading) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spin />
      </div>
    );
  }

  if (authenticated) {
    return <Navigate to="/" />;
  }

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
