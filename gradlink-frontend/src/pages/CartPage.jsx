import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CartPage = () => {
  const { token } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Error al cargar el carrito");
      const data = await res.json();
      setCartItems(data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  const handleRemove = async (serviceId) => {
    try {
      const res = await fetch("http://localhost:4000/api/cart/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ serviceId }),
      });
      if (!res.ok) throw new Error("Error al eliminar el servicio del carrito");
      setCartItems((prev) => prev.filter((item) => item.service.id !== serviceId));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCheckout = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/cart/checkout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { url } = await res.json();
      window.location.href = url;
    } catch (err) {
      alert("Error al iniciar el pago");
      console.error(err);
    }
  };

  const handleClearCart = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/cart", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Error al vaciar el carrito");
      setCartItems([]);
    } catch (err) {
      alert(err.message);
    }
  };  

  const total = cartItems.reduce((sum, item) => sum + (parseFloat(item.service.price) || 0), 0);

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
        <Typography variant="h5" gutterBottom>
          Tu carrito de la compra
        </Typography>

        {cartItems.length === 0 ? (
          <Typography variant="body2">Tu carrito está vacío.</Typography>
        ) : (
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <List>
              {cartItems.map((item) => (
                <ListItem key={item.service.id} secondaryAction={
                  <IconButton edge="end" onClick={() => handleRemove(item.service.id)}>
                    <DeleteIcon />
                  </IconButton>
                }>
                  <ListItemText
                    primary={item.service.title}
                    secondary={`Precio: ${parseFloat(item.service.price).toFixed(2)} €`}
                  />
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" sx={{ mb: 2 }}>
              Total: {total.toFixed(2)} €
            </Typography>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button variant="contained" color="primary" onClick={handleCheckout}>
                  Proceder al pago
              </Button>
              <Button variant="outlined" color="error" onClick={handleClearCart}>
                  Vaciar carrito
              </Button>
            </Box>
          </Paper>
        )}

        <Button variant="outlined" sx={{ mt: 3, borderRadius: '99px', color: '#f0c987', borderColor: '#f0c987', "&:hover": {
              backgroundColor: "#f0c987",
              borderColor: "#2c3544",
              color: "#2c3544",
              transition: "all 0.3s ease-in-out",
            },}} onClick={() => navigate("/")}>← Volver al inicio</Button>
      </Container>
      <Footer />
    </>
  );
};

export default CartPage;
