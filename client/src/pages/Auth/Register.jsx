import React from "react";

import { useNavigate, Navigate } from "react-router-dom";
import { Input, Typography, Button, Form, message, Spin  } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  MailOutlined,
  LockOutlined,
  UserOutlined,
  ProfileOutlined,
} from "@ant-design/icons";

import { AuthService } from "services";
import useAuthStatus from "hooks/useAuthStatus";
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
  // Checks if user is already logged in
  const { authenticated, loading } = useAuthStatus();

  const [isLoading, setIsLoading] = React.useState(false);
  const [responseErrors, setResponseErrors] = React.useState({});

  /**
   * Keep a list of usernames and emails that are taken (for real-time validation)
   * Usernames and emails will be appended to list after each submit (if taken)
   **/
  const [takenUsernames, setTakenUsernames] = React.useState([]);
  const [takenEmails, setTakenEmails] = React.useState([]);

  const checkName = (_, value) => {
    // If name is null
    if (!value) {
      const requiredMessage = "Name is Required!";
      setResponseErrors((prevResponseErrors) => {
        const { name, ...newState } = prevResponseErrors;
        return { name: requiredMessage, ...newState };
      });
      return Promise.reject(new Error(requiredMessage));
    }
    // If the server responds with an error for the name
    if (responseErrors?.name) {
      return Promise.reject(new Error(responseErrors.name));
    }
    // Resolve
    return Promise.resolve();
  };

  const checkUsername = (_, value) => {
    // If username is null
    if (!value) {
      const requiredMessage = "Username is Required!";
      setResponseErrors((prevResponseErrors) => {
        const { username, ...newState } = prevResponseErrors;
        return { username: requiredMessage, ...newState };
      });
      return Promise.reject(new Error(requiredMessage));
    }
    // If the server responds with an error for the username
    if (responseErrors?.username) {
      // Check if username is taken
      if (responseErrors?.username === "Username is taken.") {
        // Append username (if not in array)
        !takenUsernames.includes(value) &&
          setTakenUsernames((prevUsernames) => [value, ...prevUsernames]);
      }

      return Promise.reject(new Error(responseErrors.username));
    }
    // Resolve
    return Promise.resolve();
  };

  const checkEmail = (_, value) => {
    // If email is null
    if (!value) {
      const requiredMessage = "Email is Required!";
      setResponseErrors((prevResponseErrors) => {
        const { email, ...newState } = prevResponseErrors;
        return { email: requiredMessage, ...newState };
      });
      return Promise.reject(new Error(requiredMessage));
    }
    // If the server responds with an error for the email
    if (responseErrors?.email) {
      // Check if username is taken
      if (responseErrors?.email === "Email is taken.") {
        // Append username (if not in array)
        !takenEmails.includes(value) &&
          setTakenEmails((prevEmails) => [value, ...prevEmails]);
      }
      return Promise.reject(new Error(responseErrors.email));
    }
    // Resolve
    return Promise.resolve();
  };

  const checkPassword = (_, value) => {
    // If password is null
    if (!value) {
      const requiredMessage = "Password is Required!";
      setResponseErrors((prevResponseErrors) => {
        const { password, ...newState } = prevResponseErrors;
        return { password: requiredMessage, ...newState };
      });
      return Promise.reject(new Error(requiredMessage));
    }
    // If the server responds with an error for the password
    if (responseErrors?.password) {
      return Promise.reject(new Error(responseErrors.password));
    }
    // Resolve
    return Promise.resolve();
  };

  const onNameChange = (event) => {
    let value = event.target.value;
    const nameRegex = /^\s*([A-Za-z]{1,}([\.,] |[-']| ))+[A-Za-z]+\.?\s*$/;

    // If username is only spaces
    if (value.length === 0) {
      setResponseErrors((prevResponseErrors) => {
        const { name, ...newState } = prevResponseErrors;
        return { name: "Name is Required!", ...newState };
      });
      return;
    }

    if (!nameRegex.test(value)) {
      setResponseErrors((prevResponseErrors) => {
        const { name, ...newState } = prevResponseErrors;
        return { name: "Name is invalid.", ...newState };
      });
      return;
    }

    // Clear name errors
    setResponseErrors((prevResponseErrors) => {
      const { name, ...newState } = prevResponseErrors;
      return { ...newState };
    });
  };

  const onUsernameChange = (event) => {
    let value = event.target.value;
    value = value.replace(/\s/g, "");

    // If username is only spaces
    if (value.length === 0) {
      setResponseErrors((prevResponseErrors) => {
        const { username, ...newState } = prevResponseErrors;
        return { username: "Username is Required!", ...newState };
      });
      return;
    }

    if (value.length >= 4) {
      // check if value in username taken list
      if (takenUsernames.includes(value)) {
        // if true, update erorr state
        setResponseErrors((prevResponseErrors) => {
          const { username, ...newState } = prevResponseErrors;
          return {
            username: "Username is taken.",
            ...newState,
          };
        });
        return;
      }

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

  const onEmailChange = (event) => {
    let value = event.target.value;
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    // If email is only spaces
    if (value.length === 0) {
      setResponseErrors((prevResponseErrors) => {
        const { email, ...newState } = prevResponseErrors;
        return { email: "Email is Required!", ...newState };
      });
      return;
    } else {
      if (!emailRegex.test(value.toLowerCase())) {
        setResponseErrors((prevResponseErrors) => {
          const { email, ...newState } = prevResponseErrors;
          return { email: "Email is not a valid email!", ...newState };
        });
        return;
      }

      // check if value in username taken list
      if (takenEmails.includes(value)) {
        // if true, update erorr state
        setResponseErrors((prevResponseErrors) => {
          const { email, ...newState } = prevResponseErrors;
          return {
            email: "Email is taken.",
            ...newState,
          };
        });
        return;
      }

      // Clear email errors
      setResponseErrors((prevResponseErrors) => {
        const { email, ...newState } = prevResponseErrors;
        return { ...newState };
      });
    }
  };

  const onPasswordChange = (event) => {
    let value = event.target.value;

    // Password is required
    if (value.length === 0) {
      setResponseErrors((prevResponseErrors) => {
        const { password, ...newState } = prevResponseErrors;
        return { password: "Password is Required!", ...newState };
      });
      return;
    }

    // Simple validation for password
    if (value.length < 6) {
      setResponseErrors((prevResponseErrors) => {
        const { password, ...newState } = prevResponseErrors;
        return {
          password: "Password must be at least 6 characters.",
          ...newState,
        };
      });
      return;
    }

    // Clear email errors
    setResponseErrors((prevResponseErrors) => {
      const { password, ...newState } = prevResponseErrors;
      return { ...newState };
    });
  };

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
        // Validate Form (will show errors from server)
        form.validateFields();
      }
      setIsLoading(false);
      return;
    }
    // The login was successful (cookie is set)
    setIsLoading(false);
    message.success("Registration is successful.");
    navigate("/login");
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
          <Title level={3}>Sign up</Title>

          <Form.Item
            hasFeedback
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                validator: checkName,
              },
            ]}
          >
            <Input
              onChange={onNameChange}
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
                validator: checkEmail,
              },
            ]}
          >
            <Input
              onChange={onEmailChange}
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
                validator: checkPassword,
              },
            ]}
          >
            <Input.Password
              onChange={onPasswordChange}
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
