import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Order";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("adminToken") || "");

  const handleLogin = (newToken) => {
    setToken(newToken);
  };

  useEffect(() => {
    localStorage.setItem("adminToken", token);
  }, [token]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />

      {token === "" ? (
        <Login onLogin={handleLogin} />
      ) : (
        <>
          <Navbar setToken={setToken} />
          <hr />

          <div className="flex w-full">
            <Sidebar setToken={setToken} />

            <div className="w-[82%] p-5">
              <Routes>
                <Route path="/add" element={<Add token={token} />} />
                <Route path="/list" element={<List token={token} />} />
                <Route path="/orders" element={<Orders token={token} />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
