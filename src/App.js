import Login from "./components/auth/login";
import Register from "./components/auth/register";

import Header from "./components/header";
import {Home} from "./components/home";
import { Holdings } from "./components/holdings";
import { Profile } from "./components/profile";
import { Expenses } from "./components/expenses";
import { Overview } from "./components/overview";
import { Income } from "./components/income";
import Settings from "./components/settings";
import ForgotPassword from './components/auth/login/ForgotPassword';


import { AuthProvider } from "./contexts/authContext";
import { useRoutes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

function App() {
  const routesArray = [
    {
      path: "*",
      element: <Login />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/home",
      element: <Home />,
    },
    {
      path: "/holdings",
      element: <Holdings />,
    },

    {
      path: "/income",
      element: <Income />
    },


    {
      path: "/profile",
      element: <Profile />,
    },

    {
      path: "/expenses",
      element: <Expenses />,
    },

    {
      path: "/overview",
      element: <Overview />,
    },

    {
      path: "/settings",
      element: <Settings />,
    },

    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    }



  ];
  let routesElement = useRoutes(routesArray);
  return (
    <AuthProvider>
      {/* <Header /> */}
      <ToastContainer /> {/* for messages */}
      <div className="w-full h-screen flex flex-col">{routesElement}</div>
    </AuthProvider>
  );
}

export default App;
