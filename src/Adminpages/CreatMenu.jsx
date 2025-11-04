
import React, { useState } from "react";
import api from "../services/api";

const CreateMenuItem = ({ onAdd}) => {
  const [menuItem, setMenuItem] = useState({
    name: "",
    description: "",
    price: "",
    category: "Biriyani",
    image: "",
  });
  const [preview, setPreview] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      const file = e.target.files[0];
      if (file) {
        setMenuItem({ ...menuItem, image: file });
        setPreview(URL.createObjectURL(file));
      }
    } else {
      setMenuItem((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", menuItem.name);
      formData.append("description", menuItem.description);
      formData.append("price", menuItem.price);
      formData.append("category", menuItem.category);
      formData.append("image", menuItem.image);

      const response = await api.post("admin/menu/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Menu Item Created:", response.data);

      if (onAdd) onAdd(response.data);

      setSuccess(true);
      setMenuItem({
        name: "",
        description: "",
        price: "",
        category: "Biriyani",
        image: "",
      });
      setPreview(null);

      setTimeout(() => setSuccess(false), 2000);
    } catch (error) {
      console.error(
        "Error creating menu item:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5 sm:px-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white text-center">
              Create New Menu Item
            </h2>
            <p className="text-indigo-50 text-center mt-1 text-xs sm:text-sm">
              Add a delicious item to your menu
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mx-6 mt-4 sm:mx-8">
              <div className="bg-indigo-50 border-l-4 border-indigo-500 p-3 rounded-r-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-indigo-800">
                      Menu Item Created Successfully!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6 sm:px-8 space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Item Name
              </label>
              <input
                type="text"
                name="name"
                value={menuItem.name}
                onChange={handleChange}
                required
                placeholder="e.g., Chicken Biriyani"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Description
              </label>
              <textarea
                name="description"
                value={menuItem.description}
                onChange={handleChange}
                required
                rows="2"
                placeholder="Describe your delicious menu item..."
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 resize-none"
              />
            </div>

            {/* Price and Category Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Price */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Price (₹)
                </label>
                <input
                  type="number"
                  name="price"
                  value={menuItem.price}
                  onChange={handleChange}
                  required
                  placeholder="0.00"
                  step="0.01"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Category
                </label>
                <select
                  name="category"
                  value={menuItem.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                >
                  <option value="Biriyani">Biriyani</option>
                  <option value="Arabic">Arabic</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Beverages">Beverages</option>
                </select>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Item Image
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="flex-1 w-full">
                  <input
                    type="file"
                    name="image"
                    onChange={handleChange}
                    accept="image/*"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 text-sm file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                </div>

                {/* Image Preview */}
                {preview && (
                  <div className="flex-shrink-0">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Create Menu Item
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateMenuItem;