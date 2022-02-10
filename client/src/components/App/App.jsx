import "antd/dist/antd.css";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/* State */
import { useAuthState } from "store";

/* My components */
import SocketProvider from "contexts/SocketProvider";
import PublicRoute from "components/Routes/PublicRoute";
import PrivateRoute from "components/Routes/PrivateRoute";
import DefaultLayout from "layouts/DefaultLayout";
import Home from "pages/Home";
import Login from "pages/Auth/Login";
import Register from "pages/Auth/Register";

function App() {
  const user = useAuthState((state) => state.user);

  return (
    <SocketProvider user={user}>
      <Router>
        <Routes>
          {/* <Route
            exact
            path="/"
            element={<PrivateRoute component={Home} layout={DefaultLayout} />}
          /> */}
          <Route
            exact
            path="/"
            element={<PublicRoute component={Home} layout={DefaultLayout} />}
          />
          <Route
            exact
            path="/login"
            element={<PublicRoute component={Login} layout={DefaultLayout} />}
          />
          <Route
            exact
            path="/register"
            element={
              <PublicRoute component={Register} layout={DefaultLayout} />
            }
          />
        </Routes>
      </Router>
    </SocketProvider>
  );
}

export default App;
