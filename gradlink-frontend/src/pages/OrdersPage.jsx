import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Container,
  Typography,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Chip,
  Button,
} from "@mui/material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const OrdersPage = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/orders/mine", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Error al cargar historial de compras");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (loading) {
    return (
      <Box sx={{ mt: 10, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <Container sx={{ height: "100vh", mt: 15 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" gutterBottom>Mis compras</Typography>
        <Button sx={{ borderRadius: '99px', color: '#f0c987', borderColor: '#f0c987', "&:hover": {
              backgroundColor: "#f0c987",
              borderColor: "#2c3544",
              color: "#2c3544",
              transition: "all 0.3s ease-in-out",
            },}} variant="outlined" onClick={() => navigate("/")}>
            Volver al inicio
        </Button>
        </Box>

        {orders.length === 0 ? (
          <Typography variant="body2">Aún no has realizado ninguna compra.</Typography>
        ) : (
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <List>
              {orders.map((order, i) => (
                <div key={order.id}>
                  <ListItem>
                    <ListItemText
                      primary={order.service?.title || "Servicio desconocido"}
                      secondary={`Fecha: ${new Date(order.createdAt).toLocaleString()}`}
                    />
                    <Chip label={order.status} color="primary" size="small" />
                  </ListItem>
                  {i < orders.length - 1 && <Divider />}
                </div>
              ))}
            </List>
          </Paper>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default OrdersPage;
