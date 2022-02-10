import React from "react";

import { Input, Typography, Button } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  MailOutlined,
  LockOutlined,
  UserOutlined,
  ProfileOutlined
} from "@ant-design/icons";

import Header from "components/Header/Header";
import styles from "./styles.module.scss";

const { Title } = Typography;

function Register() {
  return (
    <div class={styles.authContainer}>
      <Header />

      <div className={styles.formContainer}>
        <form className={styles.form}>
          <Title level={3}>Sign up</Title>
          <Input
            prefix={
              <ProfileOutlined style={{ color: "#bfbfbf", marginRight: 4 }} />
            }
            placeholder="Name"
          />
          <Input
            prefix={
              <UserOutlined style={{ color: "#bfbfbf", marginRight: 4 }} />
            }
            placeholder="Username"
          />
          <Input
            prefix={
              <MailOutlined style={{ color: "#bfbfbf", marginRight: 4 }} />
            }
            placeholder="Email"
          />

          <Input.Password
            prefix={
              <LockOutlined style={{ color: "#bfbfbf", marginRight: 4 }} />
            }
            placeholder="Password"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
          <Input.Password
            prefix={
              <LockOutlined style={{ color: "#bfbfbf", marginRight: 4 }} />
            }
            placeholder="Confirm your Password"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
          <Button loading={true} type="primary">
            Continue
          </Button>
          <a>Already have an account?</a>
        </form>
      </div>
    </div>
  );
}

export default Register;
