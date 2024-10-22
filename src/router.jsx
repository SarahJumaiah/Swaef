import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import MedicPage from "./pages/MedicPage";
import Admin from "./pages/Admin";
import Sign from "./components/Sign";
import NotFoundPage from "./pages/NotFoundPage";
import Login from './components/Login'
import WaitingPage from "./pages/WaitingPage";

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
    path:"/WaitingPage/:id",
    element : <WaitingPage/>

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
    path: "*",
    element: <NotFoundPage />,
  }
]);

export default router;