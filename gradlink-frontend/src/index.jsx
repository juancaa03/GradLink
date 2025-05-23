import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./ProtectedRoute";
import ServiceDetails from "./pages/ServiceDetails";
import CreateService from "./pages/CreateService";
import MyServices from "./pages/MyServices";
import EditService from "./pages/EditService";
import ChatWithUser from "./pages/ChatWithUser";
import Conversations from "./pages/Conversations.jsx";
import CartPage from "./pages/CartPage.jsx";
import SuccessPage from "./pages/SuccessPage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

const AppRouter = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={["student", "admin", "client"]}>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/admindashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/service/:id"
        element={
          <ProtectedRoute>
            <ServiceDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-service"
        element={
          <ProtectedRoute allowedRoles={["student", "dev", "admin"]}>
            <CreateService />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-services"
        element={
          <ProtectedRoute allowedRoles={["student", "dev", "admin"]}>
            <MyServices />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/edit-service/:id"
        element={
          <ProtectedRoute allowedRoles={["student", "dev", "admin"]}>
            <EditService />
          </ProtectedRoute>
        }
      />

      <Route
        path="/chat/:userId"
        element={
          <ProtectedRoute>
            <ChatWithUser />
          </ProtectedRoute>
        }
      />

      <Route
        path="/conversations"
        element={
          <ProtectedRoute>
            <Conversations />
          </ProtectedRoute>
        }
      />

      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/success"
        element={
          <ProtectedRoute>
            <SuccessPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRouter;
