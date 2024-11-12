import axios from "axios";

const API_URL = "http://localhost:3000/api";

// Set up axios instance for authenticated requests
const authAxios = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Required to send cookies with requests
});

// Function to retrieve the access token from localStorage
const getAccessToken = () => localStorage.getItem("accessToken");

// Function to set the access token to localStorage
const setAccessToken = (token) => {
  localStorage.setItem("accessToken", token);
};

// Function to remove the access token from localStorage (on logout)
const removeAccessToken = () => {
  localStorage.removeItem("accessToken");
};

// Login function to get access and refresh tokens
export const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/admin/login`, credentials, {
    withCredentials: true, // Ensure refresh token is stored as an HttpOnly cookie
  });

  // Set the access token in localStorage
  setAccessToken(response.data.accessToken);
  return response.data;
};
export const deleteEmployee = async (id) => {
  return await axios.delete(`${API_URL}/employees/delete-employee/${id}`, {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });
};

const createEmployee = async (employeeData) => {
  return await axios.post(
    `${API_URL}/employees/create-employee`,
    employeeData,
    {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    }
  );
};

// Refresh token function
const refreshAccessToken = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/admin/refresh-token`,
      {},
      {
        withCredentials: true,
      }
    );
    // Set the new access token in localStorage
    setAccessToken(response.data.accessToken);
    return response.data.accessToken;
  } catch (error) {
    console.error("Failed to refresh access token", error);
    throw error;
  }
};

// Axios interceptor to attach access token to requests and refresh when expired
authAxios.interceptors.request.use(
  async (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

authAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        await refreshAccessToken(); // Refresh the access token
        originalRequest.headers["Authorization"] = `Bearer ${getAccessToken()}`;
        return authAxios(originalRequest); // Retry the original request
      } catch (refreshError) {
        console.error("Refresh token failed. Redirect to login");
        removeAccessToken(); // Clear the access token on failure
        window.location.href = "/login"; // Redirect to login on refresh failure
      }
    }
    return Promise.reject(error);
  }
);

export { authAxios, setAccessToken, removeAccessToken, createEmployee };
