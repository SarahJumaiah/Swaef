import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import NotFoundPage from "./pages/NotFoundPage";

const router = createBrowserRouter([
  {
    path: "/",

    element: <Home />,
  },
  {
    path: "/admin",

    element: <Admin />,
  },
  {
    path: "*",

    element: <NotFoundPage />,
  }
]);

export default router;