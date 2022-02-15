import React from "react";

import { useNavigate } from "react-router-dom";
import { Input, Typography, Button, Form, message } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  MailOutlined,
  LockOutlined,
  UserOutlined,
  ProfileOutlined,
} from "@ant-design/icons";

import { AuthService } from "services";
import Header from "components/Header/Header";
import styles from "./styles.module.scss";

const { Title } = Typography;

function Register() {
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
  const [responseErrors, setResponseErrors] = React.useState({});

  const [takenUsernames, setTakenUsernames] = React.useState([]);
  const [takenEmails, setTakenEmails] = React.useState([]);

  const checkUsername = (_, value) => {
    // If username is null
    if (!value) {
      const usernameRequiredMessage = "Username is Required!";
      setResponseErrors((prevResponseErrors) => {
        const { username, ...newState } = prevResponseErrors;
        return { username: usernameRequiredMessage, ...newState };
      });
      return Promise.reject(new Error(usernameRequiredMessage));
    }

    // If the server responds with an error for the username
    if (responseErrors?.username) {
      return Promise.reject(new Error(responseErrors.username));
    }

    return Promise.resolve();
  };

  const onUsernameChange = (event) => {
    let value = event.target.value;
    value = value.replace(/\s/g, "");

    // If username is only spaces
    if (value.length == 0) {
      setResponseErrors((prevResponseErrors) => {
        const { username, ...newState } = prevResponseErrors;
        return { username: "Username is Required!", ...newState };
      });
      return;
    }

    if (value.length >= 4) {
      setResponseErrors((prevResponseErrors) => {
        const { username, ...newState } = prevResponseErrors;
        return { ...newState };
      });
    } else {
      setResponseErrors((prevResponseErrors) => {
        const { username, ...newState } = prevResponseErrors;
        return {
          username: "Username must be at least 4 characters.",
          ...newState,
        };
      });
    }
  };

  const checkEmail = (_, value) => {};

  const onFinish = async (user) => {
    console.log("Form submitted");
    const response = await AuthService.register(user);

    // The login was unsuccessful
    if (response.error) {
      // check if the server is offline
      if (!response.serverOnline) {
        message.error(serverOfflineMessage);
      } else {
        // display a generic error Message
        const { error: errorObject } = response.error.response.data;
        setResponseErrors(errorObject);
        message.error("Please correct the errors below");
        console.log(errorObject);
      }
      setIsLoading(false);
      return;
    }
    // The login was successful (cookie is set)
    setIsLoading(false);
    message.success("Registration is successful.");
    // navigate("/");
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
                validator: checkUsername,
              },
            ]}
          >
            <Input
              onChange={onUsernameChange}
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
