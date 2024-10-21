import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Sign from "./components/Sign";
import NotFoundPage from "./pages/NotFoundPage";
import Login from './components/Login'

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
    path: "*",

    element: <NotFoundPage />,
  }
]);

export default router;