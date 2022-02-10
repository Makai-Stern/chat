import React from "react";
import { Navigate } from "react-router-dom";
import { Spin } from "antd";
import useAuthStatus from "hooks/useAuthStatus";

export default function PrivateRoute({
  component: Component,
  layout: Layout,
  ...rest
}) {
  const { authenticated, loading } = useAuthStatus();

  if (loading) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Spin />
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <Layout {...rest}>
      <Component {...rest} />
    </Layout>
  );
}
