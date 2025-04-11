import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
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

// Puedes mover esto a un `routes.js` más adelante si crece
const AppRouter = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={["student", "admin", "dev"]}>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Dashboard />
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
          <ProtectedRoute>
            <MyServices />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/edit-service/:id"
        element={
          <ProtectedRoute>
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
