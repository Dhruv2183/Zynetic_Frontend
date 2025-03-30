import { Link, useNavigate } from "react-router-dom";
import { getToken, logout } from "../services/authService";
import { useEffect, useState } from "react";

interface NavbarProps {
  role: string | null;
}

const Navbar: React.FC<NavbarProps> = ({ role }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());
  const [userRole, setUserRole] = useState<string | null>(role);

  useEffect(() => {
    setIsAuthenticated(!!getToken());
    setUserRole(role);
  }, [role]);

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    setUserRole(null);
    setTimeout(() => navigate("/login"), 100);
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-700 to-blue-600 shadow-md p-4 flex justify-between items-center">
      <h1 className="text-2xl font-extrabold tracking-wide text-white">
        <Link to="/" className="hover:text-gray-300 transition">MyWebsite</Link>
      </h1>

      <div className="space-x-6 flex items-center">
        {isAuthenticated ? (
          <>
            <span className="bg-gray-900 text-white px-4 py-1 rounded-lg text-sm shadow-md">
              {userRole === "admin" ? "Admin" : "User"}
            </span>
            {userRole === "admin" && (
              <Link to="/admin-dashboard" className="text-white hover:text-gray-300">
                Admin Panel
              </Link>
            )}
            <Link to="/products" className="text-white hover:text-gray-300">
              Products
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-5 py-2 rounded-lg shadow-md hover:bg-red-700 transition text-white"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-white hover:text-gray-300">Login</Link>
            <Link to="/signup" className="text-white hover:text-gray-300">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
