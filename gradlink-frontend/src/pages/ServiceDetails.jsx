import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Container,
  Typography,
  CircularProgress,
  Paper,
  Box,
  Button,
  Divider,
  Chip,
} from "@mui/material";
import LocationOnIcon from '@mui/icons-material/LocationOn';

const ServiceDetails = () => {
  const { id } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/services/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al cargar el servicio");
        const data = await res.json();
        setService(data);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id, token]);

  if (loading) return <Box sx={{ mt: 10, display: "flex", justifyContent: "center" }}><CircularProgress/></Box>;
  if (!service) return (
    <Container sx={{ mt: 10 }}>
      <Typography variant="h6" color="error">Servicio no encontrado.</Typography>
    </Container>
  );

  const handleAddToCart = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ serviceId: service.id }),
      });
      if (!res.ok) throw new Error("Error al añadir al carrito");
      alert("Servicio añadido al carrito");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Container sx={{ mt: 5, mb: 4 }}>
      <Button variant="outlined" onClick={() => navigate("/home")} sx={{ mb: 3 }}>← Volver atrás</Button>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom>{service.title}</Typography>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Publicado por: {service.user?.name || "Desconocido"}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body1" sx={{ whiteSpace: "pre-line", mb: 2 }}>
          {service.description}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Precio: {service.price && !isNaN(parseFloat(service.price))
            ? `${parseFloat(service.price).toFixed(2)} €`
            : "No indicado"}
        </Typography>
        {service.location && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 0.5 }}>
            <LocationOnIcon sx={{ fontSize: 18, transform: 'translateY(2px)' }} />
            <Typography variant="subtitle1" sx={{ fontStyle: 'italic', transform: 'translateY(2px)' }}>
              {service.location}
            </Typography>
          </Box>
        )}
        {service.tags?.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Etiquetas:</Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
              {service.tags.map((tag) => <Chip key={tag.id||tag.name} label={tag.name} />)}
            </Box>
          </Box>
        )}
        {user.id !== service.user?.id && (
          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button variant="contained" onClick={() => navigate(`/chat/${service.user.id}`, { state: { serviceId: service.id } })}>
              Contactar
            </Button>
            <Button variant="outlined" color="success" onClick={handleAddToCart}>
              Añadir al carrito
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ServiceDetails;
