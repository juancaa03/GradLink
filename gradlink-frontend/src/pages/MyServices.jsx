import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const MyServices = () => {
  const { token } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyServices = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/services/my-services", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Error cargando tus servicios");

        const data = await res.json();
        setServices(data);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyServices();
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
        Mis servicios publicados
      </Typography>

      {services.length === 0 ? (
        <Typography variant="body2">No has publicado ningún servicio aún.</Typography>
      ) : (
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            mt: 2,
          }}
        >
          {services.map((service) => (
            <Card
              key={service.id}
              sx={{ p: 2, cursor: "pointer" }}
              onClick={() => navigate(`/service/${service.id}`)}
            >
              <CardContent>
                <Typography variant="h6">{service.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {service.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default MyServices;
