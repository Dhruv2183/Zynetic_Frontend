import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import AdminDashboard from "./pages/AdminDashboard"; 
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { getRole } from "./services/authService"; 

function App() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setRole(getRole()); 
  }, []);

  return (
    <Router>
      <Navbar role={role} /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products role={role} />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} /> 
      </Routes>
    </Router>
  );
}

export default App;
