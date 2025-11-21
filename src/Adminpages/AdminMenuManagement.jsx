
import React, { useState, useEffect } from 'react';
import api from '../services/api'
import { Trash2, Edit, Utensils, Loader2, PlusCircle } from 'lucide-react'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation, useNavigate } from 'react-router-dom'

const AdminMenuManagement = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
const location= useLocation()
    // fetch MenuItems
    const fetchMenuItems = async () => {
        setLoading(true);
        try {
            
            const res = await api.get('/menu/getmenu');
            setMenuItems(res.data.menuItems || []);
        } catch (error) {
            console.error("Error fetching menu data:", error);
            toast.error("Failed to load menu data. Check server connectivity.", { autoClose: 4000 });
            setMenuItems([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMenuItems();
    }, [location]);

    
    const handleDeleteMenuItem = async (menuItemId, itemName) => {
        if (!window.confirm(`Are you sure you want to delete '${itemName}'? This action cannot be undone.`)) {
            return;
        }

        const originalItems = menuItems;
        setMenuItems(prevItems => prevItems.filter(item => item._id !== menuItemId));
        
        try {
            await api.delete(`/menu/${menuItemId}`); 
            toast.success("Menu item deleted successfully!", { autoClose: 2000 });

        } catch (err) {
            console.error("Error deleting menu item:", err);
            setMenuItems(originalItems); 
            toast.error("Failed to delete item. Please ensure you are logged in as Admin.", { autoClose: 4000 });
            
        }
    };

    
    const handleEdit = (itemId) => {
        navigate(`/editmenu/${itemId}`); 
    
    };

   


    if (loading) {
        return (
            <div className="p-8 flex flex-col justify-center items-center h-screen bg-gray-50">
                <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-3" />
                <p className="text-xl text-gray-500 font-medium">Loading Delicious Menu Items...</p>
            </div>
        );
    }
    
    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen bg-gray-50">
            <ToastContainer />
            <div className="flex justify-between items-center mb-10 border-b pb-4">
                <h1 className="text-4xl font-extrabold text-gray-800">
                     <span className='text-emerald-600'>Admin</span> Menu Dashboard
                </h1>
               
            </div>

            <div className="mb-6 flex justify-between items-center">
                <p className="text-xl text-gray-600">
                    Total Items: <span className='font-bold text-emerald-700 text-2xl'>{menuItems.length}</span>
                </p>
              
            </div>

            <div className="space-y-6">
                {menuItems.length > 0 ? (
                    menuItems.map(item => (
                        <div
                            key={item._id}
                            className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row transition duration-300 hover:shadow-2xl hover:ring-2 hover:ring-emerald-400/50 transform hover:-translate-y-1"
                        >
                            
                            {/* Image Section (Fixed Size) */}
                            <div className="md:w-1/5 w-full h-48 md:h-auto overflow-hidden flex-shrink-0">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                   
                                    className="w-full h-full object-cover" 
                                    onError={(e) => { e.target.onerror = null; e.target.src = "fallback-image-path.jpg" }} // Add a fallback
                                />
                            </div>

                            {/*  Details and Actions Section */}
                            <div className="p-6 flex-grow flex flex-col justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 flex items-center mb-1">
                                        <Utensils className="w-5 h-5 text-emerald-600 mr-2" />
                                        {item.name}
                                    </h3>
                                    <p className="text-sm font-medium text-emerald-600 mb-3 bg-emerald-50 inline-block px-3 py-1 rounded-full">
                                        {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                                    </p>
                                    <p className="text-gray-600 text-base line-clamp-2">{item.description}</p>
                                </div>

                                <div className="mt-4 flex justify-between items-center pt-4 border-t border-gray-100">
                                    <span className="text-3xl font-extrabold text-red-600">
                                        ₹{item.price}
                                    </span>

                                    {/* Action Buttons */}
                                    <div className="flex space-x-3">
                                        {/* Edit Button */}
                                        <button
                                            onClick={() => handleEdit(item._id)}
                                            className="p-3 rounded-full bg-blue-500 text-white shadow-md hover:bg-blue-600 transition duration-200 transform hover:scale-110"
                                            title="Edit Item"
                                        >
                                            <Edit size={20} />
                                        </button>
                                        
                                        {/* Delete Button */}
                                        <button
                                            onClick={() => handleDeleteMenuItem(item._id, item.name)}
                                            className="p-3 rounded-full bg-red-500 text-white shadow-md hover:bg-red-600 transition duration-200 transform hover:scale-110"
                                            title="Delete Item"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center p-12 bg-white rounded-xl shadow-lg mt-10">
                        <p className="text-2xl text-red-500 font-semibold mb-4">
                            No items have been added to the menu....
                        </p>
                       
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminMenuManagement;