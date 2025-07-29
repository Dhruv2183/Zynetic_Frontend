
import React, { useState } from "react";
import axios from "axios";

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  image?: string;
}

interface ProductListProps {
  products: Product[];
  role: string | null;
  handleDeleteProduct: (id: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, role, handleDeleteProduct }) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleEditClick = (product: Product) => {
    setEditingProduct({ ...product });
    setImageFile(null); // Clear image file when opening editor
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingProduct) return;
    const { name, value } = event.target;
    setEditingProduct({
      ...editingProduct,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImageFile(event.target.files[0]);
    }
  };

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editingProduct) return;

    try {
      const formData = new FormData();
      formData.append("name", editingProduct.name);
      formData.append("price", editingProduct.price.toString());
      formData.append("category", editingProduct.category);
      formData.append("stock", editingProduct.stock.toString());

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await axios.put(
      `${process.env.REACT_APP_API_BASE_URL}/api/products/${editingProduct._id}`,
      formData,
      {
        headers: { 
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
      }
    );

      console.log("✅ Updated product:", res.data);
      alert("Product updated successfully.");

      setEditingProduct(null);
      setImageFile(null);

      // Refresh the page or ideally use a state update
      window.location.reload();
    } catch (error: any) {
      console.error("❌ Error updating product:", error.response?.data || error.message);
      alert("Failed to update product. Check console for more info.");
    }
  };

  return (
    <ul className="space-y-4">
      {products.map((product) => (
        <li key={product._id} className="p-4 border rounded flex justify-between items-center shadow-md">
          <div>
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-600">₹{product.price}</p>
            <p className="text-gray-600">Category: {product.category}</p>
            <p className="text-gray-600">Stock: {product.stock}</p>
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="mt-2 w-32 h-32 object-cover rounded"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            )}
          </div>
          {role === "admin" && (
            <div>
              <button
                onClick={() => handleDeleteProduct(product._id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
              >
                Delete
              </button>
              <button
                onClick={() => handleEditClick(product)}
                className="ml-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
              >
                Update
              </button>
            </div>
          )}
        </li>
      ))}

      {editingProduct && (
        <form onSubmit={handleUpdate} className="edit-form p-4 border rounded shadow-md mt-4">
          <input
            type="text"
            name="name"
            value={editingProduct.name}
            onChange={handleInputChange}
            className="border p-2 rounded w-full mb-2"
          />
          <input
            type="number"
            name="price"
            value={editingProduct.price}
            onChange={handleInputChange}
            className="border p-2 rounded w-full mb-2"
          />
          <input
            type="text"
            name="category"
            value={editingProduct.category}
            onChange={handleInputChange}
            className="border p-2 rounded w-full mb-2"
          />
          <input
            type="number"
            name="stock"
            value={editingProduct.stock}
            onChange={handleInputChange}
            className="border p-2 rounded w-full mb-2"
          />
          <input
            type="file"
            onChange={handleImageChange}
            className="border p-2 rounded w-full mb-2"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
          >
            Save
          </button>
        </form>
      )}
    </ul>
  );
};

export default ProductList;

