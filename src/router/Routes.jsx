import { createBrowserRouter } from "react-router-dom";
import { Dashboard } from "../pages/Dashboard";
import { Login } from "../pages/Login";
import { PageNotFound } from "../pages/PageNotFound";
import ListEmployee from "../pages/ListEmployee";
import EditEmployee from "../pages/EditEmployee";
import CreateEmployee from "../pages/CreateEmployee";
import PrivateRoute from "./PrivateRoute"; // Import PrivateRoute component

// Protected routes that need authentication
const ProtectedRoutes = [
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/create-employee",
    element: <CreateEmployee />,
  },
  {
    path: "/list",
    element: <ListEmployee />,
  },
  {
    path: "/edit-employee/:id",
    element: <EditEmployee />,
  },
];

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  // Wrapping protected routes with PrivateRoute
  ...ProtectedRoutes.map(route => ({
    ...route,
    element: <PrivateRoute>{route.element}</PrivateRoute>,
  })),
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

export default router;
