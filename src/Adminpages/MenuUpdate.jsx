import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom"; 
import api from "../services/api";
import { Loader2, Save, X, Image as ImageIcon, Utensils, ArrowLeft } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Initialize state to a structured object 
const initialMenuItemState = {
 name: "",
 description: "",
 price: 0,
 category: "",
 image: null,
};

const EditMenu = () => {
 const { id } = useParams();
 const navigate = useNavigate();
 const [menuItem, setMenuItem] = useState(initialMenuItemState);
 const [preview, setPreview] = useState(null);
 const [loading, setLoading] = useState(false);
 const [isLoadingData, setIsLoadingData] = useState(true); 

 useEffect(() => {
  const fetchMenu = async () => {
   try {
    const res = await api.get(`/menu/${id}`);
    
    setMenuItem(res.data.menuItem);

    setPreview(
      res.data.menuItem.image?.startsWith("http")
        ? res.data.menuItem.image
        : `https://restaurant-management-system-1-rnh4.onrender.com/uploads/${res.data.menuItem.image}`
    );

   } catch (err) {
    console.error("Error fetching menu item:", err);
    toast.error("Failed to fetch menu item data");
   } finally {
    setIsLoadingData(false); 
   }
  };
  fetchMenu();
 }, [id]);

 const handleChange = (e) => {
  const value = e.target.name === 'price' ? Number(e.target.value) : e.target.value;
  setMenuItem({ ...menuItem, [e.target.name]: value });
 };

 const handleImageChange = (e) => {
  const file = e.target.files[0];
  setMenuItem({ ...menuItem, image: file }); 
  setPreview(URL.createObjectURL(file));
 };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const formData = new FormData();
  formData.append("name", menuItem.name);
  formData.append("description", menuItem.description);
  formData.append("price", menuItem.price);
  formData.append("category", menuItem.category);

  if (menuItem.image instanceof File) {
   formData.append("image", menuItem.image); 
  } 

  try {
   await api.put(`/menu/${id}`, formData); 
   toast.success("Menu item updated successfully!");
   setTimeout(() => navigate("/admin/deletemenu"), 1500);
  } catch (err) {
   console.error("Error updating menu:", err);
   const errorMessage = err.response?.data?.message || "Update failed. Check server logs.";
   toast.error(errorMessage);
  } finally {
   setLoading(false);
  }
 };

 if (isLoadingData) {
  return (
   <div className="flex justify-center items-center h-screen bg-slate-50">
    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    <p className="ml-3 text-lg text-gray-600">Loading menu data...</p>
   </div>
  );
 }

 return (
  <div className="min-h-screen bg-slate-100 pb-20"> 
        <nav className="bg-white shadow-md sticky top-0 z-10 border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                
                {/* Restaurant Name (Left) */}
                <Link to="/" className="flex items-center space-x-2 text-xl font-extrabold text-gray-800">
                    <Utensils className="w-6 h-6" />
                    <span>Fork & Flame </span>
                </Link>

                {/* Go Back Button (Right) */}
                <button 
                    onClick={() => navigate("/admin/deletemenu")} 
                    className="flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition duration-150 border border-slate-300 shadow-sm"
                >
                    <ArrowLeft className="mr-2 w-5 h-5" /> Back to Menu Dashboard
                </button>
            </div>
        </nav>

   <ToastContainer />
   
   <div className="max-w-3xl mx-auto p-6 md:p-10 bg-white shadow-2xl rounded-xl mt-12 transition-all duration-500 border border-slate-200">
    <h2 className="text-3xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-cyan-500 text-center border-b border-slate-200 pb-4 flex items-center justify-center">
     <Utensils className="w-7 h-7 mr-3" />
     Edit Menu Item: <span className="ml-2 text-gray-700 truncate max-w-[200px] sm:max-w-full">{menuItem.name}</span>
    </h2>

    <form onSubmit={handleSubmit} className="space-y-6">
     
     {/* Input Fields */}
     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block font-medium text-slate-700 mb-2">Name</label>
        <input
          type="text"
          name="name"
          value={menuItem.name}
          onChange={handleChange}
          placeholder="e.g., Classic Burger"
          className="w-full border-2 border-slate-300 p-3 rounded-lg focus:border-blue-500 focus:ring-blue-500 transition duration-200 outline-none hover:border-slate-400"
          required
        />
      </div>

      {/* ✅ CATEGORY DROPDOWN */}
      <div>
        <label className="block font-medium text-slate-700 mb-2">Category</label>
        <select
          name="category"
          value={menuItem.category}
          onChange={handleChange}
          className="w-full border-2 border-slate-300 p-3 rounded-lg bg-white focus:border-blue-500 focus:ring-blue-500 transition duration-200 outline-none hover:border-slate-400"
          required
        >
         
          <option value="Biriyani">Biriyani</option>
          <option value="Arabic">Arabic</option>
          <option value="Chinese">Chinese</option>
          <option value="Bevarages">Bevarages</option>
          <option value="Veg">Veg</option>
        </select>
      </div>
     </div>
    
     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-medium text-slate-700 mb-2">Price (₹)</label>
          <input
            type="number"
            name="price"
            value={String(menuItem.price)} 
            onChange={handleChange}
            placeholder="e.g., 65"
            className="w-full border-2 border-slate-300 p-3 rounded-lg focus:border-blue-500 focus:ring-blue-500 transition duration-200 outline-none hover:border-slate-400"
            required
          />
        </div>
      </div>

      <div>
       <label className="block font-medium text-slate-700 mb-2">Description</label>
       <textarea
        name="description"
        value={menuItem.description}
        onChange={handleChange}
        placeholder="A short description of the item."
        className="w-full border-2 border-slate-300 p-3 rounded-lg focus:border-blue-500 focus:ring-blue-500 transition duration-200 outline-none resize-none hover:border-slate-400"
        rows="4"
        required
       ></textarea>
      </div>

      {/* Image Upload/Preview */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-8 p-5 border border-slate-300 rounded-lg bg-slate-50">
        <div className="flex-shrink-0">
          {preview ? (
            <img
              src={preview}
              alt="Current Image Preview"
              className="rounded-lg w-32 h-32 object-cover shadow-md border-2 border-white"
            />
          ) : (
            <div className='w-32 h-32 bg-slate-200 rounded-lg flex items-center justify-center text-slate-500 border border-dashed border-slate-400'>
              <ImageIcon size={30} />
            </div>
          )}
        </div>
        
        <div className='flex-grow'>
          <label className="block font-medium text-slate-700 mb-2">Change Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer"
          />
          <p className='mt-2 text-xs text-slate-500'>Upload a new image to replace the current one.</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200">
       <button
        type="button"
        onClick={() => navigate("/admin/deletemenu")}
        className="flex items-center px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition duration-200 shadow-lg transform hover:scale-[1.02]"
       >
        <X className="mr-2 w-5 h-5" /> Cancel
       </button>

       <button
        type="submit"
        disabled={loading}
        className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition duration-200 shadow-xl disabled:cursor-not-allowed transform hover:scale-[1.02]"
       >
        {loading ? (
         <>
          <Loader2 className="mr-2 w-5 h-5 animate-spin" /> Updating...
         </>
        ) : (
         <>
          <Save className="mr-2 w-5 h-5" /> Save Changes
         </>
        )}
       </button>
      </div>
    </form>
   </div>
  </div>
 );
};

export default EditMenu;











// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom"; 
// import api from "../services/api";
// import { Loader2, Save, X, Image as ImageIcon, Utensils, ArrowLeft } from "lucide-react";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// // Initialize state to a structured object 
// const initialMenuItemState = {
//  name: "",
//  description: "",
//  price: 0,
//  category: "",
//  image: null,
// };

// const EditMenu = () => {
//  const { id } = useParams();
//  const navigate = useNavigate();
//  const [menuItem, setMenuItem] = useState(initialMenuItemState);
//  const [preview, setPreview] = useState(null);
//  const [loading, setLoading] = useState(false);
//  const [isLoadingData, setIsLoadingData] = useState(true); 

//  useEffect(() => {
//   const fetchMenu = async () => {
//    try {
//     const res = await api.get(`/menu/${id}`);
//     // setMenuItem(res.data.menuItem); 
//     // setPreview(res.data.menuItem.image);
//   setMenuItem(res.data.menuItem);

//     setPreview(
//       res.data.menuItem.image?.startsWith("http")
//         ? res.data.menuItem.image
//         : `https://restaurant-management-system-1-rnh4.onrender.com/uploads/${res.data.menuItem.image}`
//     );

//    } catch (err) {
//     console.error("Error fetching menu item:", err);
//     toast.error("Failed to fetch menu item data");
//    } finally {
//     setIsLoadingData(false); 
//    }
//   };
//   fetchMenu();
//  }, [id]);

//  const handleChange = (e) => {
//   const value = e.target.name === 'price' ? Number(e.target.value) : e.target.value;
//   setMenuItem({ ...menuItem, [e.target.name]: value });
//  };

//  const handleImageChange = (e) => {
//   const file = e.target.files[0];
//   setMenuItem({ ...menuItem, image: file }); 
//   setPreview(URL.createObjectURL(file));
//  };

//  const handleSubmit = async (e) => {
//   e.preventDefault();
//   setLoading(true);

//   const formData = new FormData();
//   formData.append("name", menuItem.name);
//   formData.append("description", menuItem.description);
//   formData.append("price", menuItem.price);
//   formData.append("category", menuItem.category);

//   if (menuItem.image instanceof File) {
//    formData.append("image", menuItem.image); 
//   } 

//   try {
//    await api.put(`/menu/${id}`, formData); 
//    toast.success("Menu item updated successfully!");
//    setTimeout(() => navigate("/admin/deletemenu"), 1500);
//   } catch (err) {
//    console.error("Error updating menu:", err);
//    const errorMessage = err.response?.data?.message || "Update failed. Check server logs.";
//    toast.error(errorMessage);
//   } finally {
//    setLoading(false);
//   }
//  };

//  if (isLoadingData) {
//   return (
//    <div className="flex justify-center items-center h-screen bg-slate-50">
//     <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
//     <p className="ml-3 text-lg text-gray-600">Loading menu data...</p>
//    </div>
//   );
//  }

//  return (
//   <div className="min-h-screen bg-slate-100 pb-20"> 
//         <nav className="bg-white shadow-md sticky top-0 z-10 border-b border-slate-200">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                
//                 {/* Restaurant Name (Left) */}
//                 <Link to="/" className="flex items-center space-x-2 text-xl font-extrabold text-gray-800">
//                     <Utensils className="w-6 h-6" />
//                     <span>Fork & Flame </span>
//                 </Link>

//                 {/* Go Back Button (Right) */}
//                 <button 
//                     onClick={() => navigate("/admin/deletemenu")} 
//                     className="flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition duration-150 border border-slate-300 shadow-sm"
//                 >
//                     <ArrowLeft className="mr-2 w-5 h-5" /> Back to Menu Dashboard
//                 </button>
//             </div>
//         </nav>

//    <ToastContainer />
   
//    <div className="max-w-3xl mx-auto p-6 md:p-10 bg-white shadow-2xl rounded-xl mt-12 transition-all duration-500 border border-slate-200">
//     <h2 className="text-3xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-cyan-500 text-center border-b border-slate-200 pb-4 flex items-center justify-center">
//      <Utensils className="w-7 h-7 mr-3" />
//      Edit Menu Item: <span className="ml-2 text-gray-700 truncate max-w-[200px] sm:max-w-full">{menuItem.name}</span>
//     </h2>

//     <form onSubmit={handleSubmit} className="space-y-6">
     
//      {/* Input Fields */}
//      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//       <div>
//         <label className="block font-medium text-slate-700 mb-2">Name</label>
//         <input
//           type="text"
//           name="name"
//           value={menuItem.name}
//           onChange={handleChange}
//           placeholder="e.g., Classic Burger"
//           className="w-full border-2 border-slate-300 p-3 rounded-lg focus:border-blue-500 focus:ring-blue-500 transition duration-200 outline-none hover:border-slate-400"
//           required
//         />
//       </div>

//       <div>
//         <label className="block font-medium text-slate-700 mb-2">Category</label>
//         <input
//           type="text"
//           name="category"
//           value={menuItem.category}
//           onChange={handleChange}
//           placeholder="e.g., Main Course"
//           className="w-full border-2 border-slate-300 p-3 rounded-lg focus:border-blue-500 focus:ring-blue-500 transition duration-200 outline-none hover:border-slate-400"
//           required
//         />
//       </div>
//      </div>
    
//      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <label className="block font-medium text-slate-700 mb-2">Price (₹)</label>
//           <input
//             type="number"
//             name="price"
//             value={String(menuItem.price)} 
//             onChange={handleChange}
//             placeholder="e.g., 65"
//             className="w-full border-2 border-slate-300 p-3 rounded-lg focus:border-blue-500 focus:ring-blue-500 transition duration-200 outline-none hover:border-slate-400"
//             required
//           />
//         </div>
//       </div>

//       <div>
//        <label className="block font-medium text-slate-700 mb-2">Description</label>
//        <textarea
//         name="description"
//         value={menuItem.description}
//         onChange={handleChange}
//         placeholder="A short description of the item."
//         className="w-full border-2 border-slate-300 p-3 rounded-lg focus:border-blue-500 focus:ring-blue-500 transition duration-200 outline-none resize-none hover:border-slate-400"
//         rows="4"
//         required
//        ></textarea>
//       </div>

//       {/* Image Upload/Preview */}
//       <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-8 p-5 border border-slate-300 rounded-lg bg-slate-50">
//         <div className="flex-shrink-0">
//           {preview ? (
//             <img
//               src={preview}
//               alt="Current Image Preview"
//               className="rounded-lg w-32 h-32 object-cover shadow-md border-2 border-white"
//             />
//           ) : (
//             <div className='w-32 h-32 bg-slate-200 rounded-lg flex items-center justify-center text-slate-500 border border-dashed border-slate-400'>
//               <ImageIcon size={30} />
//             </div>
//           )}
//         </div>
        
//         <div className='flex-grow'>
//           <label className="block font-medium text-slate-700 mb-2">Change Image</label>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleImageChange}
//             className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer"
//           />
//           <p className='mt-2 text-xs text-slate-500'>Upload a new image to replace the current one.</p>
//         </div>
//       </div>


//       {/* Buttons */}
//       <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200">
//        <button
//         type="button"
//         onClick={() => navigate("/admin/deletemenu")}
//         className="flex items-center px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition duration-200 shadow-lg transform hover:scale-[1.02]"
//        >
//         <X className="mr-2 w-5 h-5" /> Cancel
//        </button>

//        <button
//         type="submit"
//         disabled={loading}
//         className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition duration-200 shadow-xl disabled:cursor-not-allowed transform hover:scale-[1.02]"
//        >
//         {loading ? (
//          <>
//           <Loader2 className="mr-2 w-5 h-5 animate-spin" /> Updating...
//          </>
//         ) : (
//          <>
//           <Save className="mr-2 w-5 h-5" /> Save Changes
//          </>
//         )}
//        </button>
//       </div>
//     </form>
//    </div>
//   </div>
//  );
// };

// export default EditMenu;