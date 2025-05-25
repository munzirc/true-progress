import React from "react";
import { logout } from "../api/auth.api";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="w-full h-13 shadow-md bg-white flex items-center px-6">
      <h1 className="text-2xl font-bold">
        <span className="text-blue-500">True</span>
        <span className="text-green-400">Progress</span>
      </h1>

      <button
        onClick={handleLogout}
        className="ml-auto bg-red-400 text-white hover:bg-red-300 px-4 py-1 rounded font-medium transition text-sm"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;
