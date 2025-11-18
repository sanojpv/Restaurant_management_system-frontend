import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  Utensils,
  Heart,
  ShoppingCart,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";

const Menu = () => {
  const [menu, setMenu] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenuAndCart = async () => {
      try {
        const menuPromise = api.get("/menu/getmenu");

        const token = localStorage.getItem("token");
        const cartPromise = token
          ? api.get("/cart/view").catch((err) => {
              if (err.response && err.response.status !== 401) {
                console.error("Cart error:", err);
              }
              return { data: { items: [] } };
            })
          : Promise.resolve({ data: { items: [] } });

        const [menuRes, cartRes] = await Promise.all([
          menuPromise,
          cartPromise,
        ]);

        setMenu(menuRes.data.menuItems || []);
        setCartItems(
          cartRes.data?.items?.map((i) => i?.menuItem?._id).filter(Boolean) ||
            []
        );
      } catch (err) {
        console.error("Failed to load menu or cart:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenuAndCart();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter]);

  const handleAddToCart = async (menuItemId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warn("Please log in to add items to your cart.", {
        autoClose: 3000,
      });
      return navigate("/login");
    }

    try {
      setCartItems((prev) => [...prev, menuItemId]);
      await api.post("/cart/add", { menuItemId, quantity: 1 });
      toast.success("Item added to cart!", { autoClose: 2000 });
    } catch (err) {
      console.error(err);
      setCartItems((prev) => prev.filter((id) => id !== menuItemId));
      toast.error("Failed to add to cart", { autoClose: 3000 });
    }
  };

  const handleToggleWishlist = (menuItemId) => {
    if (!localStorage.getItem("token")) {
      toast.warn("Please log in to manage your wishlist.", { autoClose: 3000 });
      return navigate("/login");
    }

    if (wishlistItems.includes(menuItemId)) {
      setWishlistItems((prev) => prev.filter((id) => id !== menuItemId));
      toast.info("Removed from wishlist.", { autoClose: 1500 });
    } else {
      setWishlistItems((prev) => [...prev, menuItemId]);
      toast.success("Added to wishlist!", { autoClose: 1500 });
    }
  };

  const filteredMenu = menu.filter((item) => {
    const categoryMatch =
      categoryFilter === "all" || item.category === categoryFilter;
    const searchMatch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const categories = ["all", ...new Set(menu.map((item) => item.category))];

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMenu.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMenu.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-16">
      <Navbar />
      <ToastContainer />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="flex flex-col items-center justify-center mb-12">
          <div className="flex items-center space-x-4">
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-800">
              Our Delicious Menu
            </h2>
            <Utensils className="w-10 h-10 text-emerald-600" />
          </div>
          <p className="mt-2 text-xl text-gray-500 font-light">
            Freshly prepared dishes, just for you.
          </p>
        </div>

        {/* Search Input */}
        <div className="max-w-xl mx-auto mb-10">
          <div className="relative">
            <input
              type="text"
              placeholder="Search delicious food items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 pl-12 pr-4 text-lg border border-gray-300 rounded-full shadow-lg focus:ring-emerald-500 focus:border-emerald-500 transition duration-300"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-5 py-2 rounded-full font-medium text-sm transition-all duration-300 shadow-md ${
                categoryFilter === cat
                  ? "bg-emerald-600 text-white shadow-emerald-400/50"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-emerald-50 hover:border-emerald-300"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mr-2" />
            <p className="text-xl text-gray-500">Loading menu...</p>
          </div>
        ) : currentItems.length > 0 ? (
          <>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {currentItems.map((item) => {
                const inCart = cartItems.includes(item._id);
                const isWishlisted = wishlistItems.includes(item._id);

                return (
                  <div
                    key={item._id}
                    className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-100/50 transition duration-500 flex flex-col"
                  >
                    <div className="relative">
                      <img
                        src={"{item.image}"}
                        alt={item.name}
                        className="w-full h-52 object-cover"
                      />
                      <button
                        onClick={() => handleToggleWishlist(item._id)}
                        className={`absolute top-4 right-4 p-2 rounded-full shadow-lg transition duration-200 ${
                          isWishlisted
                            ? "bg-white text-red-500 hover:text-red-600"
                            : "bg-white text-gray-400 hover:text-emerald-500"
                        }`}
                      >
                        <Heart
                          size={22}
                          fill={isWishlisted ? "currentColor" : "none"}
                        />
                      </button>
                    </div>

                    <div className="p-5 flex flex-col flex-grow justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {item.name}
                        </h3>
                        <p className="text-gray-500 mt-1 text-sm">
                          {item.description}
                        </p>
                      </div>

                      <div className="mt-4 flex justify-between items-center pt-2 border-t border-gray-100">
                        <span className="text-2xl font-extrabold text-emerald-600">
                          ₹{item.price}
                        </span>

                        {/* Availability Button */}
                        {inCart ? (
                          <button
                            onClick={() => navigate("/cart")}
                            className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold bg-emerald-600 text-white shadow-md hover:bg-emerald-700 transition"
                          >
                            Go to Cart <ArrowRight size={16} />
                          </button>
                        ) : (
                          <button
                            disabled={!item.isAvailable}
                            onClick={() => handleAddToCart(item._id)}
                            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition ${
                              item.isAvailable
                                ? "bg-white border border-emerald-500 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                                : "bg-gray-300 text-gray-600 cursor-not-allowed"
                            }`}
                          >
                            {item.isAvailable ? (
                              <>
                                <ShoppingCart size={16} /> Add to Cart
                              </>
                            ) : (
                              "Not Available"
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-12">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-full font-medium transition duration-300 ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-emerald-500 text-white hover:bg-emerald-600"
                  }`}
                >
                  Previous
                </button>

                {[...Array(totalPages).keys()].map((number) => (
                  <button
                    key={number + 1}
                    onClick={() => paginate(number + 1)}
                    className={`w-10 h-10 rounded-full font-bold transition duration-300 ${
                      currentPage === number + 1
                        ? "bg-emerald-600 text-white shadow-lg"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-emerald-50 hover:text-emerald-700"
                    }`}
                  >
                    {number + 1}
                  </button>
                ))}

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-full font-medium transition duration-300 ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-emerald-500 text-white hover:bg-emerald-600"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-gray-500 text-lg">
            Dish Not Found.....!!
          </p>
        )}
      </div>
    </div>
  );
};

export default Menu;


