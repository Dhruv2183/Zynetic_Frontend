import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-indigo-700 to-blue-600">
      <motion.div
        className="bg-white bg-opacity-10 backdrop-blur-md shadow-lg rounded-2xl p-8 max-w-lg text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h2
          className="text-4xl font-extrabold text-white drop-shadow-md"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Admin Dashboard
        </motion.h2>
        <motion.p
          className="text-lg text-gray-200 mt-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Welcome, Admin! Manage your products efficiently.
        </motion.p>

        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          className="mt-6"
        >
          <Link
            to="/products"
            className="px-6 py-3 bg-yellow-300 text-indigo-900 font-semibold text-lg rounded-lg shadow-md hover:bg-yellow-400 transition duration-300"
          >
            Manage Products
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
