import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductForm from "./ProductForm";
import ProductList from "./ProductList";

interface ProductsProps {
  role: string | null;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  size: string[];
  image?: string;
}

const Products: React.FC<ProductsProps> = ({ role }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(false); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [categoryFilter, setCategoryFilter] = useState<string>(""); 
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]); 
  const [searchQuery, setSearchQuery] = useState<string>(""); 

  useEffect(() => {
    fetchProducts();
  }, []); 

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:5002/api/products");
      setProducts(response.data);
    } catch (error: any) {
      setError("Failed to fetch products. Please try again.");
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (role !== "admin") {
      alert("You do not have permission to delete products.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication error. Please log in.");
      return;
    }

    try {
      await axios.delete(`http://localhost:5002/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts(products.filter((product) => product._id !== id));
    } catch (error: any) {
      console.error("Error deleting product:", error);
      setError("Failed to delete product.");
    }
  };

  
  const filteredProducts = products.filter((product) => {
    const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesPrice && matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-lg mt-6">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">Products</h1>
      <p className="text-sm text-gray-500 text-center mb-4">Role: <span className="font-semibold">{role || "Guest"}</span></p>

      
      <div className="mb-6">
        <label htmlFor="search" className="block text-gray-700 font-semibold mb-2">Search Products</label>
        <input
          type="text"
          id="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or description"
          className="w-full p-2 border rounded-lg"
        />
      </div>

      
      <div className="flex justify-between mb-6">
        
        <div className="w-1/3">
          <label htmlFor="category" className="block text-gray-700 font-semibold mb-2">Category</label>
          <select
            id="category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">All Categories</option>
            <option value="Clothing">Clothing</option>
            <option value="Accessories">Accessories</option>
            <option value="Footwear">Footwear</option>
            <option value="Essentials">Essentials</option>
          </select>
        </div>

        
        <div className="w-1/3">
          <label htmlFor="priceRange" className="block text-gray-700 font-semibold mb-2">Price Range</label>
          <input
            type="range"
            min="0"
            max="1000"
            step="10"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
            className="w-full"
          />
          <div className="flex justify-between text-gray-700 mt-2">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      {role === "admin" && (
        <div className="flex justify-center mb-4">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition-all"
          >
            {showAddForm ? "Cancel" : "Add Product"}
          </button>
        </div>
      )}

      {showAddForm && role === "admin" && (
        <div className="mb-6">
          <ProductForm fetchProducts={fetchProducts} setShowAddForm={setShowAddForm} />
        </div>
      )}

      
      <div className="flex justify-center mb-4">
        <button
          onClick={() => setShowAllProducts(!showAllProducts)} // Toggle show all products
          className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition-all"
        >
          {showAllProducts ? "Show Fewer Products" : "View All Products"}
        </button>
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {loading ? (
        <p className="text-gray-500 text-center animate-pulse">Loading products...</p>
      ) : (
        <ProductList
          products={showAllProducts ? filteredProducts : filteredProducts.slice(0, 5)} // Show all or limit to first 5
          role={role}
          handleDeleteProduct={handleDeleteProduct}
        />
      )}
    </div>
  );
};

export default Products;
