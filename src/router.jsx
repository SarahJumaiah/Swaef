import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import MedicPage from "./pages/MedicPage";
import Admin from "./pages/Admin";
import NotFoundPage from "./pages/NotFoundPage";

const router = createBrowserRouter([
  {
    path: "/",

    element: <Home />,
  },
  {
    path: "/MedicPage",

    element: <MedicPage />,
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