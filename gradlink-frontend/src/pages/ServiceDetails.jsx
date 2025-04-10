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
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  if (loading) {
    return (
      <Box sx={{ mt: 10, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!service) {
    return (
      <Container sx={{ mt: 10 }}>
        <Typography variant="h6" color="error">
          Servicio no encontrado.
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 5, mb: 4 }}>
      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 3 }}>
        ← Volver atrás
      </Button>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom>
          {service.title}
        </Typography>

        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Publicado por: {service.user?.name || "Desconocido"}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="body1" sx={{ whiteSpace: "pre-line", mb: 2 }}>
            {service.description}
        </Typography>

        <Typography variant="subtitle1" gutterBottom>
            Precio:{" "}
            {service.price && !isNaN(parseFloat(service.price))
                ? `${parseFloat(service.price).toFixed(2)} €`
                : "No indicado"}
        </Typography>


        {service.tags?.length > 0 && (
            <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1">Etiquetas:</Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
                    {service.tags.map((tag) => (
                        <Chip key={tag.id || tag.name} label={tag.name} />
                    ))}
                </Box>
            </Box>
        )}


        {user.id !== service.user?.id && (
            <Button
                variant="contained"
                color="primary"
                sx={{ mt: 3 }}
                onClick={() => navigate(`/chat/${service.user.id}`, { state: { serviceId: service.id } })}
            >
                Contactar
            </Button>
        )}


      </Paper>
    </Container>
  );
};

export default ServiceDetails;
