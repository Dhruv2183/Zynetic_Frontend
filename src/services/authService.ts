import axios from "axios";
import { jwtDecode } from "jwt-decode"; 

const API_URL = "http://localhost:5002/api/auth";


axios.defaults.headers.common["Content-Type"] = "application/json";


export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.user.role); 
    }

    return response.data;
  } catch (error: any) {
    return { error: error.response?.data?.msg || "Login failed. Please try again." };
  }
};


export const signup = async (name: string, email: string, password: string, role: string = "user", adminSecret?: string) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, { name, email, password, role, adminSecret });

    return response.data;
  } catch (error: any) {
    return { error: error.response?.data?.msg || "Signup failed. Please try again." };
  }
};


export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role"); 
};


export const getToken = (): string | null => {
  return localStorage.getItem("token");
};


export const getRole = (): string | null => {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded: any = jwtDecode(token); 
    return decoded.role || null;
  } catch (err) {
    console.error("Error decoding token", err);
    return null;
  }
};


export const isAuthenticated = (): boolean => {
  return !!getToken(); 
};
