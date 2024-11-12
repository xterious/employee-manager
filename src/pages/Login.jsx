import React, { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);  // For loading state
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state before making a request
    setIsLoading(true); // Set loading state
    try {
      await login({ email, password });
      navigate("/employee-list"); // Redirect to the protected route on successful login
    } catch (err) {
      // Handle specific error scenarios
      setError("Invalid credentials or server error. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false); // Reset loading state after request completes
    }
  };

  // Styles for the component
  const styles = {
    container: "flex items-center justify-center min-h-screen bg-gray-100",
    box: "w-full max-w-md p-8 bg-white rounded-lg shadow-lg",
    title: "text-3xl font-bold text-center text-gray-800",
    form: "space-y-4",
    label: "block mb-2 text-sm font-medium text-gray-700",
    inputContainer: "relative",
    input: "w-full px-4 py-2 text-sm text-gray-800 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500",
    button: "w-full px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700 disabled:bg-indigo-400",
    eyeButton: "absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500",
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h2 className={styles.title}>Admin Login</h2>
        <form onSubmit={handleLogin} className={styles.form}>
          <div>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              required
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className={styles.label}>Password</label>
            <div className={styles.inputContainer}>
              <input
                type={showPassword ? "text" : "password"}
                required
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
              <span onClick={togglePasswordVisibility} className={styles.eyeButton}>
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.973 9.973 0 012.243-3.606M9.88 9.88a3 3 0 104.24 4.24m1.82-7.071A9.953 9.953 0 0112 5c4.477 0 8.268 2.943 9.542 7-.512 1.633-1.415 3.062-2.571 4.208M3 3l18 18" />
                  </svg>
                )}
              </span>
            </div>
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};
