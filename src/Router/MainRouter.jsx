import React from "react";
import { Routes, Route } from "react-router-dom";
import Signup from "../CommenPages/SignUp";
import LoginPage from "../CommenPages/Login";
import Home from "../CustomersPages/Home";
import ReservationPage from "../CustomersPages/ReservationTable";
import Dashboard from "../Adminpages/Dashboard";
import AdminProfile from "../Adminpages/Admin";
import GetCustomers from "../Adminpages/GetCustomers";
import CreateStaffs from "../Adminpages/CreatStaffs";
import CreatMenu from "../Adminpages/CreatMenu";
import GetStaffs from "../Adminpages/GetStaffs";
import Errorpage from "../components/Errorpage";
import Menu from "../CustomersPages/Menu";
import StaffProfile from "../Staffs/StaffPages/StaffProfile";
import StaffDashboard from "../Staffs/StaffPages/StaffDashboard"
import CartPage from "../CustomersPages/Cart";
import ProtectedRoute from "../components/protectedRoute";
import CustomerProfile from "../CustomersPages/CustomerProfile";
import OrderPage from "../CustomersPages/OrdersPage";
import Payment from "../CustomersPages/Payment";
import Contact from "../components/Contact";
import CustomerReservations from "../CustomersPages/ReservationDetailspage";
import AdmiDashboard from "../Adminpages/Admin";
import Admin_Profile from "../Adminpages/AdminProfile";
import AdminMenuManagement from "../Adminpages/AdminMenuManagement";
import EditMenu from "../Adminpages/MenuUpdate";
import CustomerWelcome from "../CustomersPages/CustomerProfileHome";
import OrderOverview from "../Staffs/StaffPages/OrderOverview";

const MainRouter = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<Errorpage />} />

      {/* Customer protected routes */}
      <Route
        path="/cart"
        element={
          <ProtectedRoute role="customer">
            <CartPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer/profile"
        element={
          <ProtectedRoute role="customer">
            <CustomerProfile />
          </ProtectedRoute>
        }
      >
        {/* Nested routes */}
        <Route index element={<CustomerWelcome/>} />
        <Route path="orders" element={<OrderPage />} /> 
        <Route path="cart" element={<CartPage />} /> 
        <Route
          path="reservationdetails"
          element={<CustomerReservations />}
        />
        
      </Route>
        <Route path="/payments" element={<Payment />} /> 

      <Route
        path="/reservation"
        element={
          <ProtectedRoute role="customer">
            <ReservationPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/staff"
        element={
          <ProtectedRoute role="staff">
            <StaffDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="/staffprofile" element={<StaffProfile />} />
      <Route path="/customerreservation" element={<CustomerReservations />} />
        <Route path="/staffoverview" element={<OrderOverview/>} />
      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdmiDashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="getcustomers" element={<GetCustomers />} />
        <Route path="getstaffs" element={<GetStaffs />} />
        <Route path="creatstaff" element={<CreateStaffs />} />
        <Route path="creatmenu" element={<CreatMenu />} />
        <Route path="adprofile" element={<Admin_Profile />} />
        <Route path="deletemenu" element={<AdminMenuManagement />} />
      </Route>
      <Route path="editmenu/:id" element={<EditMenu />} />
    </Routes>
  );
};

export default MainRouter;
