import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface LoginResponse {
  token: string;
  role?: string;
  message?: string;
}

interface FormData {
  email: string;
  password: string;
}

const Login = () => {
  const [formData, setFormData] = useState<FormData>({ 
    email: "", 
    password: "" 
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setIsLoading(true);

  try {
    const response = await axios.post<LoginResponse>(
      `${process.env.REACT_APP_API_BASE_URL}/api/auth/login`, 
      formData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const { token, role } = response.data;

    if (!token) {
      throw new Error('Authentication failed: No token received');
    }

    // Store authentication data
    localStorage.setItem("token", token);
    localStorage.setItem("role", role || "user");

    // Redirect to home page and reload
    navigate("/", { replace: true });
    window.location.reload();  // ✅ reloads the app with updated state

  } catch (err) {
    let errorMessage = "Invalid email or password";
    
    if (axios.isAxiosError(err)) {
      errorMessage = err.response?.data?.message || errorMessage;
    } else if (err instanceof Error) {
      errorMessage = err.message;
    }

    setError(errorMessage);
    console.error("Login Error:", err);
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
        
        {error && (
          <p className="text-red-500 text-center mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a 
            href="/signup" 
            className="text-blue-600 hover:underline"
          >
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
