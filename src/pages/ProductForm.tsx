import React, { useState } from "react";
import axios from "axios";
import "./ProductForm.css";

const categoryOptions = ["Clothing", "Accessories", "Footwear", "Bags"];
const sizeOptions = ["S", "M", "L", "XL", "XXL"];

interface ProductFormProps {
  fetchProducts: () => void;
  setShowAddForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProductForm: React.FC<ProductFormProps> = ({ fetchProducts, setShowAddForm }) => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    stock: 0,
    size: [] as string[], 
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.category || newProduct.price <= 0) {
      alert("Please fill in all required fields.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to add products.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("description", newProduct.description);
      formData.append("price", String(newProduct.price));
      formData.append("category", newProduct.category);
      formData.append("stock", String(newProduct.stock));
      formData.append("size", JSON.stringify(newProduct.size));

      if (imageFile) {
        formData.append("image", imageFile);
      }

      await axios.post("http://localhost:5002/api/products", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      fetchProducts();
      setShowAddForm(false);
      setNewProduct({ name: "", description: "", price: 0, category: "", stock: 0, size: [] });
      setImageFile(null);
      setImagePreview(null);
    } catch (error: any) {
      console.error("Error adding product:", error.response?.data || error.message);
      alert("Failed to add product. Check console for details.");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-xl rounded-lg backdrop-blur-md">
      <div className="grid grid-cols-2 gap-4">
        <input type="text" placeholder="Product Name" value={newProduct.name} 
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} 
          className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500" />

        <select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} 
          className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500">
          <option value="">Select Category</option>
          {categoryOptions.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <input type="number" placeholder="Price" value={newProduct.price || ""}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value ? Number(e.target.value) : 0 })} 
          className="border p-3 rounded-lg w-full remove-arrows" />

        <input type="number" placeholder="Stock Quantity" value={newProduct.stock || ""}
          onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value ? Number(e.target.value) : 0 })} 
          className="border p-3 rounded-lg w-full remove-arrows" />
      </div>

      <textarea placeholder="Product Description" value={newProduct.description} 
        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} 
        className="border p-3 rounded-lg w-full mt-4 focus:ring-2 focus:ring-blue-500" />

      <div className="mt-4 flex flex-wrap gap-2">
        {sizeOptions.map((size) => (
          <button key={size} onClick={() => setNewProduct({ ...newProduct, size: newProduct.size.includes(size) ? newProduct.size.filter((s) => s !== size) : [...newProduct.size, size] })} 
            className={`px-4 py-2 rounded-lg transition-all border-2 ${newProduct.size.includes(size) ? 'bg-blue-500 text-white border-blue-700' : 'bg-gray-200 border-gray-300 hover:bg-gray-300'}`}>
            {size}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <label className="block">Product Image</label>
        <input type="file" onChange={handleImageChange} className="border p-2 rounded-lg w-full" />
        {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-lg shadow-lg" />}
      </div>

      <button onClick={handleAddProduct} className="mt-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-3 rounded-lg w-full font-bold shadow-lg hover:scale-105 transition-all">
        Add Product
      </button>
    </div>
  );
};

export default ProductForm;
