import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  CircularProgress,
  Button,
  Box,
} from "@mui/material";

const SuccessPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ref to ensure confirmOrder is only called once
  const hasConfirmed = useRef(false);

  useEffect(() => {
    if (hasConfirmed.current) return;
    hasConfirmed.current = true;

    const confirmOrder = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/orders/confirm", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Error al confirmar la compra");
        await res.json();
      } catch (err) {
        console.error(err);
        setError("Hubo un error al registrar tu compra.");
      } finally {
        setLoading(false);
      }
    };

    confirmOrder();
  }, [token]);

  if (loading) {
    return (
      <Box sx={{ mt: 10, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        {error ? "Ups, algo salió mal 😢" : "¡Compra completada con éxito! 🎉"}
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        {error
          ? error
          : "Tus servicios han sido registrados. Puedes revisarlos en tu historial próximamente."}
      </Typography>
      <Button sx={{ borderRadius: '99px', color: '#f0c987', borderColor: '#f0c987', "&:hover": {
              backgroundColor: "#f0c987",
              borderColor: "#2c3544",
              color: "#2c3544",
              transition: "all 0.3s ease-in-out",
            },}} variant="contained" onClick={() => navigate("/")}>
        Volver al inicio
      </Button>
    </Container>
  );
};

export default SuccessPage;