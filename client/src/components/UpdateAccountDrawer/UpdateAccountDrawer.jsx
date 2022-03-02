import React from "react";
import { Drawer, Form, Input, Button, message, Upload } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  MailOutlined,
  LockOutlined,
  UserOutlined,
  ProfileOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import { useAuthState } from "store";
import { UserService } from "services";
import styles from "./styles.module.scss";

function UpdateAccountDrawer({ onClose, placement, visible }) {
  const user = useAuthState((state) => state.user);
  const setUser = useAuthState((state) => state.setUser);
  const [responseErrors, setResponseErrors] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [profileImage, setProfileImage] = React.useState(user?.profileImage);
  const [name, setName] = React.useState(user?.name);
  const [email, setEmail] = React.useState(user?.email);
  const [username, setUsername] = React.useState(user?.username);
  const [takenUsernames, setTakenUsernames] = React.useState([]);
  const [takenEmails, setTakenEmails] = React.useState([]);
  const [form] = Form.useForm();

  React.useEffect(() => {
    setProfileImage(user?.profileImage);
    setName(user?.name);
    setEmail(user?.email);
    setUsername(user?.username);
    setTakenUsernames([]);
    setTakenEmails([]);
  }, [visible]);

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

  const uploadButton = (
    <div>
      {isLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const checkName = (_, value) => {
    if (responseErrors?.name) {
      return Promise.reject(new Error(responseErrors.name));
    }
    setName(value);
    // Resolve
    return Promise.resolve();
  };

  const checkUsername = (_, value) => {
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
    setUsername(value);
    return Promise.resolve();
  };

  const checkEmail = (_, value) => {
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

    setEmail(value);
    // Resolve
    return Promise.resolve();
  };

  const checkPassword = (_, value) => {
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
    setUsername(value);
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

  const handleProfileImageChange = async (info) => {
    setIsLoading(true);
    const userData = new FormData();
    userData.append("profileImage", info.file);
    await UserService.update(userData);
    const response = await UserService.update(userData);

    if (response.data && !response.serverError) {
      setUser(response.data);
      setProfileImage(response.data.profileImage);
      message.success("Your profile Image was updated.");
    } else {
      message.error("There was an error. Please try again.");
    }
    setIsLoading(false);
  };

  const onFinish = async (values) => {
    if (isLoading) {
      message.warning("A request is already in progress...");
      return;
    }
    // Check if there are any errors
    if (Object.keys(responseErrors).length === 0) {
      const userData = new FormData();

      let postForm = false;

      // Check what needs to be updated
      if (user.username !== values.username && values.username) {
        userData.append("username", values.username);
        postForm = true;
      }

      if (user.name !== values.name && values.name) {
        userData.append("name", values.name);
        postForm = true;
      }

      if (user.email !== values.email && values.email) {
        userData.append("email", values.email);
        postForm = true;
      }

      if (!postForm) {
        message.info("No changes made.");
        return;
      }

      const response = await UserService.update(userData);

      if (response.data && !response.serverError) {
        const updatedUser = response.data;
        // Update Central State with the new User
        setUser(updatedUser);
        // Show Success Message
        message.success("Your account has been updated.");
      } else if (response.serverError?.error) {
        const serverErrors = response.serverError.error;
        setResponseErrors(serverErrors);

        // Store Taken email to compare to the current email
        if (serverErrors?.email === "Email is taken.") {
          setTakenEmails((prevEmails) => [email, ...prevEmails]);
        }

        // Store Taken username to compare to the current username
        if (serverErrors?.username === "Username is taken.") {
          setTakenUsernames((prevUsernames) => [username, ...prevUsernames]);
        }
      }
    } else {
      message.error("Please fix the errors below");
    }
  };

  return (
    <Drawer
      destroyOnClose
      title="Account Update"
      placement={"right"}
      closable={false}
      onClose={onClose}
      visible={visible}
      key={placement}
    >
      <Form
        className={styles.form}
        form={form}
        onFinish={onFinish}
        validateMessages={validateMessages}
        layout="vertical"
      >
        <Form.Item label="Profile Image" style={{ width: "125px" }}>
          <Upload
            accept={"image/*"}
            name="avatar"
            multiple={false}
            listType="picture-card"
            showUploadList={false}
            customRequest={handleProfileImageChange}
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt="avatar"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              uploadButton
            )}
          </Upload>
        </Form.Item>
        <Form.Item
          hasFeedback
          name="name"
          label="Name"
          rules={[
            {
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
            defaultValue={name}
            // value={name}
          />
        </Form.Item>

        <Form.Item
          hasFeedback
          name="username"
          label="Username"
          rules={[
            {
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
            defaultValue={username}
          />
        </Form.Item>
        <Form.Item
          hasFeedback
          name="email"
          label="Email"
          rules={[
            {
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
            defaultValue={email}
          />
        </Form.Item>
        <Form.Item className={styles.buttonGroup}>
          <Button style={{ marginRight: "10px" }} onClick={onClose}>
            Cancel
          </Button>
          <Button type="primary" loading={isLoading} htmlType="submit">
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
}

export default UpdateAccountDrawer;
