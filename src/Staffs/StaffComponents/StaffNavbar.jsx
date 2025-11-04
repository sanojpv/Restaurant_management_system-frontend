
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Utensils, Home, User, LogOut } from 'lucide-react'; 

const StaffNavbar = () => {
  const navigate = useNavigate();

  // Define the staff dashboard path
  const dashboardPath = "/staff/dashboard"; 
    // Define the login path
    const loginPath = "/login"; 

  const handleLogout = () => {
        //  Clear authentication data from local storage 
        localStorage.removeItem("token"); 
        localStorage.removeItem("id"); 
        localStorage.removeItem("role"); 

        // Redirect the user to the login page
        navigate(loginPath);
    };

  return (
    <nav className="bg-emerald-700 shadow-lg sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        
        {/* Restaurant Name/Branding (Left) */}
        <Link to={dashboardPath} className="flex items-center space-x-2 text-2xl font-extrabold text-white transition duration-150 hover:text-emerald-200">
          <Utensils className="w-6 h-6" />
          <span>Fork & Flame Staff</span>
        </Link>

        {/* Navigation Links & Actions (Right) */}
        <div className='flex space-x-4 items-center'>

                    {/* Profile Button */}
            <button 
                        onClick={() => navigate("/staffprofile")}
              className="flex items-center px-3 py-2 text-white rounded-lg font-semibold hover:bg-emerald-600 transition duration-150"
            >
                        <User className="mr-2 w-5 h-5"/>
                        Profile
                    </button>

                    {/* Log Out Button */}
                    <button 
                        onClick={handleLogout}
              className="flex items-center px-4 py-2 text-white rounded-lg font-semibold border-2 border-red-400 bg-red-600 hover:bg-red-700 hover:border-red-600 transition duration-150 shadow-md"
            >
                        <LogOut className="mr-2 w-5 h-5"/>
                        Logout
                    </button>
        </div>
      </div>
    </nav>
  );
};

export default StaffNavbar;