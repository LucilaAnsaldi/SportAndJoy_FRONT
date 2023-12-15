import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import "./App.css";

import Signin from "./components/Singin/Signin";
import Signup from "./components/Signup/Signup";
import Dashboard from "./components/Dashboard/Dashboard";
import { useContext, useEffect } from "react";
import Profile from "./components/Profile/Profile";
import Reservations from "./components/Reservations/Reservations";
import FieldDetail from "./components/FieldDetail/FieldDetail";
import Users from "./components/Users/Users";
import AdminView from "./components/AdminView/AdminView";
import { ThemeContext } from "./services/theme.context";
import ToggleTheme from "./components/toggleTheme/ToggleTheme";
import NotFound from "./components/NotFound/NotFound";
import { RoleContext } from "./services/role.context";
import { Protected } from "./components/Security/Protected/Protected";

const App = () => {
  const { theme } = useContext(ThemeContext);
  const { role } = useContext(RoleContext);

  const router = createBrowserRouter([
    { path: "/", element: <Navigate to="/signin" /> },
    {
      path: "/signin",
      element: <Signin />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/dashboard",
      element: (
        <Protected>
          <Dashboard />
        </Protected>
      ),
    },
    {
      path: "/profile",
      element: (
        <Protected>
          <Profile />
        </Protected>
      ),
    },
    {
      path: "/reservations",
      element: (
        <Protected>
          {" "}
          <Reservations />{" "}
        </Protected>
      ),
    },
    {
      path: "/fieldDetail/:id",
      element: (
        <Protected>
          {" "}
          <FieldDetail />{" "}
        </Protected>
      ),
    },
    {
      path: "/users",
      element: (
        <Protected>
          {" "}
          <Users />{" "}
        </Protected>
      ),
    },
    {
      path: "/adminView",
      element: (
        <Protected>
          {" "}
          <AdminView />{" "}
        </Protected>
      ),
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return (
    <div className={theme === "dark" && "dark-theme"}>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
