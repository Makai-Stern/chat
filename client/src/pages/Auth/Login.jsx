import React from "react";

import { Input, Typography, Button } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  MailOutlined,
  LockOutlined,
} from "@ant-design/icons";

import Header from "components/Header/Header";
import styles from "./styles.module.scss";

const { Title } = Typography;

function Login() {
  return (
    <div class={styles.authContainer}>
      <Header />

      <div className={styles.formContainer}>
        <form className={styles.form}>
          <Title level={3}>Login</Title>
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
          <Button loading={true} type="primary">
            Continue
          </Button>
          <a>Forgot your password?</a>
        </form>
      </div>
    </div>
  );
}

export default Login;
