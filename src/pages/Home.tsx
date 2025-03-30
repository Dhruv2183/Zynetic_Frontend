import { motion } from "framer-motion";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-indigo-700 to-blue-600">
      <motion.h1
        className="text-6xl font-extrabold text-white drop-shadow-lg text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        Welcome to <span className="text-yellow-300">MyWebsite</span>
      </motion.h1>
      <motion.p
        className="text-lg text-gray-300 mt-4 max-w-2xl text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        Discover amazing products with a seamless shopping experience. Explore our collections today!
      </motion.p>
      <motion.a
        href="/products"
        className="mt-6 px-6 py-3 bg-yellow-300 text-indigo-900 font-semibold text-lg rounded-lg shadow-lg hover:bg-yellow-400 transition duration-300"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
      >
        Explore Now
      </motion.a>
    </div>
  );
};

export default Home;
