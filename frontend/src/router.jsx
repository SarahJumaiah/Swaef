import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Sign from "./components/Sign";
import MedicPage from "./pages/MedicPage";
import CaseDetailsPage from "./pages/CaseDetailsPage";
import Admin from "./pages/Admin";
import NotFoundPage from "./pages/NotFoundPage";
import Login from "./components/login";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path:"/sign",
    element : <Sign/>
  },
  {
    path:"/login",
    element : <Login/>

  },
  {
    path: "/MedicPage/:id",
    element: <MedicPage />,
  },
  {
    path: "/CaseDetailsPage/:caseId",
    element: <CaseDetailsPage />,
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