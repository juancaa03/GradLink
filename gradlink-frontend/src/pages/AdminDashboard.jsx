import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al cargar pedidos");
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : data.orders);
      } catch (err) {
        console.error("Error al obtener pedidos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/orders/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      if (!res.ok) throw new Error("Error al actualizar estado");
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: newStatus } : o
        )
      );
    } catch (err) {
      console.error("Error al actualizar estado:", err);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          height: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress color="primary" />
        <Typography variant="h6" color="textSecondary">
          Cargando pedidos...
        </Typography>
      </Box>
    );
  }

  const formatDate = (isoString) => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

  return (
    <>
      <Navbar />
      <Box sx={{ mt: 10, p: 4 }}>
        <Box sx={{ mb: 4, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "#ffff00" }}
          >
            Panel de Administración
          </Typography>
          <Button 
              sx={{ borderRadius: '99px', color: '#ffff00', borderColor: '#ffff00', "&:hover": {
                backgroundColor: "#ffff00",
                borderColor: "#2c3544",
                color: "#2c3544",
                transition: "all 0.3s ease-in-out",
              },}} variant="outlined" onClick={() => navigate("/home")}>Volver</Button>
        </Box>

        <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold" }}>ID Pedido</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Fecha creación</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Cliente</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Servicios (id)</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Estado</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow
                  key={order.id}
                  sx={{
                    "&:hover": { backgroundColor: "rgba(32,48,64,0.05)" },
                  }}
                >
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell>{order.user.name}</TableCell>
                  <TableCell>
                    {order.service ? (
                      <Typography variant="body2">
                        {order.service.title} ({order.service.id})
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        Sin servicio
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order.id, e.target.value)
                      }
                      size="small"
                      sx={{ minWidth: 140 }}
                    >
                      <MenuItem value="processing">Processing</MenuItem>
                      <MenuItem value="delivering">Delivering</MenuItem>
                      <MenuItem value="delivered">Delivered</MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}