import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../Context/AppContext";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { showSnackbar } = useApp();

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const toggleForm = () => setIsSignUp(!isSignUp);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const endpoint = isSignUp
        ? `${baseURL}/api/auth/signup`
        : `${baseURL}/api/auth/signin`;

      const res = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      showSnackbar(data.message, data.severity);
      if (res.ok && !isSignUp) navigate("/lecturer-videos");
    } catch (error) {
        showSnackbar("Something went wrong!!", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          {isSignUp ? "Sign Up" : "Sign In"}
        </h2>

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="w-full mb-4 p-2 border rounded"
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full mb-4 p-2 border rounded"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full mb-4 p-2 border rounded"
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            {isSignUp ? "Register" : "Login"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            className="text-blue-500 underline"
            onClick={toggleForm}
            type="button"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
