import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import NotFoundPage from "./pages/NotFoundPage";

const router = createBrowserRouter([
  {
    path: "/",

    element: <Home />,
  },
  {
    path: "*",

    element: <NotFoundPage />,
  }
]);

export default router;